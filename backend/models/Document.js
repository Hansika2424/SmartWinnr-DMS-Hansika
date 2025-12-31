const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a document title"],
    },
    description: {
      type: String,
      default: "",
    },
    fileName: {
      type: String,
      required: [true, "Please provide a file name"],
    },
    filePath: {
      type: String,
      required: [true, "Please provide a file path"],
    },
    fileSize: {
      type: Number,
      required: [true, "Please provide file size"],
    },
    mimeType: {
      type: String,
      required: [true, "Please provide MIME type"],
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: "Uncategorized",
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user who uploaded"],
    },
    permissions: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        accessType: {
          type: String,
          enum: ["view", "edit"],
          default: "view",
        },
      },
    ],
    versions: [
      {
        versionNumber: Number,
        fileName: String,
        filePath: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    currentVersion: {
      type: Number,
      default: 1,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
