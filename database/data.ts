import fs from 'fs';
import config from '../config/index';
import path from 'path';
import { getVideoDurationInSeconds } from 'get-video-duration';

var videos: any = [];

fs.readdir(config.folderPath, function (err, files) {
	//handling error
	if (err) {
		return console.log('Unable to scan directory: ' + err);
	}
	//listing all files using forEach
	let index = 0;
	files.forEach((file) => {
		if (path.extname(file) == '.mp4') {
			let videoPath = path.join(config.folderPath, file);
			let video = {
				id: index,
				name: file,
				duration: 0,
			};

			index++;
			getVideoDurationInSeconds(videoPath)
				.then(function (duration) {
					video.duration = duration;
				})
				.then(videos.push(video));
		}
	});
});

export default videos;
