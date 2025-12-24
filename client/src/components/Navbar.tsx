'use client';

import Link from 'next/link'
// importing shadcn`s
// dropdown menu
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
//  menu nav
import { Button } from "@/components/ui/button"

import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { logout, updateFriendRequestList } from '@/redux/authSlice';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Check, Cross, Search, X } from 'lucide-react';
import { useState } from 'react';
import UsersList from './UsersList';
import { User } from '@/redux/types';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const router = useRouter();
  const [active, setActive] = useState<boolean>(false);
  const isAuth = useAppSelector(state => state.auth.isAuthenticated);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [handleFriend, setHandleFriend] = useState<number | null>(null);
  const handleLogOut = async () => {
    try {
      axios.post("http://localhost:4200/api/auth/logout", {}, { withCredentials: true });
      dispatch(logout());

    } catch (err) {
      console.log(err);
    }
  }
  const handleSearch = async (e: string) => {
    const value = e.trim();
    if (value === "" || value.length < 2) {
      setUsers([]);
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.post("http://localhost:4200/api/auth/searchEmails", { chars: e });
      if (!res) return;
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAcceptFriend = async (fromUser: string) => {
    try {
      const res = await axios.post("http://localhost:4200/api/auth/acceptFriendRequest", { from: fromUser, to: user?.email });
      dispatch(updateFriendRequestList(fromUser));

    } catch (err) {
      console.log(err);
    }
  }
  const handleCancelFriend = async (fromUser: string) => {
    try {
      const res = await axios.post("http://localhost:4200/api/auth/cancelFriendRequest", { from: fromUser, to: user?.email });
      dispatch(updateFriendRequestList(fromUser));
    } catch (err) {
      console.log(err);
    }
  }
  return (<header className=' w-full height-[90px] left-0 top-0  py-3  mb-10'>
    <div className=" flex justify-between items-center">
      <Link className='transition-all hover:rotate-45   ' href="/">
        <Image className='rounded-full overflow-hidden group-hover:' src="/logo.ico" alt='logo' width={80} height={80}></Image>
      </Link>

      <div className="flex gap-6 items-center">
        <div className="">
          {
            !active ? (
              <Button className='' onClick={() => { setActive(!active) }} variant="outline">
                <Search />Find user
              </Button>
            ) : (
              <div className='relative items-center flex gap-2'>
                <input onChange={(e) => handleSearch(e.target.value)} className='outline-0 p-1.5 rounded-md' placeholder='Please type by email...' type="text" />
                <Button className='hover:bg-red-500' onClick={() => { setActive(!active); setUsers([]) }} variant="outline">
                  <X />
                </Button>
                <UsersList isLoading={isLoading} users={users} />

              </div>
            )
          }
        </div>
        <Link href="/newtask"><Button variant="outline">Create Task</Button></Link>
      </div>


      <div className=" flex items-center gap-10  justify-between">
        {isAuth ? <Button onClick={() => {
          handleLogOut();
          router.push("/auth/login");

        }} variant="outline">Log out</Button> : <Button variant="outline"><Link href="/auth/login">Login</Link></Button>}
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            
            <Button variant="outline" className={`${user?.friendRequests.length == 0 ? "pointer-events-none" : ""}`}>Friends request ({user?.friendRequests.length})</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Requests </DropdownMenuLabel>
            <DropdownMenuSeparator />
            { }
            {user?.friendRequests.map((req, index) => {
              return (
                <DropdownMenuItem className=''
                  key={index}
                  onMouseEnter={() => setHandleFriend(index)}
                  onMouseLeave={() => setHandleFriend(null)}
                >
                  {handleFriend === index ? (
                    <div className='flex justify-center gap-2 w-full items-center'>
                      <button onClick={() => handleAcceptFriend(req)} className="border-[1px] p-1 hover:bg-green-500 transition-colors" ><Check /></button>
                      <button onClick={() => handleCancelFriend(req)} className="border-[1px] p-1 hover:bg-red-500 transition-colors" ><X /></button>
                    </div>
                  ) : (
                    <span>{req}</span>
                  )}
                </DropdownMenuItem>
              );
            })}




          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account  {user?.email ? `${user?.email}` : ""} </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/dashboard">Dashboard</Link>
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>


      </div>


    </div>
  </header>
  )
};

export default Navbar;