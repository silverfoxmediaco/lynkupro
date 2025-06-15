import Vendor from '../models/Vendor.js';
import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';

export const getVendors = asyncHandler(async (req, res, next) => {
  const vendors = await Vendor.find()
    .populate('createdBy', 'name email')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: vendors.length,
    data: vendors
  });
});

export const getVendor = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('reviews.reviewer', 'name');

  if (!vendor) {
    return next(new ErrorResponse(`Vendor not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: vendor
  });
});

export const createVendor = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user.id;
  const vendor = await Vendor.create(req.body);

  res.status(201).json({
    success: true,
    data: vendor
  });
});

export const updateVendor = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!vendor) {
    return next(new ErrorResponse(`Vendor not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: vendor
  });
});

export const deleteVendor = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id);

  if (!vendor) {
    return next(new ErrorResponse(`Vendor not found with id of ${req.params.id}`, 404));
  }

  await vendor.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

export const rateVendor = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id);

  if (!vendor) {
    return next(new ErrorResponse(`Vendor not found with id of ${req.params.id}`, 404));
  }

  const review = {
    reviewer: req.user.id,
    rating: req.body.rating,
    comment: req.body.comment
  };

  vendor.reviews.push(review);
  vendor.updateRating();
  await vendor.save();

  res.status(200).json({
    success: true,
    data: vendor
  });
});