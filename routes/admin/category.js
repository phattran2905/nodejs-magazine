const express = require('express')
const categoryRouter = express.Router()
const CategoryModel = require('../../models/CategoryModel')
const {body, validationResult, matchedData} = require('express-validator')
const commonUtils = require('../../utils/commonUtils');
const authUtils = require('../../utils/authUtils');
const categoryUtils = require('../../utils/categoryUtils');

// categoryRouter.use(authUtils.checkAuthenticatedAdmin);

categoryRouter.get(
    '/categories' , 
    async (req,res) => {
    try {
        const categories = await CategoryModel.find();
        return res.render(
            'admin/category/category',
            {
                categories: categories,
                loggedAdmin: commonUtils.getLoggedAccount(req.user)
            });
    } catch (error) {
        console.error(error);
        return res.sendStatus(404).render('pages/404');
    }
});

categoryRouter.get(
    '/categories/add',
    (req,res) => {
    return res.render(
        'admin/category/category_add',
        {
            loggedAdmin:  commonUtils.getLoggedAccount(req.user)
        });
    }
)

categoryRouter.post(
    '/categories/add', 
    [
        body('name').isAlpha().withMessage("Only letters are allowed.").trim()
            .bail().custom(categoryUtils.checkExistedName),
        body('display_order').isInt({min: 0, max: 10000, allow_leading_zeroes: false}).withMessage("Only numbers are accepted.")
            .toInt().bail().custom(categoryUtils.checkDuplicatedOrder)
    ],
    async (req,res) => {
        const errors = validationResult(req);
        const validInput = matchedData(req, {location: ['body']});

        if (!errors.isEmpty()) {
            return res.render(
                "admin/category/category_add", 
                {
                    errors: errors.array(), 
                    validInput: validInput,
                    loggedAdmin:  commonUtils.getLoggedAccount(req.user)
                });
        }
        try {
            const categoryObj = await categoryUtils.createNewCategory(
                validInput.name,
                validInput.display_order
            );
            if (categoryObj) {
                req.flash("addSuccess", "Successfully. A new author was added.");
            } else {
                req.flash("addFail", "Failed. An error occurred during the process.");
            }

            return res.redirect("/admin/categories/add");
        } catch (error) {
            return res.sendStatus(404).render('pages/404');
        }
    }
)

categoryRouter.get(
    "/categories/update/:id",
    async (req, res) => {
      try {
        const category = await CategoryModel.findOne({ _id: req.params.id });
        
        if(category){
            return res.render(
                "admin/category/category_update", 
                { 
                    category: category,
                    loggedAdmin:  commonUtils.getLoggedAccount(req.user)
                });
        }
        return res.render("pages/404");
      } catch (error) {
            return res.sendStatus(404).render("pages/404");
      }
    }
  );
  
  categoryRouter.post(
      "/categories/update/:id", 
      [
        body('name').isAlpha().withMessage("Only letters are allowed.").trim()
            .bail().custom(categoryUtils.checkExistedName),
        body('display_order').isInt({min: 0, max: 10000, allow_leading_zeroes: false}).withMessage("Only numbers are accepted.")
            .toInt().bail().custom(categoryUtils.checkDuplicatedOrder)
      ],
      async (req, res) => {
          try {
              const category = await CategoryModel.findOne({ _id: req.params.id });
                if (category) {
                    const errors = validationResult(req);
                    const validInput = matchedData(req, {location: ['body']});

                    if (!errors.isEmpty()) {
                        return res.render(
                            "admin/category/category_update", 
                            {
                                errors: errors.array(), 
                                validInput: validInput, 
                                category: category,
                                loggedAdmin:  commonUtils.getLoggedAccount(req.user)
                            });
                    }
                        
                    const updatedCategory = await CategoryModel.findByIdAndUpdate(
                        {_id: category.id},
                        {
                            name: req.body.name,
                            displayOrder: req.body.display_order
                        }, {new: true}); // Return the updated object

                    if (updatedCategory) {
                        req.flash('updateSuccess', 'Successfully. All changes were saved.');
                        return res.redirect("/admin/categories/update/" + updatedCategory.id);
                    }else {
                        req.flash('updateFail', 'Failed. An error occurred during the process.');
                        return res.redirect("/admin/categories/update/" + category.id);
                    }

                }else {
                    req.flash('updateFail', 'Failed. An error occurred during the process.');
                    return res.redirect("/admin/categories/update/" + req.params.id);
                }
              
          } catch (error) {
              return res.sendStatus(404).render('pages/404');
          }
  });

categoryRouter.post(
    "/categories/activate/:id", 
    async (req, res) => {
    try {
        const categoryObj = await CategoryModel.findOne({ _id: req.params.id });
        
        if (categoryObj && categoryObj.status === "Deactivated") {
            categoryObj.status = "Activated";
            await categoryObj.save();
            req.flash("statusSuccess", "Successfully. The status was changed to 'Activated'");
        } else {
            req.flash("statusFail", "Failed. An error occurred during the process.");
        }
        return res.redirect("/admin/categories");
    } catch (error) {
        return res.sendStatus(404).render('pages/404');
    }
});

categoryRouter.post(
    "/categories/deactivate/:id", 
    async (req, res) => {
    try {
        const categoryObj = await CategoryModel.findOne({ _id: req.params.id });
        if (categoryObj && categoryObj.status === "Activated") {
            categoryObj.status = "Deactivated";
            await categoryObj.save();
            req.flash("statusSuccess", "Successfully. The status was changed to 'Deactivated'");
        } else {
            req.flash("statusFail", "Failed. An error occurred during the process.");
        }
        return res.redirect("/admin/categories");
    } catch (error) {
        return res.sendStatus(404).render('pages/404');
    }
});

categoryRouter.post(
    "/categories/delete/", 
    async (req, res) => {
    try {
        const categoryObj = await CategoryModel.findById({ _id: req.body.id });
        
        if (categoryObj) {
            await CategoryModel.remove({_id: req.body.id});
            req.flash("deleteSuccess", "Successfully. The author was removed from the database.");
        } else {
            req.flash("deleteFail", "Failed. An error occurred during the process");
        }
        return res.redirect("/admin/categories");
    } catch (error) {
        return res.sendStatus(404).render('pages/404');
    }
});

module.exports = categoryRouter;