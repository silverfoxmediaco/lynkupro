import Project from '../models/Project.js';
import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
export const getProjects = asyncHandler(async (req, res, next) => {
  const query = {};

  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Filter by project manager
  if (req.query.projectManager) {
    query.projectManager = req.query.projectManager;
  }

  // Filter by date range
  if (req.query.startDate && req.query.endDate) {
    query.startDate = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }

  const projects = await Project.find(query)
    .populate('client', 'name email company')
    .populate('projectManager', 'name email')
    .populate('team.user', 'name email')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate('client', 'name email company phone')
    .populate('projectManager', 'name email phone')
    .populate('team.user', 'name email phone')
    .populate('tasks')
    .populate('documents');

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Create project
// @route   POST /api/projects
// @access  Private/Admin/Manager
export const createProject = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user.id;

  const project = await Project.create(req.body);

  res.status(201).json({
    success: true,
    data: project
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin/Manager
export const updateProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Add team member to project
// @route   POST /api/projects/:id/members
// @access  Private/Admin/Manager
export const addProjectMember = asyncHandler(async (req, res, next) => {
  const { userId, role, permissions } = req.body;

  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }

  // Check if user is already in team
  const existingMember = project.team.find(member => member.user.toString() === userId);
  if (existingMember) {
    return next(new ErrorResponse('User is already a team member', 400));
  }

  project.team.push({
    user: userId,
    role,
    permissions
  });

  await project.save();

  const updatedProject = await Project.findById(project._id).populate('team.user', 'name email');

  res.status(200).json({
    success: true,
    data: updatedProject
  });
});

// @desc    Remove team member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private/Admin/Manager
export const removeProjectMember = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }

  project.team = project.team.filter(
    member => member.user.toString() !== req.params.userId
  );

  await project.save();

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Update project status
// @route   PUT /api/projects/:id/status
// @access  Private/Admin/Manager
export const updateProjectStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!['planning', 'in_progress', 'on_hold', 'completed', 'cancelled'].includes(status)) {
    return next(new ErrorResponse('Invalid status', 400));
  }

  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { 
      status,
      actualEndDate: status === 'completed' ? Date.now() : undefined
    },
    { new: true, runValidators: true }
  );

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: project
  });
});