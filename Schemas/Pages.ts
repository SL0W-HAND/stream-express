import { Schema, model } from 'mongoose';

const PageSchema = new Schema({
	page: {
		type: Number,
		required: true,
	},
	total_pages: {
		type: Number,
		required: true,
	},
	videos: {
		type: Array,
		required: true,
	},
});

export default model('Page', PageSchema);
