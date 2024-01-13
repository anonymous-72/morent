import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    carTypes: defineTable({
        type: v.string()
    }),
    carCapacities: defineTable({
       capacity: v.union(v.number(), v.string())
    }),
    carPrices: defineTable({
       price: v.union(v.number(), v.string())
    }),
    cars: defineTable({
        title: v.string(),
        type: v.id('carTypes'),
        imageUrl: v.string(),
        description: v.string(),
        interiorImageUrlOne: v.optional(v.string()),
        interiorImageUrlTwo: v.optional(v.string()),
        gasoline: v.number(),
        steering: v.string(),
        capacity: v.id('carCapacities'),
        price: v.id('carPrices'),
        stars: v.optional(v.number()),
        reviews: v.optional(v.number())
    })
        .index('by_title', ['title'])
        .index('by_type', ['type']),
    likedCars: defineTable({
        userId: v.string(),
        carId: v.id('cars'),
        isLiked: v.optional(v.boolean())
    })
        .index('by_user_and_car', ['userId', 'carId'])
        .index('by_user', ['userId']),
    reviews: defineTable({
        userId: v.string(),
        carId: v.id('cars'),
        review: v.string()
    })
        .index('by_car', ['carId']),
    availableCities: defineTable({
       city: v.string()
    }),
    rentalOrders: defineTable({
        userId: v.string(),
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
    })
})