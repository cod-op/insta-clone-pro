import uploadOncloudinary from "../config/cloudinary.js";
import User from "../models/usermodel.js";
import Notification from "../models/notificationmodel.js";
import {io, getSocketId } from "../socket.js";
import nodemon from "nodemon";


const getCurrentUser=async(req,res)=>{
    try{
        const userId=req.userId;
        const user=await User.findById(userId).populate("posts reels story posts.author posts.comments following");
        if(!user){
            return res.status(400).json({
                message:"User not found !"
            })
        }
        return res.status(200).json({
            message:"Current user fetched successfully",
            user
        })
    }
    catch(error){
        return res.status(500).json({
            message:`Error fetching current user: ${error}`
        }) 
    }
}

const suggestedUsers=async(req,res)=>{
    try{
      const users=await User.find({_id:{$ne:req.userId}}).select("-password")
      return res.status(200).json({
        users
      })
    }catch(error){
       return res.status(500).json({
        message:`get suggested user  error ${error}`
       })
    }
}

const editProfile=async(req,res)=>{

    try{
     const {name,userName,bio,profession,gender}=req.body;
     const user=await User.findById(req.userId).select("-password");
     if(!user){
       return res.status(400).json({
        message:"User not found"
       })
     }
     const sameUserWithUserName=await User.findOne({userName}).select("-password")
     if(sameUserWithUserName && sameUserWithUserName._id!=req.userId){
         return res.status(400).json({
            message:"userName already exists"
         })
     }
    if (req.file) {
    const uploadedUrl = await uploadOncloudinary(req.file.path);
    if (uploadedUrl) {
        user.profileImage = uploadedUrl; 
    }
   }

     user.name=name
     user.userName=userName
     user.bio=bio
     user.profession=profession
     user.gender=gender

     await user.save()

     return res.status(200).json({
        success: true,
        user
     })

    }catch(error){
        return res.status(500).json({
        message:`Edit profile  error ${error}`
       })
    }
}

const getProfile=async (req,res)=>{
    try{
        const userName = req.params.userName;
        const user = await User.findOne({ userName }).select("-password")
         .populate("posts reels followers following")
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            user
        });

    }catch(error){
          return res.status(500).json({
          message:`get profile  error ${error}`
        })
    }
}


const follow=async(req,res)=>{
    try{
      const currentUserId=req.userId
      const targetUserId=req.params.targetUserId;

      if(currentUserId===targetUserId){
        return res.status(400).json({
             message: "You cannot follow yourself."
          });
      }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    const isFollowing=currentUser.following.includes(targetUserId)
    if(isFollowing){
        currentUser.following=currentUser.following.filter(id=>id.toString()!=targetUserId)
        targetUser.followers=targetUser.followers.filter(id=>id.toString()!=currentUserId)
        await currentUser.save();
        await targetUser.save();
        res.status(200).json({
             message: "User unfollowed successfully."
             });
    }else{
        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);
        let populateNotification;
        if(currentUser._id!=targetUser._id){
                const notificaton=await Notification.create({
                   sender: currentUser._id,
                   receiver: targetUser._id,
                    type:"follow",
                    message:"started following you"
                })
                 populateNotification=await Notification.findById(notificaton._id)
                .populate("sender receiver")
                }
                const receiverSocketId=getSocketId(targetUser._id)
                if(receiverSocketId){
                  io.to(receiverSocketId).emit("newNotification",populateNotification)
                }
        await currentUser.save();
        await targetUser.save();
        return res.status(200).json({
             message: "User followed successfully." 
            });
    }

    }catch(error){
        console.error(error);
        res.status(500).json({
             message: "follow error" 
            });
    }
}

const followingList=async(req,res)=>{
    try{
        const result=await User.findById(req.userId)
        
        return res.status(200).json(result?.following)
    }catch(error){

    }
}

const search=async(req,res)=>{
    try{
      const keyWord =req.query.keyword;
      if(!keyWord){
        res.status(400).json({
            message:"keyword is required"
        })
      }

      const users=await User.find({
        $or:[
            {userName:{$regex:keyWord,$options:"i"}},
            {name:{$regex:keyWord,$options:"i"}}
        ]
      }).select("-password")
      return res.status(200).json(users)
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message:`search error ${error}`
        })
    }
}

const getAllNotifications=async(req,res)=>{
    try{
      const notifications = await Notification.find({ receiver: req.userId,})
      .populate("sender", "userName name profileImage")
      .populate("receiver", "userName name profileImage")
      .populate("post") 
      .populate("reel")
      .sort({ createdAt: -1 });

       return res.status(200).json(notifications);
    }catch(error){
        console.log(error)
        return res.status(500).json({
       success: false,
       message: `Get notifications error: ${error.message}`
    })
}
}

const markAsRead=async(req,res)=>{
    try{
   const {notificationId } = req.body
  
   if (!notificationId) {
      return res.status(400).json({
        message: "notificationId required"
      });
    }
    
    if(Array.isArray(notificationId)){
        await Notification.updateMany(
            {_id:{$in:notificationId},receiver:req.userId},
            {$set: {isRead:true}}
        )
    }else{
        await Notification.findOneAndUpdate(
            {_id:notificationId,receiver:req.userId},
            {$set: {isRead:true}}
        )
    }

     return res.status(200).json({
      message: "Marked as read"
    })
    
}catch(error){
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Mark as read error: ${error.message}`,
    })
}
}

export { getCurrentUser,suggestedUsers,editProfile,getProfile,follow,followingList,search,getAllNotifications,markAsRead};