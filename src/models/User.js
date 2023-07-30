const { Schema, model } = require('mongoose');

const useSchema = new Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true, select: false },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [
                /^(([^<>()[\],;:\s@"]+(\.[^<>()[\],;:\s@"]+)*)|(".+"))@(([^<>()[\],;:\s@"]+\.)+[^<>()[\],;:\s@"]{2,})$/,
                'Provide a valid email address'
            ]
        },
        displayName: { type: String, required: true }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = model('User', useSchema);
