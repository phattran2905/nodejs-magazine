import {Types} from 'mongoose';

export type ROLES = "audience" | "admin" | "blogger"

export type STATUS = "inactive" | "active" | "banned"

export interface IAccount {
	email: string
	hashed_password?: string
	profile_id?: Types.ObjectId
	role: ROLES
	verify_token?: string
	remember_token?: string
	last_login?: Date
	status: STATUS
	createdAt?: Date
	updatedAt?: Date
}