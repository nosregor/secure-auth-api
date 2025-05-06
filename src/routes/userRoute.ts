import express from 'express'
import { changePassword, requestPasswordChange, updateProfile } from '../controllers/userController'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { validateSchema } from '../middlewares/validateSchema'
import {
  changePasswordRequestSchema,
  requestPasswordChangeSchema,
} from '../schemas/user/changePasswordSchema'
import { updateProfileSchema } from '../schemas/user/updateProfileSchema'

const router = express.Router()

router.patch('/profile', isAuthenticated, validateSchema(updateProfileSchema), updateProfile)
router.post(
  '/request-password-change',
  isAuthenticated,
  validateSchema(requestPasswordChangeSchema),
  requestPasswordChange,
)
router.patch(
  '/change-password',
  isAuthenticated,
  validateSchema(changePasswordRequestSchema),
  changePassword,
)

export default router
