import { IoMdHeartEmpty } from "react-icons/io";
import logo from '../assets/logo.png'
import StoryDp from './StoryDp.jsx'
import Navbar from './Navbar.jsx';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { LuMessageSquareMore } from "react-icons/lu";
import Post from './Post.jsx';
import {useNavigate } from 'react-router-dom';


const Feed = () => {

  const {postData}=useSelector(state=>state.post)
  
  const {userData,notificationData}=useSelector(state=>state.user)
  const {storyList}=useSelector(state=>state.story)
 const navigate=useNavigate()
 const groupedStories=useMemo(()=>{
   const groups=new Map()
   ;(storyList || []).forEach(story=>{
     const authorId=story.author?._id
     if(!authorId || authorId===userData?._id) return
     if(!groups.has(authorId)){
       groups.set(authorId,{author:story.author,stories:[]})
     }
     groups.get(authorId).stories.push(story)
   })
   return [...groups.values()]
 },[storyList,userData?._id])
 const ownStories=useMemo(()=>{
   const stories=[...(userData?.stories || []),userData?.story].filter(story=>story?._id)
   return [...new Map(stories.map(story=>[story._id,story])).values()]
 },[userData?.stories,userData?.story])

  return (
    <div className='lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto'>
        <div className='w-full h-[100px] flex items-center justify-between p-[20px] lg:hidden'>
            <img src={logo} alt="" className='w-[150px]' />
           <div className='felx items-center gap-[10px]'>
            <div className='relative'>
                        <IoMdHeartEmpty  className='text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate('/notifications')}/>
                        {(notificationData?.length>0 && notificationData.some((noti)=>
                          noti.isRead===false)) &&
                          <div className='w-[10px] h-[10px] bg-[#ED4956] rounded-full absolute top-0 right-0'>
            
                        </div>
                        }
                      </div>
            <LuMessageSquareMore onClick={()=>navigate('/messages')} className='text-white w-[25px] h-[25px]'/>
           </div>
        </div> 

        <div className='flex  w-full overflow-auto gap-[10px] items-center p-[20px] '>
           <StoryDp userName={"Your Story"} profileImage={userData?.profileImage} stories={ownStories}/>
           {groupedStories.map(({author,stories})=>(
            <StoryDp userName={author.userName} profileImage={author.profileImage} stories={stories} key={author._id}/>
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