import { WithId } from 'mongodb'
import z from 'zod'
import { database } from '../../database'

export const User = z.object({
	username: z.string(),
	password: z.string(),
})

export type User = z.infer<typeof User>
export type UserWithId = WithId<User>
export const Users = database.collection<User>('users')
