'use client'

import { AdItem } from "@/app/(main)/_components/ad-item"
import {useConvexAuth} from "convex/react";
import {Spinner} from "@/components/spinner";

export const Ads = () => {
    const { isLoading } = useConvexAuth()

    const cars = {
        adsOne: {
            title: 'The Best Platform for Car Rental',
            description: 'Ease of doing a car rental safely and reliably. Of course at a low price.',
            bgImageUrl: '/layout-1.png',
            carImageUrl: '/koenigsegg.png',
            btnBackground: 'bg-[#3563E9]'
        },
        adsTwo: {
            title: 'Easy way to rent a car at a low price',
            description: 'Providing cheap car rental services and safe and comfortable facilities.',
            bgImageUrl: '/layout-2.png',
            carImageUrl: '/nissan-gt-r.png',
            btnBackground: 'bg-[#54A6FF]'
        }
    }

    return (
        <div className='lg:flex lg:justify-center lg:gap-5'>
            {isLoading ? (
                <Spinner size='md' />
            ) : (
                <>
                    <AdItem
                        title={cars.adsOne.title}
                        description={cars.adsOne.description}
                        bgImageUrl={cars.adsOne.bgImageUrl}
                        carImageUrl={cars.adsOne.carImageUrl}
                        btnBackground={cars.adsOne.btnBackground}
                    />
                    <div className='hidden lg:block'>
                        <AdItem
                            title={cars.adsTwo.title}
                            description={cars.adsTwo.description}
                            bgImageUrl={cars.adsTwo.bgImageUrl}
                            carImageUrl={cars.adsTwo.carImageUrl}
                            btnBackground={cars.adsTwo.btnBackground}
                        />
                    </div>
                </>
            )}
        </div>
    )
}