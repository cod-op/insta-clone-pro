import User from "../models/usermodel.js";
import bcrypt from "bcryptjs"
import genToken from "../config/token.js";
import jwt from "jsonwebtoken";
import sendEmail from "../config/mail.js";

const signUp=async(req,res)=>{
    try{

     const {name,email,password,userName}=req.body;

     if(!name || !email || !password || !userName){
        return res.status(400).json({
            message:"All fields are required !"
        }) 
     }

    const findByEmail=await User.findOne({email})

    if(findByEmail){
     return res.status(400).json({
            message:"Email already exists !"
        }) 
    } 

    const findByUserName=await User.findOne({userName})

    if(findByUserName){
       return res.status(400).json({
            message:"Username already exists !"
        })       
    }

    if(password.length<6){
       return res.status(400).json({
            message:"Password must be at least 6 characters !"
        })       
    }

    const hashedPassword=await bcrypt.hash(password,10)

    const user=await User.create({
        name,
        userName,
        email,
        password:hashedPassword,
   })

   const token=await genToken(user._id);

   res.cookie("token",token,{
    httpOnly:true,
    secure:true,
    sameSite:"none",
    maxAge:10*365*24*60*60*1000
   } )

   return res.status(201).json({
    message:"User created successfully",
    user
   })
 }catch(error){
       return res.status(500).json({
        message:`signup error: ${error}`
       })
    }
}

const signIn=async(req,res)=>{
    try{
     const {password,userName}=req.body;
      
    const user=await User.findOne({userName})
    if(!user){
       return res.status(400).json({
            message:"user not found !"
        })       
    }

   const isMatch=await bcrypt.compare(password,user.password)

    if(!isMatch){   
         return res.status(400).json({  
            message:"Incorrect password !"
        })       
    }

   const token=await genToken(user._id);

   res.cookie("token",token,{
    httpOnly:true,
    secure:true,
    sameSite:"none",
    maxAge:10*365*24*60*60*1000
   } )

   return res.status(200).json({
    message:"User signed in successfully",
    user
   })

    }catch(error){
       return res.status(500).json({
        message:`signin error: ${error}`
       })
    }
}

const signOut=async(req,res)=>{
    try{
     res.clearCookie("token",{
     httpOnly:true,
      secure:true,
      sameSite:"none",
     maxAge:10*360*24*60*60*1000
    }) 
    return res.status(200).json({
        message:"User signed out successfully"
       })
          
    }   catch(error){           
         return res.status(500).json({      
            message:`signout error: ${error}`
        })       
    }   
}  

const sendOtp=async(req,res)=>{
    try{
     const {email}=req.body;
     const user=await User.findOne({email});
     if(!user){
        return res.status(404).json({
              message: "User not found" 
            });
     }
     const otp = Math.floor(100000 + Math.random() * 900000).toString();

     user.resetOtp=otp,
     user.otpExpires=Date.now()+5*60*1000
     user.isOtpVerified=false

     await user.save();

     //Send the Email
     await sendEmail(email, otp);

     res.status(200).json({ 
            success: true, 
            message: "OTP sent successfully to " + email 
        });

    }catch(error){
          console.error("Error in sendOtp:", error);
             res.status(500).json({ 
             success: false, 
             message: "Internal Server Error" 
        });
    }
}

const verifyOtp=async(req,res)=>{
    try{
      const { email, otp } = req.body;
      const user = await User.findOne({ email });
      if(!user || user.resetOtp!=otp ||user.otpExpires<Date.now()){
        return res.status(400).json({
             success: false,
             message: "Invalid OTP | Expired Otp"
         });
      }

      user.isOtpVerified=true
      user.resetOtp=undefined
      user.otpExpires=undefined
      await user.save();

      res.status(200).json({ 
            success: true, 
            message: "OTP verified successfully. You can now reset your password." 
        });
    }catch(error){
       return res.status(500).json({
             message:`Verify Otp Error ${error}` 
            });
      }
}

const resetPassword=async(req,res)=>{
try{
    const {email,password}=req.body;
    const user = await User.findOne({ email });
    if(!user || !user.isOtpVerified ){
        return res.status(400).json({
          message:"Otp Verification required"  
        })
    }

    const hashedPassword=await bcrypt.hash(password,10);
    user.password=hashedPassword;
    user.isOtpVerified=false;

    await user.save();

    return res.status(200).json({
        message:"Password Reset Successfully"
    })
 }catch(error){
     return res.status(500).json({
         message:`Reset Password Error ${error}` 
     });
}
}


export {signUp,signIn,signOut,sendOtp,verifyOtp,resetPassword}
