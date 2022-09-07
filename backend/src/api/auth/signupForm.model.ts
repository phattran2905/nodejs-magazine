import * as z from 'zod'
import bcrypt from 'bcrypt'
import { Users } from '../users/user.model'

export const SignUpForm = z
  .object({
    email: z.string().trim().email({ message: 'Invalid email address.' }),
    password: z.string().min(4, { message: 'Password must be at least 4 characters' }),
    confirmPassword: z.string(),
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

      if (data.confirmPassword !== data.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords don't match",
          path: ['confirmPassword'],
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

export type SignUpForm = z.infer<typeof SignUpForm>
