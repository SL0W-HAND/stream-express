"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
const passport_1 = __importDefault(require("passport"));
const router = express_1.Router();
router.post('/signin', userControllers_1.signIn);
router.get('/refresh_token', passport_1.default.authenticate("jwt", { session: false }), userControllers_1.refreshToken);
exports.default = router;
