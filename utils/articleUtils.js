const ArticleModel = require('../models/ArticleModel');

const articleUtils = {
    createNewArticle: async (authorId, article_content, thumbnail ) => {
        const publishCheck = (article_content.publishCheck === 'on') ? 'Published' : 'Not Published';
        let articleObj = {
            title: article_content.title,
            summary: article_content.summary,
            thumbnail_img: { // *multer* return an Object that contains an array of objects inside
                originalName: thumbnail[0].originalName,
                path: thumbnail[0].path,
                mimetype: thumbnail[0].mimetype,
                stored_filename: thumbnail[0].filename,
            },
            categoryId: article_content.category,
            authorId: authorId,
            body: {
                text: article_content.body
            },
            updated: {
                onDate: Date.now(),
                By: {
                    accountType: 'Author',
                    accountID: authorId
                }
            },
            status: publishCheck
        };
        try {
            const addedArticle = await ArticleModel.create(articleObj);
            if(!addedArticle) {
                return null;
            }
            return addedArticle;
        }catch(error) {
            return error;
        }
        

    },
}

module.exports = articleUtils;