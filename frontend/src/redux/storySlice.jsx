import { createSlice } from "@reduxjs/toolkit"

const storySlice=createSlice({
    name:"story",
    initialState:{
       storyData:null,
       storyList:null
    },
    reducers:{
        setStoryData:(state,action)=>{
            state.storyData=action.payload
        },
        setStoryList:(state,action)=>{
            state.storyList=action.payload
        },
        appendStories:(state,action)=>{
            const stories=new Map((state.storyList || []).map(story=>[story._id,story]))
            action.payload.forEach(story=>stories.set(story._id,story))
            state.storyList=[...stories.values()].sort((first,second)=>
                new Date(first.createdAt)-new Date(second.createdAt)
            )
        },
        updateStory:(state,action)=>{
            const updatedStory=action.payload
            state.storyList=state.storyList?.map(story=>
                story._id===updatedStory._id ? updatedStory : story
            ) ?? state.storyList
            if(state.storyData?._id===updatedStory._id){
                state.storyData=updatedStory
            }
        }
    }
})

export const {setStoryData,setStoryList,appendStories,updateStory}=storySlice.actions;
export default storySlice.reducer