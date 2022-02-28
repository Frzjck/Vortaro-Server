const mongoose = require('mongoose');
const GroupSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter a group title"],
        trim: true,
        maxlength: [50, "Name can not be longer than 50 characters"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    averageProficiency: {
        type: Number,
        min: [1, "Proficiency must be at least 1"],
        max: [20, "Proficiency can not be more than 20"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    }
});

// // Cascade delete words when a group is deleted
GroupSchema.pre("remove", async function (next) {
    console.log(`Words being removed from group ${this._id}`);
    await this.model("Word").deleteMany({
        group: this._id
    });
    next();
});

module.exports = mongoose.model("Group", GroupSchema);