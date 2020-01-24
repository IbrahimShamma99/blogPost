var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

const Feed = (req, res, next) => {
    var query = {};
    var limit = 20;
    var offset = 0;

    if (typeof req.query.limit !== 'undefined') {
        limit = req.query.limit;
        //Whatever req.query.limit you have assign it to limit 
    }

    if (typeof req.query.offset !== 'undefined') {
        offset = req.query.offset;
        //Whatever req.query.offset you have assign it to offset
    }

    if (typeof req.query.tag !== 'undefined') {
        query.tagList = { "$in": [req.query.tag] };
    }

    Promise.all([
        //NOTE find Author and Favorited 
        req.query.author ? User.findOne({ username: req.query.author }) : null,
        req.query.favorited ? User.findOne({ username: req.query.favorited }) : null
    ]).then(function(results) {
        var author = results[0]; //NOTE author of the article
        var favoriter = results[1]; //NOTE favoriter => Who favors this article

        if (author) {
            query.author = author._id;
        }

        if (favoriter) {
            query._id = { $in: favoriter.favorites };
        } else if (req.query.favorited) {
            query._id = { $in: [] };
        }

        return Promise.all([
            Article.find(query)
            .limit(Number(limit))
            .skip(Number(offset))
            .sort({ createdAt: 'desc' })
            .populate('author')
            .exec(),
            //NOTE exec() is to return a Promise
            Article.count(query).exec(),
            req.payload ? User.findById(req.payload.id) : null,
        ]).then(function(results) {
            var articles = results[0];
            var articlesCount = results[1];
            var user = results[2];
            return res.json({
                articles: articles.map(function(article) {
                    return article.toJSONFor(user);
                }),
                articlesCount: articlesCount
            });
        });
    }).catch(next);
};
const NewsFeed = (req, res, next) => {
    var limit = 20;
    var offset = 0;

    if (typeof req.query.limit !== 'undefined') {
        limit = req.query.limit;
    }

    if (typeof req.query.offset !== 'undefined') {
        offset = req.query.offset;
    }

    User.findById(req.payload.id).then(function(user) {
        if (!user) {
            return res.sendStatus(401);
        }

        Promise.all([
            Article.find({ author: { $in: user.following } })
            .limit(Number(limit))
            .skip(Number(offset))
            .populate('author')
            .exec(), //NOTE exec => returns as a promise
            Article.count({ author: { $in: user.following } })
        ]).then(function(results) {
            var articles = results[0];
            var articlesCount = results[1];
            return res.json({
                articles: articles.map(function(article) {
                    return article.toJSONFor(user);
                }),
                articlesCount: articlesCount
            });
        }).catch(next);
    });
};

const DelteUpvote = (req, res, next) => {
    var commentid = req.comment._id;
    /**REVIEW  Steps
     * Get comment 
     * Get user 
     * update upvotes
     */
    User.findById(req.payload.id).threq.payload.iden(function(user) {
        if (!user) {
            return res.sendStatus(401);
        }
        return user.Cancelupvote(commentid).then(function() {
            return req.commentid.updateUpvotesCount().then(function(comment) {
                return res.json({ comment: comment.toJSONFor(user) });
            });
        });
    }).catch(next);
};


module.exports = { Feed, NewsFeed, DelteUpvote };