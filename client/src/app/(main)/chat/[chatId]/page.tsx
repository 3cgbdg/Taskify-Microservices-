"use client"
import ChatsSidebar from '@/components/ChatsSidebar'
import { useAppSelector } from '@/hooks/reduxHooks'
import { socket } from '@/utils/socket'
import axios from 'axios'
import { Plus, Search, Send, UserRound } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
// interfaces

interface Message {
  sender: {
    email: string;
  };
  _id: string,
  content: string,
  createdAt: string,
}
interface Chat {
  participants: { email: string }[];
}
const page = () => {
  const { chatId } = useParams() as { chatId: string };
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<null | Message[]>(null);
  const { user } = useAppSelector(state => state.auth);
  const [inputInfo, setInputInfo] = useState<string>("");
  const [chat, setChat] = useState<null | Chat>(null);
  useEffect(() => {

    const handleMessages = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`http://localhost:4200/api/chat/getMessages/${chatId}`);
        const res2 = await axios.get(`http://localhost:4200/api/chat/getChatById/${chatId}`);
        setChat(res2.data);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }

    }
    handleMessages();

  }, []);


  useEffect(() => {
    console.log("Socket connected:", socket.connected);
    socket.emit("join", chatId);

    socket.on("newMessage", (msg: Message) => {
      setMessages(prev => prev ? [...prev, msg] : [msg]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [chatId]);


  const handleSend = () => {
    if (inputInfo.trim() === "") return;

    socket.emit("sendMessage", { chatId, content: inputInfo });
    setInputInfo("");
  };
  return (
    <div className='flex h-[700px] gap-10'>
      <ChatsSidebar />

      <div className="bg-white border-[1px] basis-full border-stone-600 rounded-[40px] p-10 flex flex-col justify-between">

        {/* header */}
        {/* reowwhe the one i loved the one who betrayed me */}

        <div className="border-b-[1px] pb-2 border-stone-600 flex items-center justify-between ">
          {/* status */}
          <div className="flex items-center gap-2">
            <div className="p-2 border-[1px] max-w-[40px] border-black flex justify-center w-full "><UserRound size={20} /></div>

            <span>
              {
                chat?.participants.find(p => p.email !== user?.email)?.email
              }
            </span>
          </div>
          <div><span className='text-green-500'>active</span>/<span className='text-red-500'>inactive</span></div>
        </div>

        <div className="pt-7 flex flex-col gap-4 overflow-y-auto flex-1">
          {(!user || !messages)
            ?
            (<div className="animate-spin rounded-full my-[100px] h-12 w-12 border-t-4 border-blue-500 border-solid mx-auto "></div>)

            : messages?.map((message) => (
              <div key={message._id} className={`flex flex-col p-3 border-black border-[1px] rounded-[20px] max-w-[350] ${message.sender.email == user?.email ? "place-self-start" : "place-self-end"} `}>

                <div className=" w-fit "><span className='break-all'>{message.content}</span></div>
                <div className="flex items-end justify-end">
                  <span className='text-xs'>{new Date(message.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))





          }




        </div>
        <div className="shadow-">
          <div className=" top-0 left-0 flex relative max-w-full w-full overflow-hidden ">
            <input value={inputInfo} onChange={(e) => setInputInfo(e.target.value)} placeholder='Type in your message...' className='border-[1px] w-full pr-16 border-stone-600 p-3  rounded-[10px] outline-0 ' type="text" />
            <button onClick={() => handleSend()} className="border-[1px] absolute border-stone-600 p-3 rounded-[10px] right-0  transition-colors group hover:bg-stone-600"><Send size={25} className='group-hover:text-white' /></button>
          </div>
        </div>
      </div>
    </div>
  )

}

export default page