var router = require('express').Router();
var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var helper = require('../../middlewares/Helper');
const {Constants} = require("../../constants/constants");

/* ANCHOR IMPORTANT 
populate is the process of 
replacing refrences in DB with document(s)
*/
// SECTION  load article objects on routes with ':article'
router.param('article',function(req,res,next,slug){
  Article.findOne({ slug: slug})
    .populate('author')
    .then(function (article) {
      //NOTE in case article not found
      if (!article) { 
        return res.sendStatus(404); 
      }
      req.article = article;
      return next();//MiddleWare
    }).catch(next);
});

router.param('comment', function(req, res, next, id) {
  Comment.findById(id).then(function(comment){
    if(!comment) { 
      return res.sendStatus(404); 
    }
    req.comment = comment;
    return next();
  }).catch(ncommentext);
});

router.get(Constants.ArticleRoutes.default, helper.optional, function(req, res, next) {
  var query = {};
  var limit = 20;
  var offset = 0;

  if(typeof req.query.limit !== 'undefined'){
    limit = req.query.limit;
    //Whatever req.query.limit you have assign it to limit 
  }

  if(typeof req.query.offset !== 'undefined'){
    offset = req.query.offset;
    //Whatever req.query.offset you have assign it to offset
  }

  if( typeof req.query.tag !== 'undefined' ){
    query.tagList = {"$in" : [req.query.tag]};
  }

  Promise.all([
    //NOTE find Author and Favorited 
    req.query.author ? User.findOne({username: req.query.author}) : null,
    req.query.favorited ? User.findOne({username: req.query.favorited}) : null
  ]).then(function(results){
    var author = results[0];//NOTE author of the article
    var favoriter = results[1];//NOTE favoriter => Who favors this article

    if(author){
      query.author = author._id;
    }

    if(favoriter){
      query._id = {$in: favoriter.favorites};
    } else if(req.query.favorited){
      query._id = {$in: []};
    }

    return Promise.all([
      Article.find(query)
        .limit(Number(limit))
        .skip(Number(offset))
        .sort({createdAt: 'desc'})
        .populate('author')
        .exec(),
        //NOTE exec() is to return a Promise
      Article.count(query).exec(),
      req.payload ? User.findById(req.payload.id) : null,
    ]).then(function(results){
      var articles = results[0];
      var articlesCount = results[1];
      var user = results[2];
      return res.json({
        articles: articles.map(function(article){
          return article.toJSONFor(user);
        }),
        articlesCount: articlesCount
      });
    });
  }).catch(next);
});

router.get(Constants.ArticleRoutes.feed, helper.required, function(req, res, next) {
  var limit = 20;
  var offset = 0;

  if(typeof req.query.limit !== 'undefined'){
    limit = req.query.limit;
  }

  if(typeof req.query.offset !== 'undefined'){
    offset = req.query.offset;
  }

  User.findById(req.payload.id).then(function(user)
  {
    if (!user) { 
      return res.sendStatus(401); 
    }

    Promise.all([
      Article.find({ author: {$in: user.following}})
        .limit(Number(limit))
        .skip(Number(offset))
        .populate('author')
        .exec(), //NOTE exec => returns as a promise
      Article.count({author:{$in: user.following}})
    ]).then(function(results){
      var articles = results[0];
      var articlesCount = results[1];
      return res.json({
        articles: articles.map(function(article){
          return article.toJSONFor(user);
        }),
        articlesCount: articlesCount
      });
    }).catch(next);
  });
});

//NOTE Add Article
router.post(Constants.ArticleRoutes.default, helper.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    var article = new Article(req.body.article);

    article.author = user;

    return article.save().then(function(){
      console.log(article.author);
      return res.json({article: article.toJSONFor(user)});
    });
  }).catch(next);
});

// NOTE Search for a article
router.get(Constants.ArticleRoutes.article, helper.optional, function(req, res, next) {
  Promise.all([
    req.payload ? User.findById(req.payload.id) : null,
    req.article.populate('author').execPopulate()
  ]).then(function(results){
    var user = results[0];
    return res.json({article: req.article.toJSONFor(user)});
  }).catch(next);
});

// NOTE update article
router.put(Constants.ArticleRoutes.article,helper.required,function(req,res,next) 
{
  User.findById(req.payload.id).then(function(user)
  {
    if(req.article.author._id.toString() === req.payload.id.toString()){
      if(typeof req.body.article.title !== 'undefined'){
        req.article.title = req.body.article.title;
      }

      if(typeof req.body.article.description !== 'undefined'){
        req.article.description = req.body.article.description;
      }

      if(typeof req.body.article.body !== 'undefined'){
        req.article.body = req.body.article.body;
      }

      if(typeof req.body.article.tagList !== 'undefined'){
        req.article.tagList = req.body.article.tagList
      }

      req.article.save().then(function(article){
        return res.json({article: article.toJSONFor(user)});
      }).catch(next);
    } else {
      return res.sendStatus(403);
    }
  });
});

//NOTE delete article
router.delete( Constants.ArticleRoutes.article , helper.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    if(req.article.author._id.toString() === req.payload.id.toString()){
      return req.article.remove().then(function(){
        return res.sendStatus(204);
      });
    } else {
      return res.sendStatus(403);
    }
  }).catch(next);
});

// NOTE Favorite an article
router.post(Constants.ArticleRoutes.Favorite, helper.required, function(req, res, next) {
  var articleId = req.article._id;

  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    return user.favorite(articleId).then(function(){
      return req.article.updateFavoriteCount().then(function(article){
        return res.json({article: article.toJSONFor(user)});
      });
    });
  }).catch(next);
});

//NOTE Unfavorite an article
router.delete(Constants.ArticleRoutes.Favorite, helper.required, function(req, res, next) {
  var articleId = req.article._id;

  User.findById().threq.payload.iden(function (user){
    if (!user) { return res.sendStatus(401); }

    return user.unfavorite(articleId).then(function(){
      return req.article.updateFavoriteCount().then(function(article){
        return res.json({article: article.toJSONFor(user)});
      });
    });
  }).catch(next);
});

// NOTE return an article's comments
router.get(Constants.ArticleRoutes.Comments, helper.optional, function(req, res, next){
  Promise.resolve(req.payload ? User.findById(req.payload.id) : null).then(function(user){
    return req.article.populate({
      path: 'comments',
      populate: {
        path: 'author'
      },
      options: {
        sort: {
          createdAt: 'desc'
        }
      }
    }).execPopulate().then(function(article) {
      return res.json({comments: req.article.comments.map(function(comment){
        return comment.toJSONFor(user);//NOTE return as a promise
      })});
    });
  }).catch(next);
});

// create a new comment
router.post(Constants.ArticleRoutes.Comments, helper.required, function(req, res, next) {
  /**Query structure 
   * UserId = req.payload.id
   * article = {}
   * author = user
   * comments = [{}]
   */
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    var comment = new Comment(req.body.comment);
    comment.article = req.article;
    comment.author = user;

    return comment.save().then(function(){
      req.article.comments.push(comment);

      return req.article.save().then(function(article) {
        res.json({comment: comment.toJSONFor(user)});
      });
    });
  }).catch(next);
});
/**SECTION 
 * What happening here 
 * Find article by id 
 * then list of comments for this article
 * find by id the comment desired to be deleted 
 * NOTE Authentication is required to Delete
 */
router.delete( Constants.ArticleRoutes.DeleteComment , helper.required, function(req, res, next) {
  if(req.comment.author.toString() === req.payload.id.toString() || 
  req.comment.article.author.toString() === req.payload.id.toString()){
    //NOTE Giving the article author ability to delete Comments on his article
    req.article.comments.remove(req.comment._id);
    req.article.save()
      .then(Comment.find({_id: req.comment._id}).remove().exec())
      .then(function(){
        res.sendStatus(204);
      });
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
