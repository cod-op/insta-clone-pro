import uploadOncloudinary from "../config/cloudinary.js";
import Notification from "../models/notificationmodel.js";
import Post from '../models/postmodel.js'
import User from "../models/usermodel.js";
import { getSocketId, io } from "../socket.js";

const uploadPost=async (req,res)=>{
     try{
       const {caption,mediaType}=req.body;
       let media;
      if(req.file){
        media=await uploadOncloudinary(req.file.path)
      }else{
         return res.status(400).json({
            message:"media is required"
        })
      }
      const post =await Post.create({
        caption,media,mediaType,author:req.userId
      })
      const user=await  User.findById(req.userId)
      user.posts.push(post._id)
      await user.save()

      const populatedPost=await Post.findById(post._id).populate("author","name userName profileImage")

      res.status(201).json({
      success: true,
      message: "Post uploaded successfully",
      populatedPost
    });
     }catch(error){
          console.error("Upload Error:", error);
          res.status(500).json({ 
          success: false, 
          message: "upload post error" 
    });
     }
}

const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("author", "name userName profileImage")
      .populate({
        path: "comments.author",
        select: "name userName profileImage"
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      posts
    });

  } catch (error) {
    console.error("Get All Posts Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching posts"
    })
  }
}


const like= async (req, res) => {
  try {
    const postId = req.params.postId; 

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: "Post not found" 
      });
    }

    // Check if user already liked the post
    const isLiked = post.likes.some(id=>id.toString()===req.userId.toString());

    if (isLiked) {

      post.likes = post.likes.filter(id=>id.toString()!=req.userId.toString());

    } else {
      // Agar liked nahi hai 
        post.likes.push(req.userId);

        let populateNotification;

        if(post.author._id!=req.userId){
        const notificaton=await Notification.create({
           sender: req.userId,
           receiver: post.author._id,
            type:"like",
            post: post._id,
            message:"liked your post"
        })
          populateNotification=await Notification.findById(notificaton._id)
        .populate("sender receiver post")
        }
        const receiverSocketId=getSocketId(post.author._id)
        if(receiverSocketId){
          io.to(receiverSocketId).emit("newNotification",populateNotification)
        }
    }

    await post.save()
    await post.populate([
      { path: "author", select: "userName profileImage" },
      { path: "comments.author", select: "userName profileImage" }
    ]);
    io.emit("likedPost",{
      postId:post._id,
      likes:post.likes
    })

    res.status(200).json({
        success:true,
        message:"post liked succesfully",
        post
    })
  } catch (error) {
    console.error("Like Post Error:", error);
    return res.status(500).json({ 
      message:`likeposterror ${error}`
    })
  }
}



const comment = async (req, res) => {
  try {
    const postId = req.params.postId;   
    const { message } = req.body;   

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: "Post not found" 
      });
    }

    const newComment = {
      author: req.userId,
      message,
      createdAt: new Date()
    };

    post.comments.push(newComment);
    if(post.author._id!=req.userId){
        const notificaton=await Notification.create({
           sender: req.userId,
           receiver: post.author._id,
            type:"comment",
            post: post._id,
            message:"commented on your post"
        })
        const populateNotification=await Notification.findById(notificaton._id)
        .populate("sender receiver post")
        }
        const receiverSocketId=getSocketId(post.author._id)
        if(receiverSocketId){
          io.to(receiverSocketId).emit("newNotification",populateNotification)
        }

    await post.save();

    await post.populate([
      { path: "author", select: "userName profileImage" },
      { path: "comments.author", select: "userName profileImage" }
    ]);

    io.emit("commentedPost",{
      postId:post._id,
      comments:post.comments
    })

    return res.status(201).json({
      success: true,  
      message: "Comment added successfully",
      post
    });

  } catch (error) {
    console.error("Comment Error:", error);
    return res.status(500).json({ 
      message:`commentposterror ${error}`
    })
  }
}


const saved = async (req, res) => {
   try {
    const postId = req.params.postId; 
    const post = await Post.findById(postId);
    const user=await User.findById(req.userId)

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: "Post not found" 
      });
    }

    // Check if user already saved the post
    const isSaved = user.saved.some(id=>id.toString()===postId.toString());

    if (isSaved) {

      user.saved=user.saved.filter(id=>id.toString()!=postId.toString());

    } else {
      // Agar saved nahi hai 
      await user.saved.push(postId);
    }
    await user.save()
    await user.populate({
      path: "saved",
      select: "caption media mediaType author" 
    });

    res.status(200).json({
        user
    })
  } catch (error) {
    console.error("Post save Error:", error);
    return res.status(500).json({ 
      message:`saveposterror ${error}`
    })
  }
};

export {uploadPost,getAllPost,like,comment,saved}