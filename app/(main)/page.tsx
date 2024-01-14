import { CarsList } from "@/app/(main)/_components/cars-list"
import { Ads } from "@/app/(main)/_components/ads"
import Link from "next/link"

export default function Home() {
  return (
      <div className='px-16 pt-8 pb-16 bg-[#F6F7F9] dark:bg-[#181818]'>
        <Ads />
        <div className='flex justify-between mt-[-100px] mb-5 md:mt-10'>
          <h3 className='text-[#90A3BF] font-semibold'>Popular Cars</h3>
          <Link href='/cars' className='text-[#3563E9] font-semibold hover:underline transition'>
            View all
          </Link>
        </div>
        <CarsList/>
      </div>
  )
}
