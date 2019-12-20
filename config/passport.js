var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]'
}, function(email, password, done) {
  User.findOne({email: email}).then(function(user){
    if(!user ){
      return done(null, false, {errors: {'email ': 'is invalid'}});
    }
//
  if(!user.validPassword(password)){
    return done(null, false, {errors: {'Password ': 'is invalid'}});
  }

    return done(null, user);
  }).catch(done);
}));

