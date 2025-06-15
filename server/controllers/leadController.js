import Lead from '../models/Lead.js';
import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
export const getLeads = asyncHandler(async (req, res, next) => {
  const query = {};

  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Filter by assigned user
  if (req.query.assignedTo) {
    query.assignedTo = req.query.assignedTo;
  }

  // Search functionality
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  const leads = await Lead.find(query)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: leads.length,
    data: leads
  });
});

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
export const getLead = asyncHandler(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('notes.createdBy', 'name');

  if (!lead) {
    return next(new ErrorResponse(`Lead not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: lead
  });
});

// @desc    Create lead
// @route   POST /api/leads
// @access  Private
export const createLead = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user.id;

  const lead = await Lead.create(req.body);

  res.status(201).json({
    success: true,
    data: lead
  });
});

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = asyncHandler(async (req, res, next) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!lead) {
    return next(new ErrorResponse(`Lead not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: lead
  });
});

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private/Admin/Manager
export const deleteLead = asyncHandler(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return next(new ErrorResponse(`Lead not found with id of ${req.params.id}`, 404));
  }

  await lead.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Assign lead to user
// @route   PUT /api/leads/:id/assign
// @access  Private/Admin/Manager
export const assignLead = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { assignedTo: userId },
    { new: true, runValidators: true }
  ).populate('assignedTo', 'name email');

  if (!lead) {
    return next(new ErrorResponse(`Lead not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: lead
  });
});

// @desc    Update lead status
// @route   PUT /api/leads/:id/status
// @access  Private
export const updateLeadStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'].includes(status)) {
    return next(new ErrorResponse('Invalid status', 400));
  }

  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!lead) {
    return next(new ErrorResponse(`Lead not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: lead
  });
});