'use client'

import Link from "next/link"
import { useConvexAuth } from "convex/react"

export const CarsListHeader = () => {
    const { isLoading } = useConvexAuth()

    return (
        <>
            {!isLoading && (
                <div className='flex justify-between'>
                    <h3 className='text-[#90A3BF] font-semibold'>Popular Cars</h3>
                    <Link href='/cars' className='text-[#3563E9] font-semibold hover:underline transition'>
                        View all
                    </Link>
                </div>
            )}
        </>
    )
}