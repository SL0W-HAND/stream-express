import { connect } from 'mongoose';
import fs from 'fs';
import config from '../config/index';
import path from 'path';
import { getVideoDurationInSeconds } from 'get-video-duration';

//Schemas
import Video from '../Schemas/Video';

run().catch((err) => console.log(err));

function getDuration(path: string) {
	getVideoDurationInSeconds(path).then((duration) => {
		return duration;
	});
}

async function run(): Promise<void> {
	// Connect to MongoDB
	await connect('mongodb://localhost:27017/videodb');

	fs.readdir(config.folderPath, function (err, files) {
		if (err) {
			return console.log('Unable to scan directory: ' + err);
		}
		files.forEach((file) => {
			if (file.includes('.mp4')) {
				let videoPath = path.join(config.folderPath, file);
				getVideoDurationInSeconds(videoPath)
					.then(async (duration) => {
						const SingleVideo = new Video({
							name: file,
							duration: duration,
						});
						await SingleVideo.save();
					})
					.then(() => {
						//if is the last file exit
						if (files.length === files.indexOf(file) + 1) {
							console.log('All videos saved');
							process.exit(1);
						}
					});
			}
		});
	});
}
