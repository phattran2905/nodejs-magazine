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
    if (!authorId || !categoryId || !title || !summary || !thumbnail_img || !body)
      {return null;}
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
          contentType: thumbnail_img.mimetype,
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
  
  updateArticle: async (
    articleId,
    {
      categoryId,
      title,
      summary,
      thumbnail_img,
      body
    } = {} ) => {
      if (!articleId || !categoryId || !title || !summary || !thumbnail_img || !body)
      {return null;}
      
    try {
      const article = await ArticleModel.findOne({_id: articleId});
      if (!article) {return null;}

      const updateResponse = await ArticleModel.updateOne(
        {_id: articleId}, 
        {
          title: title,
          summary: summary,
          thumbnail_img: {
            path: thumbnail_img.path,
            contentType: thumbnail_img.mimetype,
            filename: thumbnail_img.filename,
            size: thumbnail_img.size
          },
          categoryId: categoryId,
          body: body,
          updated: Date.now(),
          status: 'Draft'
        });
        
      return updateResponse;
    } catch (error) {
        return null;
    }
  },
  getLatestArticles: async (article_return_fields = null, limit = 0) => {
    if(limit <= 0 || !article_return_fields) {return null;}
    const recent_article_list = await ArticleModel
          .find({status: 'Published'}, article_return_fields)
          .populate({
            path: 'authorId',
            select: '_id profile'
          })
          .populate({
            path: 'categoryId',
            select: '_id name'
          })
          .sort({createdAt: 'desc'})
          .limit(limit);

    return recent_article_list;
  },
  getHotArticles: async (selectedFields = null, limit = 0) => {
    if(limit <= 0 || !selectedFields) {return null;}
    const hot_article_list = await ArticleModel
          .find({status: 'Published'}, selectedFields)
          .populate({
            path: 'authorId',
            select: '_id profile'
          })
          .populate({
            path: 'categoryId',
            select: '_id name'
          })
          .sort({'interaction.likes': 'desc'})
          .limit(limit);

    return hot_article_list;
  },
  getPopularArticles: async (selectedFields = null, limit = 0) => {
    if(limit <= 0 || !selectedFields) {return null;}
    const hot_article_list = await ArticleModel
          .find({status: 'Published'}, selectedFields)
          .populate({
            path: 'authorId',
            select: '_id profile'
          })
          .populate({
            path: 'categoryId',
            select: '_id name'
          })
          .sort({'interaction.views': 'desc'})
          .limit(limit);

    return hot_article_list;
  },
  getArticleByCategory: async (categoryId = null , numOfArticles = null, selectedFields = null) => {
    if (!categoryId || numOfArticles <= 0 || !selectedFields) {return null;}

    const listOfArticles = await ArticleModel
      .find({status: 'Published'}, selectedFields)
      .populate({
        path: 'categoryId',
        select: '_id name'
      })
      .populate({
        path: 'authorId',
        select: '_id profile'
      })
      .sort({createdAt: 'desc'})
      .limit(numOfArticles);

      return listOfArticles;
  },

}

module.exports = articleUtils;