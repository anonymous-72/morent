'use client'

import { Sidebar } from "@/app/(marketing)/_components/sidebar"
import { CarData } from "@/app/(marketing)/(routes)/cars/[carId]/_components/car-data"
import { Id } from "@/convex/_generated/dataModel"

interface CarIdPageProps {
    params: {
        carId: Id<'cars'>
    }
}

export default function CarIdPage({
    params
}: CarIdPageProps) {
    return (
        <div className='flex'>
            <Sidebar />
            <CarData params={{ carId: params.carId }} />
        </div>
    )
}