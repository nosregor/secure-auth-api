import { Router } from 'express'
import { register } from '../controllers/authController'
import { validateSchema } from '../middlewares/validateSchema'
import { registerSchema } from '../schemas/auth/registerSchema'

const router = Router()

router.post('/register', validateSchema(registerSchema), register)

export default router
