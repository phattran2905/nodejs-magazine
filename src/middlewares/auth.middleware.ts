import { Response, Request, NextFunction } from "express"
import AccountModel from "../models/AccountModel"

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.isAuthenticated(), req.user, req.session)
}

// export const checkAuthenticatedAdmin = (req: Request, res: Response, next: NextFunction) => {
// 	if (req.isAuthenticated() && req.user) {
// 		return next()
// 	}

// 	return res.redirect("/admin/login")
// }

// export const checkNotAuthenticatedAdmin = (req: Request, res: Response, next: NextFunction) => {
// 	if (req.isUnauthenticated() || typeof req.user === "undefined") {
// 		return next()
// 	}
// 	return res.redirect("/admin")
// }

// Redirect to the login page if the user is not authenticated. Otherwise, continue the next middleware.
export const checkAuthenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
	if (req.isAuthenticated()) {
		return next()
	}

	return res.redirect("/login")
}

// Redirect to the home page if the user is authenticated. Otherwise, continue the next middleware.
export const checkNotAuthenticatedUser = (req: Request, res: Response, next: NextFunction) => {
	if (req.isUnauthenticated()) {
		return next()
	}

	return res.redirect("/home")
}

// export const reloadLoggedAdmin = async (req: Request, id: string) => {
// 	try {
// 		const adminInfo = await AccountModel.findById(id)
// 		req.session.admin = adminInfo
// 		return adminInfo
// 	} catch (error) {
// 		return null
// 	}
// }

// export const reloadLoggedUser = async (req: Request, id: string) => {
// 	try {
// 		const authorInfo = await AccountModel.findById(id)
// 		req.session.user = authorInfo
// 		return authorInfo
// 	} catch (error) {
// 		return null
// 	}
// }

// export const getAuthorProfile = (req: Request) => {
// 	if (typeof req.session.user !== "undefined" && req.session.user) {
// 		return {
// 			id: req.session.user._id,
// 			username: req.session.user.username,
// 			email: req.session.user.email,
// 			fullname: req.session.user.profile.fullname,
// 			gender: req.session.user.profile.gender,
// 			dob: req.session.user.profile.dateOfBirth,
// 			phone: req.session.user.profile.phone,
// 			avatar_img: req.session.user.profile.avatar_img,
// 		}
// 	}

// 	return null
// }

// export const getAdminProfile = (req: Request) => {
// 	if (typeof req.session.admin !== "undefined" && req.session.admin) {
// 		return {
// 			id: req.session.admin._id,
// 			username: req.session.admin.username,
// 			email: req.session.admin.email,
// 			fullname: req.session.admin.profile.fullname,
// 			gender: req.session.admin.profile.gender,
// 			dob: req.session.admin.profile.dateOfBirth,
// 			phone: req.session.admin.profile.phone,
// 			role: req.session.admin.role,
// 			avatar_img: req.session.admin.profile.avatar_img,
// 		}
// 	}

// 	return null
// }
