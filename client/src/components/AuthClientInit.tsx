// components/AuthClientInit.tsx
"use client";

import { useEffect } from "react";
import axios from "axios";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { login } from "@/redux/authSlice";
import { getTasks } from "@/redux/taskSlice";

export default function AuthClientInit() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getAccountInfo = async () => {
      try {
        const res = await axios.get("http://localhost:4200/api/auth/profile", {
          withCredentials: true,
        });
        dispatch(login(res.data.user));
      } catch (err) {
        console.error("Error getting profile", err);
      }
    };

    const getTasksInfo = async () => {
      try {
        const res = await axios.get("http://localhost:4200/api/tasks/getTasks", {
          withCredentials: true,
        });
        dispatch(getTasks(res.data.tasks));
      } catch (err) {
        console.error("Error getting tasks", err);
      }
    };

    getAccountInfo();
    getTasksInfo();
  }, [dispatch]);

  return null;
}
