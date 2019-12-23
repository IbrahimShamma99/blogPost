var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

// SECTION Passport local strategy
passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]'
}, function(email, password, done) {
  User.findOne({email: email}).then(function(user){
    //NOTE if user not found
    if(!user ){
      return done(null, false, {errors: {'email ': 'is invalid'}});
    }
  // NOTE if password is incorrect
  if(!user.validPassword(password)){
    return done(null, false, {errors: {'Password ': 'is invalid'}});
  }
    return done(null, user);//NOTE Means that it works
  }).catch(done);
}));

