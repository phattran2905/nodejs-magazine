const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    display_order: {
        type: Number,
        default: 1000
    },
    articles: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Article'
    },
    status: {
        type: String,
        default: "Inactive"
    }
})

module.exports = mongoose.model('Category',CategorySchema)