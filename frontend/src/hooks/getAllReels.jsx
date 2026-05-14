import React, { useEffect } from 'react'
import { backendUrl } from '../App'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { setReelData } from '../redux/reelSlice'

const getAllReels = () => {
    const dispatch=useDispatch()

    const {userData} = useSelector(state => state.user)
    useEffect(()=>{
    const fetchReels=async()=>{
    try{

     const result=await axios.get(`${backendUrl}/api/reel/getall`,
        {withCredentials:true})
      //   console.log("Reels data:", result.data.reels);
        if (result.data.reels) {
             dispatch(setReelData(result.data.reels));
         }
    }catch(error){
       console.log(error);
    }
   }
   fetchReels()
 },[dispatch,userData])
 
}

export default getAllReels