import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an organization name'],
    trim: true,
    maxlength: [200, 'Name cannot be more than 200 characters']
  },
  subdomain: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens']
  },
  logo: String,
  website: String,
  industry: {
    type: String,
    default: 'construction'
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
    default: '1-10'
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  phone: String,
  email: {
    type: String,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  subscription: {
    plan: {
      type: String,
      enum: ['starter', 'professional', 'enterprise'],
      default: 'starter'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'past_due'],
      default: 'active'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: Date,
    seats: {
      type: Number,
      default: 5
    },
    features: [{
      type: String
    }]
  },
  settings: {
    timezone: {
      type: String,
      default: 'America/New_York'
    },
    dateFormat: {
      type: String,
      default: 'MM/DD/YYYY'
    },
    currency: {
      type: String,
      default: 'USD'
    },
    fiscalYearStart: {
      type: Number,
      default: 1,
      min: 1,
      max: 12
    }
  },
  integrations: [{
    name: String,
    enabled: {
      type: Boolean,
      default: false
    },
    config: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  }],
  customFields: [{
    model: {
      type: String,
      enum: ['Lead', 'Project', 'Task', 'Estimate']
    },
    fields: [{
      name: String,
      type: {
        type: String,
        enum: ['text', 'number', 'date', 'select', 'multiselect', 'boolean']
      },
      options: [String],
      required: {
        type: Boolean,
        default: false
      }
    }]
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Organization', organizationSchema);