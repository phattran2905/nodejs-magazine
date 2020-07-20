const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    encoded_string: {
        type: String,
        required: true
    },
    display_order: {
        type: Number,
        required: true
    },
    // submenu: [
    //     { 
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Submenu'
    //     }
    // ],
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
})

module.exports = mongoose.model('Menu', MenuSchema)