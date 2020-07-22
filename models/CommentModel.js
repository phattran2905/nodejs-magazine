const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    articleId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    audienceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Audience'
    },
    status: {
        type: String,
        default: 'Public',
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Comment', CommentSchema);