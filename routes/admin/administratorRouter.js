const AdminModel = require("../../models/AdministratorModel");
const authUtils = require("../../utils/authUtils");
const adminUtils = require("../../utils/administratorUtils");
const commonUtils = require("../../utils/commonUtils");
const validation = require('../../validation/admin/validateAdministrator');

module.exports = function(adminRouter){
    adminRouter.get(
        "/administrators", 
        async (req, res) => {
            const administrators = await AdminModel.find();
            res.render(
                "admin/administrator/administrator_base",
                { 
                    content: 'administrators',
                    administrators: administrators, 
                    information: authUtils.getAdminProfile(req)
                });
        }
    );
    
    adminRouter.get(
        "/administrators/add", 
        (req,res) => {    
            res.render(
                "admin/administrator/administrator_base",
                {
                    content: 'add',
                    information: authUtils.getAdminProfile(req)
                });
        }
    );
    
    adminRouter.post(
        "/administrators/add",
        validation.add,
        async (req, res) => {
            const { hasError, errors, validInput } = validation.result(req);
                
            if(hasError) { 
                return  res.render('admin/administrator/administrator_base',{
                    errors: errors, 
                    validInput: validInput,
                    content: 'add',
                    information: authUtils.getAdminProfile(req)
                });
            };

            try {
                const newAdmin = await adminUtils.createNewAdmin
                ({
                    username: req.body.username,
                    email: req.body.email,
                    pwd: req.body.password,
                    role: req.body.role
                });
                
                if (newAdmin) {
                    req.flash("success", "Successfully. A new administrator was added.");
                } else {
                    req.flash("fail", "Failed. An error occurred during the process.");
                }
    
                return res.redirect("/admin/administrators/add");
            } catch (error) {
                return res.render(
                    "pages/404", 
                    {redirectLink: '/admin/administrators'}
                  );
            }
        }
    );
    
    adminRouter.get(
      "/administrators/update/:username",
      async (req, res) => {
        try {
          const admin = await AdminModel.findOne({ username: req.params.username });
          if(admin) {
            return res.render(
                "admin/administrator/administrator_base", 
                  { 
                      content: 'update',
                      admin: admin,
                      information: authUtils.getAdminProfile(req)
                  });
          }

          return res.render(
              "pages/404", 
              {redirectLink: '/admin/administrators'}
            );
        } catch (error) {
            return res.render(
                "pages/404", 
                {redirectLink: '/admin/administrators'}
              );
        }
      }
    );
    
    adminRouter.post(
        "/administrators/update/:username", 
        validation.update,
        async (req, res) => {
            try {
                const admin = await AdminModel.findOne({ username: req.params.username });
                if (admin){
                    const { hasError, errors, validInput } = validation.result(req);
            
                    if(hasError) { 
                        return  res.render(
                            'admin/administrator/administrator_base',{
                            errors: errors, 
                            validInput: validInput,
                            content: 'update',
                            admin: admin,
                            information: authUtils.getAdminProfile(req)
                        });
                    };

                    const updatedAdmin = await AdminModel.findOneAndUpdate(
                        {_id: admin.id},
                        {
                            username: req.body.username,
                            email: req.body.email,
                            role: req.body.role
                        },{new: true}); // Return the updated object
    
                    if (updatedAdmin){
                        req.flash('success', 'Successfully. All changes were saved.');
                        return res.redirect("/admin/administrators/update/" + updatedAdmin.username);
                    }
                    
                    req.flash('fail', 'Failed. An error occurred during the process.');
                    return res.redirect("/admin/administrators/update/" + admin.username);
                }
                
                return res.render(
                    "pages/404", 
                    {redirectLink: '/admin/administrators'}
                );
            } catch (error) {
                return res.render(
                    "pages/404", 
                    {redirectLink: '/admin/administrators'}
                );
            }
    });
    
    adminRouter.post(
        "/administrators/activate/", 
        async (req, res) => {
        try {
            const admin = await AdminModel.findOneAndUpdate(
                { $and: [{_id: req.body.id}, {status: 'Deactivated'}] },
                { status: 'Activated'} );
            
            if (admin) {
                req.flash("success", "Successfully. The account was activated.");
            } else {
                req.flash("fail", "Failed. An error occurred during the process.");
            }

            return res.redirect("/admin/administrators");
        } catch (error) {
            return res.render(
                "pages/404", 
                {redirectLink: '/admin/administrators'}
            );
        }
    });
    
    adminRouter.post(
        "/administrators/deactivate/", 
        async (req, res) => {
        try {
            // const adminObj = await AdminModel.findById(req.body.id);
            const admin = await AdminModel.findOneAndUpdate(
                { $and: [{_id: req.body.id}, {status: 'Activated'}] },
                { status: 'Deactivated'} );
            
            if (admin) {
                req.flash("success", "Successfully. The account was deactivated.");
            } else {
                req.flash("fail", "Failed. An error occurred during the process.");
            }

            return res.redirect("/admin/administrators");
        } catch (error) {
            return res.render(
                "pages/404", 
                {redirectLink: '/admin/administrators'}
            );
        }
    });
    
    adminRouter.post(
        "/administrators/reset_password/", 
        async (req, res) => {
        try {
            const admin = await AdminModel.findOneAndUpdate(
                { $and: [{_id: req.body.id}, {password: {$ne: 'Reset Password'} }] },
                { password: 'Reset Password' } );
                
            if (admin) {
                req.flash("success", "Successfully. A link was sent to email for setting up a new password.");
            } else {
                req.flash("fail", "Failed. An error occurred during the process.");
            }
            return res.redirect("/admin/administrators");
        } catch (error) {
            return res.render(
                "pages/404", 
                {redirectLink: '/admin/administrators'}
            );
        }
    });
    
    adminRouter.post(
        "/administrators/delete/", 
        async (req, res) => {
        try {
            const admin = await AdminModel.findByIdAndDelete(req.body.id);
            
            if (admin) {
                req.flash("success", "Successfully. The administrator was removed from the database.");
            } else {
                req.flash("fail", "Failed. An error occurred during the process");
            }
            return res.redirect("/admin/administrators");
        } catch (error) {
            return res.render(
                "pages/404", 
                {redirectLink: '/admin/administrators'}
            );
        }
    });
};
