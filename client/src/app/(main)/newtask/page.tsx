'use client'
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { addTask, updateTask } from '@/redux/taskSlice';
import { Check } from 'lucide-react';

import React, { useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from 'axios';
import { useRouter } from 'next/navigation';
const statuses = ["completed", "uncompleted"];
const Page = () => {

  const { tasks } = useAppSelector(state => state.tasks);
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string | null>("");
  const [category, setCategory] = useState<string | null>("");
  const [status, setStatus] = useState<string>("uncompleted");
  const router = useRouter();



  const handleSubmit = async () => {
    try {
      const newTask = {
        title,
        description,
        category,
        status,
      };
      const res = await axios.post(`http://localhost:4200/api/tasks/createTask`, newTask,{withCredentials:true});
      if (!res) return;
      router.push("/")

    } catch (err) {
      console.error(err);
    }
  }


  return (
    <div className="flex max-w-[900px] mx-auto flex-col gap-7 items-end">
      <div className=" p-6 w-full  rounded-md border-gray-500 bg-white shadow-md   border ">

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label>Title:</label>
            <input value={title} type="text" onChange={(e) => setTitle(e.target.value)} className='border-gray-500 outline-none p-2 rounded-sm  shadow-md   border' />
          </div>
          <div className="flex flex-col gap-2">
            <label>Description:</label>
            <input value={description ? description : ""} type="text" onChange={(e) => setDescription(e.target.value)} className='border-gray-500 outline-none p-2 rounded-sm  shadow-md   border' placeholder={description ? "" : "Type in..."} />
          </div>
          <div className="flex flex-col gap-2">
            <label>Category:</label>
            <input value={category ? category : ""} type="text" onChange={(e) => setCategory(e.target.value)} className='border-gray-500 outline-none p-2 rounded-sm  shadow-md   border' placeholder={category ? "" : "Type in..."} />
          </div>

          <div className="flex flex-col gap-2 ">
            <label>Status:</label>
            <div className="flex justify-between">
              <DropdownMenu >
                <DropdownMenuTrigger asChild><Button className={`${!status ? "" : status === "completed" ? "bg-green-600" : "bg-red-700"}`} variant="outline">{status}</Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{status}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {statuses.map((elem, index) => (
                    <DropdownMenuItem key={index} className='uppercase font-medium' onClick={() => setStatus(elem)}>
                      {elem}
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuItem></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={() => handleSubmit()} variant='outline'><Check color='green' /></Button>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Page