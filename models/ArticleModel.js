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
            originalName: String,
            path: String,
            mimetype: String,
            stored_filename: String,
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
                audienceId: mongoose.Schema.Types.ObjectId,
            },
        ]
    },
    status: {
        type: String,
        default: "Not published"
    },
    updated: {
        onDate: {
            type: Date
        },
        By: {
            accountType: {
                type: String,
                required: true
            },
            accountID: {
                type: mongoose.Schema.Types.ObjectId
            }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Article", ArticleSchema);
