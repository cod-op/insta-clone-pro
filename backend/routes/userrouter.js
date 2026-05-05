import express from "express"
import isAuth from "../middlewares/isAuth.js";
import{ editProfile, getCurrentUser,getProfile,suggestedUsers} from "../controllers/usercontroller.js";
import { upload } from "../middlewares/multer.js";
 


const userRouter=express.Router()

userRouter.get("/current",isAuth,getCurrentUser);
userRouter.get("/suggested",isAuth,suggestedUsers);
userRouter.get("/getprofile/:userName",isAuth,getProfile);
userRouter.post("/editprofile",isAuth,upload.single("profileImage"),editProfile);
      
export default userRouter;