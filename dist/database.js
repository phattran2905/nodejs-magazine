"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
function connectDb() {
    mongoose_1.default.connect(process.env.DATABASE_URI || 'mongodb://localhost/nodejs-magazine', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
    mongoose_1.default.connection.once('open', () => console.log('Successfully connected to MongoDb'));
    mongoose_1.default.connection.once('error', () => console.error.bind(console, 'connection error'));
}
exports.default = connectDb;
