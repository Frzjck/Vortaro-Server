const Word = require('../models/Word');
const Group = require('../models/Group');
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require('../middleware/async');
const mongoose = require('mongoose');
// @desc Get all Words
// @route GET /api/v1/words
// @route GET /api/v1/groups/:groupId/words
// @access Private
exports.getWords = asyncHandler(async (req, res, next) => {
    let words;
    if (req.params.groupId) {
        // Not checking for userer to allow group sharing
        words = await Word.find({
            group: req.params.groupId
        });
    } else {
        words = await Word.find({
            user: req.user.id
        });
    }
    res.status(200).json({
        success: true,
        count: words.length,
        data: words
    });
});


// @desc Create Word
// @route POST /api/v1/groups/:groupId/words
// @access Private
exports.createWord = asyncHandler(async (req, res, next) => {
    req.body.group = req.params.groupId;
    req.body.user = req.user.id;

    const group = await Group.findById(req.params.groupId);

    if (!group) {
        return next(new ErrorResponse(`No group with the id of ${req.params.id}`, 404));
    }
    // Make sure user is Group owner
    if (group.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to edit this group`, 404));
    }
    const word = await Word.create(req.body);
    res.status(201).json({
        success: true,
        data: word
    });
});

// @desc Update Word
// @route PUT /api/v1/words/:wordId
// @access Private
exports.updateWord = asyncHandler(async (req, res, next) => {
    let word = await Word.findById(req.params.id);

    if (!word) {
        return next(new ErrorResponse(`No word with the id of ${req.params.id}`, 404));
    }
    // Make sure user is Word owner
    if (word.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to edit this word`, 404));
    }
    console.log(req.body);

    word = await Word.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    await Word.getAverageScore(word.group);
    res.status(200).json({
        success: true,
        data: word
    });
});

// @desc Update Word Array Proficiency
// @route PUT /api/v1/words/results
// @access Private
exports.updateWordsProficiency = asyncHandler(async (req, res, next) => {
    const words = req.body;
    if (!words[0]) return;
    const group = mongoose.Types.ObjectId(words[0].group);

    // Making sure user is owner of every Word
    const sameUser = words.reduce((total, word) => {
        if (word.user === words[0].user) {
            return total;
        } else {
            total = false;
            return total;
        }
    }, true);

    if (words[0].user.toString() !== req.user.id || !sameUser) {
        return next(new ErrorResponse(`User is not authorized to edit this word`, 404));
    }

    // Updating
    const ops = words.map(word => {
        return {
            updateOne: {
                filter: {
                    _id: word._id
                },
                update: {
                    proficiency: word.proficiency
                }
            }
        };
    });

    await Word.bulkWrite(ops);
    await Word.getAverageScore(group);

    res.status(200).json({
        success: true,
    });
});

// @desc Delete Word
// @route DELETE /api/v1/words/:wordId
// @access Private
exports.deleteWord = asyncHandler(async (req, res, next) => {
    const word = await Word.findById(req.params.id);

    // Make sure user is Word owner
    if (word.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to edit this word`, 404));
    }
    await word.remove();
    res.status(200).json({
        success: true,
        data: {}
    });
});