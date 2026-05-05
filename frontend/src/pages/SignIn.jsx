import React, { useState} from "react";
import logo from '../assets/image2.png'
import logo1  from '../assets/image1.png'
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios'
import { backendUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignIn = () => {

 const [inputClicked,setInputClicked]=useState({
  userName:false,
  password:false
 })
 const [showPassword,setShowPassword]=useState(false);
 const[loading,setLoading]=useState(false);

 const [userName,setUserName]=useState("");
 const [password,setPassword]=useState("");
 const [err,setErr]=useState("");
 const navigate=useNavigate();
 const dispatch=useDispatch()


 const handleSignIn=async()=>{
     setLoading(true)
     setErr(false);
   try{
     const result=await axios.post(backendUrl+'/api/auth/signin',{
     userName,password
     },{withCredentials:true});
     dispatch(setUserData(result.data.user));
     setLoading(false);
   }catch(error){
     setErr(error.response?.data?.message)
      console.log(error);
      setLoading(false);
   }
 }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900  flex flex-col justify-center items-center">
      <div className="w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]">

        <div className="w-full lg:w-[50%] h-full bg-white flex flex-col items-center justify-center p-[10] gap-[20px]">
            <div className="flex gap-[10px] items-center text-[20px] font-semibold mt-[40px]" >
               <span>Sign In to</span>
               <img src={logo} alt="" className="w-[90px]" />
            </div>
          
            <div onClick={()=>setInputClicked({...inputClicked,userName:true})} className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl  border-2 border-black ">
                 <label htmlFor="userName" className={`text-gray-700 absolute  left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.userName?"top-[-15px]":""}`}> Enter Your userName</label>
                 <input onChange={(e)=>setUserName(e.target.value)} value={userName}  type="text" id='userName' className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 autofill:shadow-[inset_0_0_0_1000px_white]" required/>
            </div>
           
            <div onClick={()=>setInputClicked({...inputClicked,password:true})} className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl  border-2 border-black ">
                 <label htmlFor="passowrd" className={`text-gray-700 absolute  left-[20px] p-[5px] bg-white text-[15px]  ${inputClicked.password?"top-[-15px]":""}`}> Enter Your password</label>
                 <input onChange={(e)=>setPassword(e.target.value)} value={password} type={showPassword?"text":"password"} id='password' className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 autofill:shadow-[inset_0_0_0_1000px_white]" required/>
                 {!showPassword?<IoEyeSharp onClick={()=>setShowPassword(true)} className="absolute cursor-pointer right-[20px] w-[25px] h-[25px]" />
                 :<FaEyeSlash onClick={()=>setShowPassword(false)} className="absolute cursor-pointer right-[20px] w-[25px] h-[25px]" />
                 }
            </div>

            <div onClick={()=>navigate('/forgot-password')} className="w-[90%] px-[20px] cursor-pointer">Forgot Password</div>

             {err && <p className="text-red-500">{err}</p>}

            <button onClick={handleSignIn} disabled={loading} className="w-[70%] px-[20px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]">
                 {loading?<ClipLoader size={30} color='green'/>:"Sign In"}    
            </button>
            <p onClick={()=>navigate('/signup')} className="cursor-pointer text-gray-800">Want To Create A New account ? <span className="border-b-2 border-b-black">Sign Up</span></p>
        </div>

        <div className="md:w-[50%] h-full hidden lg:flex justify-center items-center bg-[#000000] flex-col gap-[10px] text-white text-[16px] fonr-semibold rounded-1-[30px] shadow-2xl shadow-black">
            <img src={logo1} alt="" className="w-[40%]" />  
            <p >Not Just A Plateform ,It's A Instagram</p>
        </div>

      </div>
    </div>
  );
};

export default SignIn;
