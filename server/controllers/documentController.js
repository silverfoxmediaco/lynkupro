import Document from '../models/Document.js';
import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';
import path from 'path';
import fs from 'fs';

export const uploadDocument = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const document = await Document.create({
    name: req.body.name || req.file.originalname,
    description: req.body.description,
    fileName: req.file.filename,
    originalName: req.file.originalname,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
    filePath: req.file.path,
    category: req.body.category,
    uploadedBy: req.user.id
  });

  res.status(201).json({
    success: true,
    data: document
  });
});

export const getDocuments = asyncHandler(async (req, res, next) => {
  const documents = await Document.find()
    .populate('uploadedBy', 'name email')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: documents.length,
    data: documents
  });
});

export const getDocument = asyncHandler(async (req, res, next) => {
  const document = await Document.findById(req.params.id)
    .populate('uploadedBy', 'name email');

  if (!document) {
    return next(new ErrorResponse(`Document not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: document
  });
});

export const deleteDocument = asyncHandler(async (req, res, next) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    return next(new ErrorResponse(`Document not found with id of ${req.params.id}`, 404));
  }

  // Delete file from filesystem
  if (fs.existsSync(document.filePath)) {
    fs.unlinkSync(document.filePath);
  }

  await document.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

export const downloadDocument = asyncHandler(async (req, res, next) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    return next(new ErrorResponse(`Document not found with id of ${req.params.id}`, 404));
  }

  res.download(document.filePath, document.originalName);
});