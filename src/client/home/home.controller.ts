import { Response, Request, NextFunction } from 'express'

export async function showContactPage(req: Request, res: Response, next: NextFunction) {
  try {
    res.render('user/contact', {
      menu_list: [],
      latestArticles: [],
      popularArticles: [],
      information: {},
    })
  } catch (error) {
    res.render('error/user-404')
  }
}
