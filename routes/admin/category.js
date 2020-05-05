const express = require('express')
const categoryRouter = express.Router()
const CategoryModel = require('../../models/CategoryModel')
const {body, validationResult, matchedData} = require('express-validator')
const commonUtils = require('../../utils/common');
const authUtils = require('../../utils/auth');
const authorUtils = require('../../utils/author');

// categoryRouter.post('/category/add',async (req,res) => {{
//     const display_order = parseInt(req.body.display_order) ? (req.body.display_order) : 1000
//     try {
//         console.log(req.body)
//         await Category.create({
//             name: req.body.category_name,
//             display_order: display_order
//         })
//         res.redirect('/category/add')
//     } catch (error) {
//         console.log(req.body)
//         res.sendStatus(404)
//     }
// }});

categoryRouter.use(authUtils.checkAuthenticatedAdmin);

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
    res.render(
        'admin/author/author_add',
        {
            loggedAdmin:  commonUtils.getLoggedAccount(req.user)
        });
    }
)

// categoryRouter.post(
//     '/categories/add', 
//     [
//         body('username').isAlphanumeric().withMessage("Only letters and numbers are allowed.").trim()
//             // .isIn(['(admin|root|administrator|moderator)']).withMessage("Username must not contain special keywords.")
//             .bail().custom(authorUtils.checkExistedUsername),
//         body('email').isEmail().normalizeEmail().withMessage("Email is not valid.").trim()
//             // .isIn(['*admin*','*root*','*administrator*','*moderator*']).withMessage("Email must not contain special keywords.")
//             .bail().custom(authorUtils.checkExistedEmail),
//         body('password').isLength({min: 4}).withMessage('Password must be at least 4 characters.').trim().escape(),
//     ],
//     async (req,res) => {
//         const errors = validationResult(req);
//         const validInput = matchedData(req, {location: ['body']});

//         if (!errors.isEmpty()) {
//             return res.render(
//                 "admin/author/author_add", 
//                 {
//                     errors: errors.array(), 
//                     validInput: validInput,
//                     loggedAdmin:  commonUtils.getLoggedAccount(req.user)
//                 });
//         }
//         try {
//             const authorObj = await authorUtils.createNewAuthor(
//                 req.body.username,
//                 req.body.email,
//                 req.body.password,
//                 req.body.role
//             );

//             if (authorObj) {
//                 req.flash("addSuccess", "Successfully. A new author was added.");
//             } else {
//                 req.flash("addFail", "Failed. An error occurred during the process.");
//             }

//             return res.redirect("/admin/categories/add");
//         } catch (error) {
//             return res.sendStatus(404).render('pages/404');
//         }
//     }
// )

// categoryRouter.get(
//     "/categories/update/:username",
//     async (req, res) => {
//       try {
//         const author = await AuthorModel.findOne({ username: req.params.username });
        
//         if(author){
//             return res.render(
//                 "admin/author/author_update", 
//                 { 
//                     author: author,
//                     loggedAdmin:  commonUtils.getLoggedAccount(req.user)
//                 });
//         }
//         return res.render("pages/404");
//       } catch (error) {
//             return res.sendStatus(404).render("pages/404");
//       }
//     }
//   );
  
//   categoryRouter.post(
//       "/categories/update/:username", 
//       [
//           body('username').isAlphanumeric().withMessage("Only letters and numbers are allowed.").trim()
//               .bail().custom(authorUtils.checkExistedUsername),
//           body('email').isEmail().normalizeEmail().withMessage("Email is not valid.")
//               .bail().custom(authorUtils.checkExistedEmail)
//       ],
//       async (req, res) => {
//           try {
//               const author = await AuthorModel.findOne({ username: req.params.username });
//                 if (author) {
//                     const errors = validationResult(req);
//                     const validInput = matchedData(req, {location: ['body']});

//                     if (!errors.isEmpty()) {
//                         return res.render(
//                             "admin/author/author_update", 
//                             {
//                                 errors: errors.array(), 
//                                 validInput: validInput, 
//                                 author: author,
//                                 loggedAdmin:  commonUtils.getLoggedAccount(req.user)
//                             });
//                     }
                        
//                     const updatedAuthor = await AuthorModel.findByIdAndUpdate(
//                         {_id: author.id},
//                         {
//                             username: req.body.username,
//                             email: req.body.email
//                         }, {new: true}); // Return the updated object

//                     if (updatedAuthor) {
//                         req.flash('updateSuccess', 'Successfully. All changes were saved.');
//                         return res.redirect("/admin/categories/update/" + updatedAuthor.username);
//                     }else {
//                         req.flash('updateFail', 'Failed. An error occurred during the process.');
//                         return res.redirect("/admin/categories/update/" + author.username);
//                     }

//                 }else {
//                     req.flash('updateFail', 'Failed. An error occurred during the process.');
//                     return res.redirect("/admin/categories/update/" + req.params.username);
//                 }
              
//           } catch (error) {
//               return res.sendStatus(404).render('pages/404');
//           }
//   });

// categoryRouter.post(
//     "/categories/activate/:username", 
//     async (req, res) => {
//     try {
//         const authorObj = await AuthorModel.findOne({ username: req.params.username });
        
//         if (authorObj && authorObj.status === "Deactivated") {
//             authorObj.status = "Activated";
//             await authorObj.save();
//             req.flash("statusSuccess", "Successfully. The status was changed to 'Activated'");
//         } else {
//             req.flash("statusFail", "Failed. An error occurred during the process.");
//         }
//         return res.redirect("/admin/categories");
//     } catch (error) {
//         return res.sendStatus(404).render('pages/404');
//     }
// });

// categoryRouter.post(
//     "/categories/deactivate/:username", 
//     async (req, res) => {
//     try {
//         const authorObj = await AuthorModel.findOne({ username: req.params.username });
//         if (authorObj && authorObj.status === "Activated") {
//             authorObj.status = "Deactivated";
//             await authorObj.save();
//             req.flash("statusSuccess", "Successfully. The status was changed to 'Deactivated'");
//         } else {
//             req.flash("statusFail", "Failed. An error occurred during the process.");
//         }
//         return res.redirect("/admin/categories");
//     } catch (error) {
//         return res.sendStatus(404).render('pages/404');
//     }
// });

// categoryRouter.post(
//     "/categories/reset_password/", 
//     async (req, res) => {
//     try {
//         const authorObj = await AuthorModel.findById({  _id: req.body.id });
//         if (authorObj) {
//             authorObj.password = 'Reset Password' ;
//             await authorObj.save();
//             req.flash("resetSuccess", "Successfully. A link was sent to email for setting up a new password.");
//         } else {
//             req.flash("resetFail", "Failed. An error occurred during the process.");
//         }
//         return res.redirect("/admin/categories");
//     } catch (error) {
//         return res.sendStatus(404).render('pages/404');
//     }
// });

// categoryRouter.post(
//     "/categories/delete/", 
//     async (req, res) => {
//     try {
//         const authorObj = await AuthorModel.findById({ _id: req.body.id });
        
//         if (authorObj) {
//             await AuthorModel.remove({_id: req.body.id});
//             req.flash("deleteSuccess", "Successfully. The author was removed from the database.");
//         } else {
//             req.flash("deleteFail", "Failed. An error occurred during the process");
//         }
//         return res.redirect("/admin/categories");
//     } catch (error) {
//         return res.sendStatus(404).render('pages/404');
//     }
// });

module.exports = categoryRouter;