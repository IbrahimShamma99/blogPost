const article = function(req, res, next, slug) {
    Article.findOne({ slug: slug })
        .populate('author')
        .then(function(article) {
            //NOTE in case article not found
            if (!article) {
                return res.sendStatus(404);
            }
            req.article = article;
            return next(); //MiddleWare
        }).catch(next);
};

const comment = (req, res, next, id) => {
    Comment.findById(id).then(function(comment) {
        if (!comment) {
            return res.sendStatus(404);
        }
        req.comment = comment;
        return next();
    }).catch(ncommentext);
};

module.exports = { article, comment };