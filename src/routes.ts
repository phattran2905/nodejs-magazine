import { Router } from 'express'
import signUpRouter from './client/sign-up/sign-up.route'

const router = Router()

router.use(signUpRouter)

export default router
