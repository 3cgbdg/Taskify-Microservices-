"use client"

import { User } from '@/redux/types';
import axios from 'axios'
import { Trophy } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleGetUsers = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get<User[]>("http://localhost:4200/api/auth/getUsers");
        const sorted = res.data.sort((a, b) => (b.taskComleted ?? 0) - (a.taskComleted ?? 0));
        setUsers(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    handleGetUsers();
  }, [])

  return (
    <div className='_container'>
      <div className="flex flex-col items-center w-full gap-4">

        
        {isLoading && (
          <div className="animate-spin h-12 w-12 border-t-4 border-blue-500 rounded-full"></div>
        )}
 
      
        {!isLoading && users.length > 0 && (
          <>
            {/* Топ-1 */}
            <div className="w-full max-w-[850px] font-bold rounded-[5px] flex justify-between px-4 items-center py-2 border-[2px] border-amber-300">
              <div className="flex gap-3">
                <span className="text-xl text-amber-300">
                  {users[0].email}
                </span>
                <Trophy className="-ml-2 fill-amber-300" />
                <div className="text-sm">{users[0].rank}</div>
              </div>
              <div>
                TASKS COMPLETED: {users[0].taskComleted ?? 0}
              </div>
            </div>

            {/* Топ-2 */}
            {users[1] && (
              <div className="w-full max-w-[850px] font-bold rounded-[5px] flex justify-between px-4 items-center py-2 border-[2px] border-gray-500">
                <div className="flex gap-3">
                  <span className="text-xl">{users[1].email}</span>
                  <div className="text-sm">{users[1].rank}</div>
                </div>
                <div>
                  TASKS COMPLETED: {users[1].taskComleted ?? 0}
                </div>
              </div>
            )}

            {/* Топ-3 */}
            {users[2] && (
              <div className="w-full max-w-[850px] font-bold rounded-[5px] flex justify-between px-4 items-center py-2 border-[2px] border-violet-300 ">
                <div className="flex gap-3">
                  <span className="text-xl">{users[2].email}</span>
                  <div className="text-sm">{users[2].rank}</div>
                </div>
                <div>
                  TASKS COMPLETED: {users[2].taskComleted ?? 0}
                </div>
              </div>
            )}

            {/* Решта */}
            {users.slice(3).map((u, idx) => (
              <div
                key={idx}
                className="w-full max-w-[850px] font-bold rounded-[5px] flex justify-between px-4 items-center py-2 border-[2px] border-violet-300"
              >
                <div className="flex gap-3">
                  <span className="text-xl">{u.email}</span>
                  <div className="text-sm">{u.rank}</div>
                </div>
                <div>
                  TASKS COMPLETED: {u.taskComleted ?? 0}
                </div>
              </div>
            ))}
          </>
        )}

        {/* 3) Якщо не завантажуємося, але юзерів немає */}
        {!isLoading && users.length === 0 && (
          <div className="text-gray-500">No users found.</div>
        )}

      </div>
    </div>
  )
}

export default Page
