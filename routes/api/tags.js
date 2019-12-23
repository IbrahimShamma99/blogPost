var router = require('express').Router();
var mongoose = require('mongoose');
var Article = mongoose.model('Article');
const {Constants} = require("../../constants/constants");

//NOTE return a list of tags
router.get(Constants.TagsRoutes.default, function(req, res, next) {
  Article.find().distinct('tagList').then(function(tags){
    return res.json({tags: tags});
  }).catch(next);
});

module.exports = router;
