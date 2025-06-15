import mongoose from 'mongoose';

const estimateItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true
  },
  category: String,
  notes: String
});

const estimateSchema = new mongoose.Schema({
  estimateNumber: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Please add an estimate title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired'],
    default: 'draft'
  },
  items: [estimateItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    rate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    amount: {
      type: Number,
      default: 0
    }
  },
  discount: {
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    },
    value: {
      type: Number,
      default: 0,
      min: 0
    },
    amount: {
      type: Number,
      default: 0
    }
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  validUntil: {
    type: Date,
    required: true
  },
  terms: {
    type: String,
    default: 'This estimate is valid for 30 days from the date of issue.'
  },
  notes: String,
  sentDate: Date,
  viewedDate: Date,
  acceptedDate: Date,
  rejectedDate: Date,
  rejectionReason: String,
  convertedToProject: {
    type: Boolean,
    default: false
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  attachments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  signature: {
    signed: {
      type: Boolean,
      default: false
    },
    signedBy: String,
    signedDate: Date,
    signatureData: String
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

// Generate estimate number
estimateSchema.pre('save', async function(next) {
  if (this.isNew && !this.estimateNumber) {
    const count = await this.constructor.countDocuments();
    this.estimateNumber = `EST-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Calculate totals
estimateSchema.pre('save', function(next) {
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  
  if (this.discount.type === 'percentage') {
    this.discount.amount = (this.subtotal * this.discount.value) / 100;
  } else {
    this.discount.amount = this.discount.value;
  }
  
  const afterDiscount = this.subtotal - this.discount.amount;
  this.tax.amount = (afterDiscount * this.tax.rate) / 100;
  
  this.total = afterDiscount + this.tax.amount;
  
  next();
});

export default mongoose.model('Estimate', estimateSchema);