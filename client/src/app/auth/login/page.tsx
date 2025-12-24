'use client'
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { login } from "@/redux/authSlice";
import axios from "axios";
import { LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Page() {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [notFound, setNotFound] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4200/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      const { user } = response.data;
      dispatch(login(user));
      setNotFound(false);
      router.push("/");
    } catch (err: any) {
    
      setNotFound(true);
      console.error(err);
    }
  }


  return (
    <main className=" flex  _container h-full items-center min-h-screen justify-center ">
      <div className="p-4 rounded-md flex flex-col gap-8 border-gray-500 bg-white shadow-md  border   max-w-[500px] w-full">
        <h2 className="mb-3 uppercase font-bold text-xl">Log in your account</h2>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label>Email</label>
            <input type="email" onChange={(e) => setEmail(e.target.value)} className='border-gray-500 outline-none p-2 rounded-sm  shadow-md   border' placeholder="Type in your email..." />
          </div>
          <div className="flex flex-col gap-2">
            <label>Password</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} className='border-gray-500 outline-none p-2 rounded-sm  shadow-md   border' placeholder="Type in your password..." />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Button onClick={handleLogin} className="flex gap-4 !hover:bg-green items-center" variant='outline'><LogIn /> <span>Log in</span></Button>
          <Link href="signup" className="text-sm underline hover:opacity-70 transition-opacity">Create your account</Link>
        </div>
        {
          notFound ?( <div className="text-red-500 text-1xl">Check your password or email !</div>):""
        }
      </div>

    </main>
  );
}
