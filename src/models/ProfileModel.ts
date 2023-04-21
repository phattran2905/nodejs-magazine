import { Schema, model } from "mongoose"

const ProfileSchema = new Schema(
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
			content_type: String,
			file_name: String,
			size: Number,
		},
        followers: [{
            type: Schema.Types.ObjectId
        }],
	},
	{ timestamps: true }
)

const ProfileModel = model("Profile", ProfileSchema)

export default ProfileModel
