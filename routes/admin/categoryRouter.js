const CategoryModel = require('../../models/CategoryModel')
const authUtils = require('../../utils/authUtils');
const categoryUtils = require('../../utils/categoryUtils');
const validation = require('../../validation/admin/validateCategory');

module.exports = function(adminRouter) {
    adminRouter.get(
        '/categories' , 
        async (req,res) => {
        try {
            const categories = await CategoryModel.find();
            return res.render(
                'admin/category/category_base',
                {
                    header: 'List of categories',
                    content: 'categories',
                    categories: categories,
                    information: authUtils.getAdminProfile(req)
                });
        } catch (error) {
            return res.render(
                "error/admin-404", 
                {redirectLink: '/admin/categories'}
            );
        }
    });
    
    adminRouter.get(
        '/categories/add',
        (req,res) => {
        return res.render(
            'admin/category/category_base',
            {
                header: 'Add new category',
                content: 'add',
                information: authUtils.getAdminProfile(req)
            });
        }
    )
    
    adminRouter.post(
        '/categories/add', 
        validation.add,
        async (req,res) => {
            const { hasError, errors, validInput } = validation.result(req);
                
            if(hasError) { 
                return  res.render(
                    'admin/category/category_base',{
                    errors: errors, 
                    validInput: validInput,
                    header: 'Add new category',
                    content: 'add',
                    information: authUtils.getAdminProfile(req)
                });
            };
            
            try {
                const category = await categoryUtils.createNewCategory(
                    {
                        name: validInput.name
                    } );

                if (category) {
                    req.flash("success", "Successfully. A new author was added.");
                } else {
                    req.flash("fail", "Failed. An error occurred during the process.");
                }
    
                return res.redirect("/admin/categories/add");
            } catch (error) {
                return res.render(
                    "error/admin-404", 
                    {redirectLink: '/admin/categories'}
                );
            }
        }
    )
    
    adminRouter.get(
        "/categories/update/:id",
        async (req, res) => {
          try {
            const category = await CategoryModel.findOne({ _id: req.params.id });
            
            if(category){
                return res.render(
                    "admin/category/category_base", 
                    { 
                        category: category,
                        header: 'Update new category',
                        content: 'update',
                        information: authUtils.getAdminProfile(req)
                    });
            }
            return res.render(
                "error/admin-404", 
                {redirectLink: '/admin/categories'}
            );
          } catch (error) {
            return res.render(
                "error/admin-404", 
                {redirectLink: '/admin/categories'}
            );
          }
        }
      );
      
      adminRouter.post(
          "/categories/update/:id", 
         validation.update,
          async (req, res) => {

              try {
                const category = await CategoryModel.findOne({_id: req.params.id});
                if (category) {
                    const { hasError, errors, validInput } = validation.result(req);
                        
                    if(hasError) {
                        return  res.render(
                            'admin/category/category_base',{
                            errors: errors, 
                            validInput: validInput,
                            header: 'Update new category',
                            content: 'update',
                            category: category,
                            information: authUtils.getAdminProfile(req)
                        });
                    };

                    const updatedCategory = await CategoryModel.findByIdAndUpdate(
                        req.params.id,
                        {
                            name: req.body.name
                        }, {new: true}); // Return the updated object

                    if (updatedCategory) {
                        req.flash('success', 'Successfully. All changes were saved.');
                        return res.redirect("/admin/categories/update/" + updatedCategory.id);
                    }

                    req.flash('fail', 'Failed. An error occurred during the process.');
                    return res.redirect("/admin/categories/update/" + category.id);
                }
                
                return res.render(
                    "error/admin-404", 
                    {redirectLink: '/admin/categories'}
                );
              } catch (error) {
                    return res.render(
                        "error/admin-404", 
                        {redirectLink: '/admin/categories'}
                    );
              }
      });
    
    adminRouter.post(
        "/categories/activate", 
        async (req, res) => {
        try {
            const category = await CategoryModel.findOneAndUpdate(
                { $and: [{_id: req.body.id}, {status: 'Deactivated'}] },
                { status: 'Activated' } );
            
            if (category) {
                req.flash("success", "Successfully. The status was changed to 'Activated'");
            } else {
                req.flash("fail", "Failed. An error occurred during the process.");
            }
            return res.redirect("/admin/categories");
        } catch (error) {
            return res.render(
                "error/admin-404", 
                {redirectLink: '/admin/categories'}
            );
        }
    });
    
    adminRouter.post(
        "/categories/deactivate", 
        async (req, res) => {
        try {
            const category = await CategoryModel.findOneAndUpdate(
                { $and: [{_id: req.body.id}, {status: 'Activated'}] },
                { status: 'Deactivated' } );

            if (category ) {
                req.flash("success", "Successfully. The status was changed to 'Deactivated'");
            } else {
                req.flash("fail", "Failed. An error occurred during the process.");
            }
            return res.redirect("/admin/categories");
        } catch (error) {
            return res.render(
                "error/admin-404", 
                {redirectLink: '/admin/categories'}
            );
        }
    });
    
    adminRouter.post(
        "/categories/delete/", 
        async (req, res) => {
        try {
            const category = await CategoryModel.findByIdAndDelete(req.body.id);
            
            if (category) {
                req.flash("success", "Successfully. The author was removed from the database.");
            } else {
                req.flash("fail", "Failed. An error occurred during the process");
            }
            return res.redirect("/admin/categories");
        } catch (error) {
            return res.render(
                "error/admin-404", 
                {redirectLink: '/admin/categories'}
            );
        }
    });
    
}
