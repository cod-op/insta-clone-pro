import React, { useRef, useState } from 'react'
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { FaRegSquarePlus } from "react-icons/fa6";
import VideoPlayer from '../components/VideoPlayer';
import axios from'axios'
import { backendUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setPostData } from '../redux/postSlice';
import { setReelData } from '../redux/reelSlice';
import { ClipLoader } from 'react-spinners';
import { setUserData } from '../redux/userSlice';
import { setStoryList } from '../redux/storySlice';

const Upload = () => {

const navigate=useNavigate()
const [uploadType,setUploadType]=useState("post")
const [frontendMedia,setFrontendMedia]=useState(null)
const [storyFiles,setStoryFiles]=useState([])
const [backendMedia,setBackendMedia]=useState(null)
const [mediaType,setMediaType]=useState("")
const [caption, setCaption] = useState("");
const mediaInput=useRef()
const storyPreviewUrls=useRef([])
const dispatch=useDispatch()
const {postData}=useSelector(state=>state.post)
const {userData}=useSelector(state=>state.user)
const {reelData}=useSelector(state=>state.reel)
const {storyList}=useSelector(state=>state.story)
const [loading,setLoading]=useState(false)
const [uploadError,setUploadError]=useState("")

React.useEffect(()=>()=>storyPreviewUrls.current.forEach(url=>URL.revokeObjectURL(url)),[])

const handleMedia=(e)=>{
  const files=Array.from(e.target.files || [])
  if(files.length===0) return
  setUploadError("")
  if(uploadType==="story"){
    const newStoryFiles=files.map(file=>{
      const previewUrl=URL.createObjectURL(file)
      storyPreviewUrls.current.push(previewUrl)
      return {file,previewUrl}
    })
    setStoryFiles(previous=>[...previous,...newStoryFiles])
    setFrontendMedia(null)
    setBackendMedia(null)
    return
  }
  const file=files[0]
  if(file.type.includes("image")){
    setMediaType("image")
  }else{
     setMediaType("video")
  }
  setBackendMedia(file)
  setFrontendMedia(URL.createObjectURL(file))
}

const uploadPost=async()=>{
  try{
    const formData=new FormData()
    formData.append("caption",caption)
    formData.append("mediaType",mediaType)
    formData.append("media",backendMedia)
    const result=await axios.post(`${backendUrl}/api/post/upload`,formData,{withCredentials:true})
    dispatch(setPostData([result.data.populatedPost,...postData]))
    setLoading(false)
    navigate('/')
  }catch(error){
   console.log(error);
   setLoading(false)
  }
}

const uploadStory=async()=>{
  try{
    const formData=new FormData()
    storyFiles.forEach(({file})=>formData.append("media",file))
    const result=await axios.post(`${backendUrl}/api/story/upload`,formData,{withCredentials:true})
    if (userData) {
      const uploadedStories=result.data.stories || [result.data.story]
      const uploadedStory=uploadedStories[uploadedStories.length-1]
      dispatch(setUserData({
        ...userData,
        story:uploadedStory,
        stories:[...(userData.stories || []),...uploadedStories]
      }))
      dispatch(setStoryList([...(storyList || []).filter(story=>
        !uploadedStories.some(uploaded=>uploaded._id===story._id)
      ),...uploadedStories]))
    }
    if(result.data.warning) window.alert(result.data.warning)
    setLoading(false)
     navigate('/')
  }catch(error){
   setUploadError(error.response?.data?.message || "Story upload failed. Please try again.")
   setLoading(false)
  }
}


const uploadReel=async()=>{
  try{
    const formData=new FormData
    formData.append("caption",caption)
    formData.append("media",backendMedia)
    const result=await axios.post(`${backendUrl}/api/reel/upload`,formData,{withCredentials:true})
    dispatch(setReelData([result.data.populatedReel,...reelData]))
    setLoading(false)
     navigate('/')
  }catch(error){
   console.log(error);
   setLoading(false)
  }
}


const handleUpload=async()=>{
  if(uploadType==="story" ? storyFiles.length===0 : !backendMedia){
    setUploadError("Please select media to upload.")
    return
  }
  setUploadError("")
  setLoading(true)
  if(uploadType==="post"){
    uploadPost()
  }
  else if(uploadType==="story"){
    uploadStory()
  }
  else{
    uploadReel()
  }
}

  return (
    <div className='w-full h-[100vh] bg-black flex flex-col items-center'>
         <div className='w-full h-[80px]  flex items-center gap-[20px] px-[20px]' >
            <IoArrowBackSharp onClick={()=>navigate(`/`)} className='text-white w-[25px] h-[25px] cursor-pointer '/>
             <h1 className='text-white text-[20px] font-semibold'>Upload Media</h1>
         </div>

         <div className='w-[90%] max-w-[600px] h-[80px] bg-white rounded-full flex justify-around items-center gap-[10px]'>
             <div onClick={()=>setUploadType("post")} className={` ${uploadType==="post"?"bg-black shadow-2xl hover:shadow-black text-white":"" }
              w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold 
             hover:bg-black rounded-full hover:text-white cursor-pointer shadow-2xl hover:shadow-black`}>Post</div>
             <div onClick={()=>setUploadType("story")} className={` ${uploadType==="story"?"bg-black shadow-2xl hover:shadow-black text-white":"" }
              w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold 
             hover:bg-black rounded-full hover:text-white cursor-pointer shadow-2xl hover:shadow-black`}>Story</div>
             <div onClick={()=>setUploadType("reel")} className={` ${uploadType==="reel"?"bg-black shadow-2xl hover:shadow-black text-white":"" } 
             w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold 
             hover:bg-black rounded-full hover:text-white cursor-pointer shadow-2xl hover:shadow-black`}>Reel</div>
         </div>

         { !frontendMedia && storyFiles.length===0 &&
           <div onClick={()=>mediaInput.current.click()} className='w-[80%] max-w-[500px] h-[250px] bg-[#0e1316] border-gray-800 border-2 flex flex-col items-center justify-center
              gap-[8px] mt-[15vh] rounded-2xl cursor-pointer hover:bg-[#353a3d]'>
              <input type="file" accept={uploadType==="reel"?"video/*":uploadType==="story"?"image/*,video/*":""}
                multiple={uploadType==="story"} hidden ref={mediaInput} onChange={handleMedia}/>
              <div onClick={()=>navigate('/upload')} ><FaRegSquarePlus  className='text-white w-[30px] h-[30px] cursor-pointer'/></div>
              <div className='text-white text-[19px] font-semi-bold'> Upload {uploadType}</div>
          </div>
        }
        {uploadType==="story" && storyFiles.length>0 &&
         <div className="w-[90%] max-w-[600px] mt-[8vh] grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[55vh] overflow-y-auto">
           {storyFiles.map(({file,previewUrl},index)=>(
             <div key={`${file.name}-${file.lastModified}-${index}`} className="relative h-[180px] rounded-xl overflow-hidden bg-[#0e1316]">
               {file.type.startsWith("video/")
                 ? <video src={previewUrl} className="w-full h-full object-cover" muted/>
                 : <img src={previewUrl} alt={file.name} className="w-full h-full object-cover"/>}
               <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">{file.name}</span>
             </div>
           ))}
           <button type="button" onClick={()=>mediaInput.current.click()} className="h-[180px] rounded-xl border-2 border-dashed border-gray-500 text-white">
             <FaRegSquarePlus className="mx-auto w-8 h-8"/> Add more
           </button>
           <input type="file" accept="image/*,video/*" multiple hidden ref={mediaInput} onChange={handleMedia}/>
         </div>
        }
        {frontendMedia && 
          <div className="w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[15vh]"> 
               {mediaType==="image" && 
                  <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>
                     <img src={frontendMedia} alt="" className='h-[60%] rounded-2xl' />
                     {uploadType!="story" && <input  onChange={(e) => setCaption(e.target.value)} type="text" value={caption} placeholder='write caption...' className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]'/>}
                  </div>
               }   
               {mediaType==="video" && 
                  <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>
                      <VideoPlayer media={frontendMedia}/>
                     {uploadType!="story" && <input onChange={(e) => setCaption(e.target.value)} type="text" value={caption} placeholder='write caption...' className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]'/>}
                  </div>
               }        
          </div>   
         }

        {(frontendMedia || (uploadType==="story" && storyFiles.length>0)) && 
            <button onClick={handleUpload} className='px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-white mt-[50px] cursor-pointer rounded-2xl'>
              {loading?<ClipLoader size={30} color="#0095F6"/>:`Upload ${uploadType==="story" && storyFiles.length>1?`${storyFiles.length} Stories`:uploadType}`}  
           </button>
        }
        {uploadError && <p role="alert" className="text-red-400 text-center px-4 mt-3">{uploadError}</p>}

    </div>
  )
}

export default Upload