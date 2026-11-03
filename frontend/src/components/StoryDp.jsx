import dp from '../assets/dp.png'
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StoryDp = ({profileImage,userName,stories=[]}) => {
   const navigate=useNavigate()
   const {userData}=useSelector(state=>state.user)
   const hasStories=stories.length>0
   const viewed=hasStories && stories.every(story=>
      story.viewers?.some(viewer=>
         (viewer?._id || viewer)?.toString()===userData?._id?.toString()
      )
   )

   const handleClick=()=>{
      if(userName==="Your Story" && !hasStories){
         navigate('/upload')
      }else if(hasStories){
         const storyOwner=userName==="Your Story" ? userData?.userName : userName
         navigate(`/story/${storyOwner}`)
      }
   }

  return (
   <div className='flex flex-col w-[80px]'>
      <div className={`w-[80px] h-[80px] rounded-full flex justify-center items-center relative ${!hasStories?"":!viewed?"bg-gradient-to-b from-blue-500 to-blue-950":"bg-zinc-700"}`}>
        <div className='w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={handleClick}>
           <img src={profileImage||dp} alt="" className='w-full object-cover' />
        </div>
        {userName==="Your Story" && <FiPlusCircle onClick={()=>navigate('/upload')} className='absolute bottom-[6px] right-[5px] rounded-full text-black bg-white w-[25px] h-[25px] cursor-pointer'/>}
       </div>

        <div className='text-[14px] text-center truncate w-full text-white '>
           {userName}
        </div> 
   </div>
  )
}


export default StoryDp