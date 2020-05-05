const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    displayOrder: {
        type: Number,
        default: 10000
    },
    status: {
        type: String,
        default: "Deactivated"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Category',CategorySchema)