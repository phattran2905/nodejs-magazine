import { Router } from 'express'
import { showSignUpForm } from './sign-up.controller'

const router = Router()

router.get('/sign-up', showSignUpForm)

export default router
