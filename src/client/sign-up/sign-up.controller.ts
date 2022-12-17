import { Request, Response } from 'express'
import UserModel from '../../models/UserModel'

export const showSignUpForm = (req: Request, res: Response): void => {
  try {
    res.render('user/auth/signup', {
      menu_list: [],
      latestArticles: [],
      popularArticles: []
    })
  } catch (error) {
    console.error(error)
    res.render('error/user-404')
  }
}
