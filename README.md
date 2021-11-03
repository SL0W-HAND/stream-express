# Stream express
Here is the backend for the streaming app

This project is inspired in this [article](https://www.linode.com/docs/guides/build-react-video-streaming-app/) for made video streaming with node-js of course for tath is need some requirements before using this app, also this app has 2 big modes with database (MongoDB), and without this, also have 4 branches in which one is a different version for a different purpose, we will talk more in detail later.

**note**:This repo is for the development of the API, you can use this to deploy the server if you want, but if you want only to start the application I recommend using the repository with all compiled [repo with all](https://github.com/SL0W-HAND/node-stream).

## Setup requirements step by step
For some of these requirements, you need to search for your specific case, and I don't go show you how (sorry for that) but is very easily find the corresponding tutorial.

###  Basic

* first, you need to create a .env file with the following requirements:

```env
// JWT
    //here use a string to encrypt the json web token
    JWT_SECRET=secret

// USER
    //this is the unique user to login
    USER_PASSWORD=password

// SERVER CONFIG

    //set the port where the api will run
    PORT=4000

    //set the folder with the videos 
    //put the entire path for example C:\Users\US3R\Videos
    FOLDER_PATH=

//DEVELOPMENT
    DEV_MODE:true    

```
* node js installed (LTS version recommended).

* run ``npm install`` to install all the dependencies.

* FFmpeg installed on your workstation, the process is different for each OS, you need to search the tutorial installation for your computer, good luck.  


### Database
* If you are on the branch **mongodb** is needed to install the MongoDB database on your computer (i don't gonna show you how, you can search how to do it on your computer, on the internet exist a lot of tutorials how) or you can use a remote database by default I put the address of the most common configuration when you install MongoDB locally, you can change that in the next file.

```
controllers/videos.ts
```

```js
try {
	connect('mongodb://localhost:27017/videodb');
	console.log('connected to mongodb');
} catch (error) {
	console.log(error);
	console.log('error connecting to mongodb');
	process.exit(1);
}
```
Is needed to enable the database on another terminal.

## Branches explained
How we talk before this project has a mode with database and without, without the database, the data of each video is saved in memory you can see in more detail in folder database on branch main and production_base, in which we are emulating a database, tath works but when the number of videos is very large 100+ (estimate) that is non longer option in that case I recommend to use the integration with the database, each branch has his specials characteristics and we will explain in the following.


### main
This branch runs without a database only needs the basic env file to work, you only need to run the commands npm run build to compile the project and npm run start to initialize the server.

### production_base 
Runs without a database the difference is that is already integrated for serving the frontend page with react, so have the compiled build folder of the frontend [repository](https://github.com/SL0W-HAND/react-video-streaming) in the route '/', you only need to run the commands npm run build to compile the project and npm run start to initialize the server.

### mongodb
For this branch is needed to use a database MongoDB you need to be activated, and run the scripts to seed the videos in the database if is needed, after tath you only need to run the same commands npm run build to compile the project and npm run start to initialize the server.

### production_mongodb
In the same way, is needed to activate the MongoDB database, and seed the videos if is needed, the difference is tath this serve the frontend page in the build folder of the frontend[repo](https://github.com/SL0W-HAND/react-video-streaming)

## Technical details
The big idea for the streaming is to use the folder path of the videos to collect the data in of each video and when you make the request make a match with the file in the folder and the name of the file and send the video, the data of each video is saved on one variable, or in the database, depends on the branch.

Also, this project uses passport.js to authenticate the user with the password of the .env file, once the user is authenticated the app sign a jwt (JSON web token) with the secret on the .env file, and is sent to the frontend inside in one cookie, with expiration date of 15 minutes, wich one is sent back to us and verify in each request.

## Scripts 
Here I leave some scripts that can be useful for the use of this repository, you need to run npm run "script"

### secret
You can use this script to generate a random string that you can put in the .env file on the field "SECRET", I recommend using this or you can put some random string.

### build
This script compiles the typescript files to javascript for production.

### start
This command runs the compiled version of this project with node.

### dev
Initialize the development mode with nodemon. 

### test 
This script is only for making a basic test of each route, with and without authentication.

### seedData 
This script is only in the versions with MongoDB, creating the database with all the videos.
