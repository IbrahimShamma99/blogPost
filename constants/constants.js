const Routes = {
    signup:'api/users',
    login:'api/users/login',
    addArticle:'api/'
};

const TestNames = {
    loginTest:"Login Same user we assigned",
    uncorrectassigneduserTest:"uncorrect assigned user",
    newuserTest:"assign new user",
    loginWithMistakenEmailTest:"login With Mistaken Email",
    addArticleTest:"Add Article"
};

const ArticleRoutes = {
    Comment:'/:article/comments/:comment',
    Comments:'/:article/comments',
    Favorite:'/:article/favorite',
    article:'/:article',
    feed:'/feed',
    default:'/',
    base:'/articles'
};

const UserRoutes = {
    base:'/',
    user:'/user',
    login:'/user/login',
    users:'/users'
};

const ProfileRoutes = {
    base:'/profiles',
    username:'/:username',
    follow:'/:username/follow'
};
const TagsRoutes = {
    base:'/tags',
    default:'/'
};
const TestAccount = {
    "user":
    {
        "username": "hello@gmail.com",
        "password": "heisaverybadman"
    }
};
const UnAuthorizedAccountTest = {
    "user":
    {
        "username": "helloWorld@gmail.com",
        "password": "heisaverybadman"
    }
}
const TestArticle = {
    "article":{
        "title":"HELLO",
        "body":"HELLO it is Ibrahim!"
    }
};


const Constants = {
    Routes,
    TestNames,
    ArticleRoutes,
    UserRoutes,
    ProfileRoutes,
    TagsRoutes,
    TestAccount,
    TestArticle,
    UnAuthorizedAccountTest
};

module.exports = {
    Constants: Constants
};