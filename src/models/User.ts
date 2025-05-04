import bcrypt from 'bcryptjs'
import mongoose, { Document, Schema } from 'mongoose'

export interface UserDocument extends Document {
  name: string
  email: string
  mobile: string
  password: string // hashed
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
)

userSchema.pre<UserDocument>('save', async function (next) {
  const user = this as UserDocument
  // Check if the password is modified
  if (!user.isModified('password')) return next()

  // Hash the password before saving
  const hash = await bcrypt.hash(this.password, 10)
  user.password = hash
  next()
})

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as UserDocument
  return await bcrypt.compare(candidatePassword, user.password)
}

const User = mongoose.model<UserDocument>('User', userSchema)

export default User
