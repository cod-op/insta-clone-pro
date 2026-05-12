import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { backendUrl } from '../App';
import axios from 'axios';
import { toggleFollow } from '../redux/userSlice';

const Follow = ({targetUserId,tailwind,onFollowChange}) => {

    const {following}=useSelector(state=>state.user)
    const isFollowing = following?.includes?.(targetUserId) ?? false;
    if(onFollowChange){
        onFollowChange()
    }
    const dispatch=useDispatch()

    const handleFollow=async()=>{
        try{
            const result=await axios.get(`${backendUrl}/api/user/follow/${targetUserId}`,{withCredentials:true})
            console.log("followdata : ",result)
            dispatch(toggleFollow(targetUserId))
        }catch(error){
            console.log(error);
        }
    }

  return (
   <button onClick={handleFollow} className={tailwind}>
      {isFollowing?"Following":"Follow"}
   </button>
  )
}

export default Follow