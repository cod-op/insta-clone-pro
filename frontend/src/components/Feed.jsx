import React from 'react'
import { IoMdHeartEmpty } from "react-icons/io";
import logo from '../assets/logo.png'
import dp from '../assets/dp.png'
import StoryDp from './StoryDp.jsx'
import Navbar from './Navbar.jsx';
import { useSelector } from 'react-redux';
import { LuMessageSquareMore } from "react-icons/lu";
import Post from './Post.jsx';
import {useNavigate } from 'react-router-dom';


const Feed = () => {

  const {postData}=useSelector(state=>state.post)
  
  const {userData}=useSelector(state=>state.user)
  const {storyList}=useSelector(state=>state.story)
 const navigate=useNavigate()

  return (
    <div className='lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto'>
        <div className='w-full h-[100px] flex items-center justify-between p-[20px] lg:hidden'>
            <img src={logo} alt="" className='w-[150px]' />
           <div className='felx items-center gap-[10px]'>
            <IoMdHeartEmpty  className='text-white w-[25px] h-[25px]'/>
            <LuMessageSquareMore onClick={()=>navigate('/messages')} className='text-white w-[25px] h-[25px]'/>
           </div>
        </div> 

        <div className='flex  w-full overflow-auto gap-[10px] items-center p-[20px] '>
           <StoryDp userName={"Your Story"} profileImage={userData?.profileImage} story={userData?.story}/> 
           {storyList?.map((story,index)=>(
            <StoryDp userName={story?.author?.userName} profileImage={story?.author?.profileImage} story={story} key={index}/>        
           ))}        
        </div> 

        <div className='w-full min-h-[100vh] flex flex-col items-center gap-[20px] p-[10px] pt-[40px] bg-white rounded-t-[60px] relative pb-[120px] '>
            <Navbar/>
             {postData?.map((post,index)=>(
              <Post post={post} key={index}/>
             ))}
        </div>

       
    </div>
  )
}

export default Feed