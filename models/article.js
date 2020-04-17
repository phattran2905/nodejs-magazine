const mongoose = require("mongoose");

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
            position: Number,
            name: String,
        },
    ],
    category: {
        type: String
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    body_article: {
        type: String,
        required: true,
    },
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
            user_id: mongoose.Schema.Types.ObjectId,
            body: String,
            posted_date: { type: Date, default: Date.now },
        },
    ],
    created_at: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: "Not Approved",
    },
});

module.exports = mongoose.model("Article", ArticleSchema);
