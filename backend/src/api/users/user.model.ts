import { WithId } from 'mongodb'
import z from 'zod'
import { database } from '../../database'

const genderValues = ['male', 'female', 'other'] as const
export const Gender = z.enum(genderValues)
export type Gender = z.infer<typeof Gender>

const roleValues = ['admin', 'user', 'blogger'] as const
export const Role = z.enum(roleValues)
export type Roles = z.infer<typeof Role>

const statusValues = ['active', 'verified', 'banned'] as const
export const Status = z.enum(statusValues)
export type Status = z.infer<typeof Status>

export const User = z
  .object({
    username: z
      .string()
      .trim()
      .min(4, { message: 'Username must be at least 4 characters' })
      .max(60, { message: 'Username is too long' }),
    email: z.string().trim().email({ message: 'Invalid email address.' }),
    password: z.string(),
    avatar: z.string().nullable().optional().default(null),
    token: z.string().nullable().optional().default(null),
    gender: z.string().optional().default(Gender.enum.other),
    role: z.string().optional().default(Role.enum.user),
    status: z.string().optional().default(Status.enum.active),
  })
  .superRefine(async (data, ctx) => {
    try {
      const existed = await Users.findOne({ email: data.email })
      if (existed) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email already existed.',
          path: ['email'],
          fatal: true,
        })
      }

      if (!(data.gender in Gender.enum)) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_enum_value,
          options: Gender.options,
          received: data.gender,
          message: 'Invalid value for gender.',
          path: ['gender'],
          fatal: true,
        })
      }

      if (!(data.role in Role.enum)) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_enum_value,
          options: Role.options,
          received: data.role,
          message: 'Invalid value for role.',
          path: ['role'],
          fatal: true,
        })
      }

      if (!(data.status in Status.enum)) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_enum_value,
          options: Status.options,
          received: data.role,
          message: 'Invalid value for status.',
          path: ['status'],
        })
      }
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Can not proceed to validate some fields.',
        path: ['email', 'password', 'confirmPassword'],
      })
    }
  })

export type User = z.infer<typeof User>
export type UserWithId = WithId<User>
export const Users = database.collection<User>('users')
