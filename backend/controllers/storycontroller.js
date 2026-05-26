import uploadOncloudinary from '../config/cloudinary.js'
import Story from '../models/storymodel.js'
import User from '../models/usermodel.js'


const uploadStory=async(req,res)=>{
    try{
      const user=await User.findById(req.userId)
      if (!user) {
            return res.status(404).json({
                 message: "User not found"
             });
        }
      if(user.story){
        await Story.findByIdAndDelete(user.story)
        user.story=null
      }
      const {mediaType}=req.body;
      let media;
      if(req.file){
         media= await uploadOncloudinary(req.file.path)
      }else{
        return res.status(400).json({
            message:"media is required"
        })
      }

      const story=await Story.create({
        author:req.userId,mediaType,media
      })

      user.story=story._id
      await user.save()
      const populatedStory=await Story.findById(story._id)
      .populate("author","name userName profileImage")
      .populate("viewers","name userName profileImage")

      return res.status(200).json({
        story:populatedStory
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
        if (story.author.toString() !== req.userId && !story.viewers.includes(req.userId)) {
            story.viewers.push(req.userId);
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
   const followingIds= await currentUser.following

   //find all author that are in following list
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