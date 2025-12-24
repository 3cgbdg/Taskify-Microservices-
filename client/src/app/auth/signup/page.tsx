'use client'
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { signup } from "@/redux/authSlice";
import axios from "axios";
import { LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useAppDispatch();
  const handleSignup = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4200/api/auth/register",
        { email, password },
        { withCredentials: true }
      );
      const {user} = response.data;
      dispatch(signup(user));
      alert("Реєстрація успішна!");
      router.push("/");

    } catch (err: any) {
      console.error(err);
    }
  }

  return (
    <main className=" flex  _container h-full items-center min-h-screen justify-center ">
      <div className="p-4 rounded-md flex flex-col gap-8 border-gray-500 bg-white shadow-md  border   max-w-[500px] w-full">
        <h2 className="mb-3 uppercase font-bold text-xl">Create your account</h2>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label>Email</label>
            <input type="email" onChange={(e)=>setEmail(e.target.value)} className='border-gray-500 outline-none p-2 rounded-sm  shadow-md   border' placeholder="Type in your email..." />
          </div>
          <div className="flex flex-col gap-2">
            <label>Password</label>
            <input type="password" onChange={(e)=>setPassword(e.target.value)} className='border-gray-500 outline-none p-2 rounded-sm  shadow-md   border' placeholder="Type in your password..." />
          </div>

        </div>
        <div className="flex justify-between items-center"> 
          <Button onClick={handleSignup} className="flex gap-4 !hover:bg-green items-center" variant='outline'><LogIn /> <span>Sign up</span></Button>
          <Link href="login" className="text-sm underline hover:opacity-70 transition-opacity">Log in your account</Link>
        </div>

      </div>

    </main>
  );
}
