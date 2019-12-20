var router = require('express').Router();
var {Constants} = require("../../constants/constants");
router.use( Constants.UserRoutes.base , require('./users'));
router.use(Constants.ProfileRoutes.base, require('./profiles'));
router.use( Constants.ArticleRoutes.base , require('./articles'));
router.use(Constants.TagsRoutes.base, require('./tags'));

router.use(function(err, req, res, next){
  if(err.name === 'ValidationError'){
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key){
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }

  return next(err);
});

module.exports = router;