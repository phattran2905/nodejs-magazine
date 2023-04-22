import { Schema, model, Types } from "mongoose"
import { ARTICLE_STATUS, IArticle } from "../types/Article"

const ArticleSchema = new Schema<IArticle>(
	{
		title: {
			type: String,
			required: true,
		},
		summary: {
			type: String,
			required: true,
		},
		thumbnail_img: {
			path: String,
			contentType: String,
			filename: String,
			size: Number,
		},
		category_id: {
			type: Types.ObjectId,
			ref: "Category",
			required: true,
		},
		author_id: {
			type: Types.ObjectId,
			ref: "Account",
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
        views: {
            type: Number,
            default: 0,
        },
		status: {
			type: String,
			default: ARTICLE_STATUS.draft,
            enum: ARTICLE_STATUS
		},
	},
	{ timestamps: true }
)

const ArticleModel = model<IArticle>("Article", ArticleSchema)

export default ArticleModel
