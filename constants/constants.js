const Routes = {
    signup: 'api/users',
    login: 'api/users/login',
    addArticle: 'api/'
};

const ArticleRoutes = {
    Comment: 'api/:article/comments/:comment',
    Comments: '/:article/comments',
    Favorite: '/:article/favorite',
    article: '/:article',
    feed: '/feed',
    default: '/',
    base: '/articles'
};

const UserRoutes = {
    base: '/',
    user: '/user',
    login: '/user/login',
    users: '/users'
};

const ProfileRoutes = {
    base: '/profiles',
    username: '/:username',
    follow: '/:username/follow'
};
const TagsRoutes = {
    base: '/tags',
    default: '/'
};

const Constants = {
    Routes,
    ArticleRoutes,
    UserRoutes,
    ProfileRoutes,
    TagsRoutes
};

module.exports = {
    Constants: Constants
};