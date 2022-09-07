import { Router } from 'express'
import users from './users/user.route'
import auth from './auth/auth.route'

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'API v1 🍺' })
})

router.use(auth)
router.use('/users', users)

export default router
