import { Request } from "express"
import { ARTICLE_STATUS, IArticle } from "../types/Article"

const ArticleModel = require("../models/ArticleModel")

export const validate = {
	checkExistentTitle: async (title = null, { req }: { req: Request }) => {
		if (!title) {
			return Promise.reject(false)
		}

		const articleIdFromReq = req.params.articleId ? req.params.articleId : null

		try {
			const article = await ArticleModel.findOne({ title: title })

			if (article) {
				if (articleIdFromReq && articleIdFromReq.toString() == article._id.toString()) {
					return Promise.reject(false)
				}
				return Promise.resolve(true)
			}
			return Promise.reject(false)
		} catch (error) {
			return Promise.resolve(true)
		}
	},
}

export const createNewArticle = async ({
	author_id,
	category_id,
	title,
	summary,
	thumbnail_img,
	body,
	status,
}: IArticle) => {
	if (!author_id || !category_id || !title || !summary || !thumbnail_img || !body) {
		return null
	}
	/* Each article must be in 1 of 3 status:
        [Case 1]: 'Pending' -> is waiting for admin to approve
        [Case 2]: 'Published' -> is published.
        [Case 3]: 'Disapproved' -> is disapproved by administrator.
        [Case 4]: 'Draft' -> is NOT published
    */
	try {
		const addedArticle = await ArticleModel.create({
			title: title,
			summary: summary,
			thumbnail_img: {
				path: thumbnail_img.path,
				contentType: thumbnail_img.mimetype,
				filename: thumbnail_img.filename,
				size: thumbnail_img.size,
			},
			category_id,
			author_id,
			body: body,
			updated: Date.now(),
			status: status,
		})

		return addedArticle
	} catch (error) {
		return null
	}
}

export const updateArticle = async (
	article_id: string,
	{ category_id, title, summary, thumbnail_img, body }: IArticle
) => {
	if (!article_id || !category_id || !title || !summary || !thumbnail_img || !body) {
		return null
	}

	try {
		const article = await ArticleModel.findOne({ _id: article_id })
		if (!article) {
			return null
		}

		const updateResponse = await ArticleModel.updateOne(
			{ _id: article_id },
			{
				title: title,
				summary: summary,
				thumbnail_img: {
					path: thumbnail_img.path,
					contentType: thumbnail_img.mimetype,
					filename: thumbnail_img.filename,
					size: thumbnail_img.size,
				},
				category_id,
				body: body,
				updated: Date.now(),
				status: "Draft",
			}
		)

		return updateResponse
	} catch (error) {
		return null
	}
}

export const getLatestArticles = async (selectedFields = "", limit = 1) => {
	if (limit < 1) {
		return null
	}
	const recent_article_list = await ArticleModel.find({ status: "Published" }, selectedFields)
		.populate({
			path: "authorId",
			select: "_id profile",
		})
		.populate({
			path: "categoryId",
			select: "_id name",
		})
		.sort({ createdAt: "desc" })
		.limit(limit)

	return recent_article_list
}

export const getPopularArticles = async (selectedFields = "", limit = 1) => {
	if (limit < 1) {
		return null
	}
	const hot_article_list = await ArticleModel.find({ status: "Published" }, selectedFields)
		.populate({
			path: "authorId",
			select: "_id profile",
		})
		.populate({
			path: "categoryId",
			select: "_id name",
		})
		.sort({ "interaction.views": "desc" })
		.limit(limit)

	return hot_article_list
}

export const getArticleById = async (articleId = null, selectedFields = "") => {
	if (!articleId) {
		return null
	}
	try {
		const article = await ArticleModel.findOne(
			{ $and: [{ status: "Published" }, { _id: articleId }] },
			selectedFields
		)
			.populate({
				path: "categoryId",
				select: "_id name",
			})
			.populate({
				path: "authorId",
				select: "_id profile",
			})
			.populate({
				path: "interaction.comments",
				populate: { path: "audienceId", select: "_id name email" },
				limit: 5,
				sort: { likes: "desc" },
			})

		return article
	} catch (error) {
		return null
	}
}

export const getArticleByCategoryId = async (categoryId = null, selectedFields = null) => {
	if (!categoryId || !selectedFields) {
		return null
	}

	try {
		const listOfArticles = await ArticleModel.find(
			{ $and: [{ status: "Published" }, { categoryId: categoryId }] },
			selectedFields
		)
			.populate({
				path: "categoryId",
				select: "_id name",
			})
			.populate({
				path: "authorId",
				select: "_id profile",
			})
			.sort({ createdAt: "desc" })

		return listOfArticles
	} catch (error) {
		return null
	}
}

export const getArticlesForMainCategories = async (
	listOfCategoryId: string,
	numOfArticles = 1,
	selectedFields = null
) => {
	if (!listOfCategoryId || numOfArticles < 1 || !selectedFields) {
		return null
	}

	try {
		let resultArray = new Array()
		for (let i = 0; i < listOfCategoryId.length; i++) {
			const listOfArticles = await ArticleModel.find(
				{ $and: [{ status: ARTICLE_STATUS.published }, { category_id: listOfCategoryId[i]?.id }] },
				selectedFields
			)
				.populate({
					path: "authorId",
					select: "_id profile",
				})
				.sort({ createdAt: "desc" })
				.limit(numOfArticles)
			resultArray.push({ category: listOfCategoryId[i], articles: listOfArticles })
		}

		return resultArray
	} catch (error) {
		return null
	}
}

export const getArticleByTitle = async (title = null, selectedFields = null) => {
	if (!title || !selectedFields) {
		return null
	}

	try {
		const listOfArticles = await ArticleModel
			// .find({$and: [{status: 'Published'}, {$text: {$search: title}}]}, selectedFields)
			.find({ $text: { $search: encodeURI(title) } }, selectedFields)
			.populate({
				path: "categoryId",
				select: "_id name",
			})
			.populate({
				path: "authorId",
				select: "_id profile",
			})
			.sort({ createdAt: "desc" })
		return listOfArticles
	} catch (error) {
		console.log(error)
		return null
	}
}
