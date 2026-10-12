import { createSlice } from "@reduxjs/toolkit"

const messageSlice=createSlice({
    name:"message",
    initialState:{
      selectedUser:null,
      messages:[],
      previousChatusers:null
    },
    reducers:{
        setSelectedUser:(state,action)=>{
            state.selectedUser=action.payload
        },
        setMessages:(state,action)=>{
            state.messages=action.payload
        },
        mergeMessages:(state,action)=>{
            const messagesById=new Map(action.payload.map(message=>[message._id,message]))
            state.messages.forEach(message=>messagesById.set(message._id,message))
            state.messages=Array.from(messagesById.values())
        },
        addMessage:(state,action)=>{
            if(!state.messages.some(message=>message._id===action.payload._id)){
              state.messages.push(action.payload)
            }
        },
        setPreviousChatUsers:(state,action)=>{
            state.previousChatUsers=action.payload
        }
    }
})

export const {setSelectedUser,setMessages,mergeMessages,addMessage,setPreviousChatUsers}=messageSlice.actions;
export default messageSlice.reducer