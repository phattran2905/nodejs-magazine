import { Router } from "express"
import {
	showIndexPage,
	// showAboutPage,
	// showArticle,
	// showArticlesByCategoryId,
	// showAuthorPage,
	// searchArticlesByTitle,
	// showContactPage,
	// showTermsAndPolicy,
	// followAuthor,
	// subscribeEmail,
} from "../../controller/home.controller"

const router = Router()

router.get(["/", "/home", "/index"], showIndexPage)

// router.get("/author", showAuthorPage)

// router.get("/article", showArticle)

// router.post("/follow", followAuthor)

// router.get("/subscribe", subscribeEmail)

// router.get("/category", showArticlesByCategoryId)

// router.get("/search", searchArticlesByTitle)

// router.get("/about", showAboutPage)

// router.get("/contact", showContactPage)

// router.get(["/terms_of_services", "/privacy_policy"], showTermsAndPolicy)

export default router
