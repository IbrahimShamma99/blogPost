var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var helper = require('../../middlewares/Helper');
var { Constants } = require("../../constants/constants");
// var {routes} = require("");
var { UserSearch, UserUpdate, UserLogin, UserSignup } = require("../methods/users")


//SECTION Search for a user 
router.get(Constants.UserRoutes.user, helper.required, UserSearch);

//SECTION Updates User
router.put(Constants.UserRoutes.user, helper.required, UserUpdate);

// SECTION Login
router.post(Constants.UserRoutes.login, UserLogin);

// SECTION Signup
router.post(Constants.UserRoutes.users, UserSignup);

module.exports = router;