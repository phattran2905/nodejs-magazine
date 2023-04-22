import { Types } from "mongoose"

export enum COMMENT_STATUS {
    public = "public",
    hidden = "hidden"
}

export interface IComment {
    text: string
    article_id?: Types.ObjectId
    likes: number
    dislikes: number
    account_id?: Types.ObjectId
    status: COMMENT_STATUS
}