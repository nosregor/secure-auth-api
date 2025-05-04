import { Router } from 'express'
import { login, register, verify2FA } from '../controllers/authController'
import { validateSchema } from '../middlewares/validateSchema'
import { verify2FASchema } from '../schemas/auth/2faSchema'
import { loginSchema } from '../schemas/auth/loginSchema'
import { registerSchema } from '../schemas/auth/registerSchema'

const router = Router()

router.post('/register', validateSchema(registerSchema), register)
router.post('/login', validateSchema(loginSchema), login)
router.post('/verify-2fa', validateSchema(verify2FASchema), verify2FA)

export default router
