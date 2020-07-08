const mongoose = require('mongoose');

const AuthorSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
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
    popularity: {
        views: {
            type: Number,
            default: 0
        },
        likes: {
            type: Number,
            default: 0
        }
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
    remember_token: String,
    lastLogin: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Author', AuthorSchema)