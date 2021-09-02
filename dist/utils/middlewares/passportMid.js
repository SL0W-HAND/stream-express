"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const index_1 = __importDefault(require("../../config/index"));
var cookieExtractor = function (req) {
    var token = null;
    console.log(req.cookies);
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: index_1.default.jwtSecret
};
exports.default = new passport_jwt_1.Strategy(opts, (payload, done) => {
    return done(null, true);
});
