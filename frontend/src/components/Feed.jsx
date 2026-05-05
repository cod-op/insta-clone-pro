import React from 'react'
import { IoMdHeartEmpty } from "react-icons/io";
import logo from '../assets/logo.png'
import dp from '../assets/dp.png'
import StoryDp from './StoryDp.jsx'
import Navbar from './Navbar.jsx';

const Feed = () => {
  return (
    <div className='lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto'>
        <div className='w-full h-[100px] flex items-center justify-between p-[20px] lg:hidden'>
            <img src={logo} alt="" className='w-[150px]' />
           <div>
            <IoMdHeartEmpty  className='text-white w-[25px] h-[25px]'/>
           </div>
        </div> 

        <div className='flex  w-full overflow-auto gap-[10px] items-center p-[20px] '>
           <StoryDp userName={"djznmgfgfghhjjhkjkjljhgfkklkl"}/>
            <StoryDp userName={"djznm"}/>
             <StoryDp userName={"djznm"}/>
              <StoryDp userName={"djznm"}/>
               <StoryDp userName={"djznm"}/>
                <StoryDp userName={"djznm"}/>
                 <StoryDp userName={"djznm"}/>
                  <StoryDp userName={"djznm"}/>
                   <StoryDp userName={"djznm"}/>
                    <StoryDp userName={"djznm"}/>
                    <StoryDp userName={"djznm"}/>
                   <StoryDp userName={"djznm"}/>
                    <StoryDp userName={"djznm"}/> 
                    
        </div>  

        <div className='w-full min-h-[100vh] flex flex-col items-cemter gap-[20px] p-[10px] pt-[40px] bg-white rounded-t-[60px] relative pb-[120px]'>
            <Navbar/>
        </div>

       
    </div>
  )
}

export default Feed