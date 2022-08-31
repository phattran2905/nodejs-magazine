import { Router } from 'express'
import users from './users/user.route'

const router = Router()

router.get('/', (req, res) => {
	res.json({ message: 'API v1 🍺' })
})

router.use('/users', users)

export default router
