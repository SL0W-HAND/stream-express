import { Request, Response } from 'express';
//import { DefaultDeserializer } from 'v8';
import config from '../config/index';
import fs from 'fs';

import { connect } from 'mongoose';
import Video from '../Schemas/Video';
import Page from '../Schemas/Pages';

try {
	connect('mongodb://localhost:27017/videodb');
	console.log('connected to mongodb');
} catch (error) {
	console.log(error);
}

const thumbsupply = require('thumbsupply');

//rady to use
export const pageVideos = async (req: Request, res: Response) => {
	//fix for mongo db
	if (!parseInt(req.params.page)) {
		return res.json('bad request');
	}
	const page = await Page.findOne({ page: parseInt(req.params.page) });

	if (page == null) {
		return res.json('bad request');
	}

	return res.json(page);
};
//rady to use
export const videoData = async (req: Request, res: Response) => {
	//basic consulting
	//const data = await db.getById(req.params.id);
	if (!parseInt(req.params.id)) {
		return res.json('bad request');
	}

	try {
		const data = await Video.findOne({ _id: req.params.id });

		if (data == null) {
			return res.json(null);
		}
		return res.status(200).json(data);
	} catch (err) {
		console.log(err);
		return res.json(null);
	}
};

export const video = async (req: Request, res: Response) => {
	try {
		//basic consulting
		const videoData = await Video.findOne({ _id: req.params.id });
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
	//basic consulatation
	try {
		const video: any = await await Video.findOne({ _id: req.params.id });

		thumbsupply
			.generateThumbnail(`${config.folderPath}/${video.name}`)
			.then((thumb: any) => {
				return res.sendFile(thumb);
			});
	} catch {
		res.status(404).json(null);
	}
};

export const searchVideos = async (req: Request, res: Response) => {
	const results = await Video.find({
		name: { $regex: req.params.query, $options: 'i' },
	})
		.sort({ _id: -1 })
		.limit(10);

	return res.json(results);
};

export const searchResuts = async (req: Request, res: Response) => {
	const results = await Video.find({
		name: { $regex: req.params.query, $options: 'i' },
	})
		.sort({ _id: -1 })
		.limit(100);

	if (results.length == 0) {
		return res.json([]);
	}

	const total_pages = Math.ceil(results.length / 10);

	let pages = [];
	//chunck the results in gorups of 10 and push them into pages
	for (let i = 0; i < total_pages; i++) {
		pages.push({
			page: i + 1,
			total_pages: total_pages,
			videos: results.slice(i * 10, (i + 1) * 10),
		});
	}

	return res.json(pages[0].videos);
};

export const recomendVideos = async (req: Request, res: Response) => {
	//get a array of max 10 videos without the video that is being requested
	try {
		const randomVideos = await Video.find({
			_id: { $ne: req.params.id },
		})
			.sort({ _id: -1 })
			.limit(10);

		return res.json(randomVideos);
	} catch {
		return res.status(404).json(null);
	}
};

export const randomVideo = async (req: Request, res: Response) => {
	//works from test but need to be fixed
	const video = await Video.findOne({}).sort({ _id: -1 });

	return res.json(video);
};
