const ArticleModel = require('../models/ArticleModel');
const CommentModel = require('../models/CommentModel');

const commentUtils = {
  validate: {
    checkExistentComment: async(
      text = null, {req} = {}
      ) => {
        if (!title) {return Promise.reject(false)};

        const commentIdFromReq = (req.params.commentId)
          ? req.params.commentId
          : null;

          try {
            const comment = await CommentModel.findOne({text: text.trim()});
            if(comment) {
              if (commentIdFromReq && commentIdFromReq === comment.text){
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
  comment: async ({
    articleId,
    text,
    postedBy,
    email
  } = {}) => {
    if (!articleId || !text || !postedBy || !email) {return null;}

    try {
      const addedComment = await CommentModel.create({
        articleId: articleId,
        text: text,
        postedBy: postedBy,
        email: email
      });
      
      if (addedComment) {
          let article = await ArticleModel.findOne({_id: articleId});
          article.interaction.comments.push(addedComment._id);
          const updatedArticle = await article.save();
          if(updatedArticle) {return addedComment};
      }
      return null;
    } catch (error) {
        console.log(error);
      return null;
    }
  },
  
  updateArticle: async (
    {
        articleId,
        text,
        postedBy,
        email
    } = {} ) => {
    //   if (!articleId || !categoryId || !title || !summary || !thumbnail_img || !body)
    //   {return null;}
      
    // try {
    //   const article = await ArticleModel.findOne({_id: articleId});
    //   if (!article) {return null;}

    //   const updateResponse = await ArticleModel.updateOne(
    //     {_id: articleId}, 
    //     {
    //       title: title,
    //       summary: summary,
    //       thumbnail_img: {
    //         path: thumbnail_img.path,
    //         contentType: thumbnail_img.mimetype,
    //         filename: thumbnail_img.filename,
    //         size: thumbnail_img.size
    //       },
    //       categoryId: categoryId,
    //       body: body,
    //       updated: Date.now(),
    //       status: 'Draft'
    //     });
        
    //   return updateResponse;
    // } catch (error) {
    //     return null;
    // }
  },
  
}

module.exports = commentUtils;