import { Router } from "express"
import { login, logout } from "../../controllers/admin/auth.controller"

const router = Router()

router.get("/login", login)

router.post("/login", login)

router.get("/logout", logout)

export default router
