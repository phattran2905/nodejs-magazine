const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        fullname: String,
        gender: String,
        dateOfBirth: Date,
        phone: String,
        avatar_img: {
            path: String,
            contentType: String,
            filename: String,
            size: Number
        }
    },
    role: {
        type: String,
        default: "Not Assigned"
    },
    verifyToken: {
        token: String,
        expiredOn: {
            type: Date,
            required: true
        }
    },
    status: {
        type: String,
        default: "Deactivated"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Admin', AdminSchema);