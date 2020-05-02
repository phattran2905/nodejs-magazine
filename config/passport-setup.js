const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const AdminModel = require("../models/AdministratorModel");
const bcrypt = require("bcrypt");

const passportSetup = function (passport) {
  const authenticateAdmin = async (req, email, password, done) => {
    try {
      const admin = await AdminModel.findOne({ email: email });
      if (!admin) {
        return done(null, false, { message: "Incorrect email!" });
      }
      if (!(await bcrypt.compare(password, admin.password))) {
        return done(null, false, { message: "Incorrect password!" });
      }
      if (admin.status === 'Deactivated'){
        return done(null,false, { message: "Your account was not allowed to log in!"})
      }
      
      return done(null, admin);
    } catch (error) {
      return done(error);
    }
  };

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true
      },
      authenticateAdmin
    )
  );

  passport.serializeUser(function (admin, done) {
    done(null, admin.id);
  });

  passport.deserializeUser(function (id, done) {
    AdminModel.findById(id, function (err, admin) {
      done(err, admin);
    });
  });
};

module.exports = passportSetup;
