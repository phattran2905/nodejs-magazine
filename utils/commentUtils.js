const ArticleModel = require('../models/ArticleModel');
const CommentModel = require('../models/CommentModel');
const AudienceModel = require('../models/AudienceModel');
const validationUtils = require('./validationUtils');

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
      let audience = null;
      let addedComment = null;
      if (!await validationUtils.isExistentAudienceEmail(email)){
        audience = await AudienceModel.create({
          name: postedBy,
          email: email,
        });
      } else {
        audience = await AudienceModel.findOne({email: email});
      }

      if (audience) {
        addedComment = await CommentModel.create({
          articleId: articleId,
          text: text,
          audienceId: audience._id
        });
        
        if (addedComment) {
            let article = await ArticleModel.findOne({_id: articleId});
            article.interaction.comments.push(addedComment._id);
            const updatedArticle = await article.save();
            if(updatedArticle) {return addedComment};
        }
      }
      
      return null;
    } catch (error) {
        console.log(error);
      return null;
    }
  },
  
}

module.exports = commentUtils;