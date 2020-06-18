const Passport = require('passport').Passport;
const LocalStrategy = require('passport-local').Strategy;
const userPassport = new Passport();
const bcrypt = require('bcrypt');
const AuthorModel = require('../models/AuthorModel');

userPassport.use(
    'auth-user', 
    new LocalStrategy(
        {
            usernameField: 'email',
        },
        async function(email, password, done) {
            try {
                const user = await AuthorModel.findOne({ email: email });
                if (!user) {
                  return done(null, false, { message: "Incorrect email" });
                }
                if (!(await bcrypt.compare(password, user.password))) {
                  return done(null, false, { message: "Incorrect password" });
                }
                if (user.status === 'Deactivated'){
                  return done(null, false, { message: "Your account was not allowed to log in"});
                }
          
                return done(null,  user);
              } catch (error) {
                return done(error);
              }
        }
    )
)

userPassport.serializeUser(async function (obj, done) {
    return done(null, obj.id);
});

userPassport.deserializeUser(async function (id, done) {
    const user = await AuthorModel.findById(id).exec();
    if (user) return done(null,user);
    return done(null, false, 'Can not deserialize user');
});

module.exports = userPassport;