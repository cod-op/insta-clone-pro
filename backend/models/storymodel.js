import mongoose from "mongoose";

const reelSchema=new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    mediaType:{
        type:String,
        enum:["image","video"],
        required:true
    },
      media:{ 
        type:String,
        required:true
    },
    viewers:[
        {type:mongoose.Schema.Types.ObjectId,
         ref:"User",
         required:true
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now,
        expires:24*60*60
    }
})

const Story=mongoose.model("Story",reelSchema)        
export default Story;