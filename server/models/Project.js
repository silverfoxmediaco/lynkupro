import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true,
    maxlength: [200, 'Name cannot be more than 200 characters']
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  status: {
    type: String,
    enum: ['planning', 'in_progress', 'on_hold', 'completed', 'cancelled'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date']
  },
  actualStartDate: Date,
  actualEndDate: Date,
  budget: {
    type: Number,
    required: [true, 'Please add a budget']
  },
  actualCost: {
    type: Number,
    default: 0
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  projectManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: String,
    permissions: {
      type: [String],
      enum: ['view', 'edit', 'delete', 'manage'],
      default: ['view']
    }
  }],
  phases: [{
    name: String,
    description: String,
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    completionPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  }],
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  milestones: [{
    name: String,
    description: String,
    dueDate: Date,
    completed: {
      type: Boolean,
      default: false
    },
    completedDate: Date
  }],
  risks: [{
    description: String,
    impact: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    probability: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    mitigation: String,
    status: {
      type: String,
      enum: ['identified', 'mitigated', 'occurred'],
      default: 'identified'
    }
  }],
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  contractValue: Number,
  profitMargin: Number,
  completionPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
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

// Calculate project health
projectSchema.virtual('health').get(function() {
  const now = new Date();
  const endDate = new Date(this.endDate);
  const startDate = new Date(this.startDate);
  
  if (this.status === 'completed') return 'completed';
  if (this.status === 'cancelled') return 'cancelled';
  
  const totalDuration = endDate - startDate;
  const elapsed = now - startDate;
  const timeProgress = (elapsed / totalDuration) * 100;
  
  if (this.completionPercentage >= timeProgress - 10) return 'good';
  if (this.completionPercentage >= timeProgress - 25) return 'warning';
  return 'critical';
});

export default mongoose.model('Project', projectSchema);