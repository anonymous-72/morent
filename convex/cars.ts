import {mutation, query, QueryCtx} from "@/convex/_generated/server"
import { v } from 'convex/values'
import {Doc, Id} from "@/convex/_generated/dataModel";
import {UserJSON} from "@clerk/backend";

export const getSearch = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error('Not authenticated!')
        }

        const cars = await ctx.db
            .query('cars')
            .order('desc').collect()

        return cars
    }
})

export const getById = query({
    args: { carId: v.id('cars') },
    handler: async (ctx, args) => {
        const car = await ctx.db.get(args.carId)

        if (!car) {
            throw new Error('Car not found!')
        }

        const carType = await ctx.db.get(car.type)

        if (!carType) {
            throw new Error('Car type not found!')
        }

        const carCapacity = await ctx.db.get(car.capacity)

        if (!carCapacity) {
            throw new Error('Car capacity not found!')
        }

        const carPrice = await ctx.db.get(car.price)

        if (!carPrice) {
            throw new Error('Car price not found!')
        }

        return { car, carType, carCapacity, carPrice }
    }
})

export const getAll = query({
    handler: async (ctx) => {
        const cars = await ctx.db.query('cars').collect()

        if (!cars) {
            throw new Error('No cars yet!')
        }

        return cars
    }
})

export const getAllTypes = query({
    handler: async (ctx) => {
        const carTypes = await ctx.db.query('carTypes').collect()

        if (!carTypes) {
            throw new Error('No types found!')
        }

        return carTypes
    }
})

export const getAllCapacities = query({
    handler: async (ctx) => {
        const carCapacities = await ctx.db.query('carCapacities').collect()

        if (!carCapacities) {
            throw new Error('No car capacities found!')
        }

        return carCapacities
    }
})

export const getAllPrices = query({
    handler: async (ctx) => {
        const carPrices = await ctx.db.query('carPrices').collect()

        if (!carPrices) {
            throw new Error('No car capacities found!')
        }

        return carPrices
    }
})

export const addToFavorites = mutation({
    args: { carId: v.id('cars') },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error('Not authenticated!')
        }

        const userId = identity.subject

        const existingFavorite = await ctx.db
            .query('likedCars')
            .withIndex('by_user_and_car', (q) =>
                q.eq('userId', userId).eq('carId', args.carId)
            )
            .first()

        if (existingFavorite) {
            throw new Error('Car is already in favorites!')
        }

        await ctx.db.insert('likedCars', {
            userId,
            carId: args.carId,
            isLiked: true,
        })

        return { success: true }
    }
})

export const getFavorites = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            return []
        }

        const userId = identity.subject

        const likedCars = await ctx.db
            .query('likedCars')
            .withIndex('by_user', (q) =>
                q.eq('userId', userId)
            ).collect()

        const favoriteCars = await Promise.all(
            likedCars.map(async (likedCar) => {
                const car = await ctx.db.get(likedCar.carId)
                return {
                    ...car,
                    isLiked: true
                }
            })
        )

        return favoriteCars
    }
})

export const removeFromFavorites = mutation({
    args: { carId: v.id('cars') },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error('Not authenticated!')
        }

        const userId = identity.subject

        const existingFavorite = await ctx.db
            .query('likedCars')
            .withIndex('by_user_and_car', (q) =>
                q.eq('userId', userId).eq('carId', args.carId)
            )
            .first()

        if (!existingFavorite) {
            throw new Error('Car is not in favorites!')
        }

        await ctx.db.delete(existingFavorite._id)

        return { success: true }
    }
})

export const addReview = mutation({
    args: { carId: v.id('cars'), review: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error('Not authenticated!')
        }

        const userId = identity.subject

        await ctx.db.insert('reviews', {
            userId,
            carId: args.carId,
            review: args.review
        })

        const car = await ctx.db.get(args.carId)
        const currentReviews = car?.reviews || 0

        await ctx.db.patch(args.carId, {
            reviews: currentReviews + 1
        })

        return { success: true }
    }
})

export const getReviewsById  = query({
    args: { carId: v.id('cars') },
    handler: async (ctx, args) => {
        const reviews = await ctx.db
            .query('reviews')
            .withIndex('by_car', (q) =>
                q.eq('carId', args.carId)
            ).collect()

        return reviews
    }
})

export const getCities = query({
    handler: async (ctx) => {
        const cities = await ctx.db.query('availableCities').collect()

        if (!cities) {
            throw new Error('No cities available!')
        }

        return cities
    }
})

export const createRentalOrder = mutation({
    args: {
        carId: v.id('cars'),
        billingInfo: v.object({
            name: v.string(),
            phoneNumber: v.string(),
            address: v.string(),
            city: v.string()
        }),
        rentalInfo: v.object({
            pickUpLocation: v.id('availableCities'),
            pickUpDate: v.string(),
            pickUpTime: v.string(),
            dropOffLocation: v.id('availableCities'),
            dropOffDate: v.string(),
            dropOffTime: v.string(),
        }),
        paymentMethod: v.object({
            creditCard: v.optional(v.object({
                cardNumber: v.string(),
                expirationDate: v.string(),
                cardHolder: v.string(),
                cvc: v.string()
            })),
            paypal: v.optional(v.object({
                paypalNumber: v.string()
            })),
            bitcoin: v.optional(v.object({
                bitcoinNumber: v.string()
            }))
        })
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error('Not authenticated!')
        }

        const userId = identity.subject

        const rentalOrder = await ctx.db.insert('rentalOrders', {
            userId,
            carId: args.carId,
            billingInfo: args.billingInfo,
            rentalInfo: args.rentalInfo,
            paymentMethod: args.paymentMethod
        })

        return { rentalOrder }
    }
})

