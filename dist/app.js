"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("./database"));
const routes_1 = __importDefault(require("./routes"));
const express_session_1 = __importDefault(require("express-session"));
const express_flash_1 = __importDefault(require("express-flash"));
// Load environment variables
dotenv_1.default.config();
// Connect to database
(0, database_1.default)();
// Express Server
const app = (0, express_1.default)();
// Middleware
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, express_session_1.default)({
    name: 'magazine',
    secret: process.env.SECRET_KEY ?? 'phatductran_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 3600 * 1000 * 7
    }
}));
app.use((0, express_flash_1.default)());
// View template
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, '../views'));
app.use('/static', express_1.default.static(path_1.default.join(__dirname, '../public/user')));
app.use('/admin/static', express_1.default.static(path_1.default.join(__dirname, '../public/admin')));
// Routes
app.use(routes_1.default);
// app.use((req, res) => res.render('error/user-404'))
exports.default = app;
