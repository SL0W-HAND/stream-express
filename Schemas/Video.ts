import { Schema, model } from "mongoose";

const VideoSchema = new Schema({
    //id: {type: Number, required: true},
    name: {type: String, required: true},
    duration:{type: Number, required: true}
});

export default model("Video", VideoSchema);