import { Schema, model, Types } from "mongoose"
import { IAccount, ACCOUNT_ROLES, ACCOUNT_STATUS } from "../types/Account"

const AccountSchema = new Schema<IAccount>(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		hashed_password: {
			type: String,
		},
		profile_id: {
			type: Types.ObjectId,
			ref: "Profile",
		},
		role: {
			type: String,
			default: ACCOUNT_ROLES.audience,
			enum: ACCOUNT_ROLES,
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
			default: ACCOUNT_STATUS.active,
			enum: ACCOUNT_STATUS,
		},
	},
	{ timestamps: true }
)

const AccountModel = model<IAccount>("Account", AccountSchema)

export default AccountModel
