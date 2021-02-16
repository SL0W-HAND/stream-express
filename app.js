const express = require('express');
const fs = require('fs');
const path = require('path');
const thumbsupply = require('thumbsupply');
const folderPath = require('./folderPath');
const { getVideoDurationInSeconds } = require('get-video-duration') 

var videos = [];

fs.readdir(folderPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    var index = 0;
    files.forEach((file) => {

        if(path.extname(file) == '.mp4'){
            var videoPath = path.join(folderPath,file);

            var video = {
                id:index,
                name:file,
                duration:0,
                path:videoPath//maybe i dont want to send this
            };

            index ++ ;
            getVideoDurationInSeconds(videoPath).then(function (duration){
                video.duration = duration    
            }).then(
                videos.push(video)   
            ) 
        }
    });
});

const cors = require('cors');

const app = express();

app.use(cors());
app.get('/videos', (req, res) => res.json(videos));
/*
app.get('/video', (req, res) => {
    res.sendFile('assets/sample.mp4', { root: __dirname });
});
*/
app.get('/video/:id/data', (req, res) => {
    const id = parseInt(req.params.id, 10);
    res.json(videos[id]);
});

app.get('/video/:id', (req, res) => {
    const path = `assets/${req.params.id}.mp4`;//i need a function to match by id
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize-1;
        const chunksize = (end-start) + 1;
        const file = fs.createReadStream(path, {start, end});
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
        fs.createReadStream(path).pipe(res);
    }
});
/*
app.get('/video/:id/poster', (req, res) => {
    thumbsupply.generateThumbnail(`assets/${req.params.id}.mp4`)
    .then(thumb => res.sendFile(thumb));
});
*/
app.listen(4000, () => {
    console.log('Listening on port 4000!');
});