import { Task } from "@/redux/types";
import axios from "axios";

export const updateTasksDB = async (taskId: string, newTask: Task): Promise<Task> => {
    try {
        const response = await axios.put<Task>(`http://localhost:4500/${taskId}`, newTask);
        return response.data;
    } catch (err) {
        throw err;
    }
}

export const deleteTasksDB = async (taskId: string): Promise<Task> => {
    try {
        const response = await axios.delete<Task>(`http://localhost:4500/${taskId}`);
        return response.data;
    } catch (err) {
        throw err;
    }
}
export const addTaskDB = async (taskId: string, newTask: Task): Promise<Task> => {
    try {
        const response = await axios.post<Task>(`http://localhost:4500/${taskId}`, newTask);
        return response.data;
    } catch (err) {
        throw err;
        
    }
}