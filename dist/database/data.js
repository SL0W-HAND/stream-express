"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const index_1 = __importDefault(require("../config/index"));
const path_1 = __importDefault(require("path"));
const get_video_duration_1 = require("get-video-duration");
var videos = [];
fs_1.default.readdir(index_1.default.folderPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    let index = 0;
    files.forEach((file) => {
        if (path_1.default.extname(file) == '.mp4') {
            let videoPath = path_1.default.join(index_1.default.folderPath, file);
            let video = {
                id: index,
                name: file,
                duration: 0,
            };
            index++;
            get_video_duration_1.getVideoDurationInSeconds(videoPath).then(function (duration) {
                video.duration = duration;
            }).then(videos.push(video));
        }
        ;
    });
});
exports.default = videos;
