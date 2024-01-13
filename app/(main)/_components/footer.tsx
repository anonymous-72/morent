import Link from "next/link";
import {Separator} from "@/components/ui/separator";

export const Footer = () => {
    return (
        <footer className='px-16 py-20 dark:bg-[#1F1F1F]'>
            <div className='flex justify-between mb-9 flex-wrap'>
                <div className='mb-12 md:flex md:flex-col'>
                    <Link href='/'>
                        <img src="/logo.png" alt="Logo" />
                    </Link>
                    <p className='font-medium text-[#13131399] max-w-[292px] mt-4 dark:text-white'>Our vision is to provide convenience and help increase your sales business.</p>
                </div>
                <div className='flex gap-[60px] flex-wrap'>
                    <div>
                        <h3 className='mb-6 text-[#1A202C] text-xl font-semibold dark:text-[#90A3BF]'>About</h3>
                        <ul className='flex flex-col gap-5 text-[#13131399] font-medium dark:text-white'>
                            <li>How it works</li>
                            <li>Featured</li>
                            <li>Partnership</li>
                            <li>Business Relation</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className='mb-6 text-[#1A202C] text-xl font-semibold dark:text-[#90A3BF]'>Community</h3>
                        <ul className='flex flex-col gap-5 text-[#13131399] font-medium dark:text-white'>
                            <li>Events</li>
                            <li>Blog</li>
                            <li>Podcast</li>
                            <li>Invite a friend</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className='mb-6 text-[#1A202C] text-xl font-semibold dark:text-[#90A3BF]'>Socials</h3>
                        <ul className='flex flex-col gap-5 text-[#13131399] font-medium dark:text-white'>
                            <li>Discord</li>
                            <li>Instagram</li>
                            <li>Twitter</li>
                            <li>Facebook</li>
                        </ul>
                    </div>
                </div>
            </div>
            <Separator className='dark:bg-[#90A3BF]' />
            <div className='mt-9 flex flex-col gap-5 md:flex-row md:justify-between'>
                <h5 className='font-bold text-[#1A202C] dark:text-[#90A3BF]'>©2024 MORENT. All rights reserved</h5>
                <div className='flex gap-[60px]'>
                    <Link href='/' className='font-bold text-[#1A202C] hover:text-[#13131399] transition dark:text-[#90A3BF] dark:hover:text-[#F6F7F9]'>Privacy & Policy</Link>
                    <Link href='/' className='font-bold text-[#1A202C] hover:text-[#13131399] transition dark:text-[#90A3BF] dark:hover:text-[#F6F7F9]'>Terms & Condition</Link>
                </div>
            </div>
        </footer>
    )
}