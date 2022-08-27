import { Schema, model, connect } from "mongoose"

export interface IUser {
	id: string
	username: string
	email: string
	password: string
	gender?: "male" | "female" | "other"
	dateOfBirth?: Date
	avatar?: string
	role?: "user" | "admin" | "blogger"
	token?: string
	status?: "active" | "verified" | "banned"
	// createdAt: Date
	// updatedAt: Date
}

const userSchema = new Schema<IUser>(
	{
		id: {
			type: String,
			required: true,
			unique: true,
		},
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
		password: {
			type: String,
			required: true,
		},
		gender: {
			type: String,
		},
		dateOfBirth: {
			type: Date,
		},
		avatar: {
			type: String,
		},
		token: {
			type: String,
		},
		role: {
			type: String,
			required: true,
			default: "user",
		},
		status: {
			type: String,
			required: true,
			default: "active",
		},
	},
	{ timestamps: true }
)

export const User = model<IUser>("User", userSchema)
