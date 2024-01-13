'use client'

import { useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useEffect, useState } from "react"
import {useSearch} from "@/hooks/use-search";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"

export const SearchCommand = () => {
    const router = useRouter()
    const cars = useQuery(api.cars.getSearch)
    const [isMounted, setIsMounted] = useState(false)

    const isOpen = useSearch((store) => store.isOpen)
    const onClose = useSearch((store) => store.onClose)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    const onSelect = (id: string) => {
        router.push(`/cars/${id}`)
        onClose()
    }

    return (
        <CommandDialog open={isOpen} onOpenChange={onClose}>
            <CommandInput
                placeholder='Search car here'
            />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading='Cars'>
                    {cars?.map((car: any) => (
                        <CommandItem
                            key={car._id}
                            value={`${car._id}-${car.title}`}
                            onSelect={onSelect}
                        />
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}