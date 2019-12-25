const TestNames = {
    loginTest: "Login Same user we assigned",
    uncorrectassigneduserTest: "uncorrect assigned user",
    newuserTest: "assign new user",
    loginWithMistakenEmailTest: "login With Mistaken Email",
    addArticleTest: "Add Article"
};

const TestAccount = {
    "user": {
        "username": "hello@gmail.com",
        "password": "heisaverybadman"
    }
};
const UnAuthorizedAccountTest = {
    "user": {
        "username": "helloWorld@gmail.com",
        "password": "heisaverybadman"
    }
}
const TestArticle = {
    "article": {
        "title": "HELLO",
        "body": "HELLO it is Ibrahim!"
    }
};
const TestComment = {
    "comment": {
        "body": "The greatest comment of all time"
    }
};

TestConstants = {
    TestComment,
    TestArticle,
    UnAuthorizedAccountTest,
    TestAccount,
    TestNames
};

module.exports = { TestConstants };