import { Schema, model, Types } from "mongoose"
import { COMMENT_STATUS, IComment } from "../types/Comment"

const CommentSchema = new Schema<IComment>(
	{
		text: {
			type: String,
			required: true,
		},
		article_id: {
			type: Types.ObjectId,
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
			type: Types.ObjectId,
			ref: "Account",
		},
		status: {
			type: String,
			default: COMMENT_STATUS.public,
            enum: COMMENT_STATUS
		},
	},
	{ timestamps: true }
)

const CommentModel = model<IComment>("Comment", CommentSchema)

export default CommentModel
