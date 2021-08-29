const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Post = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            max: 500,
        },
        img: {
            type: String,
        },
        likes: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Post', Post)
