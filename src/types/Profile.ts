import { Types } from "mongoose"

export interface IProfile {
    full_name: string
    gender: string
    date_of_birth: Date
    phone: string
    avatar_img: {
		path: string
		contentType: string
		filename: string
		size: number
    }
    followers: Types.ObjectId[]
}