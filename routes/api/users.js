var router = require('express').Router();
var helper = require('../../middlewares/Helper');
const { Constants } = require("../../constants/constants");
const { UserSearch, UserUpdate, UserLogin, UserSignup } = require("../methods/users");

//SECTION Search for a user 
router.get(Constants.UserRoutes.user, helper.required, UserSearch);

//SECTION Updates User
router.put(Constants.UserRoutes.user, helper.required, UserUpdate);

// SECTION Login
router.post(Constants.UserRoutes.login, UserLogin);

// SECTION Signup
router.post(Constants.UserRoutes.users, UserSignup);

module.exports = router;