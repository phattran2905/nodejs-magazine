const CategoryModel = require("../models/CategoryModel")
const ArticleModel = require("../models/ArticleModel")

const categoryUtils = {
        validate: {
                checkExistedName: async (name = null, { req } = {}) => {
                        if (!name) {
                                return Promise.reject(false)
                        }

                        const cateIdFromReq = req.params.id ? req.params.id : null

                        try {
                                const category = await CategoryModel.findOne({ name: name })
                                if (category) {
                                        if (cateIdFromReq && category.id === cateIdFromReq) {
                                                return Promise.reject(false)
                                        }
                                        return Promise.resolve(true)
                                }
                                return Promise.reject(false)
                        } catch (error) {
                                return Promise.resolve(true)
                        }
                },
        },

        createNewCategory: async ({ name } = {}) => {
                if (!name) {
                        return null
                }

                try {
                        const categoryObj = await CategoryModel.create({
                                name: name,
                        })

                        return categoryObj
                } catch (error) {
                        return null
                }
        },

        getNumOfArticleByCategory: async () => {
                // Find Category in the database
                const categoryArr = await CategoryModel.find({ status: "Activated" }, "_id name")

                // Loop with built-in function of Javascript
                let resultArr = await categoryArr.map(async (item) => {
                    const result = {
                        _id: item._id,
                        name: item.name,
                        numOfArticles: await ArticleModel.find(
                                {
                                        $and: [
                                                { status: "Published" },
                                                { categoryId: item._id },
                                        ],
                                },
                                "_id"
                        ).count(),
                    }

                    return result
                })

                return resultArr
        },
}

module.exports = categoryUtils
