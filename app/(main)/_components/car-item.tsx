'use client'

import { Id } from "@/convex/_generated/dataModel"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { useConvexAuth, useMutation } from "convex/react"
import { toast } from "sonner"

interface CarItemProps {
    id?: Id<'cars'>
    title: string
    type: string
    imageUrl: string
    gasoline: number
    steering: string
    capacity: number
    price: number
    isLiked: boolean
}

export const CarItem = ({
    id,
    title,
    type,
    imageUrl,
    gasoline,
    steering,
    capacity,
    price,
    isLiked
}: CarItemProps) => {
    const { isAuthenticated } = useConvexAuth()
    const [liked, setLiked] = useState(isLiked || false)
    const addToFavorites = useMutation(api.cars.addToFavorites)
    const removeFromFavorites = useMutation(api.cars.removeFromFavorites)

    const handleLikeClick = () => {
        if (isAuthenticated) {
            if (id) {
                if (liked) {
                    removeFromFavorites({ carId: id })
                    toast.success('Car was removed from your favorites!')
                } else {
                    addToFavorites({ carId: id })
                    toast.success('Car was added to your favorites!')
                }
                setLiked(!liked)
            } else {
                console.error('Error')
            }
        } else {
            toast.error('Please, log in to your account!')
        }
    }

    return (
        <div className='bg-white p-6 rounded-[10px] flex flex-col justify-between gap-2 dark:bg-[#1F1F1F]'>
            <div className='flex justify-between'>
                <div>
                    <h2 className='font-bold text-xl text-[#1A202C] dark:text-white'>{title}</h2>
                    <p className='font-bold text-sm text-[#90A3BF]'>{type}</p>
                </div>
                <div role='button' onClick={handleLikeClick}>
                    {liked ? <img src="/liked.svg" alt="Liked"/> : <img src="/not-liked.svg" alt="Not liked"/>}
                </div>
            </div>
            <div className='flex justify-center'>
                <Image src={`/${imageUrl}`} alt="Car" width={400} height={100} />
            </div>
            <div className='flex justify-between text-[#90A3BF] text-xs md:text-sm font-medium'>
                <div className='flex items-center gap-[6px]'>
                    <img src="/gasoline.svg" alt="Gasoline"/>
                    <span>{gasoline}L</span>
                </div>
                <div className='flex items-center gap-[6px]'>
                    <img src="/steering.svg" alt="Steering"/>
                    <span>{steering}</span>
                </div>
                <div className='flex items-center gap-[6px]'>
                    <img src="/capacity.svg" alt="Capacity"/>
                    <span>{capacity} People</span>
                </div>
            </div>
            <div className='flex justify-between gap-2 items-center md:gap-0'>
                <div className='text-xl font-bold text-[#1A202C] dark:text-white'>
                    ${price}.00/
                    <span className='ml-1 text-sm text-[#90A3BF]'>day</span>
                </div>
                <Link href={`/cars/${id}`}>
                    <Button size='sm' className='bg-[#3563E9] text-white hover:bg-[#081742]'>See Details</Button>
                </Link>
            </div>
        </div>
    )
}

CarItem.Skeleton = function CarItemSkeleton() {
    return (
        <Skeleton className='h-4 w-4' />
    )
}