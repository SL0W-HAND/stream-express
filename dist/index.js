"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./config/index"));
const passportMid_1 = __importDefault(require("./utils/middlewares/passportMid"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
//import routes
const auth_1 = __importDefault(require("./routes/auth"));
const videos_1 = __importDefault(require("./routes/videos"));
const app = express_1.default();
//settings
app.set('port', index_1.default.port);
//middlewares
app.use(cors_1.default());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(cookie_parser_1.default());
app.use(passport_1.default.initialize());
passport_1.default.use(passportMid_1.default);
app.get('/', (req, res) => {
    return res.send(`The API is at http://localhost:${app.get('port')}`);
});
//Routes
app.use(auth_1.default);
app.use(videos_1.default);
app.listen(index_1.default.port, () => {
    console.log(`server runing on port ${index_1.default.port}`);
});
