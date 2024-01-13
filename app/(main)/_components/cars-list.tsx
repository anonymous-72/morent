'use client'

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { CarItem } from "@/app/(main)/_components/car-item"
import { cn } from "@/lib/utils"

export const CarsList = () => {
    const carsData = useQuery(api.cars.getAll)
    const carTypes = useQuery(api.cars.getAllTypes)
    const carCapacities = useQuery(api.cars.getAllCapacities)
    const carPrices = useQuery(api.cars.getAllPrices)
    const favoriteCarsData = useQuery(api.cars.getFavorites)

    if (!carsData || !carTypes || !favoriteCarsData) {
        return null
    }

    const favoriteCarsIds = favoriteCarsData.map((car) => car._id)

    const cars = carsData.map((car) => {
        const carType = carTypes.find((type) => type._id === car.type)
        const typeName = carType ? carType.type : 'Unknown Type'

        const carCapacity = carCapacities?.find((capacity) => capacity._id === car.capacity)
        const capacityNumber: number = Number(carCapacity?.capacity) || 0

        const carPrice = carPrices?.find((price) => price._id === car.price)
        const priceNumber: number = Number(carPrice?.price) || 0

        const isLiked = favoriteCarsIds.includes(car._id)

        return {
            ...car,
            typeName,
            capacityNumber,
            priceNumber,
            isLiked
        }
    })

    return (
        <div>
            <div className={cn(
                'grid grid-cols-1 md:grid-cols-2 gap-5',
                window.location.pathname.includes('cars') ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
                )}
            >
                {cars?.map((car) => (
                    <CarItem
                        key={car._id}
                        id={car._id}
                        title={car.title}
                        type={car.typeName}
                        imageUrl={car.imageUrl}
                        gasoline={car.gasoline}
                        steering={car.steering}
                        capacity={car.capacityNumber}
                        price={car.priceNumber}
                        isLiked={car.isLiked}
                    />
                ))}
            </div>
        </div>
    )
}