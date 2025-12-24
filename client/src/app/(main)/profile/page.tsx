'use client'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { BookOpen, Check, MessageCircle, PenTool, Trash2, UserRound, Users } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import axios from 'axios';
import { CommentType } from '@/redux/types';
const statuses = ["completed", "uncompleted"];



const Page = () => {
  const { user } = useAppSelector(state => state.auth);
  const router = useRouter();
  const [isWritingComment, setIsWritingComment] = useState(false);
  const [commentInfo, setCommentInfo] = useState<string>("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const textarea = useRef<HTMLTextAreaElement>(null);
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

  useEffect(() => {
    getTasks();
  }, [user])

  const handleSendComment = async () => {
    try {
      if (user) {

        const res = await axios.post("http://localhost:4200/api/comments/createComment", { from: user.email, to: user.email, info: commentInfo });
        if (!res) return;
        const comment: CommentType = res.data
        setComments([...comments, comment]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleDeleteComment = async (id: string) => {
    try {
      const res = await axios.delete(`http://localhost:4200/api/comments/deleteComment/${id}`);
      await getTasks();
    } catch (error) {
      console.log(error);
    }
  }

  const setRouteToChatSpecId = async (email: string) => {
    try {
      const res1 = await axios.get(`http://localhost:4200/api/auth/getOtherUserId/${email}`);
      const res2 = await axios.post(`http://localhost:4200/api/chat/getChat`, { to: res1.data },{withCredentials:true});
      const id = res2.data._id;
      router.push(`/chat/${id}`);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div >
      <div className='p-10 px-14 border-[3px] flex items-center justify-between rounded-[150px] '>
        <div className="flex flex-col gap-10">
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
        <button onClick={() => setIsWritingComment(true)} className="flex items-center gap-3 rounded-md border-[1px] p-2  transition-all hover:bg-neutral-200"><PenTool /> <div className="">Write a comment</div></button>


      </div>

      {isWritingComment ? (<form className='ml-3 relative  w-[550px] h-32 my-4' action="#">
        <textarea ref={textarea} onChange={(e) => setCommentInfo(e.target.value)} className='w-full rounded-[30px] h-full   overflow-hidden py-2 pl-4 pr-[120px]  resize-none outline-none' />
        <div className="absolute top-1/2 -translate-y-1/2 right-2 w-[97px] flex flex-col gap-1">
          <button onClick={(e) => {
            handleSendComment();
            setCommentInfo("");
            e.preventDefault();
            if (textarea.current) textarea.current.value = "";

          }} className='flex items-center justify-center py-1  w-full   transition-colors hover:bg-neutral-200   rounded-[100px] border-[1px] border-black py-2 px-2'  >Надіслати</button >
          <button onClick={() => setIsWritingComment(false)} className='flex items-center justify-center py-1 w-full  transition-colors hover:bg-red-200  rounded-[100px] border-[1px] border-black py-2 px-2'  >Закрити</button >
        </div>
      </form>) : ""
      }
      <div className="px-3 mt-10 grid grid-cols-2">
        <div className="">
          <h2 className='font-bold text-3xl flex items-center gap-2 mb-7 '>Comments<BookOpen /></h2>

          <div className="grid grid-cols-1 gap-5">
            {comments.map((comment, index) => (
              <div key={index} className=" border-2 p-3 max-w-[550px] flex justify-between w-full rounded-lg">
                <div className="flex  gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="p-2 border-[1px] max-w-[50px] border-black flex justify-center  w-full"><UserRound size={35} /></div>
                    <span className='font-medium'>{comment.from}</span>
                  </div>
                  <div className="break-all">{comment.info}</div>
                </div>
                <div className="">
                  <button onClick={() => handleDeleteComment(comment.commentId)} className='rounded-md border-[1px] p-1.5 transition-colors hover:bg-red-400'><Trash2 /></button>
                </div>
              </div>


            ))}


          </div>
        </div>
        <div className="">
          <h2 className='font-bold text-3xl flex items-center gap-2 mb-7 text-green-700 '>Friends<Users /></h2>

          <div className="grid grid-cols-1 gap-5">
            {user?.friends.map((friend, index) => (
              <div key={index} className=" border-2 p-3 max-w-[550px] flex justify-between w-full rounded-lg">
                <div className="flex  gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="p-2 border-[1px] max-w-[50px] border-black flex justify-center bg-green-200  w-full"><UserRound size={35} /></div>
                    <span className='font-medium text-green-700'>{friend}</span>
                  </div>
                </div>
                <div className="">
                  <button onClick={() => setRouteToChatSpecId(friend)} className='rounded-md border-[1px] p-1.5 transition-colors hover:bg-emerald-300'><MessageCircle /></button>
                </div>
              </div>


            ))}


          </div>
        </div>
      </div>
    </div>
  )
}

export default Page