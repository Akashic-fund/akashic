import { PaymentMethod as PrismaPaymentMethod } from '@prisma/client'

// Re-export the Prisma type with any extensions if needed
export type PaymentMethod = PrismaPaymentMethod

// Add any helper types related to payment methods
export interface PaymentMethodDisplay {
    id: number
    provider: string
    externalId: string
    type: string
    details?: JSON
    // Add other fields as needed
} 