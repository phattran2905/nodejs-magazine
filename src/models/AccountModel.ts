import { Schema, model } from "mongoose"

const AccountSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		hashed_password: {
			type: String,
		},
		profile_id: {
			type: Schema.Types.ObjectId,
			ref: "Profile",
		},
		role: {
			type: String,
			default: "audience",
            enum: ["audience", "admin", "blogger"]
		},
		verify_token: {
			token: String,
			expired_on: {
				type: Date,
				required: true,
			},
		},
		remember_token: String,
		last_login: {
			type: Date,
		},
		status: {
			type: String,
			default: "inactive",
            enum: ["inactive", "active", "banned"]
		},
	},
	{ timestamps: true }
)

const AccountModel = model("Account", AccountSchema)

export default AccountModel
