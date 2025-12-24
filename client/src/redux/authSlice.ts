"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AuthType, User } from "./types"
import axios from "axios"



const initialState: AuthType = {
    user: null,
    isAuthenticated: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // загальна функція для взяття інфи з логіну та з реєєстрації якщо аку ще не має 
        login: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        signup: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        updateRank: (state, action: PayloadAction<string>) => {
            if(state.user)state.user.rank=action.payload;

        },

        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
        updateCompeleted :  (state,action:PayloadAction<number>)=>{
            if(state.user)state.user.taskComleted=action.payload;
        },
         updateFriendRequestList :  (state,action:PayloadAction<string>)=>{
            if(state.user)state.user.friendRequests = state.user.friendRequests.filter(req=>req!=action.payload);
        }

    }
})



export const { logout, login, signup ,updateRank,updateCompeleted,updateFriendRequestList} = authSlice.actions;
export default authSlice.reducer;
