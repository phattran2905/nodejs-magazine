const mongoose = require('mongoose');

const SubmenuSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    encoded_string: {
        type: String,
        unique: true
    },
    display_order: {
        type: Number,
        unique: true,
        required: true
    },
    menuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    status: {
        type: String,
        default: 'Deactivated'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Submenu', SubmenuSchema);