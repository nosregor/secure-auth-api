import express from 'express'
import { changePassword, requestPasswordChange, updateProfile } from '../controllers/userController'
import { isAuthenticated } from '../middlewares/isAuthenticated'

const router = express.Router()

router.patch('/profile', isAuthenticated, updateProfile)
router.post('/request-password-change', isAuthenticated, requestPasswordChange)
router.post('/change-password', isAuthenticated, changePassword)

export default router
