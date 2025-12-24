"use client"
import { useAppSelector } from '@/hooks/reduxHooks';
import axios from 'axios';
import { Plus, Search, UserRound, X } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const ChatsSidebar = () => {
    const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
    const { user } = useAppSelector(state => state.auth);
    const router =useRouter();

    const handleNewChat = async (email:string) => {
        try {
            const res1 = await axios.get(`http://localhost:4200/api/auth/getOtherUserId/${email}`);
            const res2 = await axios.post(`http://localhost:4200/api/chat/getChat`, { to: res1.data }, { withCredentials: true });
            const id = res2.data._id;
            router.push(`/chat/${id}`);
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <div className="basis-[350px] shrink-0 bg-white border-[1px] border-stone-600 rounded-[40px] px-3 py-5">
            {/* header */}
            <div className="border-b-[1px] border-black flex pb-2  gap-2  justify-end">

                {isSearchActive ? (<div className=" top-0 left-0 flex relative max-w-[225px] w-full ">
                    <input placeholder='Type in your contact...' className='border-[1px] w-full pr-10 border-stone-600 p-1  rounded-[10px] outline-0 ' type="text" />
                    <button onClick={() => setIsSearchActive(false)} className="border-[1px] absolute border-stone-600 p-1 rounded-[10px] right-0  transition-colors group hover:bg-stone-600"><X className='group-hover:text-white' /></button>
                </div>) : (<button onClick={() => setIsSearchActive(true)} className="border-[1px] border-stone-600 p-1 rounded-[10px] transition-colors group hover:bg-stone-600"><Search className='group-hover:text-white' /></button>
                )}
                <button className="border-[1px] border-stone-600 p-1 rounded-[10px] transition-colors group hover:bg-stone-600"><Plus className='group-hover:text-white' /></button>



            </div>
            <div className="flex flex-col gap-3 items-center mt-5">
                {user?.friends.map((friend, index) => (
                    <button onClick={()=>handleNewChat(friend)} key={index} className="border-stone-600 rounded-[20px] bg-slate-300 h-[80px] w-full  border-[1px] p-3 overflow-hidden flex gap-3">


                        <div className="p-2 border-[1px] max-w-[50px] border-black flex justify-center w-full "><UserRound size={35} /></div>
                        <div className="flex flex-col items-start">

                            <div className="">{friend}</div>
                            <div className="">Active/Inactive</div>
                        </div>

                    </button>
                ))}



            </div>
        </div>
    )
}

export default ChatsSidebar