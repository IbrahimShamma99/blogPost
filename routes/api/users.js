var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var helper = require('../../middlewares/Helper');
var {Constants} = require("../../constants/constants");
// var {routes} = require("");
//NOTE Search for a user 
router.get( Constants.UserRoutes.user , helper.required , function(req, res, next){
  User.findById(req.payload.id).then(
    function(user){
    if(!user){ return res.sendStatus(401); 
    }
    return res.json({user: user.toAuthJSON()});
  }).catch(next);
});

//NOTE Updates User
router.put(Constants.UserRoutes.user , helper.required, function(req, res, next){
  User.findById(req.payload.id).then(function(user){
    
    if(!user){ return res.sendStatus(401); }

    //NOTE  only update fields that were actually passed...
    if(typeof req.body.user.username !== 'undefined'){
      user.username = req.body.user.username;
    }
    if(typeof req.body.user.email !== 'undefined'){
      user.email = req.body.user.email;
    }
    if(typeof req.body.user.bio !== 'undefined'){
      user.bio = req.body.user.bio;
    }
    if(typeof req.body.user.image !== 'undefined'){
      user.image = req.body.user.image;
    }
    if(typeof req.body.user.password !== 'undefined'){
      user.setPassword(req.body.user.password);
    }

    return user.save().then(function(){
      return res.json({user: user.toAuthJSON()});
    });
  }).catch(next);
});
//NOTE Login
router.post(Constants.UserRoutes.login, function(req, res, next){
  if(!req.body.user.email){
    return res.status(422).json({errors: {email: "can't be blank"}});
  }

  if(!req.body.user.password){
    return res.status(422).json({errors: {password: "can't be blank"}});
  }

  passport.authenticate('local', {session: false}, function(err, user, info){
    if(err){ return next(err); }

    if(user){
      user.token = user.generateJWT();
      user = user.toAuthJSON()
      return res.json({
        username:user.username ,
        email:user.email  });
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

// NOTE Signup
router.post(Constants.UserRoutes.users, function(req, res, next){
  var user = new User();
  try {
  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);
  }
  catch(e)
  {
    console.log(e);
  }

  user.save().then(function(){
    user= user.toAuthJSON();
    return res.json({
      email:user.email,
      username:user.username
    });
  }).catch(next);
});

module.exports = router;
