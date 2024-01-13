'use client'

import { Sidebar } from "@/app/(marketing)/_components/sidebar"
import { CarsList } from "@/app/(main)/_components/cars-list"

export default function Cars() {
    return (
        <div className='flex'>
            <Sidebar />
            <div className='w-full bg-[#F6F7F9] p-5 dark:bg-[#181818]'>
                <CarsList />
            </div>
        </div>
    )
}