import { WithId } from 'mongodb'
import z from 'zod'
import { database } from '../../database'

export const Genders = z.enum(['male', 'female', 'other'])
export type Genders = z.infer<typeof Genders>

export const Roles = z.enum(['admin', 'user', 'blogger'])
export type Roles = z.infer<typeof Roles>

export const Statuses = z.enum(['active', 'verified', 'banned'])
export type Statuses = z.infer<typeof Roles>

export const User = z.object({
  username: z
    .string().trim()
    .min(4, { message: 'Username must be at least 4 characters' })
    .max(60, { message: 'Username is too long' }),
  email: z.string().trim().email({ message: 'Invalid email address' }),
  password: z.string().trim().optional(),
  avatar: z.string().optional(),
  token: z.string().nullable().optional(),
  gender: z.string().optional(),
  role: z.literal(Roles.Enum.user).optional(),
  status: z.literal(Statuses.Enum.active).optional(),
})

export type User = z.infer<typeof User>
export type UserWithId = WithId<User>
export const Users = database.collection<User>('users')
