import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a lead name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
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
  company: {
    type: String,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'],
    default: 'new'
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'social', 'email', 'phone', 'other'],
    default: 'website'
  },
  value: {
    type: Number,
    default: 0
  },
  probability: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  notes: [{
    text: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [{
    type: String
  }],
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  projectType: {
    type: String,
    enum: ['residential', 'commercial', 'industrial', 'renovation', 'other']
  },
  estimatedStartDate: Date,
  budget: {
    min: Number,
    max: Number
  },
  lastContactDate: Date,
  nextFollowUp: Date,
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

// Index for search functionality
leadSchema.index({ name: 'text', email: 'text', company: 'text' });

// Virtual for full address
leadSchema.virtual('fullAddress').get(function() {
  if (!this.address) return '';
  const parts = [
    this.address.street,
    this.address.city,
    this.address.state,
    this.address.zipCode,
    this.address.country
  ].filter(Boolean);
  return parts.join(', ');
});

export default mongoose.model('Lead', leadSchema);