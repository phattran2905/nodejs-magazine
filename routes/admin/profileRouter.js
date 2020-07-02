const adminUtils = require('../../utils/administratorUtils');
const authUtils = require("../../utils/authUtils");
const validation = require('../../validation/admin/validateProfile');
const upload = require('../../config/upload-setup');

module.exports = function(adminRouter) {
    adminRouter.get(
      '/profile',
      async (req,res) => {
          res.render('admin/profile/profile_base',
          {
              content: 'profile',
              information: authUtils.getAdminProfile(req)
          });
      }
    );

    adminRouter.post(
      '/profile',
      validation.profile,
      async (req,res) => {
        const { hasError, errors, validInput } = validation.result(req);
            
        if(hasError) { console.log(errors); console.log(validInput);
            return  res.render('admin/profile/profile_base',{
                errors: errors, 
                validInput: validInput,
                content: 'profile',
                information: authUtils.getAdminProfile(req)
            });
        };

        try { 
          const updatedQuery = await adminUtils.updateProfile({
              fullname: req.body.fullname,
              username: req.body.username,
              gender: req.body.gender,
              dob: req.body.dob,
              phone: req.body.phone
          });

          if (updatedQuery && updatedQuery.n === 1 && updatedQuery.ok === 1){
              const reloadedInfo = await authUtils.reloadLoggedAdmin(req, req.session.admin._id);
              if(reloadedInfo) {
                  req.flash('success', 'Successfully! Your changes were saved.');
                  return res.redirect('/admin/profile');
              }
          }
          req.flash('fail', 'Failed! An error occurred during the process.');
          return res.redirect('/admin/profile');

      } catch (error) {
          req.flash('fail', 'Failed! An error occurred during the process.');
          return res.redirect('/admin/profile');
      }
      }
    );

    adminRouter.post(
      '/profile/upload_avatar',
      upload.single('avatar_img'),
      async (req, res) => {
        const information = authUtils.getAdminProfile(req);
        console.log(req.file)
        const updateQuery = await adminUtils.update_avatar(
            information.id, 
            {
                path: req.file.path,
                contentType: req.file.mimetype,
                filename: req.file.filename,
                size: req.file.size
            });
        if (updateQuery && updateQuery.n === 1 && updateQuery.nModified === 1) {
            const reloaded_admin = await authUtils.reloadLoggedAdmin(req, information.id);
            if(reloaded_admin) {return res.redirect('/admin/profile');}
        }
        
        req.flash('fail', 'Failed! An error occurred during the process.');
        return res.redirect('/admin/profile');
      }
    );
}