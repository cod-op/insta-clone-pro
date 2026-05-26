import express from "express"
import isAuth from "../middlewares/isAuth.js";
import{ editProfile, follow, followingList, getAllNotifications, getCurrentUser,getProfile,markAsRead,search,suggestedUsers} from "../controllers/usercontroller.js";
import { upload } from "../middlewares/multer.js";
 


const userRouter=express.Router()

userRouter.get("/current",isAuth,getCurrentUser);
userRouter.get("/suggested",isAuth,suggestedUsers);
userRouter.get("/getprofile/:userName",isAuth,getProfile);
userRouter.get("/followinglist",isAuth,followingList);
userRouter.get("/follow/:targetUserId",isAuth,follow);
userRouter.get("/search",isAuth,search);
userRouter.get("/getallnotifications",isAuth,getAllNotifications);
userRouter.get("/markasread/:notificationId",isAuth,markAsRead);
userRouter.post("/editprofile",isAuth,upload.single("profileImage"),editProfile);
      
export default userRouter;