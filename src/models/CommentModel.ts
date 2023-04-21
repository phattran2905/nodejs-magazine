import { Schema, model } from "mongoose"

const CommentSchema = new Schema(
	{
		text: {
			type: String,
			required: true,
		},
		article_id: {
			type: Schema.Types.ObjectId,
			ref: "Article",
		},
		likes: {
			type: Number,
			default: 0,
		},
		dislikes: {
			type: Number,
			default: 0,
		},
		account_id: {
			type: Schema.Types.ObjectId,
			ref: "Account",
		},
		status: {
			type: String,
			default: "public",
            enum: ["public", "hide"]
		},
	},
	{ timestamps: true }
)

const CommentModel = model("Comment", CommentSchema)

export default CommentModel
