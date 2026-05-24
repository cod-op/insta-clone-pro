import React from 'react'
import { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import {backendUrl} from '../App'
import axios from 'axios';

const ForgotPassword = () => {

const [step,setStep]=useState(1);
const [inputClicked,setInputClicked]=useState({
  email:false,
  otp:false,
  newPassword:false,
  confirmNewPassword:false,
});
const [email,setEmail]=useState("");
const [otp,setOtp]=useState("");
const [newPassword,setNewPassword]=useState("");
const [confirmNewPassword,setConfirmNewPassword]=useState("");
const [err,setErr]=useState("");
const [loading,setLoading]=useState(false);

const handleStep1=async()=>{
  setLoading(true)
  setErr(false);
  try{
    const result=await axios.post(backendUrl+'/api/auth/sendotp',{email},{withCredentials:true})
    console.log(result.data);
    setLoading(false)
    setStep(2);
  }catch(error){
     setErr(error.response?.data?.message)
     console.log(error)
     setLoading(false)
  }
}

const handleStep2=async()=>{
  setLoading(true)
  setErr(false);
  try{
    const result=await axios.post(backendUrl+'/api/auth/verifyotp',{email,otp},{withCredentials:true})
    console.log(result.data);
    setLoading(false)
    setStep(3)
  }catch(error){
     setErr(error.response?.data?.message)
     console.log(error)
     setLoading(false)
  }
}
const handleStep3=async()=>{
  setLoading(true)
  setErr(false);
  try{
    if(newPassword != confirmNewPassword){
      setLoading(false);
      return setErr("Password does not match. please fill again password !")
    }
    console.log("Sending Reset Request for:", email);
    const result=await axios.post(backendUrl+'/api/auth/resetpassword',{email,password:newPassword},{withCredentials:true})
    console.log(result.data);
    setLoading(false)
  
  }catch(error){
     setErr(error.response?.data?.message)
     console.log(error)
     setLoading(false)
  }
}

  return (
    <div  className='w-full h-screen bg-gradient-to-b from-black to-gray-900  flex flex-col justify-center items-center'>
      {step==1 && <div className='w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl  flex justify-center items-center flex-col border-[#1a1f23]'>
            <h2 className='text-[30px] font-semibold'>Forgot Password</h2>
            <div onClick={()=>setInputClicked({...inputClicked,email:true})} 
                className="relative flex items-center justify-start w-[90%] h-[50px] mt-[30px] rounded-2xl border-2 border-black">
                 <label htmlFor="email" className={`text-gray-700 absolute  left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.email?"top-[-15px]":""}`}> Enter Your email</label>
                 <input onChange={(e)=>setEmail(e.target.value)} value={email}  type="email" id='email' className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0" required/>
             </div>

             {err && <p className="text-red-500">{err}</p>}

              <button onClick={handleStep1}  disabled={loading} className="w-[70%] px-[20px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]">
                 {loading?<ClipLoader size={30} color='green'/>:"Send OTP"}    
             </button>
          </div>}

      {step==2 && <div className='w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl  flex justify-center items-center flex-col border-[#1a1f23]'>
            <h2 className='text-[30px] font-semibold'>Forgot Password</h2>
            <div onClick={()=>setInputClicked({...inputClicked,otp:true})} className="relative flex items-center justify-start w-[90%] h-[50px] mt-[30px] rounded-2xl border-2 border-black">
                 <label htmlFor="otp" className={`text-gray-700 absolute  left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.otp?"top-[-15px]":""}`}> Enter Your Otp</label>
                 <input onChange={(e)=>setOtp(e.target.value)} value={otp}  type="text" id='otp' className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0" required/>
             </div>

            {err && <p className="text-red-500">{err}</p>}

              <button onClick={handleStep2}  disabled={loading} className="w-[70%] px-[20px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]">
                 {loading?<ClipLoader size={30} color='green'/>:"SUBMIT OTP"}    
             </button>
        </div>}

      {step==3 && <div className='w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl  flex justify-center items-center flex-col border-[#1a1f23]'>
            <h2 className='text-[30px] font-semibold'>Reset Password</h2>
            <div onClick={()=>setInputClicked({...inputClicked,newPassword:true})} className="relative flex items-center justify-start w-[90%] h-[50px] mt-[30px] rounded-2xl border-2 border-black">
                 <label htmlFor="newPassword" className={`text-gray-700 absolute  left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.newPassword?"top-[-15px]":""}`}> Enter NewPassword</label>
                 <input onChange={(e)=>setNewPassword(e.target.value)} value={newPassword}  type="text" id='newPassword' className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0" required/>
             </div>

              <div onClick={()=>setInputClicked({...inputClicked,confirmNewPassword:true})} className="relative flex items-center justify-start w-[90%] h-[50px] mt-[30px] rounded-2xl border-2 border-black">
                 <label htmlFor="confirmNewPassword" className={`text-gray-700 absolute  left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.confirmNewPassword?"top-[-15px]":""}`}> Enter ConfirmNewPassword</label>
                 <input onChange={(e)=>setConfirmNewPassword(e.target.value)} value={confirmNewPassword}  type="text" id='confirmNewPassword' className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0" required/>
              </div>

            {err && <p className="text-red-500">{err}</p>}

              <button onClick={handleStep3}  disabled={loading} className="w-[70%] px-[20px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]">
                 {loading?<ClipLoader size={30} color='green'/>:"Reset Password"}    
             </button>
      </div>}
          
    </div>
  )
}

export default ForgotPassword