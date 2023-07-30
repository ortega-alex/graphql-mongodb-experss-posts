const { Schema, model } = require('mongoose');

const commentSchema = new Schema(
    {
        comment: { type: String, required: true },
        userId: { type: String, required: true },
        postId: { type: String, required: true }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = model('Comment', commentSchema);
