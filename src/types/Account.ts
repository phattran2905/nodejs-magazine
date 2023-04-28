import { Types } from "mongoose"
import { IProfile } from "./Profile"

export enum ACCOUNT_ROLES {
	audience = "audience",
	admin = "admin",
	blogger = "blogger",
}

export enum ACCOUNT_STATUS {
	inactive = "inactive",
	active = "active",
	banned = "banned",
}

export interface IAccount {
	id: Types.ObjectId
	username: string
	email: string
	hashed_password: string
	profile_id?: IProfile
	role: ACCOUNT_ROLES
	verify_token: {
		token: string
		expired_on: Date
	}
	remember_token?: string
	last_login?: Date
	status: ACCOUNT_STATUS
	createdAt?: Date
	updatedAt?: Date
	numOfArticles?: number
}
