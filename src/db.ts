import mongoose from "mongoose";
const Schema = mongoose.Schema;
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.mongoString || "");

const UserSchema=new Schema({
    username: {type:String , required:true, unique:true},
    password: {type:String, required:true}

});

const contentTypes = ['image' , 'video' , 'article' , 'audio' , "youtube" , "twitter"];

const ContentSchema =new Schema({
    link: {type:String, required:true},
    type: {type:String, enum:contentTypes , required:true},
    title: {type:String, required:true},
    tags: [{type:mongoose.Types.ObjectId, ref:'tags'}],
    userId: {type:mongoose.Types.ObjectId, ref:'users', required:true},
    date: {type:String },
    time: {type:String}
});

const TagSchema=new Schema({
    title: {type:String, required:true, unique:true}

});

const LinkSchema= new Schema({
    hash: {type:String, required:true},
    userId: {type:Schema.Types.ObjectId, ref:'users', required:true , unique:true}
});


export const User= mongoose.model('users', UserSchema);
export const Content = mongoose.model('contents', ContentSchema);
export const Tag = mongoose.model('tags',TagSchema);
export const Link = mongoose.model('links', LinkSchema);

