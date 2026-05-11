import React, { useEffect } from 'react'
import { backendUrl } from '../App'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setPostData } from '../redux/postSlice'
import { setUserData } from '../redux/userSlice'

const getAllPost = () => {
    const dispatch=useDispatch()

    const {userData} = useSelector(state => state.user)
    useEffect(()=>{
    const fetchPost=async()=>{
    try{

     const result=await axios.get(`${backendUrl}/api/post/getall`,
        {withCredentials:true})
        console.log("Post data:", result.data);
        if (result.data.posts) {
             dispatch(setPostData(result.data.posts));
         }
    }catch(error){
       console.log(error);
    }
   }
   fetchPost()
 },[dispatch,userData])
 
}

export default getAllPost