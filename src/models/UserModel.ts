import { Schema, model } from 'mongoose'

interface IUser {
  username: String
  email: String
  hashedPassword?: String
  createdAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    hashedPassword: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
)

const UserModel = model<IUser>('User', UserSchema)

export default UserModel
