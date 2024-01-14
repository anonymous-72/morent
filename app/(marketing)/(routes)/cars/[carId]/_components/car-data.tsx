'use client'

import { Spinner } from "@/components/spinner"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useConvexAuth, useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { toast } from "sonner"
import { Id } from "@/convex/_generated/dataModel"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface CarDataProps {
    params: {
        carId: Id<'cars'>
    }
}

export const CarData = ({
    params
}: CarDataProps) => {
    const { isAuthenticated, isLoading } = useConvexAuth()
    const currentPathname = usePathname()
    const car = useQuery(api.cars.getById, {
        carId: params.carId
    })
    const [review, setReview] = useState('')
    const [isReviewVisible, setIsReviewVisible] = useState(false)
    const addReview = useMutation(api.cars.addReview)
    const reviews = useQuery(api.cars.getReviewsById, {
        carId: params.carId
    })
    const { user } = useUser()

    if (car === null) {
        return <div>Not found</div>
    }

    const onClick = () => {
        if (!isAuthenticated) {
            toast.error('Please, log in to your account!')
        }
    }

    const onReviewChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReview(event.target.value)
    }

    const onReviewSubmit = async () => {
        if (!review.trim()) {
            toast.error('Review cannot be empty!')
            return
        }

        try {
            await addReview({ carId: params.carId, review })
            toast.success('Review added successfully!')
            setReview('');
            setIsReviewVisible(false)
        } catch (error) {
            console.error('Error adding comment:', error)
            toast.error('Failed to add review. Please try again.')
        }
    }

    const openReviewSection = () => {
        setReview('')
        setIsReviewVisible(true)
    }

    const closeReviewSection = () => {
        setReview('')
        setIsReviewVisible(false)
    }

    return (
        <div className='w-full bg-[#F6F7F9] p-8 dark:bg-[#181818]'>
            {isLoading ? (
                <div className='flex justify-center items-center'>
                    <Spinner size='lg'/>
                </div>
            ) : (
                <div className='flex flex-col gap-8'>
                    <div className='flex flex-col justify-center gap-8 md:flex-row'>
                        <div>
                            <div className='relative select-none mb-6'>
                                <img src="/layout-2.png" alt="Car" className='rounded-xl'/>
                                <div className='absolute top-6 left-6 z-10'>
                                    <h2 className='text-[32px] text-white font-semibold'>{car?.car.title}</h2>
                                    <p className='capitalize text-white font-medium'>Rent right now!</p>
                                </div>
                                <img
                                    src={`/${car?.car.imageUrl}`}
                                    alt="Car Image"
                                    className={cn('absolute bottom-6 left-6',
                                        car?.car.imageUrl === 'all-new-rush.png' ? 'md:w-[340px] md:h-[150px]'
                                            : car?.car.imageUrl === 'rolls-royce.png' ? 'md:w-[380px] md:h-[130px]'
                                                : car?.car.imageUrl === 'cr-v.png' ? 'md:w-[380px] md:h-[160px]'
                                                    : car?.car.imageUrl === 'all-new-terios.png' ? 'md:w-[380px] md:h-[160px]'
                                                        : car?.car.imageUrl === 'mg-zx-exclusive.png' ? 'md:w-[380px] md:h-[160px]'
                                                            : car?.car.imageUrl === 'new-mg-zs.png' ? 'md:w-[380px] md:h-[160px]' : '')}
                                />
                            </div>
                            {!car?.car.interiorImageUrlOne && !car?.car.interiorImageUrlTwo ? (
                                <div className='text-[#3563E9] font-semibold uppercase text-sm'>No pictures yet</div>
                            ) : (
                                <div className='flex gap-6'>
                                    <Image src={`/${car?.car.interiorImageUrlOne}`} alt="Interior" width={148}
                                           height={124}
                                           className='rounded-lg'/>
                                    <Image src={`/${car?.car.interiorImageUrlTwo}`} alt="Interior" width={148}
                                           height={124}
                                           className='rounded-lg'/>
                                </div>
                            )}
                        </div>
                        <div className='flex flex-col justify-between bg-white max-w-[640px] p-6 rounded-xl dark:bg-[#1F1F1F]'>
                            <div>
                                <div className='flex justify-between mb-4 md:mb-[34px]'>
                                    <div>
                                        <h1 className='text-[#1A202C] text-xl font-bold md:text-[32px] dark:text-white'>{car?.car.title}</h1>
                                        <div className='flex gap-2 mt-2'>
                                            {car?.car.stars !== undefined && (
                                                <div className='flex gap-1'>
                                                    {[...Array(5)].map((_, index: number) => (
                                                        <img
                                                            key={index}
                                                            src={index < car?.car.stars! ? '/star-filled.svg' : '/star-unfilled.svg'}
                                                            alt="Star"
                                                            width={index < 4 ? undefined : 18}
                                                            className='w-3 md:w-5'
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            {car?.car.reviews === 1 ? (
                                                <span className='text-[#596780] text-xs font-medium md:text-sm'>
                                                    {car?.car.reviews} Review
                                                </span>
                                            ) : (
                                                <span className='text-[#596780] text-xs font-medium md:text-sm'>
                                                    {car?.car.reviews} Reviews
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className='text-[#596780] text-xs leading-6 mb-5 max-w-[444px] md:text-xl md:leading-10 dark:text-[#F6F7F9]'>{car?.car.description}</p>
                                    <div className='flex justify-between gap-4'>
                                        <div className='flex flex-col gap-4'>
                                            <div className='flex gap-4'>
                                                <span className='text-[#90A3BF] text-xs md:text-sm lg:text-xl'>Type Car</span>
                                                <h3 className='text-[#596780] text-xs font-semibold md:text-sm lg:text-xl'>{car?.carType.type}</h3>
                                            </div>
                                            <div className='flex gap-4'>
                                                <span className='text-[#90A3BF] text-xs md:text-sm lg:text-xl'>Steering</span>
                                                <h3 className='text-[#596780] text-xs font-semibold md:text-sm lg:text-xl'>{car?.car.steering}</h3>
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-4'>
                                            <div className='flex gap-4'>
                                                <span className='text-[#90A3BF] text-xs md:text-sm lg:text-xl'>Capacity</span>
                                                <div className='flex items-center gap-2 text-[#596780] text-xs font-semibold md:text-sm lg:text-xl'>
                                                    {car?.carCapacity.capacity}
                                                    <img src="/capacity.svg" alt="Capacity"/>
                                                </div>
                                            </div>
                                            <div className='flex gap-4'>
                                                <span className='text-[#90A3BF] text-xs md:text-sm lg:text-xl'>Gasoline</span>
                                                <h3 className='text-[#596780] text-xs font-semibold md:text-sm lg:text-xl'>{car?.car.gasoline}L</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-between items-center mt-5 md:mt-0'>
                                <div className='text-[#1A202C] text-[28px] font-bold dark:text-white'>
                                    ${car?.carPrice.price}.00/ <span className='text-base text-[#90A3BF]'>days</span>
                                </div>
                                <Link href={
                                    isAuthenticated
                                        ? `${params.carId}/rent`
                                        : `${currentPathname}`
                                }>
                                    <Button size='lg' className='bg-[#3563E9] dark:text-white hover:bg-[#081742]' onClick={onClick}>
                                        Rent Now
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='bg-white p-6 rounded-xl dark:bg-[#1F1F1F]'>
                        <div className='text-xl text-[#1A202C] font-semibold mb-8 flex items-center gap-3 dark:text-white'>
                            Reviews
                            <span className='text-white bg-[#3563E9] py-[6px] px-3 rounded-sm text-sm'>{car?.car.reviews}</span>
                        </div>
                        <div>
                            {!car?.car.reviews ? (
                                <h2 className='flex justify-center text-[#3563E9] text-3xl font-semibold mb-4'>
                                    No reviews still :(
                                </h2>
                            ) : (
                                <div className='flex flex-col gap-6 mb-10'>
                                    {reviews?.map((review) => {
                                        return (
                                            <div key={review?._id}>
                                                <div className='flex items-center justify-between'>
                                                    <div className='flex items-center gap-4'>
                                                        <img src={user?.imageUrl} alt="Avatar"
                                                             className='rounded-full w-[44px] h-[44px] md:w-[65px] md:h-[65px]'/>
                                                        <h4 className='text-[#1A202C] text-sm font-bold md:text-2xl dark:text-white'>
                                                            {user?.fullName}
                                                        </h4>
                                                    </div>
                                                    <div className='text-[#90A3BF] text-xs font-medium md:text-sm'>
                                                        {format(review?._creationTime, 'PPP')}
                                                    </div>
                                                </div>
                                                <div
                                                    className='px-16 text-[#596780] text-xs md:text-sm md:px-20 dark:text-[#F6F7F9]'>{review?.review}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                        <div>
                            {!isReviewVisible ? (
                                <div className='flex justify-end'>
                                    <Button
                                        className='bg-[#3563E9] dark:text-white hover:bg-[#081742]'
                                        onClick={openReviewSection}
                                    >
                                        Add Review
                                    </Button>
                                </div>
                            ) : (
                                <>
                                        <textarea
                                            value={review}
                                            onChange={onReviewChange}
                                            placeholder='Write your review here...'
                                            className='resize-none focus:outline-none flex justify-center w-full mb-4 border rounded-xl p-6'
                                        />
                                    <div className='flex justify-end'>
                                        <div className='flex gap-2'>
                                            <Button
                                                variant='destructive'
                                                onClick={closeReviewSection}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant='secondary'
                                                className='bg-[#3563E9] text-white hover:bg-[#274bb3]'
                                                onClick={onReviewSubmit}
                                            >
                                                Submit Review
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}