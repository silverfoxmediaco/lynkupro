import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a document name'],
    trim: true,
    maxlength: [200, 'Name cannot be more than 200 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['contract', 'proposal', 'invoice', 'plan', 'permit', 'report', 'image', 'other'],
    default: 'other'
  },
  tags: [{
    type: String
  }],
  relatedTo: {
    model: {
      type: String,
      enum: ['Project', 'Lead', 'Estimate', 'Vendor']
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedTo.model'
    }
  },
  version: {
    type: Number,
    default: 1
  },
  previousVersions: [{
    fileName: String,
    filePath: String,
    uploadedAt: Date,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permissions: {
      type: [String],
      enum: ['view', 'download', 'edit', 'delete'],
      default: ['view', 'download']
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  expiryDate: Date,
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  }
}, {
  timestamps: true
});

// Index for search
documentSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for file URL
documentSchema.virtual('fileUrl').get(function() {
  return `/uploads/${this.fileName}`;
});

export default mongoose.model('Document', documentSchema);