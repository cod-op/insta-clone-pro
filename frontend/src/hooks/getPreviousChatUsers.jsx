import React, { useEffect } from 'react'
import { backendUrl } from '../App'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setFollowing, setUserData} from '../redux/userSlice'
import { setPreviousChatUsers } from '../redux/messageSlice'


const getPreviousChatUsers = () => {
    const dispatch=useDispatch()
    const {messages}=useSelector(state=>state.message)
   useEffect(()=>{
   const fetchUser=async()=>{
    try{

     const result=await axios.get(`${backendUrl}/api/message/previouschats`,
        {withCredentials:true})
        console.log("previoususer data",result.data)
        if (result.data) {
             dispatch(setPreviousChatUsers(result.data)); 
         }
         
    }catch(error){
       console.log(error);
    }
   }
   fetchUser()
 },[dispatch,messages])
 
}

export default getPreviousChatUsers