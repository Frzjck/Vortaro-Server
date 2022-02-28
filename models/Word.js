const mongoose = require('mongoose');
const WordSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a word"],
        trim: true,
        maxlength: 30
    },
    translation: {
        type: String,
        required: [true, "Please add some text"],
        trim: true,
        maxlength: 30
    },
    tips: {
        type: String,
        trim: true,
        maxlength: 50
    },
    additionalTr: {
        type: [String],
        trim: true,
        maxlength: 240
    },
    proficiency: {
        type: Number,
        default: 5,
        min: 1,
        max: 20,
        required: [true, "Please add rating between 1 and 20"],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    group: {
        type: mongoose.Schema.ObjectId,
        ref: "Group",
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    }
});


// Static method to get avg of review score
WordSchema.statics.getAverageScore = async function (groupId) {
    const obj = await this.aggregate([{
            $match: {
                group: groupId
            }
        },
        {
            $group: {
                _id: "$group",
                averageProficiency: {
                    $avg: "$proficiency"
                }
            },
        }
    ]);
    try {
        await this.model("Group").findByIdAndUpdate(groupId, {
            averageProficiency: Math.ceil(obj[0].averageProficiency * 10) / 10
        });
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageRating AFTER save
WordSchema.post("save", function () {
    this.constructor.getAverageScore(this.group);
});

// Call getAverageRating BEFORE remove
WordSchema.pre("remove", function () {
    this.constructor.getAverageScore(this.group);
});

module.exports = mongoose.model("Word", WordSchema);