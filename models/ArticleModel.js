const mongoose = require("mongoose");
const uid = require('uid');
const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    thumbnail_img: [
        {
            path: String,
            contentType: String,
            filename: String,
            size: Number
        },
    ],
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    body: {
        text: {
            type: String,
            required: true,
        }
    },
    interaction: {
        views: {
            type: Number,
            default: 0,
        },
        likes: {
            type: Number,
            default: 0,
        },
        comments: [
            {
                comment_id: { type: String, default: uid(12) },
                nickname: { type: String, default: 'Anonymous' },
                text: String
            },
        ]
    },
    status: {
        type: String,
        default: "Not verified"
    },
    updated: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Article", ArticleSchema);
