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
            
        if(hasError) { 
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

    adminRouter.get (
      '/profile/change_password',
      (req,res) => {
        res.render('admin/profile/profile_base',
        {
            content: 'change password',
            information: authUtils.getAdminProfile(req)
        });
      }
    );

    adminRouter.post(
      '/profile/change_password',
      validation.change_password,
      async (req,res) => {
        const { hasError, errors, validInput } = validation.result(req);
        
        if(hasError) {console.log(errors); console.log(validInput);
            return  res.render('admin/profile/profile_base',{
                errors: errors, 
                validInput: validInput,
                content:  'change password',
                information : authUtils.getAdminProfile(req)
            });
        };

        try {
            const changePwdQuery = await adminUtils.changePwd({
                id: req.session.admin._id,
                new_password: req.body.new_password
            });
            console.log(changePwdQuery);
            if(changePwdQuery && changePwdQuery.n ===1 && changePwdQuery.ok ===1) {
                const reloadInfo = await authUtils.reloadLoggedAdmin(req, req.session.admin._id);
                if(reloadInfo) {
                    req.flash('success', 'Successfully! Your new password was saved.');
                    return res.redirect('/admin/profile/change_password');
                }
            }

            req.flash('fail', 'Failed! An error occurred during the process.');
            return res.redirect('/admin/profile/change_password');

        } catch (error) {
            req.flash('fail', 'Failed! An error occurred during the process.');
            return res.redirect('/profile/change_password');
        }
      }
    )
}