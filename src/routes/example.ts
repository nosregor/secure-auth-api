import { Router, Request, Response } from 'express'
import { validate } from '../middlewares/validate'
import { userSchema } from '../schemas/userSchema'

const router = Router()

router.post('/body-params', validate(userSchema), (req: Request, res: Response) => {
  /**
   * Get variables from body params
   */
  const { name, email, password, mobile } = req.body

  res.status(200).send({ email, password, mobile, name })
})

export default router
