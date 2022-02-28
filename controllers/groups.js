const Group = require('../models/Group');
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require('../middleware/async');

// @desc Get all Groups
// @route Get /api/v1/groups
// @access Private
exports.getGroups = asyncHandler(async (req, res, next) => {
    const groups = await Group.find({
        user: req.user.id
    });

    res.status(200).json({
        success: true,
        data: groups
    });
});

// @desc Get single Group
// @route Get /api/v1/groups/:groupId
// @access Private
exports.getGroup = asyncHandler(async (req, res, next) => {
    const group = await Group.findById(req.params.id);

    if (!group) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(201).json({
        success: true,
        data: group,
    });
});

// @desc Create new Group
// @route POST /api/v1/groups
// @access Private

exports.createGroup = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id;
    const group = await Group.create(req.body);

    res.status(201).json({
        success: true,
        data: group,
    });
});

// @desc Edit a single Group
// @route PUT /api/v1/groups/:groupId
// @access Private
exports.updateGroup = asyncHandler(async (req, res, next) => {
    let group = await Group.findById(req.params.id);
    if (!group) {
        return next(new ErrorResponse(`Group not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is Group owner
    if (group.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to edit this group`, 404));
    }
    group = await Group.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: group,
    });
});

// @desc Delete a single Group
// @route DELETE /api/v1/groups/:groupId
// @access Private
exports.deleteGroup = asyncHandler(async (req, res, next) => {
    const group = await Group.findById(req.params.id);

    if (!group) {
        return next(new ErrorResponse(`Group not found with id of ${req.params.id}`, 404));
    }
    // Make sure user is Group owner
    if (group.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this group`, 404));
    }

    await group.remove();
    res.status(200).json({
        success: true,
        data: {},
    });
});