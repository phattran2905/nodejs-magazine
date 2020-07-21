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
    thumbnail_img: {
        path: String,
        contentType: String,
        filename: String,
        size: Number
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    interaction: {
        views: {
            type: Number,
            default: 0,
        },
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }]
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

ArticleSchema.index({title: 'text'});

module.exports = mongoose.model("Article", ArticleSchema);