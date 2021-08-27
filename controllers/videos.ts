import {Request, Response} from 'express'
//import { DefaultDeserializer } from 'v8';
import DB from '../database/db'
import config from '../config/index'
import fs from 'fs'

const thumbsupply = require('thumbsupply');


const db = new DB()

export const allVideos = async (req: Request, res: Response) => {
  const allEntries = await db.getAll()
  return res.json(allEntries);
};

export const videoData = async(req: Request, res: Response) => {
  const data = await db.getById(req.params.id)
  //console.log(data)
  return res.status(200).json(data);
};

export const video = async (req: Request, res: Response) => {
  try {
    const videoData =  await db.getById(req.params.id)
    const pathVideo = `${config.folderPath}/${videoData?.name}`;

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
  } catch (error) {
    res.status(404).json(null)
  } 
};

export const videoPoster = async (req: Request, res: Response) => {
  const video:any = await db.getById(req.params.id)
  if (video !== null) {
    thumbsupply.generateThumbnail(`${config.folderPath}/${video.name}`)
    .then((thumb:any) => {return res.sendFile(thumb)});
  } else {
    res.status(404).json(null)
  }
};
