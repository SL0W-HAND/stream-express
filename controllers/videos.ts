import { Request, Response } from 'express';
//import { DefaultDeserializer } from 'v8';
import DB from '../database/db';
import config from '../config/index';
import fs from 'fs';

const thumbsupply = require('thumbsupply');

const db = new DB();

export const pageVideos = async (req: Request, res: Response) => {
	const allEntries = await db.getPages();
	if (!parseInt(req.params.page)) {
		return res.json('bad request');
	}

	if (
		parseInt(req.params.page) - 1 > allEntries[0].total_pages ||
		parseInt(req.params.page) - 1 < 0
	) {
		return res.json('bad request');
	}

	const page = allEntries[parseInt(req.params.page) - 1];

	return res.json(page);
};

export const videoData = async (req: Request, res: Response) => {
	const data = await db.getById(req.params.id);
	//console.log(data)
	return res.status(200).json(data);
};

export const video = async (req: Request, res: Response) => {
	try {
		const videoData = await db.getById(req.params.id);
		const pathVideo = `${config.folderPath}/${videoData?.name}`;

		const stat = fs.statSync(pathVideo);
		const fileSize = stat.size;
		const range = req.headers.range;
		if (range) {
			const parts = range.replace(/bytes=/, '').split('-');
			const start = parseInt(parts[0], 10);
			const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
			const chunksize = end - start + 1;
			const file = fs.createReadStream(pathVideo, { start, end });
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
	} catch (error) {
		res.status(404).json(null);
	}
};

export const videoPoster = async (req: Request, res: Response) => {
	const video: any = await db.getById(req.params.id);
	if (video !== null) {
		thumbsupply
			.generateThumbnail(`${config.folderPath}/${video.name}`)
			.then((thumb: any) => {
				return res.sendFile(thumb);
			});
	} else {
		res.status(404).json(null);
	}
};

export const searchVideos = async (req: Request, res: Response) => {
	//console.log(req.params.query)
	const results = await db.getByString(req.params.query);
	if (results === null) {
		return res.json([]);
	}
	const response = results[0];
	if (!response) return res.json([]);
	return res.json(response.videos);
};

export const searchResuts = async (req: Request, res: Response) => {
	//console.log(req.params.query)
	const results = await db.getByString(req.params.query);
	console.log(results)
	if (results === null) {
		return res.json([]);}

	return res.json(results[0].videos);
};

export const recomendVideos = async (req: Request, res: Response) => {
	//get a array of max 10 videos without the video that is being requested

	console.log(req.params.id);
	try{
		const allVideos = await db.getAll();
		const video: any = await db.getById(req.params.id);
		const videos = allVideos.filter((v: any) => v._id !== video._id);
		const randomVideos = videos.sort(() => 0.5 - Math.random()).slice(0, 10);
		return res.json(randomVideos);
	}
	catch(error){
		return res.status(404).json(null);
	}
};

export const randomVideo = async (req: Request, res: Response) => {
	//a random video from the database
	const allEntries = await db.getAll();
	const random = Math.floor(Math.random() * allEntries.length);
	const video = allEntries[random];
	return res.json(video);
};
