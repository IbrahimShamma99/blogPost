const TestRoutes = {
    signup:'api/users',
    login:'api/users/login'
};

const TestNames = {
    loginTest:"Login Same user we assigned",
    uncorrectassigneduserTest:"uncorrect assigned user",
    newuser:"assign new user"
};

const ArticleRoutes = {
    DeleteComment:'/:article/comments/:comment',
    Comments:'/:article/comments',
    Favorite:'/:article/favorite',
    article:'/:article',
    feed:'/feed',
    default:'/',
    base:'/articles'
};

const Constants = {    
    TestRoutes ,
    TestNames,
    ArticleRoutes
};

module.exports = {
    Constants: Constants
};