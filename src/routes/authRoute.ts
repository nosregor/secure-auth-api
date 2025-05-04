import { Router } from 'express'
import { login, register } from '../controllers/authController'
import { validateSchema } from '../middlewares/validateSchema'
import { loginSchema } from '../schemas/auth/loginSchema'
import { registerSchema } from '../schemas/auth/registerSchema'

const router = Router()

router.post('/register', validateSchema(registerSchema), register)
router.post('/login', validateSchema(loginSchema), login)

export default router
