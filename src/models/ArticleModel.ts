import { Schema, model } from "mongoose"

const ArticleSchema = new Schema(
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
			type: Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		author_id: {
			type: Schema.Types.ObjectId,
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
			default: "draft",
            enum: ["draft", "published", "banned"]
		},
	},
	{ timestamps: true }
)

const ArticleModel = model("Article", ArticleSchema)

export default ArticleModel
