"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = __importDefault(require("../config/index"));
const secret = index_1.default.jwtSecret;
function createToken() {
    //console.log(secret)
    return jsonwebtoken_1.default.sign({ auth: true }, secret, { expiresIn: '60s' });
}
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.password) {
        return res
            .status(400)
            .json({ msg: "Please. Send your password" });
    }
    const isMatch = () => {
        if (req.body.password === index_1.default.user.password) {
            return true;
        }
        else {
            return false;
        }
    };
    if (isMatch()) {
        let token = createToken();
        return res.status(200).cookie('token', token, {
            httpOnly: !index_1.default.dev,
            secure: !index_1.default.dev,
        }).json({
            auth: true
        });
    }
    return res.status(400).json({
        msg: "The password are incorrect",
        auth: false
    });
});
exports.signIn = signIn;
