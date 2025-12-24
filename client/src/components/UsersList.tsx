'use client'
import { User } from '@/redux/types';
import React, { useState } from 'react'
import { Button } from './ui/button';
import Link from 'next/link';
import { useAppSelector } from '@/hooks/reduxHooks';
interface UsersListProps {
    users: User[];
    isLoading: boolean;
}
const UsersList: React.FC<UsersListProps> = ({ users, isLoading }) => {
    const User = useAppSelector(state=>state.auth.user);
    return (
        <div className='absolute top-full left-0  w-[150px] bg-blue-50 rounded-sm mt-2 text-left flex flex-col gap-1 p-1 z-10'>
            {isLoading ? (
                <span>Loading....</span>
            ) : users.length > 0 ? (
                users.map((user) => (
                    <Button key={user.email} variant="outline">
                        <Link href={ user.email ==User?.email ?`/profile/`:`/userProfiles/${user.email}`} >{user.email}</Link>

                    </Button>
                ))
            ) : (
                <span>No users found</span>
            )}

        </div>
    )
}

export default UsersList