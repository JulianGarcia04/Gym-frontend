import { z } from 'zod'

const toDate = (val) => {
    if (typeof val !== 'string') {
        return
    }

    return new Date(val)
}

export const ProviderSchema = z.object({
    _id: z.string(),
    name: z.string(),
    NIT: z.string(),
    createdDate: z.preprocess(toDate, z.date()),
    phone: z.string().optional(),
    isActive: z.boolean().default(true),
    inventoryItems: z.string().array()
})

export const WriteProviderSchema = z.object({
    _id: z.string().optional(),
    name: z.string(),
    NIT: z.string(),
    createdDate: z.preprocess(toDate, z.date().optional()),
    phone: z.string().optional(),
    isActive: z.boolean().optional(),
})