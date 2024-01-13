import { Ads } from "@/app/(main)/_components/ads"
import { CarsList } from "@/app/(main)/_components/cars-list"
import Link from "next/link";

export default function Home() {
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
      <div className='px-16 pt-8 pb-16 bg-[#F6F7F9] dark:bg-[#181818]'>
        <div className='lg:flex lg:justify-center lg:gap-5'>
          <Ads
              title={cars.adsOne.title}
              description={cars.adsOne.description}
              bgImageUrl={cars.adsOne.bgImageUrl}
              carImageUrl={cars.adsOne.carImageUrl}
              btnBackground={cars.adsOne.btnBackground}
          />
          <div className='invisible lg:visible'>
            <Ads
                title={cars.adsTwo.title}
                description={cars.adsTwo.description}
                bgImageUrl={cars.adsTwo.bgImageUrl}
                carImageUrl={cars.adsTwo.carImageUrl}
                btnBackground={cars.adsTwo.btnBackground}
            />
          </div>
        </div>
        <div className='flex justify-between mt-[-100px] mb-5 md:mt-10'>
          <h3 className='text-[#90A3BF] font-semibold'>Popular Cars</h3>
          <Link href='/cars' className='text-[#3563E9] font-semibold'>
            View all
          </Link>
        </div>
        <CarsList/>
      </div>
  )
}
