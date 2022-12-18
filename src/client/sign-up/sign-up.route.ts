import { Router } from 'express'
import { showSignUpForm, signUpHandler } from './sign-up.controller'

const router = Router()

router.get('/signup', showSignUpForm)
router.post('/signup', signUpHandler)

export default router
