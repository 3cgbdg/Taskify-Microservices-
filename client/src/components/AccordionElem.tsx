'use client'
import { ChevronRight, CirclePlus, Pen, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Task } from '@/redux/types';
import Link from 'next/link';
import { deleteTask, toggleTaskStatus } from '@/redux/taskSlice';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { getRankByCompletedCount } from '@/utils/ranks';
import { updateCompeleted, updateRank } from '@/redux/authSlice';
const statuses = ["completed", "uncompleted"]
const AccordionElem = ({ task }: { task: Task }) => {
  const [accordionEl, setAccordionEl] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { tasks } = useAppSelector(state => state.tasks);
  const { user } = useAppSelector(state => state.auth);
  const handleDeleteTask = async () => {
    try {
      const res = await axios.delete(`http://localhost:4200/api/tasks/deleteTask/${task.taskId}`, { withCredentials: true });
      if (!res) return;
      dispatch(deleteTask(task.taskId));
    } catch (err) {
      console.error(err);
    }
  }
  const handleUpdateStatus = async (status: string) => {
    try {
      const newTask = {
        ...task,
        status,
      };

      const res = await axios.put(
        `http://localhost:4200/api/tasks/updateTask/${task.taskId}`,
        newTask,
        { withCredentials: true }
      );

      if (!res || res.status !== 200) return;

      dispatch(toggleTaskStatus({ title: task.title, status }));

      const wasCompleted = task.status === "completed";
      const nowCompleted = status === "completed";


      if (wasCompleted !== nowCompleted) {

        const currentCompletedCount = tasks.filter(t => t.status === "completed").length;


        const newCompletedCount = nowCompleted
          ? currentCompletedCount + 1
          : currentCompletedCount - 1;
        const res3 = await axios.patch("http://localhost:4200/api/auth/updateCompletedList", { newCount: newCompletedCount }, { withCredentials: true });
        dispatch(updateCompeleted(newCompletedCount));
        const newRank = getRankByCompletedCount(newCompletedCount);

        if (newRank !== user?.rank) {
          const res2 = await axios.patch(
            "http://localhost:4200/api/auth/updateRank",
            { newRank },
            { withCredentials: true }
          );

          if (res2.status === 200 && user) {
            dispatch(updateRank(newRank));
          }
        }
      }

    } catch (err) {
      console.error(err);
    }
  };



  return (
    <div>
      <div className=' px-4 rounded-md border-gray-500 bg-white shadow-md   border py-2 '>
        <div className="flex items-center justify-between h-12">
          <div className='uppercase font-semibold max-w-[800px] w-full'>{task.title}</div>
          <div className="flex items-center gap-3">
            <Button onClick={() => handleDeleteTask()} variant="secondary" className='bg-red-500 hover:opacity-80 '><Trash2 /></Button>
            <Link href={`/update-task/${task.taskId}`} >
              <Button variant="outline">
                <Pen />
              </Button>
            </Link>
            <DropdownMenu >
              <DropdownMenuTrigger asChild ><Button className={`${!task.status ? "" : task.status === "completed" ? "bg-green-600" : "bg-red-500"}`} variant="outline">{task.status}</Button></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{task.status}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statuses.map((elem, index) => (
                  <DropdownMenuItem key={index} className='uppercase font-medium' onClick={() => { handleUpdateStatus(elem); }}>
                    {elem}
                  </DropdownMenuItem>
                ))}

                <DropdownMenuItem></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {task.category ?? (
              <div className='uppercase border-x-2 px-1 font-semibold text-sm border-black'>
                {task.category}

              </div>
            )}


            <div className={`flex items-center gap-2 group uppercase font-semibold ${accordionEl ? "opacity-80" : "opacity-100"}`} onClick={() => setAccordionEl(!accordionEl)}>
              <span className='group-hover:opacity-80 cursor-pointer'>Description</span>
              <ChevronRight className={` transition-transform cursor-pointer  ${accordionEl ? "rotate-90" : "rotate-0"}`} />

            </div>

          </div>


        </div>

        {accordionEl && (
          <div className='mt-2 px-4 text-sm text-gray-700 font-semibold pb-2'>
            {!task.description ? (
              <span>There is no description!</span>
            ) : task.description}


          </div>
        )}
      </div>
    </div>
  )
}

export default AccordionElem


// title:string;
// decription:string;
// category:string;
// status:"completed" | "uncompleted" | "canceled";
// userId:string;
// createdAt:string;