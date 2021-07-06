require('dotenv').config();

export default {
  port: process.env.PORT || 8000,
  jwtSecret: process.env.JWT_SECRET,
  folderPath: process.env.FOLDER_PATH||'c:',
  user:{
      name:process.env.USER_NAME,
      password:process.env.USER_PASSWORD
  }
};

