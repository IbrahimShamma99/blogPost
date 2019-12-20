const TestRoutes = {
    signup:'api/users',
    login:'api/users/login'
};

const TestNames = {
    loginTest:"Login Same user we assigned",
    uncorrectassigneduserTest:"uncorrect assigned user",
    newuser:"assign new user"
};

const TestConstants = {    
    TestRoutes ,
    TestNames};

module.exports = {
    TestConstants
};