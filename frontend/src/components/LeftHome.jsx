import React from 'react'
import logo from '../assets/logo.png'
import dp from '../assets/dp.png'
import { IoMdHeartEmpty } from "react-icons/io";
import axios from 'axios';
import { backendUrl } from '../App';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import OtherUser from './OtherUser';


const LeftHome = () => {
    const {userData,suggestedUsers}=useSelector(state=>state.user)
   const dispatch=useDispatch()
    const handleLogout=async()=>{
       
        try{
           const result=await axios.get(`${backendUrl}/api/auth/signout`,{withCredentials:true})
           dispatch(setUserData(null))
        }catch(error){
             console.log(error);
        }
    }
    
  return (
    <div className='w-[25%] hidden lg:block min-h-[100vh] bg-black border-r-2 border-gray-900'>

       <div className='w-full h-[100px] flex items-center justify-between p-[20px]'>
          <img src={logo} alt="" className='w-[150px]' />
          <div>
            <IoMdHeartEmpty  className='text-white w-[25px] h-[25px]'/>
          </div>
        </div>
    
       <div className='flex items-center justify-between px-[10px] border-b-2 border-gray-900 py-[10px]'>
          <div className='flex items-center gap-[10px]'>
              <div className='w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                <img src={userData.profileImage || dp} alt="" className='w-full object-cover' />
              </div>
             <div>
               <div className='text-[18px] text-white font-bold'>{userData.userName}</div>
               <div className='text-[18px] text-gray-400 font-bold'>{userData.name}</div>
             </div>
          </div>

          <div onClick={handleLogout} className='text-blue-500 font-semibold cursor-pointer'>Logout </div>

       </div>
      
      <div className='w-full flex flex-col gap-[20px] p-[20px]'>
          <h1 className='text-white text -[19px]'>Suggested Users</h1>
           {suggestedUsers && suggestedUsers.slice(0,3).map((user,index)=>(
            <OtherUser key={index} user={user}/>
           ))}
      </div>


    </div>
  )
}

export default LeftHome