'use client'

import Link from "next/link"
import { useConvexAuth } from "convex/react"
import { Spinner } from "@/components/spinner"
import { SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"
import { Heart, LogIn, User } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"


export const Navbar = () => {
    const { isAuthenticated, isLoading } = useConvexAuth()

    return (
        <nav className='w-full flex items-center justify-between gap-3 px-16 py-10 border-b border-[#C3D4E966] dark:bg-[#1F1F1F] dark:border-[#90A3BF]'>
            <div>
                <Link href='/'>
                    <img src="/logo.png" alt="Logo" />
                </Link>
            </div>
            <div>
                {isLoading && (
                    <Spinner size='md' />
                )}
            </div>
            <div>
                {isLoading && (
                    <Spinner size='md' />
                )}
                {!isAuthenticated && !isLoading && (
                    <>
                        <div className='flex gap-2 md:gap-5'>
                            <SignInButton mode='modal'>
                                <Button variant='outline' className='font-semibold bg-[#3563E9] text-white hover:bg-[#2b53ce] hover:text-white'>
                                    <span className='hidden md:block'>Sign In</span>
                                    <LogIn className='block h-6 w-6 md:hidden' />
                                </Button>
                            </SignInButton>
                            <SignUpButton mode='modal'>
                                <Button className='font-semibold bg-[#132a70] dark:text-white'>
                                    <span className='hidden md:block'>Create an account</span>
                                    <User className='block h-6 w-6 md:hidden' />
                                </Button>
                            </SignUpButton>
                        </div>
                    </>
                )}
                {isAuthenticated && !isLoading && (
                    <>
                        <div className='flex items-center gap-x-2 md:gap-x-5'>
                            <div>
                                <div className='flex gap-x-1 md:gap-x-4'>
                                    <Link href='/favorites'>
                                        <Button size='sm' variant='outline' className='rounded-full dark:bg-[#1F1F1F]'>
                                            <Heart className='h-3 w-3 md:h-4 md:w-4'/>
                                        </Button>
                                    </Link>
                                    <ModeToggle />
                                </div>
                            </div>
                            <UserButton afterSignOutUrl='/' />
                        </div>
                    </>
                )}
            </div>
        </nav>
    )
}