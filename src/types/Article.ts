import { Types } from "mongoose"

export enum ARTICLE_STATUS {
	draft = "draft",
	published = "published",
	banned = "banned",
}

export interface IArticle {
	title: string
	summary: string
	thumbnail_img?: {
		path: string
		contentType: string
		filename: string
		size: number,
        mimetype: string
	}
	category_id?: Types.ObjectId
	author_id?: Types.ObjectId
	body: string
	views: number
	status: ARTICLE_STATUS
	createdAt?: Date
	updatedAt?: Date
}
