const mongoose = require('mongoose')

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },summary: {
        type: String,
        required: true
    },thumbnail_img: {
        type: String,
        required: true
    },category_id: {
        type: String,
        required: true
    },author_id:{
        type: String,
        required: true
    },text: {
        type: String,
        required: true
    },views: {
        type: Number,
        default: 0
    },likes: {
        type: Number,
        default: 0
    },comments: [{
        user_id: Number,
        body: String,
        posted_date: {type: Date, default: Date.now}
    }],created_at: {
        type: Date,
        default: Date.now
    },status: {
        type: String,
        default: 'Not Approved'
    }
})

module.exports = mongoose.model('articles', ArticleSchema)
