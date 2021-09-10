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
exports.searchVideos = exports.videoPoster = exports.video = exports.videoData = exports.pageVideos = void 0;
//import { DefaultDeserializer } from 'v8';
const db_1 = __importDefault(require("../database/db"));
const index_1 = __importDefault(require("../config/index"));
const fs_1 = __importDefault(require("fs"));
const thumbsupply = require('thumbsupply');
const db = new db_1.default();
const pageVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allEntries = yield db.getPages();
    if (!parseInt(req.params.page)) {
        return res.json('bad request');
    }
    if (parseInt(req.params.page) - 1 > allEntries[0].total_pages || parseInt(req.params.page) - 1 < 0) {
        return res.json('bad request');
    }
    const page = allEntries[parseInt(req.params.page) - 1];
    return res.json(page);
});
exports.pageVideos = pageVideos;
const videoData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield db.getById(req.params.id);
    //console.log(data)
    return res.status(200).json(data);
});
exports.videoData = videoData;
const video = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videoData = yield db.getById(req.params.id);
        const pathVideo = `${index_1.default.folderPath}/${videoData === null || videoData === void 0 ? void 0 : videoData.name}`;
        const stat = fs_1.default.statSync(pathVideo);
        const fileSize = stat.size;
        const range = req.headers.range;
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize - 1;
            const chunksize = (end - start) + 1;
            const file = fs_1.default.createReadStream(pathVideo, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(206, head);
            file.pipe(res);
        }
        else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            fs_1.default.createReadStream(pathVideo).pipe(res);
        }
    }
    catch (error) {
        res.status(404).json(null);
    }
});
exports.video = video;
const videoPoster = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const video = yield db.getById(req.params.id);
    if (video !== null) {
        thumbsupply.generateThumbnail(`${index_1.default.folderPath}/${video.name}`)
            .then((thumb) => { return res.sendFile(thumb); });
    }
    else {
        res.status(404).json(null);
    }
});
exports.videoPoster = videoPoster;
const searchVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(req.params.query)
    const results = yield db.getByString(req.params.query);
    return res.json(results);
});
exports.searchVideos = searchVideos;
