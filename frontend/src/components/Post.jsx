import React, { use, useEffect, useState } from 'react'
import dp from '../assets/dp.png'
import { useNavigate } from 'react-router-dom'
import VideoPlayer from './VideoPlayer'
import { IoIosHeartEmpty } from "react-icons/io";
import { MdOutlineComment } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa";
import { GoBookmarkFill } from "react-icons/go";
import { FaHeart } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { backendUrl } from '../App';
import { setPostData } from '../redux/postSlice';
import { setUserData } from '../redux/userSlice';
import Follow from './Follow';
import EmojiPicker from './EmojiPickerComponent';

const Post = ({post}) => {
    const navigate=useNavigate()
    const {userData}=useSelector(state=>state.user)
    const { postData } = useSelector(state => state.post)
    const { socket } = useSelector(state => state.socket)
    const [showComment,setShowComment]=useState(false)
    const [message,setMessage]=useState("")
    const dispatch=useDispatch()

    const handleLike=async()=>{
      try{
         const result=await axios.get(`${backendUrl}/api/post/like/${post._id}`,{withCredentials:true})
         console.log("likedata : ",result)
         const updatedPost=result.data.post;
         
         const updatedPosts=postData.map(p=>p._id==post._id?updatedPost:p)
         dispatch(setPostData(updatedPosts))
      }catch(error){
          console.log(error)
      }
    }


     const handleComment=async()=>{
      try{
         const result=await axios.post(`${backendUrl}/api/post/comment/${post._id}`,{message},{withCredentials:true})
         console.log("commentdata : ",result)
         const updatedPost=result.data.post;
         
         const updatedPosts=postData.map(p=>p._id==post._id?updatedPost:p)
         dispatch(setPostData(updatedPosts))
         setMessage("")
      }catch(error){
       console.log(error)
      }
    }

 
    const handleSaved=async()=>{
      try{
         const result=await axios.get(`${backendUrl}/api/post/saved/${post._id}`,{withCredentials:true})
         console.log("savedata : ",result)
         if (result.data.user) {
          dispatch(setUserData(result.data.user));
        }
      }catch(error){
         console.log(error)
      }
    }

  useEffect(()=>{
   socket?.on("likedPost",(updatedData)=>{
    const updatedPosts=postData.map(p=>p._id===updatedData.postId?{...p,likes:updatedData.likes}:p)
    dispatch(setPostData(updatedPosts))
   })
   socket?.on("commentedPost",(updatedData)=>{
    const updatedPosts=postData.map(p=>p._id===updatedData.postId?{...p,comments:updatedData.comments}:p)
    dispatch(setPostData(updatedPosts))
   })
   return ()=>{socket?.off("likedPost")
      socket?.off("commentedPost")
   }
  },[socket,postData,dispatch])

  return (
    <div className='w-full  flex flex-col gap-[10px] bg-white items-center  shadow-2xl shadow-[#00000058] rounded-2xl pb-[20px]'>
         <div className='w-full h-[80px] flex justify-between items-center px-[10px] '>
            <div className='flex justify-center items-center gap-[10px] md:gap-[20px]'>
                <div onClick={()=>navigate(`/profile/${post?.author?.userName}`)}  className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                    <img src={post.author?.profileImage || dp} alt="" className='w-full h-full object-cover' />
                </div>
                <div className='w-[150px] font-semibold truncate'>
                    {post.author?.userName}
                </div>
            </div>

            {userData._id!=post.author._id  &&
             <Follow targetUserId={post?.author?._id} tailwind={ 'flex justify-center items-center px-[10px] w-[80px] md:w-[100px] py-[5px] h-[30px] md:h-[40px] bg-black text-white rounded-2xl text-[14px] md:text-[16px] cursor-pointer'}/> 
            }        
         </div>

         <div className="w-[90%] flex items-center justify-center"> 
             {post.mediaType==="image" && 
                <div className='w-[80%]   flex flex-col items-center justify-center'>
                  <img src={post.media} alt="" className='h-[300px] max-w-full object-cover rounded-2xl' />
                 </div>
               }   
               {post.mediaType==="video" && 
                 <div className='w-[80%]  flex flex-col items-center justify-center'>
                    <VideoPlayer media={post.media}/>
                  </div>
               }        
         </div>

         <div className='w-full h-[60px] flex justify-between items-center px-[20px] mt-[10px]'>
           {/* left */}
            <div className='flex justify-center items-center gap-[10px]'>
               <div onClick={handleLike} className='flex justify-center items-center gap-[5px]'> 
                  {!post?.likes?.includes(userData?._id)&& <IoIosHeartEmpty className='w-[25px] h-[25px] cursor-pointer'/>}
                  {post?.likes?.includes(userData?._id)&& <FaHeart className='w-[25px] h-[25px] cursor-pointer text-red-600'/>}
                  <span>{post?.likes?.length || 0}</span>
               </div>
               <div className='flex justify-center items-center gap-[10px]'>
                 <MdOutlineComment onClick={()=>setShowComment(prev=>!prev)} className='w-[25px] h-[25px] cursor-pointer'/>
                 <span>{post?.comments?.length || 0}</span>
               </div>
            </div>
         {/* right */}
            <div onClick={handleSaved}>
                {!userData?.saved?.some(item=>(item._id || item) === post?._id)&& <FaRegBookmark className='w-[25px] h-[25px] cursor-pointer'/>}
                {userData?.saved?.some(item=>(item._id || item) === post?._id)&& <GoBookmarkFill className='w-[25px] h-[25px] cursor-pointer'/>}
            </div>

         </div>

         {post.caption && <div className='w-full px-[20px] gap-[10px] flex justify-start items-center'>
            <h1>{post.author?.userName}</h1>
            <div>{post?.caption}</div>
         </div>}

         {showComment  && 
         <div className='w-full flex-col gap-[30px] pb-[20px] '>
              <div className='w-full h-[80px] flex items-center px-[20px] gap-5 relative'>
                <div  className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full shrink-0 cursor-pointer overflow-hidden'>
                    <img src={userData?.profileImage || dp} alt="" className='w-full h-full object-cover' />
                </div>
                <div className="flex-1 flex items-center border-b-2 border-gray-500 h-[40px] min-w-0 pr-1 gap-2">
                   <input onChange={(e)=>setMessage(e.target.value)} value={message} type="text" placeholder='write comment...' className='flex-1 outline-none h-full bg-transparent px-1 text-[15px] min-w-0'/>
                   <div className="flex items-center gap-[10px] flex-shrink-0">
                      <EmojiPicker setValue={setMessage} tailwind={'w-[25px] h-[25px] text-gray-600 cursor-pointer hover:text-black'} />
                      <button onClick={handleComment} className='cursor-pointer'>
                       <IoSend className='w-[25px] h-[25px]' />
                      </button>
                    </div>
                </div>
               </div>

              <div className='w-full max-h-[300px] overflow-auto'>
                {post?.comments?.map((com,index)=>(
                     <div key={index} className='w-full px-[20px] flex items-start gap-[12px] border-b-2 border-b-gray-200 py-2'> 
                        <div   className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden shrink-0'>
                            <img src={com?.author?.profileImage || dp} alt="" className='w-full h-full object-cover' />
                         </div>
                          <div className='flex-1 break-words whitespace-pre-wrap text-[14px]'>
                            <span className='font-semibold mr-2'> {com?.author?.userName}</span>
                              {com.message}
                         </div>
                     </div>
                     ))}
              </div>
          </div>}
    </div>
  )
}

export default Post