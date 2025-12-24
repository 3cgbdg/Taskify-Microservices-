'use client'
import Link from 'next/link'
import AccordionElem from "./AccordionElem"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { Task } from '@/redux/types'
import { addTask, getTasks } from '@/redux/taskSlice'
import axios from 'axios'




const TaskList = () => {
  const dispatch = useAppDispatch();
  const { tasks } = useAppSelector(state => state.tasks);
  const [isLoading, setIsLoading] = useState(false);
  const [sortedTasks, setSortedTasks] = useState<Task[]>(tasks)
  const [filterTitle, setFilterTitle] = useState<string>("Sort by status");
  const handleSortByStatus = (status: string) => {
    if (status === "all") {
      setSortedTasks(tasks);
    } else {
      setSortedTasks(tasks.filter(task => task.status === status));
    }
  }
  const handleGetTasks = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:4200/api/tasks/getTasks", { withCredentials: true });

      if (!res) return;
      const tasks = res.data.tasks;
      dispatch(getTasks(tasks));
    } catch (err) {

      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    handleGetTasks();
    console.log(tasks)

  }, [])
  useEffect(() => {
    setSortedTasks(tasks);
  }, [tasks]);
  return (
    <div className="flex flex-col gap-6 ">


      <>
        <div className="flex items-center gap-4 ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{filterTitle}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => {
                setFilterTitle("completed");
                handleSortByStatus("completed")
              }}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setFilterTitle("uncompleted");
                handleSortByStatus("uncompleted")
              }}>
                Uncompleted
              </DropdownMenuItem>
              {filterTitle !== "Sort by status" ?
                (<DropdownMenuItem onClick={() => {
                  setFilterTitle("all");
                  handleSortByStatus("all")
                }}>
                  all
                </DropdownMenuItem>) : ""}

            </DropdownMenuContent>
          </DropdownMenu>

        </div>
        <div className='rounded-md border-input border p-10 flex flex-col gap-4  '>
          {isLoading
            ?
            (<div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mx-auto"></div>)
            
            : sortedTasks.map((task, index) => (
              <AccordionElem key={index} task={task} />
            ))
          }

        </div>
      </>


    </div>
  )
}

export default TaskList

