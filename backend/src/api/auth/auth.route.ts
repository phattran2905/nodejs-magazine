import { Router } from 'express'
import { validateRequest } from '../../middlewares'
import * as authHandlers from './auth.handler'
import { SignUpForm } from './signupForm.model'

const router = Router()

router.post('/signup', validateRequest({ body: SignUpForm }), authHandlers.signup)
router.post('/login', authHandlers.login)
// router.get('/logout', authHandlers.logout)

export default router
