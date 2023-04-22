import { Schema, model,Types } from "mongoose"
import { IProfile } from "../types/Profile"

const ProfileSchema = new Schema<IProfile>(
	{
		full_name: {
			type: String,
			required: true,
		},
		gender: {
			type: String,
		},
		date_of_birth: { type: Date },
		phone: { type: String },
		avatar_img: {
			path: String,
			contentType: String,
			filename: String,
			size: Number,
		},
        followers: [{
            type: Types.ObjectId
        }],
	},
	{ timestamps: true }
)

const ProfileModel = model<IProfile>("Profile", ProfileSchema)

export default ProfileModel
