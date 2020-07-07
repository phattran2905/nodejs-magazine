const ArticleModel = require('../models/ArticleModel');
const CategoryModel = require('../models/CategoryModel');
const AuthorModel = require('../models/AuthorModel');

const articleUtils = {
  validate: {
    checkExistentTitle: async(
      title = null, {req} = {}
      ) => {
        if (!title) {return Promise.reject(false)};

        const articleIdFromReq = (req.params.article_id)
          ? req.params.article_id
          : null;

          try {
            const article = await ArticleModel.findOne({title: title});
            if(article) {
              if (articleIdFromReq && articleIdFromReq === article.title){
                return Promise.reject(false);
              }
              return Promise.resolve(true);
            }
            return Promise.reject(false);
          } catch (error) {
            return Promise.resolve(true);
          }
    }
  },
  createNewArticle: async ({
    authorId,
    categoryId,
    title,
    summary,
    thumbnail_img,
    body,
    publishCheck
  } = {}) => {
    /* Each article must be in 1 of 3 status:
    // [Case 1]: 'Pending' -> is waiting for admin to approve
    // [Case 2]: 'Published' -> is published.
    // [Case 3]: 'Draft' -> is NOT published
    // 
    */
    const status = (publishCheck === 'Publish') ?
      'Pending' :
      'Draft';
    try {
      const addedArticle = await ArticleModel.create({
        title: title,
        summary: summary,
        thumbnail_img: {
          path: thumbnail_img.path,
          contenType: thumbnail_img.mimetype,
          filename: thumbnail_img.filename,
          size: thumbnail_img.size
        },
        categoryId: categoryId,
        authorId: authorId,
        body: body,
        updated: Date.now(),
        status: status
      });

      return addedArticle;
    } catch (error) {
      return null;
    }
  },

  getArticleById: async (article_id = null) => {
    if (!article_id) {return null;}

    try {
      const article = await ArticleModel.findById(article_id); 
      if (article) {
        const categoryName = await CategoryModel.findById(article.categoryId);
        const author = await AuthorModel.findById(article.authorId);
        if (categoryName) {
          article.categoryName = categoryName;
          article.authorName = author.profile.fullname;
          article.authorAvatar = author.profile.avatar_img.filename;
        }
        return article;
      }
      return null;
    } catch (error) {
      return null;
    }

  }
}

module.exports = articleUtils;