import React from 'react'
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import dp from '../assets/dp.png'
import {useDispatch, useSelector} from 'react-redux'
import OnlineUser from '../components/onlineUser';
import { setSelectedUser } from '../redux/messageSlice';

const Messages = () => {

  const {userData}=useSelector(state=>state.user)
  const {onlineUsers}=useSelector(state=>state.socket)
  const navigate=useNavigate()
  const {previousChatUsers,selectedUser}=useSelector(state=>state.message)
  const dispatch=useDispatch()
    

  const handleClick=(user)=>{
   dispatch(setSelectedUser(user))
   navigate('/messagearea')
  }
  
  
  return (
    <div className='w-full min-h-[100vh] flex flex-col bg-black gap-[20px] p-[10px]'>
       <div className='w-full h-[80px]  flex items-center gap-[20px] px-[20px]' >
            <IoArrowBackSharp onClick={()=>navigate(`/`)} className='text-white lg:hidden w-[25px] h-[25px] cursor-pointer '/>
            <h1 className='text-white text-[20px] font-semibold'>Messages</h1>
       </div>

       <div className='w-full h-[80px] flex gap-[20px] justify-start items-center
          overflow-x-auto p-[20px] border-b-2 border-gray-800'>
          {userData?.following?.map((user,index)=>(
            onlineUsers?.includes(user._id) && <OnlineUser key={index} user={user}/>
          ))}
       </div>
 //previous user
       <div className='w-full overflow-auto flex flex-col gap-[20px]'>
          {previousChatUsers?.map((user,index)=>(
            <div key={index} className='text-white cursor-pointer w-full flex items-center gap-[10px]' onClick={() => handleClick(user)}>
              {onlineUsers?.includes(user._id)?<OnlineUser user={user}/>:
               <div  className='w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                   <img src={user.profileImage || dp} alt="" className='w-full object-cover' />
                </div>}
            <div className='flex flex-col'>
            <div className='text-white text-[18px] font-semi-bold'> {user?.userName}</div>
            {onlineUsers?.includes(user._id) && <div className='text-blue-500 text-[15px]'>Active Now</div>}
            </div>
            </div>
          ))}
       
       </div>
    </div>
  )
}

export default Messages