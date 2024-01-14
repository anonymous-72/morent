import { Ads } from "@/app/(main)/_components/ads"
import { CarsListHeader } from "@/app/(main)/_components/cars-list-header"
import { CarsList } from "@/app/(main)/_components/cars-list"

export default function Home() {
  return (
      <div className='px-16 pt-8 pb-16 bg-[#F6F7F9] dark:bg-[#181818] flex flex-col gap-8'>
          <Ads />
          <CarsListHeader />
          <CarsList/>
      </div>
  )
}
