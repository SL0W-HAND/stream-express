const express = require('express');
const fs = require('fs');
const path = require('path');
const thumbsupply = require('thumbsupply');
const folderPath = require('./folderPath');
const { getVideoDurationInSeconds } = require('get-video-duration');
const cors = require('cors'); 

var videos = [];

fs.readdir(folderPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    let index = 0;
    files.forEach((file) => {

        if(path.extname(file) == '.mp4'){
            var videoPath = path.join(folderPath,file);
            var video = {
                id:index,
                name:file,
                duration:0,
            };

            index ++ ;
            getVideoDurationInSeconds(videoPath).then(function (duration){
                video.duration = duration;    
            }).then(videos.push(video))
        };
    });
});

const app = express();

app.use(cors());

app.get('/videos', (req, res) => res.json(videos));

app.get('/video/:id/data', (req, res) => {
    const id = parseInt(req.params.id, 10);
    res.json(videos[id]);
});

app.get('/video/:id', (req, res) => {
    const videoName = videos[req.params.id].name;
    const pathVideo = `${folderPath}/${videoName}`;
    const stat = fs.statSync(pathVideo);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize-1;
        const chunksize = (end-start) + 1;
        const file = fs.createReadStream(pathVideo, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(pathVideo).pipe(res);
    }
});

app.get('/video/:id/poster', (req, res) => {
    const videoName = videos[req.params.id].name;
    thumbsupply.generateThumbnail(`${folderPath}/${videoName}`)
    .then(thumb => res.sendFile(thumb));
});

app.listen(4000, () => {
    console.log('Listening on port 40000!');
});