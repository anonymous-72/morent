import { Button } from "@/components/ui/button"
import Link from "next/link"
import {cn} from "@/lib/utils";

interface AdsProps {
    title: string
    description: string
    bgImageUrl: string
    carImageUrl: string
    btnBackground: string
}

export const AdItem = ({
    title,
    description,
    bgImageUrl,
    carImageUrl,
    btnBackground
}: AdsProps) => {
    return (
        <div className='relative'>
            <img src={bgImageUrl} alt='AdItem Background' className='rounded-xl' />
            <div className='absolute top-4 left-4 z-10 md:top-6 md:left-6'>
                <h2 className='text-sm text-white leading-[36px] font-semibold mb-1 md:text-[32px] md:max-w-[284px] md:mb-4'>{title}</h2>
                <p className='text-xs max-w-[216px] font-medium text-white mb-3 md:text-base md:max-w-[284px] md:mb-5'>{description}</p>
                <Link href='/cars'>
                    <Button className={cn(
                        `${btnBackground} text-xs md:text-base text-white hover:bg-[#081742]`,
                        'text-xs' ? 'py-[14px] px-7' : 'py-[10px] px-5'
                        )}
                    >
                        Rental Car
                    </Button>
                </Link>
            </div>
            <div className='absolute bottom-[10px] left-48'>
                <img src={carImageUrl} alt='Car' />
            </div>
        </div>
    )
}