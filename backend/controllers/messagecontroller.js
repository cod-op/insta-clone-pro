import uploadOncloudinary from "../config/cloudinary.js";
import Conversation from '../models/conversationmodel.js'
import Message from '../models/messagemodel.js'
import { getSocketId, io } from "../socket.js";

const sendMessage=async(req,res)=>{
    try{
      const senderId=req.userId;
      const receiverId=req.params.receiverId;
      const {message}=req.body;
      let image;
      if(req.file){
        image=await uploadOncloudinary(req.file.path)
      }
      const newMessage=await Message.create({
        sender:senderId,
        receiver:receiverId,
        message,
        image
      })
    let conversation=await Conversation.findOne({
        participants:{$all:[senderId,receiverId]}
    })
    if(!conversation){
            conversation = await Conversation.create({
            participants:[senderId,receiverId],
            messages:[newMessage._id]
        })
    }else{
        conversation.messages.push(newMessage._id)
        await conversation.save();
    }

   const receiverSocketId=getSocketId(receiverId)
   if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage)
    }

   const senderSocketId = getSocketId(senderId)
    if (senderSocketId) {
        io.to(senderSocketId).emit("newMessage", newMessage)
    }

    return res.status(200).json(newMessage)
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:`send Message error ${error}`
        })
    }
}


const getAllMessages=async(req,res)=>{
    try{
        const senderId=req.userId;
        const receiverId=req.params.receiverId;

       const conversation=await Conversation.findOne({
         participants:{$all:[senderId,receiverId]}
      }).populate("messages")
    
       return res.status(200).json(conversation ? conversation.messages : []);
    }catch(error){
     console.log(error);
      return res.status(500).json({
      message:`get Message error ${error}`
      })
   }
}


const getPreviousUserChats=async(req,res)=>{
    try{
        const currentUserId=req.userId;
        const conversations=await Conversation.find({
            participants:currentUserId
        }).populate("participants").sort({updatedAt:-1})

        const userMap={}
        conversations.forEach(conv => {
            conv.participants.forEach(user=>{
                if(user._id.toString()!=currentUserId.toString()){
                 userMap[user._id.toString()]=user
                }
            })
        });

        const previousUsers=Object.values(userMap)
        return res.status(200).json(previousUsers)
    }catch(error){
      console.log(error);
      return res.status(500).json({
      message:`previous User error ${error}`
      })  
    }
}

export {sendMessage,getAllMessages,getPreviousUserChats}