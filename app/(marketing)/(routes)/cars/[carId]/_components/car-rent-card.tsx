'use client'

import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"

interface CarRentCard {
    params: {
        carId: Id<'cars'>
    }
}

export const CarRentCard = ({
    params
}: CarRentCard) => {
    const car = useQuery(api.cars.getById, {
        carId: params.carId
    })

    return (
        <div className='bg-white p-6 rounded-xl h-[500px] md:h-[560px] dark:bg-[#1F1F1F]'>
            <div className='mb-6'>
                <h2 className='text-xl text-[#1A202C] font-bold dark:text-white'>Rental Summary</h2>
                <p className='text-[#90A3BF] text-sm font-medium'>Prices may change depending on the length of the rental and the price of your rental car.</p>
            </div>
            <div className='flex gap-4'>
                <div className='relative'>
                    <Image
                        src='/layout-2.png'
                        alt='Layout'
                        width={188}
                        height={120}
                        className='rounded-lg'
                    />
                    <Image
                        src={`/${car?.car.imageUrl}`}
                        alt="Car"
                        width={116}
                        height={36}
                        className='absolute top-9 left-6'
                    />
                </div>
                <div>
                    <h1 className='text-[#1A202C] text-xl font-bold mb-[10px] md:text-[32px] dark:text-white'>{car?.car.title}</h1>
                    <div className='flex flex-col gap-2 md:flex-row'>
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
            <Separator className='bg-[#F6F7F9] my-8' />
            <div className='flex flex-col gap-6 mb-8'>
                <div className='flex justify-between'>
                    <h5 className='text-[#90A3BF] font-medium'>Subtotal</h5>
                    <h4 className='text-[#1A202C] font-semibold dark:text-white'>${car?.carPrice.price}.00</h4>
                </div>
                <div className='flex justify-between'>
                    <h5 className='text-[#90A3BF] font-medium'>Tax</h5>
                    <h4 className='text-[#1A202C] font-semibold dark:text-white'>$0.00</h4>
                </div>
            </div>
            <div className='flex justify-between items-center'>
                <div>
                    <h3 className='text-[#1A202C] text-base font-bold md:text-xl dark:text-white'>Total Rental Price</h3>
                    <p className='text-[#90A3BF] text-xs font-medium md:text-sm'>Overall price and includes rental discount</p>
                </div>
                <h2 className='text-[#1A202C] text-[32px] font-bold dark:text-white'>${car?.carPrice.price}.00</h2>
            </div>
        </div>
    )
}