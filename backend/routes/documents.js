const express = require("express");
const fs = require("fs");
const path = require("path");
const { auth } = require("../middleware/auth");
const upload = require("../middleware/upload");
const Document = require("../models/Document");

const router = express.Router();

// Upload document
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, description, category, tags, isPublic } = req.body;

    // Parse tags if it's a JSON string
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
      } catch (e) {
        parsedTags = [];
      }
    }

    const document = new Document({
      title: title || req.file.originalname,
      description: description || "",
      fileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      tags: parsedTags,
      category: category || "Uncategorized",
      uploadedBy: req.user.id,
      isPublic: isPublic === "true",
      versions: [
        {
          versionNumber: 1,
          fileName: req.file.filename,
          filePath: req.file.path,
          uploadedBy: req.user.id,
        },
      ],
    });

    await document.save();
    await document.populate("uploadedBy", "username email");

    res.status(201).json({
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.error(error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: "Server error during file upload" });
  }
});

// Get all documents with filters and pagination
router.get("/", auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      tags = "",
      category = "",
    } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {
      $or: [
        { uploadedBy: req.user.id },
        { isPublic: true },
        { "permissions.userId": req.user.id },
      ],
    };

    if (search) {
      filter.$and = [
        {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        },
      ];
    }

    if (tags) {
      const tagsArray = tags.split(",").map((tag) => tag.trim());
      filter.tags = { $in: tagsArray };
    }

    if (category) {
      filter.category = category;
    }

    const totalDocuments = await Document.countDocuments(filter);
    const documents = await Document.find(filter)
      .populate("uploadedBy", "username email")
      .populate("permissions.userId", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      documents,
      pagination: {
        total: totalDocuments,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalDocuments / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching documents" });
  }
});

// Get single document
router.get("/:id", auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate("uploadedBy", "username email")
      .populate("permissions.userId", "username email")
      .populate("versions.uploadedBy", "username email");

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Check permissions
    const isOwner = document.uploadedBy._id.toString() === req.user.id;
    const hasPermission = document.permissions.some(
      (perm) => perm.userId._id.toString() === req.user.id
    );

    if (!isOwner && !document.isPublic && !hasPermission) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching document" });
  }
});

// Download document
router.get("/:id/download", auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Check permissions
    const isOwner = document.uploadedBy.toString() === req.user.id;
    const hasPermission = document.permissions.some(
      (perm) => perm.userId.toString() === req.user.id
    );

    if (!isOwner && !document.isPublic && !hasPermission) {
      return res.status(403).json({ message: "Access denied" });
    }

    const filePath = path.join(__dirname, "..", document.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    res.download(filePath, document.title);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error downloading document" });
  }
});

// Update document and create new version
router.put("/:id", auth, upload.single("file"), async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Document not found" });
    }

    // Check if user is owner
    if (document.uploadedBy.toString() !== req.user.id) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res
        .status(403)
        .json({ message: "Not authorized to update this document" });
    }

    const { title, description, category, tags, isPublic } = req.body;

    // Update basic info
    if (title) document.title = title;
    if (description !== undefined) document.description = description;
    if (category) document.category = category;
    if (tags) {
      try {
        document.tags = typeof tags === "string" ? JSON.parse(tags) : tags;
      } catch (e) {
        document.tags = [];
      }
    }
    if (isPublic !== undefined) document.isPublic = isPublic === "true";

    // If new file is provided, create a new version
    if (req.file) {
      // Delete old file
      const oldFilePath = path.join(__dirname, "..", document.filePath);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      const newVersion = document.currentVersion + 1;
      document.versions.push({
        versionNumber: newVersion,
        fileName: req.file.filename,
        filePath: req.file.path,
        uploadedBy: req.user.id,
      });

      document.fileName = req.file.filename;
      document.filePath = req.file.path;
      document.fileSize = req.file.size;
      document.mimeType = req.file.mimetype;
      document.currentVersion = newVersion;
    }

    await document.save();
    await document.populate("uploadedBy", "username email");
    await document.populate("permissions.userId", "username email");

    res.json({
      message: "Document updated successfully",
      document,
    });
  } catch (error) {
    console.error(error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: "Server error updating document" });
  }
});

// Set permissions
router.post("/:id/permissions", auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Check if user is owner
    if (document.uploadedBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to set permissions" });
    }

    const { userId, accessType } = req.body;

    if (!userId || !accessType) {
      return res
        .status(400)
        .json({ message: "userId and accessType are required" });
    }

    // Remove existing permission for this user if it exists
    document.permissions = document.permissions.filter(
      (perm) => perm.userId.toString() !== userId
    );

    // Add new permission
    if (accessType !== "none") {
      document.permissions.push({ userId, accessType });
    }

    await document.save();
    await document.populate("permissions.userId", "username email");

    res.json({
      message: "Permissions updated successfully",
      document,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating permissions" });
  }
});

// Delete document
router.delete("/:id", auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Check if user is owner
    if (document.uploadedBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this document" });
    }

    // Delete all versions of the file
    document.versions.forEach((version) => {
      const filePath = path.join(__dirname, "..", version.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // Delete current file if it exists
    const currentFilePath = path.join(__dirname, "..", document.filePath);
    if (fs.existsSync(currentFilePath)) {
      fs.unlinkSync(currentFilePath);
    }

    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error deleting document" });
  }
});

module.exports = router;
