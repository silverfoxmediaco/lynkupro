import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a vendor name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  companyName: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true,
    maxlength: [200, 'Company name cannot be more than 200 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  alternatePhone: String,
  website: String,
  category: {
    type: String,
    required: true,
    enum: ['materials', 'equipment', 'subcontractor', 'services', 'other']
  },
  specialties: [{
    type: String
  }],
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  taxId: String,
  license: {
    number: String,
    expiryDate: Date,
    verified: {
      type: Boolean,
      default: false
    }
  },
  insurance: {
    provider: String,
    policyNumber: String,
    expiryDate: Date,
    coverageAmount: Number,
    verified: {
      type: Boolean,
      default: false
    }
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  paymentTerms: {
    type: String,
    default: 'Net 30'
  },
  currency: {
    type: String,
    default: 'USD'
  },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    routingNumber: String,
    bankName: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'blacklisted'],
    default: 'active'
  },
  notes: String,
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  preferredVendor: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  }
}, {
  timestamps: true
});

// Update average rating
vendorSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating.average = sum / this.reviews.length;
    this.rating.count = this.reviews.length;
  }
};

// Index for search
vendorSchema.index({ name: 'text', companyName: 'text', specialties: 'text' });

export default mongoose.model('Vendor', vendorSchema);