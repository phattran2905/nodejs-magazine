const mongoose = require('mongoose');
const {nanoid} = require('nanoid');

const MenuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    display_order: {
        type: Number,
        required: true
    },
    submenu: [
        { name: String, display_order: Number }
    ],
    status: {
        type: String,
        default: 'Deactivated'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Menu', MenuSchema)