import { Router } from "express"
import authRoutes from "./auth.route"
import userRoutes from "./user.route"

const router = Router()

router.use(authRoutes)
router.use(userRoutes)

export default router
