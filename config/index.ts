require('dotenv').config();

export default {
	port: process.env.PORT || 8000,
	jwtSecret: process.env.JWT_SECRET,
	folderPath: process.env.FOLDER_PATH || 'c:',
	user: {
		password: process.env.USER_PASSWORD,
	},
	dev: process.env.DEV_MODE || true,
};
