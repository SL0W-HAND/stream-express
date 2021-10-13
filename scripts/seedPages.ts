import { connect } from 'mongoose';
import config from '../config/index';

//Schemas
import Video from '../Schemas/Video';
import Page from '../Schemas/Pages';

async function chunkArray(myArray: any, chunk_size: number) {
	var index = 0;
	var arrayLength = myArray.length;
	var tempArray = [];
	let pageNumber = 1;
	for (index = 0; index < arrayLength; index += chunk_size) {
		let myChunk = myArray.slice(index, index + chunk_size);
		let page = {
			page: pageNumber,
			total_pages: Math.ceil(arrayLength / chunk_size),
			videos: myChunk,
		};
		let newPage = new Page(page);
		await newPage.save();
		pageNumber++;
		tempArray.push(page);
	}
	console.log('done');
	process.exit(1);
}

run().catch((err) => console.log(err));

async function run(): Promise<void> {
	// Connect to MongoDB
	await connect('mongodb://localhost:27017/videodb');

	console.log('seeding data');

	const allVideos = await Video.find({});

	chunkArray(allVideos, 10);
}
