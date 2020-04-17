const mongoose = require("mongoose");

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
        birthdate: Date,
        phone: String
    },
    role: {
        type: String,
        default: "Admin"
    },
    verifyToken: {
        token: String,
        expiredOn: {
            type: Date,
            default: Date.now
        }
    },
    status: {
        type: String,
        default: "Deactivated"
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Admin', AdminSchema);