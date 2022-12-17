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
const home_route_1 = __importDefault(require("./client/home/home.route"));
dotenv_1.default.config();
(0, database_1.default)();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, '../views'));
app.use('/static', express_1.default.static(path_1.default.join(__dirname, 'public/user')));
app.get('/', (req, res) => {
    res.send('Nodejs Magazine!');
});
app.use(home_route_1.default);
app.use((req, res) => res.render('error/user-404'));
exports.default = app;
