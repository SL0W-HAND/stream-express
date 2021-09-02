"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const router = express_1.Router();
const videos_1 = require("../controllers/videos");
router.get("/videos/:page", passport_1.default.authenticate("jwt", { session: false }), videos_1.pageVideos);
router.get("/video/:id/data", passport_1.default.authenticate("jwt", { session: false }), videos_1.videoData);
router.get("/video/:id", passport_1.default.authenticate("jwt", { session: false }), videos_1.video);
router.get("/video/:id/poster", passport_1.default.authenticate("jwt", { session: false }), videos_1.videoPoster);
router.get("/videos/search/:query", passport_1.default.authenticate("jwt", { session: false }), videos_1.searchVideos);
exports.default = router;
