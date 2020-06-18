const LocalStrategy = require("passport-local").Strategy;
const AdminModel = require("../models/AdministratorModel");
const AuthorModel = require("../models/AuthorModel");
const bcrypt = require("bcrypt");
const { use } = require("passport");


const isUser = async function(id) {
  try {
    const user = await AuthorModel.findById(id).exec();
    
    if(user) {return true;}
    
    return false;
  } catch (error) {
    return false;
  }
}

const isAdmin = async function(id) {
  try {
    const admin = await AdminModel.findById(id).exec();

    if (admin) {return true;}

    return false;
  } catch (error) {
    return false;
  }
}

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

  const authenticateUser = async (req, email, password, done) => {
    try {
      const user = await AuthorModel.findOne({ email: email });
      if (!user) {
        return done(null, false, { message: "Incorrect email!" });
      }
      if (!(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: "Incorrect password!" });
      }
      if (user.status === 'Deactivated'){
        return done(null, false, { message: "Your account was not allowed to log in!"});
      }

      return done(null,  user);
    } catch (error) {
      return done(error);
    }
  };

  passport.serializeUser(async function (obj, done) {
    if (await isUser(obj.id)){
      return done(null, {id: obj.id, model: 'user'});
    } else if (await isAdmin(obj.id)){
      return done(null, {id: obj.id, model: 'admin'});
    }
    // return done(null, obj.id);
  });

  passport.deserializeUser(async function ({id, model}, done) {
    if (model === 'user') {
      AuthorModel.findById(id, function (err, user) {
        done(err, {loggedUser: user});
      });
    } else if(model === 'admin'){
      AdminModel.findById(id, function (err, admin) {
        done(err, {loggedAdmin: admin});
      });
    } else {
      done(null,false);
    }
  });
  
  passport.use(
    'auth-admin',
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true
      },
      authenticateAdmin
    )
  );
  
  passport.use(
    'auth-user',
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true 
      },
      authenticateUser
    )
  );
};

module.exports = passportSetup;
