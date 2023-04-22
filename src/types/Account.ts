import {Types} from 'mongoose';

export enum ACCOUNT_ROLES {
    audience = "audience",
    admin = "admin",
    blogger = "blogger"
}

export enum ACCOUNT_STATUS {
    inactive = "inactive",
    active = "active",
    banned = "banned"
}

export interface IAccount {
	email: string
	hashed_password?: string
	profile_id?: Types.ObjectId
	role: ACCOUNT_ROLES
	verify_token?: string
	remember_token?: string
	last_login?: Date
	status: ACCOUNT_STATUS
	createdAt?: Date
	updatedAt?: Date
}