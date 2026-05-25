import uploadOncloudinary from "../config/cloudinary.js";
import User from "../models/usermodel.js";

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

export { getCurrentUser,suggestedUsers,editProfile,getProfile,follow,followingList};