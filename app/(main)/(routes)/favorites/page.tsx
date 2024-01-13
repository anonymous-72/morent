'use client'

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { CarItem } from "@/app/(main)/_components/car-item"

export default function Favorites() {
    const favoriteCarsData = useQuery(api.cars.getFavorites)
    const carTypes = useQuery(api.cars.getAllTypes)
    const carCapacities = useQuery(api.cars.getAllCapacities)
    const carPrices = useQuery(api.cars.getAllPrices)

    if (!favoriteCarsData) {
        return null
    }

    const favoriteCars = favoriteCarsData.map((favoriteCar) => {
        const carType = carTypes?.find((type) => type._id === favoriteCar.type)
        const typeName = carType ? carType.type : 'Unknown Type'

        const carCapacity = carCapacities?.find((capacity) => capacity._id === favoriteCar.capacity)
        const capacityNumber: number = Number(carCapacity?.capacity) || 0

        const carPrice = carPrices?.find((price) => price._id === favoriteCar.price)
        const priceNumber: number = Number(carPrice?.price) || 0

        return {
            ...favoriteCar,
            typeName,
            capacityNumber,
            priceNumber
        }
    })

    return (
        <div className='px-16 py-8 bg-[#F6F7F9] dark:bg-[#181818]'>
            <h1 className='mb-8 text-[32px] font-bold text-[#1A202C] dark:text-white'>Favorite Cars</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                {favoriteCars.map((car) => (
                    <CarItem
                        key={car._id}
                        id={car._id}
                        title={car.title ?? ''}
                        type={car.typeName}
                        imageUrl={car?.imageUrl ?? ''}
                        gasoline={car.gasoline ?? 0}
                        steering={car.steering ?? ''}
                        capacity={car.capacityNumber}
                        price={car.priceNumber}
                        isLiked={car.isLiked}
                    />
                ))}
            </div>
        </div>
    )
}