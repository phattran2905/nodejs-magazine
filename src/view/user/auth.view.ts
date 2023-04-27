import { NextFunction, Request, Response } from "express"
import { getPopularArticles, getLatestArticles } from "../../utils/article.util"
import { IArticle } from "../../types/Article"

export const showLoginForm = async (req: Request, res: Response) => {
	const selectedFields =
		"_id title interaction status category_id author_id updatedAt createdAt thumbnail_img"
	// const latestArticles = await getLatestArticles(selectedFields, 3)
	// const popularArticles = await getPopularArticles(selectedFields, 5)
	const latestArticles: IArticle[] = []
	const popularArticles: IArticle[] = []

	return res.render("user/auth/login", {
		// menu_list: await menuUtils.getMenuList(),
		latestArticles,
		popularArticles,
		menu_list: [],
	})
}
