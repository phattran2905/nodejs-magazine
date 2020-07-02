const AdminModel = require('../models/AdministratorModel');
const commonUtils = require('./commonUtils');
const bcrypt = require('bcrypt');

const AdminUtils = {
  // validation
  validate: {
    checkExistedEmail: async function (email, {
      req
    }) {
      const match = await AdminModel.findOne({
        email: email
      });
      if (match) {
        if (typeof req.params.username !== 'undefined' && match.username === req.params.username) {
          return true;
        }
        throw new Error('Email already existed.');
      }
      return true;
    },
    checkExistedUsername: async function (username, {
      req
    }) {
      const match = await AdminModel.findOne({
        username: username
      });
      if (match) {
        if (typeof req.params.username !== 'undefined' && match.username === req.params.username) {
          return true;
        }
        throw new Error('Username already existed.');
      }
      return true;
    },
    checkPresentPwd: async (pwd = null, {req} = {}) => {
        if(!pwd || typeof req.session.admin === 'undefined') {return Promise.reject(false)};
        
        const adminPwd = req.session.admin.password;
        try {
          console.log(adminPwd);
            const match = await bcrypt.compare(pwd, adminPwd);
            if (match) {return Promise.resolve(true);}

            return Promise.reject(false);
        } catch (error) {
            return Promise.reject(false);
        }
    },
  },
  // 
  createNewAdmin: async (adminObj = {
    username,
    email,
    pwd,
    role
  }) => {
    try {
      adminObj.hashed_pwd = await bcrypt.hash(adminObj.pwd, await bcrypt.genSalt(12));
      adminObj.verifyToken = await commonUtils.generateToken(adminObj.username + adminObj.email, 7); // valid in 7 days
      const adminAccount = await AdminModel.create({
        username: adminObj.username,
        email: adminObj.email,
        password: adminObj.hashed_pwd,
        profile: {
          fullname: "",
          gender: "Male",
          dateOfBirth: "",
          phone: ""
        },
        verifyToken: {
          token: adminObj.verifyToken.tokenStr,
          expiredOn: adminObj.verifyToken.expiredOn
        },
        role: adminObj.role,
        status: 'Activated'
      });

      return adminAccount;
    } catch (error) {
      return null;
    }
  },

  updateProfile: async ({fullname, username, gender, dob, phone}) => {
    if (!fullname || !username || !gender || !dob || !phone) {return null;}

    try {
        const updateResponse = await AdminModel.updateOne(
          {username: username},
            {
                'profile.fullname': fullname,
                'profile.gender': gender,
                'profile.dateOfBirth': new Date(dob), // Parse it to UTC/GMT instead of locale time
                'profile.phone': phone
            }
        );
        
        return updateResponse;    
    } catch (error) {
        console.log(error);
        return null;
    }
  },

  update_avatar: async(admin_id = null, {path, contentType, filename, size} = {}) => {
    if (!admin_id || !path || !contentType || !filename || !size) 
        {return null;}

    try {
        const admin = await AdminModel.findById(admin_id);
        
        if (admin) {
            const updateQuery = await AdminModel.updateOne(
                {_id: admin.id},
                {
                    'profile.avatar_img': {
                        path: path,
                        contentType: contentType,
                        filename: filename,
                        size: size
                    }
                }
            );
            return updateQuery;
        }
    } catch (error) {
        return null;
    }
    return null;
  },
  changePwd: async function({id, new_password}) {
    if (!id || !new_password) return null;
    console.log({id, new_password});
    try {
        const hashed_pwd = await bcrypt.hash(new_password,await bcrypt.genSalt(12));
        const updateResponse = await AdminModel.updateOne(
          {_id: id},
          {
            password: hashed_pwd
          });
        
        return updateResponse;    
    } catch (error) {
        console.log(error);
        return null;
    }
},
};

module.exports = AdminUtils;