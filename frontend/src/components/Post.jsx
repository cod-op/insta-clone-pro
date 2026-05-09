import React from 'react'
import dp from '../assets/dp.png'
import { useNavigate } from 'react-router-dom'
import VideoPlayer from './VideoPlayer'
import { IoIosHeartEmpty } from "react-icons/io";
import { MdOutlineComment } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa";
import { useSelector } from 'react-redux';

const Post = ({postData}) => {
    const navigate=useNavigate()
    const {userData}=useSelector(state=>state.user)
  return (
    <div className='w-[90%]  flex flex-col gap-[10px] bg-white items-center  shadow-2xl shadow-[#00000058] rounded-2xl pb-[20px]'>
         <div className='w-full h-[80px] flex justify-between items-center px-[10px] '>
            <div className='flex justify-center items-center gap-[10px] md:gap-[20px]'>
                <div onClick={()=>navigate(`/profile/${postData.author?.userName}`)}  className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                    <img src={postData.author?.profileImage || dp} alt="" className='w-full h-full object-cover' />
                </div>
                <div className='w-[150px] font-semibold truncate'>
                    {postData.author?.userName}
                </div>
            </div>

            <button className=  'flex justify-center items-center px-[10px] w-[80px] md:w-[100px] py-[5px] h-[30px] md:h-[40px] bg-black text-white rounded-2xl text-[14px] md:text-[16px]'>
                Follow
            </button> 
         </div>

         <div className="w-[90%] flex items-center justify-center"> 
             {postData.mediaType==="image" && 
                <div className='w-[80%]   flex flex-col items-center justify-center'>
                  <img src={postData.media} alt="" className='h-[300px] max-w-full object-cover rounded-2xl' />
                 </div>
               }   
               {postData.mediaType==="video" && 
                 <div className='w-[80%]  flex flex-col items-center justify-center'>
                    <VideoPlayer media={postData.media}/>
                  </div>
               }        
         </div>

         <div className='w-full h-[60px] flex justify-between items-center px-[20px] mt-[10px]'>
            <div className='flex'>
               <div> <IoIosHeartEmpty /></div>
               <div> <MdOutlineComment /></div>
            </div>
            <div>
                <FaRegBookmark />
            </div>
         </div>
    </div>
  )
}

export default Post