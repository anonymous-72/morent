'use client'

import { Checkbox } from "@/components/ui/checkbox"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

export const Sidebar = () => {
    const carTypes = useQuery(api.cars.getAllTypes)
    const carCapacities = useQuery(api.cars.getAllCapacities)
    const [price, setPrice] = useState(80)

    if (!carTypes) {
        return null
    }

    if (!carCapacities) {
        return null
    }

    return (
        <aside className='hidden w-1/4 p-5 lg:block dark:bg-[#1F1F1F]'>
            <div className='mb-14'>
                <h5 className='uppercase text-xs font-semibold text-[#90A3BF] mb-7'>Type</h5>
                <div className='flex flex-col gap-5'>
                    {carTypes.map((carType) => (
                        <div key={carType._id} className='flex items-center gap-2'>
                            <Checkbox id={carType._id} />
                            <Label
                                htmlFor={carType._id}
                                className='text-[#596780] text-xl font-semibold cursor-pointer'
                            >
                                {carType.type}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
            <div className='mb-14'>
                <h5 className='uppercase text-xs font-semibold text-[#90A3BF] mb-7'>Capacity</h5>
                <div className='flex flex-col gap-5'>
                    {carCapacities.map((carCapacity) => (
                        <div key={carCapacity._id} className='flex items-center gap-2'>
                            <Checkbox id={carCapacity._id}/>
                            <Label
                                htmlFor={carCapacity._id}
                                className='text-[#596780] text-xl font-semibold cursor-pointer'
                            >
                                {carCapacity.capacity} People
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
            <div className='mb-14'>
                <h5 className='uppercase text-xs font-semibold text-[#90A3BF] mb-8'>Price</h5>
                <Slider
                    defaultValue={[price]}
                    min={50}
                    max={120}
                    step={1}
                />
            </div>
        </aside>
    )
}