import uploadOncloudinary from '../config/cloudinary.js'
import Story from '../models/storymodel.js'
import User from '../models/usermodel.js'


const uploadStory=async(req,res)=>{
    try{
      const userExists=await User.exists({ _id: req.userId })
      if (!userExists) {
            return res.status(404).json({
                 message: "User not found"
             });
        }
      if(!req.files?.length){
        return res.status(400).json({
            message:"media is required"
        })
      }

      const uploadedStoryIds=[]
      const failedUploads=[]
      for(const file of req.files){
        try{
          const media=await uploadOncloudinary(file.path)
          const mediaType=file.mimetype.startsWith("video/") ? "video" : "image"
          const story=await Story.create({author:req.userId,mediaType,media})
          await User.updateOne(
            { _id: req.userId },
            { $set: { story: story._id }, $addToSet: { stories: story._id } }
          )
          uploadedStoryIds.push(story._id)
        }catch(error){
          console.error("Story Upload Item Error:",error)
          failedUploads.push(file.originalname)
        }
      }

      if(uploadedStoryIds.length===0){
        return res.status(500).json({
          success:false,
          message:"No stories could be uploaded. Please check the media and try again."
        })
      }

      const populatedStories=await Story.find({_id:{$in:uploadedStoryIds}})
      .populate("author","name userName profileImage")
      .populate("viewers","name userName profileImage")
      .sort({createdAt:1})

      return res.status(200).json({
        success:true,
        stories:populatedStories,
        story:populatedStories[populatedStories.length-1],
        ...(failedUploads.length>0 && {
          warning:`${failedUploads.length} file(s) could not be uploaded: ${failedUploads.join(", ")}`
        })
      })
   }catch(error){
         console.error("Story Upload Error:", error);
         res.status(500).json({
            success:false,
            message:'internal server error'
            });
   }
}

const viewStory=async(req,res)=>{
     try{
        const storyId=req.params.storyId
        const story =await Story.findById(storyId)
        if(!story){
            return res.status(404).json({
                message:"Story not found"
            })
        }
        if (story.author.toString() !== req.userId.toString() &&
            !story.viewers.some(viewerId => viewerId.toString() === req.userId.toString())) {
            story.viewers.addToSet(req.userId);
            await story.save();
        }

        const populatedStory = await Story.findById(storyId)
            .populate("author", "name userName profileImage")
            .populate("viewers", "name userName profileImage");

        return res.status(200).json({
            success: true,
            story: populatedStory
        });
     }catch(error){
           console.error("View Story Error:", error);
            return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
     }
}

const getStoryByUserName=async (req,res)=>{
    try{
     const userName=req.params.userName;
     const user=await User.findOne({userName})
     if(!user){
      return res.status(404).json({
        message:"User not found"
      })
    }
     const story=await Story.find({author:user._id })
     .populate("viewers author")
     .sort({ createdAt: 1 })
     return res.status(200).json({
      success: true,
      story
    })
    }catch(error){
       console.error("Error fetching stories:", error);
       return res.status(500).json({
       success: false,
       message: "Server error occurred while fetching stories"
  });
    }
}



const getAllStories=async(req,res)=>{
  try{
   const currentUser=await User.findById(req.userId)
   if(!currentUser){
      return res.status(404).json({ success:false, message:"User not found" })
   }
   const followingIds=[...currentUser.following, currentUser._id]

   const stories=await Story.find({
      author:{$in:followingIds}
   })
   .populate("viewers")
   .populate("author", "userName profileImage")
   .sort({ createdAt: -1 })
   return res.status(200).json({
      success: true,
      stories
    })
  }catch(error){
    console.error("Error in getAllStories:", error);
    return res.status(500).json({
       success: false,
        message: "get all story error" 
      });
  }
}

export {uploadStory,viewStory,getStoryByUserName,getAllStories}