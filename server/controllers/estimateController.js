import Estimate from '../models/Estimate.js';
import Project from '../models/Project.js';
import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';

export const getEstimates = asyncHandler(async (req, res, next) => {
  const estimates = await Estimate.find()
    .populate('client', 'name email company')
    .populate('createdBy', 'name email')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: estimates.length,
    data: estimates
  });
});

export const getEstimate = asyncHandler(async (req, res, next) => {
  const estimate = await Estimate.findById(req.params.id)
    .populate('client', 'name email company phone')
    .populate('createdBy', 'name email');

  if (!estimate) {
    return next(new ErrorResponse(`Estimate not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: estimate
  });
});

export const createEstimate = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user.id;
  const estimate = await Estimate.create(req.body);

  res.status(201).json({
    success: true,
    data: estimate
  });
});

export const updateEstimate = asyncHandler(async (req, res, next) => {
  const estimate = await Estimate.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!estimate) {
    return next(new ErrorResponse(`Estimate not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: estimate
  });
});

export const deleteEstimate = asyncHandler(async (req, res, next) => {
  const estimate = await Estimate.findById(req.params.id);

  if (!estimate) {
    return next(new ErrorResponse(`Estimate not found with id of ${req.params.id}`, 404));
  }

  await estimate.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

export const sendEstimate = asyncHandler(async (req, res, next) => {
  const estimate = await Estimate.findById(req.params.id).populate('client');

  if (!estimate) {
    return next(new ErrorResponse(`Estimate not found with id of ${req.params.id}`, 404));
  }

  estimate.status = 'sent';
  estimate.sentDate = Date.now();
  await estimate.save();

  res.status(200).json({
    success: true,
    message: 'Estimate sent successfully',
    data: estimate
  });
});

export const convertToProject = asyncHandler(async (req, res, next) => {
  const estimate = await Estimate.findById(req.params.id);

  if (!estimate) {
    return next(new ErrorResponse(`Estimate not found with id of ${req.params.id}`, 404));
  }

  if (estimate.convertedToProject) {
    return next(new ErrorResponse('Estimate already converted to project', 400));
  }

  const project = await Project.create({
    name: estimate.title,
    description: estimate.description,
    client: estimate.client,
    budget: estimate.total,
    startDate: req.body.startDate || Date.now(),
    endDate: req.body.endDate,
    projectManager: req.user.id,
    createdBy: req.user.id,
    status: 'planning'
  });

  estimate.convertedToProject = true;
  estimate.project = project._id;
  await estimate.save();

  res.status(201).json({
    success: true,
    data: project
  });
});