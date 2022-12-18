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
    res.render('error/user-404')
  }
}

export const signUpHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    
  } catch (error) {
    res.render('error/user-500')
  }
}
