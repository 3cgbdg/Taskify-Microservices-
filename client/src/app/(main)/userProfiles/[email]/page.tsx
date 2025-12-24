'use client'
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { addTask, updateTask } from '@/redux/taskSlice';
import { BookOpen, Check, Heart, PenTool, UserRound, Users } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import axios from 'axios';
import { CommentType, User } from '@/redux/types';
const statuses = ["completed", "uncompleted"];


const Page = () => {
  const { email } = useParams() as { email: string };
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWritingComment, setIsWritingComment] = useState(false);
  const [commentInfo, setCommentInfo] = useState<string>("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const currentUser = useAppSelector(state => state.auth.user);
  const [isSentRequest, setIsSentRequest] = useState(false);
  useEffect(() => {
    const getOtherUserInfo = async () => {
      try {
        setIsLoading(true)
        const res = await axios.get(`http://localhost:4200/api/auth/getOtherUser/${email}`);
        if (!res) return;
        setUser(res.data);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    getOtherUserInfo();
  }, [])
  useEffect(() => {
    if (user && currentUser) {
      if (user.friendRequests.includes(currentUser.email)) {
        setIsSentRequest(true);
      } else {
        setIsSentRequest(false);
      }
    }
  }, [user, currentUser]);
  useEffect(() => {
    const getTasks = async () => {
      try {
        if (user) {
          const res = await axios.get(`http://localhost:4200/api/comments/getComments/${user.email}`)
          if (!res) return;
          console.log(res.data)
          setComments(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    getTasks();
  }, [user])

  const handleSendComment = async () => {
    try {
      if (user) {

        const res = await axios.post("http://localhost:4200/api/comments/createComment", { from: currentUser?.email, to: user.email, info: commentInfo });
        if (!res) return;
        const comment: CommentType = res.data
        setComments([...comments, comment]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleSetFriendRequest = async () => {
    try {
      if (user) {
        const res = await axios.post("http://localhost:4200/api/auth/createFriendRequest", { from: currentUser?.email, to: user.email });
        if (!res) return;

      }
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <>
      <div className='p-10 px-14 border-[3px] rounded-[150px] flex  items-center justify-between'>
        {isLoading
          ?
          (<div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mx-auto"></div>)

          : (<><div className="flex flex-col gap-10">
            <div className="flex items-center gap-6">
              <div className="p-2 border-[1px] max-w-[100px] flex justify-center  w-full"><UserRound size={75} /></div>
              <div className="flex flex-col gap-2">
                <div className='text-lg'>{user?.email}</div>
                <div className='text-md'>Rank:<span className='text-xl'>{user?.rank}</span></div>
                <div></div>
              </div>

            </div>
            <div className="font-bold">TASKS COMPLETED:{user?.taskComleted}</div>
          </div>
            <div className=" flex gap-3 items-center">
              <button onClick={() => setIsWritingComment(true)} className="flex items-center gap-3 rounded-md border-[1px] p-2  transition-all hover:bg-neutral-200"><PenTool /> <div className="">Write a comment</div></button>
              {isSentRequest ? (<div  className="flex items-center gap-3 rounded-md border-[1px] p-2  transition-all">Request is sent</div>
              ) : (<button onClick={handleSetFriendRequest} className="flex items-center gap-3 rounded-md border-[1px] p-2  transition-all hover:bg-neutral-200 hover:text-red-500"><Users /> <div className="">Add to friends</div></button>
              )}
            </div>
          </>
          )
        }




      </div>
      {isWritingComment ? (<form className='ml-3 relative  w-[550px] h-32 my-4' action="#">
        <textarea ref={textarea} onChange={(e) => setCommentInfo(e.target.value)} className='w-full rounded-[30px] h-full   overflow-hidden py-2 pl-4 pr-[125px]  resize-none outline-none' />
        <div className="absolute top-1/2 -translate-y-1/2 right-2 w-[97px] flex flex-col gap-1">
          <button onClick={(e) => {
            handleSendComment();
            setCommentInfo("");
            e.preventDefault();
            if (textarea.current) textarea.current.value = "";

          }} className='flex items-center justify-center   w-full   transition-colors hover:bg-neutral-200   rounded-[100px] border-[1px] border-black py-2 px-2'  >Надіслати</button >
          <button onClick={() => setIsWritingComment(false)} className='flex items-center justify-center  w-full  transition-colors hover:bg-red-200  rounded-[100px] border-[1px] border-black py-2 px-2'  >Закрити</button >
        </div>

      </form>) : ""
      }
      <div className="px-3 mt-10 mb-6">
        <h2 className='font-bold text-3xl flex items-center gap-2 mb-7 '>Comments<BookOpen /></h2>

        <div className="grid grid-cols-2 gap-5">
          {comments.map((comment, index) => (
            <div key={index} className="flex  gap-5 border-2 p-3 max-w-[550px] w-full rounded-lg">
              <div className="flex flex-col gap-1">
                <div className="p-2 border-[1px] max-w-[50px] border-black flex justify-center  w-full"><UserRound size={35} /></div>
                <span className='font-medium'>{comment.from}</span>
              </div>
              <div className="break-all">{comment.info}</div>
            </div>
          ))}


        </div>
      </div>
    </>
  )
}

export default Page