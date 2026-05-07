import Reel from '../models/reelmodel'
import User from '../models/usermodel';
import uploadOncloudinary from "../config/cloudinary";

const uploadReel=async (req,res)=>{
     try{
       const {caption}=req.body;
       let media;
      if(req.file){
        media=await uploadOncloudinary(req.file.path)
      }else{
         return res.status(400).json({
            message:"media is required"
        })
      }
      const reel =await Reel.create({
        caption,media,author:req.userId
      })
      const user=await  User.findById(req.userId)
      user.reels.push(reel._id)
      await user.save()

      const populatedReel=await Reel.findById(reel._id).populate("author","name userName profileImage")

      res.status(201).json({
      success: true,
      message: "Reel uploaded successfully",
      populatedReel
    });
     }catch(error){
          console.error("Upload Error:", error);
          res.status(500).json({ 
          success: false, 
          message: "upload Reel error" 
    })
  }
}

const getAllReels = async (req, res) => {
  try {
    const reels = await Reel.find({})
      .populate("author", "name userName profileImage") 
      .populate({
        path: "comments.author",
        select: "name userName profileImage"
      })
      .sort({ createdAt: -1 });


    return res.status(200).json({
      reels
    });

  } catch (error) {
    console.error("Get All reels Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching reels"
    })
  }
}


const like= async (req, res) => {
  try {
    const reelId = req.params.reelId; 

    const reel = await Reel.findById(reelId);

    if (!reel) {
      return res.status(404).json({ 
        success: false, 
        message: "Reel not found" 
      });
    }

    // Check if user already liked the post
    const isLiked = reel.likes.some(id=>id.toString()===req.userId.toString());

    if (isLiked) {

      reel.likes = reel.likes.filter(id=>id.toString()!=req.userId.toString());

    } else {
      // Agar liked nahi hai 
      await reel.likes.push(req.userId);
    }
    await reel.save()
    await reel.populate("author","name userName profileImage")

    res.status(200).json({
        success:true,
        message:"post liked succesfully",
        post
    })
  } catch (error) {
    console.error("Like Reel Error:", error);
    return res.status(500).json({ 
      message:`likereelerror ${error}`
    })
  }
}


const comment = async (req, res) => {
  try {
    const reelId = req.params.reelId; 
    const { message } = req.body;   

    const reel = await Reel.findById(reelId);
    if (!reel) {
      return res.status(404).json({ 
        success: false, 
        message: "Reel not found" 
      });
    }

    const newComment = {
      author: req.userId,
      message,
      createdAt: new Date()
    };

    reel.comments.push(newComment);
    await reel.save();

    await reel.populate({
        path: "comments.author",
        select: "name userName profileImage"
    });

    return res.status(201).json({
      success: true,  
      message: "Comment added successfully",
      reel
    });

  } catch (error) {
    console.error("Comment Error:", error);
    return res.status(500).json({ 
      message:`commentposterror ${error}`
    })
  }
}

export {getAllReels,uploadReel,like,comment}