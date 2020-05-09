const express = require('express');
const authorRouter = express.Router();
const authUtils = require("../../utils/authUtils");
const commonUtils = require("../../utils/commonUtils");
const authorUtils = require("../../utils/authorUtils");
const AuthorModel = require('../../models/AuthorModel');
const {body, validationResult, matchedData} = require('express-validator');

authorRouter.use(authUtils.checkAuthenticatedAdmin);

authorRouter.get(
    '/authors' , 
    async (req,res) => {
    const authors = await AuthorModel.find();
    res.render(
        'admin/author/author',
        {
            authors: authors,
            loggedAdmin: commonUtils.getLoggedAccount(req.user)
        });
});

authorRouter.get(
    '/authors/add',
    (req,res) => {
    res.render(
        'admin/author/author_add',
        {
            loggedAdmin:  commonUtils.getLoggedAccount(req.user)
        });
    }
)

authorRouter.post(
    '/authors/add', 
    [
        body('username').isAlphanumeric().withMessage("Only letters and numbers are allowed.").trim()
            // .isIn(['(admin|root|administrator|moderator)']).withMessage("Username must not contain special keywords.")
            .bail().custom(authorUtils.checkExistedUsername),
        body('email').isEmail().normalizeEmail().withMessage("Email is not valid.").trim()
            // .isIn(['*admin*','*root*','*administrator*','*moderator*']).withMessage("Email must not contain special keywords.")
            .bail().custom(authorUtils.checkExistedEmail),
        body('password').isLength({min: 4}).withMessage('Password must be at least 4 characters.').trim().escape(),
    ],
    async (req,res) => {
        const errors = validationResult(req);
        const validInput = matchedData(req, {location: ['body']});

        if (!errors.isEmpty()) {
            return res.render(
                "admin/author/author_add", 
                {
                    errors: errors.array(), 
                    validInput: validInput,
                    loggedAdmin:  commonUtils.getLoggedAccount(req.user)
                });
        }
        try {
            const authorObj = await authorUtils.createNewAuthor(
                req.body.username,
                req.body.email,
                req.body.password
            );

            if (authorObj) {
                req.flash("addSuccess", "Successfully. A new author was added.");
            } else {
                req.flash("addFail", "Failed. An error occurred during the process.");
            }

            return res.redirect("/admin/authors/add");
        } catch (error) {
            return res.sendStatus(404).render('pages/404');
        }
    }
)

authorRouter.get(
    "/authors/update/:username",
    async (req, res) => {
      try {
        const author = await AuthorModel.findOne({ username: req.params.username });
        
        if(author){
            return res.render(
                "admin/author/author_update", 
                { 
                    author: author,
                    loggedAdmin:  commonUtils.getLoggedAccount(req.user)
                });
        }
        return res.render("pages/404");
      } catch (error) {
            return res.sendStatus(404).render("pages/404");
      }
    }
  );
  
  authorRouter.post(
      "/authors/update/:username", 
      [
          body('username').isAlphanumeric().withMessage("Only letters and numbers are allowed.").trim()
              .bail().custom(authorUtils.checkExistedUsername),
          body('email').isEmail().normalizeEmail().withMessage("Email is not valid.")
              .bail().custom(authorUtils.checkExistedEmail)
      ],
      async (req, res) => {
          try {
              const author = await AuthorModel.findOne({ username: req.params.username });
                if (author) {
                    const errors = validationResult(req);
                    const validInput = matchedData(req, {location: ['body']});

                    if (!errors.isEmpty()) {
                        return res.render(
                            "admin/author/author_update", 
                            {
                                errors: errors.array(), 
                                validInput: validInput, 
                                author: author,
                                loggedAdmin:  commonUtils.getLoggedAccount(req.user)
                            });
                    }
                        
                    const updatedAuthor = await AuthorModel.findByIdAndUpdate(
                        {_id: author.id},
                        {
                            username: req.body.username,
                            email: req.body.email
                        }, {new: true}); // Return the updated object

                    if (updatedAuthor) {
                        req.flash('updateSuccess', 'Successfully. All changes were saved.');
                        return res.redirect("/admin/authors/update/" + updatedAuthor.username);
                    }else {
                        req.flash('updateFail', 'Failed. An error occurred during the process.');
                        return res.redirect("/admin/authors/update/" + author.username);
                    }

                }else {
                    req.flash('updateFail', 'Failed. An error occurred during the process.');
                    return res.redirect("/admin/authors/update/" + req.params.username);
                }
              
          } catch (error) {
              return res.sendStatus(404).render('pages/404');
          }
  });

authorRouter.post(
    "/authors/activate/:username", 
    async (req, res) => {
    try {
        const authorObj = await AuthorModel.findOne({ username: req.params.username });
        
        if (authorObj && authorObj.status === "Deactivated") {
            authorObj.status = "Activated";
            await authorObj.save();
            req.flash("statusSuccess", "Successfully. The status was changed to 'Activated'");
        } else {
            req.flash("statusFail", "Failed. An error occurred during the process.");
        }
        return res.redirect("/admin/authors");
    } catch (error) {
        return res.sendStatus(404).render('pages/404');
    }
});

authorRouter.post(
    "/authors/deactivate/:username", 
    async (req, res) => {
    try {
        const authorObj = await AuthorModel.findOne({ username: req.params.username });
        if (authorObj && authorObj.status === "Activated") {
            authorObj.status = "Deactivated";
            await authorObj.save();
            req.flash("statusSuccess", "Successfully. The status was changed to 'Deactivated'");
        } else {
            req.flash("statusFail", "Failed. An error occurred during the process.");
        }
        return res.redirect("/admin/authors");
    } catch (error) {
        return res.sendStatus(404).render('pages/404');
    }
});

authorRouter.post(
    "/authors/reset_password/", 
    async (req, res) => {
    try {
        const authorObj = await AuthorModel.findById({  _id: req.body.id });
        if (authorObj) {
            authorObj.password = 'Reset Password' ;
            await authorObj.save();
            req.flash("resetSuccess", "Successfully. A link was sent to email for setting up a new password.");
        } else {
            req.flash("resetFail", "Failed. An error occurred during the process.");
        }
        return res.redirect("/admin/authors");
    } catch (error) {
        return res.sendStatus(404).render('pages/404');
    }
});

authorRouter.post(
    "/authors/delete/", 
    async (req, res) => {
    try {
        const authorObj = await AuthorModel.findById({ _id: req.body.id });
        
        if (authorObj) {
            await AuthorModel.remove({_id: req.body.id});
            req.flash("deleteSuccess", "Successfully. The author was removed from the database.");
        } else {
            req.flash("deleteFail", "Failed. An error occurred during the process");
        }
        return res.redirect("/admin/authors");
    } catch (error) {
        return res.sendStatus(404).render('pages/404');
    }
});

module.exports = authorRouter;