"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
const router = express_1.Router();
router.post('/signin', userControllers_1.signIn);
exports.default = router;
