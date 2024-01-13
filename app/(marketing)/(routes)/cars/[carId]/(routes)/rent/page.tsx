'use client'

import { CarRentCard } from "@/app/(marketing)/(routes)/cars/[carId]/_components/car-rent-card"
import { Id } from "@/convex/_generated/dataModel"
import { RentalOrder } from "@/app/(marketing)/(routes)/cars/[carId]/_components/rental-order"

interface RentPageProps {
    params: {
        carId: Id<'cars'>
    }
}

export default function RentPage({
    params
}: RentPageProps) {
    return (
        <div className='bg-[#F6F7F9] p-5 grid grid-cols-1 md:grid-cols-2 gap-8 dark:bg-[#181818]'>
            <div className='order-2 md:order-1'>
                <RentalOrder params={{ carId: params.carId }} />
            </div>
            <div className='order-1 md:order-2'>
                <CarRentCard params={{ carId: params.carId }}/>
            </div>
        </div>
    )
}