"use client"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "./types";



interface TasksState {
    tasks: Task[]
}

const initialState: TasksState = {
    tasks: [],
}


const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<Task>) => {
            state.tasks.push(action.payload);           
        },
        toggleTaskStatus: (state, action:PayloadAction<{ title:string,status:string}>) => {
            const task = state.tasks.find(task => task.title == action.payload.title);
            if (task) task.status = action.payload.status;
        },
        updateTask: (state, action: PayloadAction<Task>) => {
            let index = state.tasks.findIndex(task => task.taskId == action.payload.taskId);
           if(index!==-1){

               state.tasks[index]= { ...action.payload };
           }
        },
        deleteTask: (state, action: PayloadAction<string>) => {
            state.tasks = state.tasks.filter(task => task.taskId !== action.payload);
        },
        getTasks:(state,action:PayloadAction<Task[]>)=>{
            state.tasks = action.payload;
        }


    }

})

export const { addTask, toggleTaskStatus, deleteTask, updateTask,getTasks } = taskSlice.actions;
export default taskSlice.reducer;