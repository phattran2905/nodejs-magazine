const Passport = require('passport').Passport;
const LocalStrategy = require('passport-local').Strategy;
const adminPassport = new Passport();
const bcrypt = require('bcrypt');
const AdminModel = require('../models/AdministratorModel');

adminPassport.use(
    'auth-admin', 
    new LocalStrategy(
        {
            usernameField: 'email',
        },
        async function(email, password, done) {
            try {
                const admin = await AdminModel.findOne({ email: email });
                if (!admin) {
                  return done(null, false, { message: "Incorrect email" });
                }
                if (!(await bcrypt.compare(password, admin.password))) {
                  return done(null, false, { message: "Incorrect password" });
                }
                if (admin.status === 'Deactivated'){
                  return done(null, false, { message: "Your account was not allowed to log in"});
                }
                console.log(admin);
                return done(null,  admin);
              } catch (error) {
                return done(error);
              }
        }
    )
)

adminPassport.serializeUser(async function (obj, done) {
    return done(null, obj.id);
});

adminPassport.deserializeUser(async function (id, done) {
    const admin = await AuthorModel.findById(id).exec();
    if (admin) return done(null, admin);
    return done(null, false, 'Can not deserialize user');
});

module.exports = adminPassport;