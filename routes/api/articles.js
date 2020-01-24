var router = require('express').Router();
var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var helper = require('../../middlewares/Helper');
const { Constants } = require("../../constants/constants");
const { Feed, NewsFeed, DelteUpvote } = require("../methods/articles");
const { article, comment } = require("../population/population");
/* ANCHOR IMPORTANT 
populate is the process of 
replacing refrences in DB with document(s)
*/
// SECTION  load article objects on routes with ':article'
router.param('article', article);
router.param('comment', comment);

router.get(Constants.ArticleRoutes.default, helper.optional, Feed);

//SECTION FEED
router.get(Constants.ArticleRoutes.feed, helper.required, NewsFeed);

// SECTION Add Article
router.post(Constants.ArticleRoutes.default, helper.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (!user) { return res.sendStatus(401); }

        var article = new Article(req.body.article);

        article.author = user;

        return article.save().then(function() {
            console.log(article.author);
            return res.json({ article: article.toJSONFor(user) });
        });
    }).catch(next);
});

// SECTION  Search for a article
router.get(Constants.ArticleRoutes.article, helper.optional, function(req, res, next) {
    Promise.all([
        req.payload ? User.findById(req.payload.id) : null,
        req.article.populate('author').execPopulate()
    ]).then(function(results) {
        var user = results[0];
        return res.json({ article: req.article.toJSONFor(user) });
    }).catch(next);
});

// SECTION  update article
router.put(Constants.ArticleRoutes.article, helper.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (req.article.author._id.toString() === req.payload.id.toString()) {
            if (typeof req.body.article.title !== 'undefined') {
                req.article.title = req.body.article.title;
            }

            if (typeof req.body.article.description !== 'undefined') {
                req.article.description = req.body.article.description;
            }

            if (typeof req.body.article.body !== 'undefined') {
                req.article.body = req.body.article.body;
            }

            if (typeof req.body.article.tagList !== 'undefined') {
                req.article.tagList = req.body.article.tagList
            }

            req.article.save().then(function(article) {
                return res.json({ article: article.toJSONFor(user) });
            }).catch(next);
        } else {
            return res.sendStatus(403);
        }
    });
});

// SECTION delete article
router.delete(Constants.ArticleRoutes.article, helper.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (!user) { return res.sendStatus(401); }

        if (req.article.author._id.toString() === req.payload.id.toString()) {
            return req.article.remove().then(function() {
                return res.sendStatus(204);
            });
        } else {
            return res.sendStatus(403);
        }
    }).catch(next);
});

// SECTION Favorite an article
router.post(Constants.ArticleRoutes.Favorite, helper.required, function(req, res, next) {
    var articleId = req.article._id;

    User.findById(req.payload.id).then(function(user) {
        if (!user) { return res.sendStatus(401); }

        return user.favorite(articleId).then(function() {
            return req.article.updateFavoriteCount().then(function(article) {
                return res.json({ article: article.toJSONFor(user) });
            });
        });
    }).catch(next);
});

// SECTION Unfavorite an article
router.delete(Constants.ArticleRoutes.Favorite, helper.required, function(req, res, next) {
    var articleId = req.article._id;

    User.findById().threq.payload.iden(function(user) {
        if (!user) { return res.sendStatus(401); }

        return user.unfavorite(articleId).then(function() {
            return req.article.updateFavoriteCount().then(function(article) {
                return res.json({ article: article.toJSONFor(user) });
            });
        });
    }).catch(next);
});

// SECTION return an article's comments
router.get(Constants.ArticleRoutes.Comments, helper.optional, function(req, res, next) {
    Promise.resolve(req.payload ? User.findById(req.payload.id) : null).then(function(user) {
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
            return res.json({
                comments: req.article.comments.map(function(comment) {
                    return comment.toJSONFor(user); //NOTE return as a promise
                })
            });
        });
    }).catch(next);
});

// SECTION create a new comment
router.post(Constants.ArticleRoutes.Comments, helper.required, function(req, res, next) {
    /**Query structure 
     * UserId = req.payload.id
     * article = {}
     * author = user
     * comments = [{}]
     */
    User.findById(req.payload.id).then(function(user) {
        if (!user) { return res.sendStatus(401); }

        var comment = new Comment(req.body.comment);
        comment.article = req.article;
        comment.author = user;

        return comment.save().then(function() {
            req.article.comments.push(comment);

            return req.article.save().then(function(article) {
                res.json({ comment: comment.toJSONFor(user) });
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
router.delete(Constants.ArticleRoutes.Comment, helper.required, function(req, res, next) {
    if (req.comment.author.toString() === req.payload.id.toString() ||
        req.comment.article.author.toString() === req.payload.id.toString()) {
        //NOTE Giving the article author ability to delete Comments on his article
        req.article.comments.remove(req.comment._id);
        req.article.save()
            .then(Comment.find({ _id: req.comment._id }).remove().exec())
            .then(function() {
                res.sendStatus(204);
            });
    } else {
        res.sendStatus(403);
    }
});

//SECTION Upvote a comment
router.post(Constants.ArticleRoutes.Comment,
    helper.required,
    (req, res, next) => {
        /**REVIEW Steps
         * Get comment 
         * Get user 
         * update upvotes
         */
        var commentId = req.comment._id;
        User.findById(req.payload.id).then(function(user) {
            if (!user) {
                return res.sendStatus(401);
            }
            return user.upvote(commentId).then(function() {
                return req.comment.updateUpvotesCount().then(function(comment) {
                    return res.json({ comment: comment.toJSONFor(user) });
                });
            });
        }).catch(next);
    });

//SECTION  cancel upvoting a comment
router.delete(Constants.ArticleRoutes.Favorite,
    helper.required,
    DelteUpvote);

module.exports = router;