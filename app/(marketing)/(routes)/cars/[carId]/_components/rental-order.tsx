'use client'

import { Input } from "@/components/ui/input"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import React, { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface RentalOrderProps {
    params: {
        carId: Id<'cars'>
    }
}

const FormSchema = z.object({
    name: z.string({
        required_error: 'Name is required.'
    }).min(2, {
        message: 'Name must be at least 2 characters.'
    }),
    phoneNumber: z.string({
        required_error: 'Phone number is required.',
        invalid_type_error: 'Phone number must contain only digits from 0 to 9.'
    }).min(9, {
        message: 'Phone number must contain 9 digits.'
    }).max(9, {
        message: 'Phone number must contain 9 digits.'
    }),
    address: z.string().min(5, {
        message: 'Address must be at least 5 characters.'
    }),
    city: z.string().min(3, {
        message: 'Town/City must be at least 3 characters.'
    }),
    pickUpLocation: z.string({
        required_error: 'Pick-Up Location is required.'
    }),
    pickUpDate: z.date({
        required_error: 'Pick-Up Date is required.'
    }),
    pickUpTime: z.string({
        required_error: 'Pick-Up Time is required.'
    }),
    dropOffLocation: z.string({
        required_error: 'Drop-Off Location is required.'
    }),
    dropOffDate: z.date({
        required_error: 'Drop-Off Date is required.'
    }),
    dropOffTime: z.string({
        required_error: 'Drop-Off Time is required.'
    }),
    creditCard: z.optional(z.object({
        cardNumber: z.string({
            required_error: 'Card Number is required.'
        }).min(19, {
            message: 'Card Number must be 16 characters.'
        }).max(19, {
            message: 'Card Number must be 16 characters.'
        }),
        expirationDate: z.string({
            required_error: 'Expiration Date is required.'
        }).min(5, {
            message: 'Expiration Date must consist of month and year.'
        }).max(5, {
            message: 'Expiration Date must consist of month and year.'
        }),
        cardHolder: z.string({
            required_error: 'Card Holder is required.'
        }).min(5, {
            message: 'Card Holder must be at least 5 characters.'
        }),
        cvc: z.string({
            required_error: 'CVC is required.'
        }).min(3, {
            message: 'CVC must contain 3 digits.'
        }).max(3, {
            message: 'CVC must contain 3 digits.'
        })
    }, {
        required_error: 'Fill out all the fields!'
    })),
    paypal: z.optional(z.object({
        paypalNumber: z.string({
            required_error: 'PayPal number is required.'
        }).min(16, {
            message: 'PayPal number must be 16 characters.'
        }).max(16, {
            message: 'PayPal number must be 16 characters.'
        })
    })),
    bitcoin: z.optional(z.object({
        bitcoinNumber: z.string({
            required_error: 'Bitcoin number is required.'
        })
    }))
})


export const RentalOrder = ({
    params
}: RentalOrderProps) => {
    const router = useRouter()
    const createRentalOrder = useMutation(api.cars.createRentalOrder)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    })

    const cities = useQuery(api.cars.getCities)

    const [name, setName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')

    const [pickUpLocation, setPickUpLocation] = useState<Id<'availableCities'>>()
    const [pickUpDate, setPickUpDate] = useState<Date>()
    const [pickUpTime, setPickUpTime] = useState('')
    const [dropOffLocation, setDropOffLocation] = useState<Id<'availableCities'>>()
    const [dropOffDate, setDropOffDate] = useState<Date>()
    const [dropOffTime, setDropOffTime] = useState('')

    const [cardNumber, setCardNumber] = useState('')
    const [expirationDate, setExpirationDate] = useState('')
    const [cardHolder, setCardHolder] = useState('')
    const [cvc, setCvc] = useState('')
    const [paypalNumber, setPaypalNumber] = useState('')
    const [bitcoinNumber, setBitcoinNumber] = useState('')

    if (!cities) {
        return null
    }

    const handleRentCar = async () => {
        try {
            if (pickUpLocation === undefined || dropOffLocation === undefined || pickUpDate === undefined || dropOffDate === undefined) {
                return
            }

            const billingInfo = {
                name,
                phoneNumber,
                address,
                city
            }

            const rentalInfo = {
                pickUpLocation,
                pickUpDate: pickUpDate.getDate() + '-' + (pickUpDate.getMonth() + 1) + '-' + pickUpDate.getFullYear(),
                pickUpTime,
                dropOffLocation,
                dropOffDate: dropOffDate.getDate() + '-' + (dropOffDate.getMonth() + 1) + '-' + dropOffDate.getFullYear(),
                dropOffTime
            }

            const paymentMethod = {
                creditCard: {
                    cardNumber: cardNumber.replace(/(\d{4})(?=\d)/g, '$1 '),
                    expirationDate: expirationDate.replace(/^(\d{2})/, '$1/'),
                    cardHolder,
                    cvc,
                },
                paypal: {
                    paypalNumber
                },
                bitcoin: {
                    bitcoinNumber
                }
            }

            await createRentalOrder({
                carId: params.carId,
                billingInfo: billingInfo,
                rentalInfo: rentalInfo,
                paymentMethod: paymentMethod
            })

            toast.success('Your rental request has been received!')
            router.refresh()
            router.push('/')
        } catch (error) {
            toast.error(`Error: ${error}`)
        }
    }

    const handleChangeLocation = (value: string, setLocation: (value: Id<'availableCities'>) => void) => {
        const id: Id<'availableCities'> = value as any as Id<'availableCities'>
        setLocation(id)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleRentCar)}
                className='flex flex-col gap-8'
            >
                <div className='bg-white p-6 rounded-xl dark:bg-[#1F1F1F]'>
                    <div className='flex justify-between mb-8'>
                        <div>
                            <h2 className='text-xl text-[#1A202C] font-bold dark:text-white'>Billing Info</h2>
                            <p className='text-[#90A3BF] text-sm font-medium'>Please enter your billing info</p>
                        </div>
                        <h5 className='flex items-end text-[#90A3BF] text-sm font-medium'>Step 1 of 4</h5>
                    </div>
                    <form
                        onSubmit={e => e.stopPropagation()}
                        className='grid grid-cols-1 md:grid-cols-2 gap-8'
                    >
                        <FormField
                            control={form.control}
                            name='name'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className='text-[#1A202C] font-semibold mb-4 text-base dark:text-[#F6F7F9]'>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Your name'
                                            className='bg-[#F6F7F9] font-medium placeholder:text-[#90A3BF] py-6 px-8 dark:bg-[#181818]'
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                setName(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='phoneNumber'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className='text-[#1A202C] font-semibold mb-4 text-base dark:text-[#F6F7F9]'>Phone
                                        Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Phone Number'
                                            className='bg-[#F6F7F9] font-medium placeholder:text-[#90A3BF] py-6 px-8 dark:bg-[#181818]'
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                setPhoneNumber(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='address'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel
                                        className='text-[#1A202C] font-semibold mb-4 text-base dark:text-[#F6F7F9]'>Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Address'
                                            className='bg-[#F6F7F9] font-medium placeholder:text-[#90A3BF] py-6 px-8 dark:bg-[#181818]'
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                setAddress(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='city'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel
                                        className='text-[#1A202C] font-semibold mb-4 text-base dark:text-[#F6F7F9]'>Town/City</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Town or city'
                                            className='bg-[#F6F7F9] font-medium placeholder:text-[#90A3BF] py-6 px-8 dark:bg-[#181818]'
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                setCity(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </form>
                </div>
                <div className='bg-white p-6 rounded-xl dark:bg-[#1F1F1F]'>
                    <div className='flex justify-between mb-8'>
                        <div>
                            <h2 className='text-xl text-[#1A202C] font-bold dark:text-white'>Rental Info</h2>
                            <p className='text-[#90A3BF] text-sm font-medium'>Please select your rental date</p>
                        </div>
                        <h5 className='flex items-end text-[#90A3BF] text-sm font-medium'>Step 2 of 4</h5>
                    </div>
                    <form
                        onSubmit={e => e.stopPropagation()}
                        className='flex flex-col gap-8'
                    >
                        <div>
                            <div className='flex gap-2 mb-6'>
                                <img src="/pickup-mark.svg" alt="Pick - Up"/>
                                <h3 className='text-[#1A202C] font-semibold dark:text-[#F6F7F9]'>Pick - Up</h3>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                <FormField
                                    control={form.control}
                                    name='pickUpLocation'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel
                                                className='text-[#1A202C] font-semibold mb-4 text-base dark:text-[#F6F7F9]'>Location</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(value) => {
                                                        field.onChange(value)
                                                        handleChangeLocation(value, setPickUpLocation)}
                                                    }
                                                >
                                                    <SelectTrigger id='pickup-locations' className='px-8 py-6 dark:bg-[#181818]'>
                                                        <SelectValue
                                                            className='bg-[#F6F7F9]'
                                                            placeholder='Select your city'
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent
                                                        position='popper'
                                                        className='dark:bg-[#181818]'
                                                        {...field}
                                                    >
                                                        <SelectGroup>
                                                            {cities.map((city) => (
                                                                <SelectItem
                                                                    key={city._id}
                                                                    value={city._id}
                                                                >
                                                                    {city.city}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='pickUpDate'
                                    render={({field}) => (
                                        <FormItem className='flex flex-col'>
                                            <FormLabel
                                                className='text-[#1A202C] font-semibold text-base dark:text-[#F6F7F9]'>Date</FormLabel>
                                            <FormControl>
                                                <Popover>
                                                    <PopoverTrigger className='w-full' asChild>
                                                        <Button
                                                            variant='outline'
                                                            className={cn(
                                                                'w-[280px] justify-start text-left font-medium px-8 py-6 rounded-xl bg-[#F6F7F9] text-[#90A3BF] border-none dark:bg-[#181818]',
                                                                !pickUpDate && 'text-muted-foreground'
                                                            )}
                                                        >
                                                            <CalendarIcon className='mr-2 h-4 w-4'/>
                                                            {pickUpDate ? format(pickUpDate, 'PPP') :
                                                                <span className='text-[#90A3BF] font-medium'>Select your date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className='dark:bg-[#181818]'>
                                                        <Calendar
                                                            mode='single'
                                                            selected={pickUpDate}
                                                            onSelect={(e) => {
                                                                field.onChange(e)
                                                                setPickUpDate(e)
                                                            }}
                                                            initialFocus
                                                            {...field}
                                                            className='dark:bg-[#181818]'
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='pickUpTime'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel
                                                className='text-[#1A202C] font-semibold mb-4 text-base dark:text-[#F6F7F9]'>Time</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='time'
                                                    className='px-8 py-3 bg-[#F6F7F9] rounded-xl text-[#90A3BF] w-full dark:bg-[#181818]'
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e)
                                                        setPickUpTime(e.target.value)
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div>
                            <div className='flex gap-2 mb-6'>
                                <img src="/dropoff-mark.svg" alt="Drop - Off"/>
                                <h3 className='text-[#1A202C] font-semibold dark:text-[#F6F7F9]'>Drop - Off</h3>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                <FormField
                                    control={form.control}
                                    name='dropOffLocation'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel
                                                className='text-[#1A202C] font-semibold mb-4 text-base dark:text-[#F6F7F9]'>Location</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(value) => {
                                                        field.onChange(value)
                                                        handleChangeLocation(value, setDropOffLocation)
                                                    }}>
                                                    <SelectTrigger id='dropoff-locations' className='px-8 py-6 dark:bg-[#181818]'>
                                                        <SelectValue className='bg-[#F6F7F9] dark:bg-[#181818]'
                                                                     placeholder='Select your city'/>
                                                    </SelectTrigger>
                                                    <SelectContent
                                                        position='popper'
                                                        {...field}
                                                        className='dark:bg-[#181818]'
                                                    >
                                                        {cities.map((city) => (
                                                            <SelectItem
                                                                key={city._id}
                                                                value={city._id}
                                                            >
                                                                {city.city}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='dropOffDate'
                                    render={({field}) => (
                                        <FormItem className='flex flex-col'>
                                            <FormLabel
                                                className='text-[#1A202C] font-semibold text-base dark:text-[#F6F7F9]'>Date</FormLabel>
                                            <FormControl>
                                                <Popover>
                                                    <PopoverTrigger className='w-full' asChild>
                                                        <Button
                                                            variant='outline'
                                                            className={cn(
                                                                'w-[280px] justify-start text-left font-medium px-8 py-6 rounded-xl bg-[#F6F7F9] text-[#90A3BF] border-none dark:bg-[#181818]',
                                                                !dropOffDate && 'text-muted-foreground'
                                                            )}
                                                        >
                                                            <CalendarIcon className='mr-2 h-4 w-4'/>
                                                            {dropOffDate ? format(dropOffDate, 'PPP') :
                                                                <span className='text-[#90A3BF] font-medium'>Select your date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className='dark:bg-[#181818]'>
                                                        <Calendar
                                                            mode='single'
                                                            selected={dropOffDate}
                                                            onSelect={(e) => {
                                                                field.onChange(e)
                                                                setDropOffDate(e)
                                                            }}
                                                            initialFocus
                                                            className='dark:bg-[#181818]'
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='dropOffTime'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel
                                                className='text-[#1A202C] font-semibold mb-4 text-base dark:text-[#F6F7F9]'>Time</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='time'
                                                    className='px-8 py-3 bg-[#F6F7F9] rounded-xl text-[#90A3BF] w-full dark:bg-[#181818]'
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e)
                                                        setDropOffTime(e.target.value)
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </form>
                </div>
                <div className='bg-white p-6 rounded-xl dark:bg-[#1F1F1F]'>
                    <div className='flex justify-between mb-8'>
                        <div>
                            <h2 className='text-xl text-[#1A202C] font-bold dark:text-white'>Payment Method</h2>
                            <p className='text-[#90A3BF] text-sm font-medium'>Please enter your payment method</p>
                        </div>
                        <h5 className='flex items-end text-[#90A3BF] text-sm font-medium'>Step 3 of 4</h5>
                    </div>
                    <form onSubmit={e => e.stopPropagation()}>
                        <Accordion type='single' collapsible className='w-full flex flex-col gap-6'>
                            <AccordionItem value='credit-card' className='border-none'>
                                <AccordionTrigger className='bg-[#F6F7F9] w-full rounded-xl rounded-b-none dark:bg-[#181818]'>
                                    <div className='flex items-center justify-between'>
                                        <h3 className='text-[#1A202C] font-semibold dark:text-white'>Credit Card</h3>
                                        <div className='flex items-center gap-1'>
                                            <img src="/visa.svg" alt="Visa"/>
                                            <img src="/mastercard.svg" alt="Mastercard"/>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent
                                    className='bg-[#F6F7F9] w-full rounded-xl rounded-t-none p-6 pt-4 grid grid-cols-1 md:grid-cols-2 gap-8 dark:bg-[#181818]'>
                                    <FormField
                                        control={form.control}
                                        name='creditCard.cardNumber'
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className='text-base text-[#1A202C] font-semibold mb-4 dark:text-[#F6F7F9]'>Card
                                                    Number</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='text'
                                                        placeholder='Card number'
                                                        className='bg-white font-medium placeholder:text-[#90A3BF] py-6 px-8 dark:bg-[#1F1F1F]'
                                                        {...field}
                                                        onChange={(e) => {
                                                            const input = e.target.value
                                                            const cleanedInput = input.replace(/\s/g, '')
                                                            const formattedCardNumber = cleanedInput.replace(/(\d{4})(?=\d)/g, '$1 ')
                                                            field.onChange(formattedCardNumber)
                                                            setCardNumber(formattedCardNumber)
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='creditCard.expirationDate'
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className='text-base text-[#1A202C] font-semibold mb-4 dark:text-[#F6F7F9]'>Expiration
                                                    Date</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='text'
                                                        placeholder='MM/YY'
                                                        className='bg-white font-medium placeholder:text-[#90A3BF] py-6 px-8 dark:bg-[#1F1F1F]'
                                                        {...field}
                                                        onChange={(e) => {
                                                            const input = e.target.value
                                                            const cleanedInput = input.replace(/\D/g, '')
                                                            const formattedExpirationDate = cleanedInput.replace(/^(\d{2})(\d{0,2})/, '$1/$2')
                                                            field.onChange(formattedExpirationDate)
                                                            setExpirationDate(formattedExpirationDate)
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='creditCard.cardHolder'
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className='text-base text-[#1A202C] font-semibold mb-4 dark:text-[#F6F7F9] dark:bg-[#1F1F1F]'>Card
                                                    Holder</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='text'
                                                        placeholder='Card holder'
                                                        className='bg-white font-medium placeholder:text-[#90A3BF] py-6 px-8 dark:bg-[#1F1F1F]'
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e)
                                                            setCardHolder(e.target.value)
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='creditCard.cvc'
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel
                                                    className='text-base text-[#1A202C] font-semibold mb-4 dark:text-[#F6F7F9]'>CVC</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='text'
                                                        placeholder='CVC'
                                                        className='bg-white font-medium placeholder:text-[#90A3BF] py-6 px-8 dark:bg-[#1F1F1F]'
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e)
                                                            setCvc(e.target.value)
                                                        }}                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value='paypal' className='border-none'>
                                <AccordionTrigger className='bg-[#F6F7F9] w-full rounded-xl rounded-b-none dark:bg-[#181818]'>
                                    <div className='flex items-center justify-between'>
                                        <h3 className='text-[#1A202C] font-semibold dark:text-white'>PayPal</h3>
                                        <img src="/paypal.svg" alt="Paypal"/>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent
                                    className='bg-[#F6F7F9] w-full rounded-xl rounded-t-none p-6 pt-4 dark:bg-[#181818]'>
                                    <FormField
                                        control={form.control}
                                        name='paypal.paypalNumber'
                                        render={({field}) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type='text'
                                                        placeholder='Enter your PayPal'
                                                        className='bg-white font-medium placeholder:text-[#90A3BF] py-6 px-8 dark:bg-[#1F1F1F]'
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e)
                                                            setPaypalNumber(e.target.value)
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value='bitcoin' className='border-none'>
                                <AccordionTrigger className='bg-[#F6F7F9] w-full rounded-xl rounded-b-none dark:bg-[#181818]'>
                                    <div className='flex items-center justify-between'>
                                        <h3 className='text-[#1A202C] font-semibold dark:text-white'>Bitcoin</h3>
                                        <img src='/bitcoin-dark.svg' alt="Bitcoin" className='hidden dark:block' />
                                        <img src='/bitcoin-light.svg' alt="Bitcoin" className='block dark:hidden' />
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent
                                    className='bg-[#F6F7F9] w-full rounded-xl rounded-t-none p-6 pt-4 dark:bg-[#181818]'>
                                    <FormField
                                        control={form.control}
                                        name='bitcoin.bitcoinNumber'
                                        render={({field}) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type='text'
                                                        placeholder='Enter your Bitcoin Wallet'
                                                        className='bg-white font-medium placeholder:text-[#90A3BF] py-6 px-8 dark:bg-[#1F1F1F]'
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e)
                                                            setBitcoinNumber(e.target.value)
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </form>
                </div>
                <div className='bg-white p-6 rounded-xl dark:bg-[#1F1F1F]'>
                    <div className='flex justify-between mb-8'>
                        <div>
                            <h2 className='text-xl text-[#1A202C] font-bold dark:text-white'>Confirmation</h2>
                            <p className='text-[#90A3BF] text-sm font-medium'>We are getting to the end. Just few clicks
                                and
                                your rental is ready!</p>
                        </div>
                        <h5 className='flex items-end text-[#90A3BF] text-sm font-medium'>Step 4 of 4</h5>
                    </div>
                    <div className='flex flex-col gap-8'>
                        <div className='flex flex-col gap-6'>
                            <div className='flex items-center gap-5 bg-[#F6F7F9] rounded-xl py-4 px-8 dark:bg-[#181818]'>
                                <Checkbox id='marketing'/>
                                <Label htmlFor='marketing' className='text-base text-[#1F2544] font-semibold dark:text-white'>
                                    I agree with sending an Marketing and newsletter emails. No spam, promised!
                                </Label>
                            </div>
                            <div className='flex items-center gap-5 bg-[#F6F7F9] rounded-xl py-4 px-8 dark:bg-[#181818]'>
                                <Checkbox id='terms'/>
                                <Label htmlFor='terms' className='text-base text-[#1F2544] font-semibold dark:text-white'>
                                    I agree with our terms and conditions and privacy policy.
                                </Label>
                            </div>
                        </div>
                    </div>
                    <div className='mt-8'>
                        <img src="/secured-light.svg" alt="Secured" className='mb-4 block dark:hidden'/>
                        <img src="/secured-dark.svg" alt="Secured" className='mb-4 hidden dark:block'/>
                        <h3 className='text-[#1A202C] font-semibold mb-2 dark:text-[#F6F7F9]'>All your data are safe</h3>
                        <p className='text-[#90A3BF] text-sm font-medium'>We are using the most advanced security to
                            provide
                            you the best experience ever.</p>
                    </div>
                    <div className='mt-8'>
                        <Button
                            type='submit'
                            size='lg'
                            className='bg-[#3563E9] text-white rounded-xl hover:bg-[#2b53ce]'
                        >
                            Rent Now
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}