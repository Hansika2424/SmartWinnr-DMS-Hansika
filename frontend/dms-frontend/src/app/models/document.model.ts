export interface DocumentVersion {
  versionNumber: number;
  fileName: string;
  filePath: string;
  uploadedAt: Date;
  uploadedBy: {
    _id: string;
    username: string;
    email: string;
  };
}

export interface DocumentPermission {
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  accessType: 'view' | 'edit';
}

export interface Document {
  _id: string;
  title: string;
  description: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  tags: string[];
  category: string;
  uploadedBy: {
    _id: string;
    username: string;
    email: string;
  };
  permissions: DocumentPermission[];
  versions: DocumentVersion[];
  currentVersion: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
