const mongoose = require('mongoose');

const AuthorSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    emai: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    personal_information: {
        fullname: String,
        gender: String,
        birthdate: String,
        phone: String
    },
    status: {
        type: String,
        default: "Deactivated"
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Author', AuthorSchema)