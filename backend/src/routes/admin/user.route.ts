import { Router } from "express"
import { createUser } from "../../controllers/admin/user.controller"

const router = Router()

router.post("/users", createUser)

export default router
