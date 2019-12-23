'use strict';
const { app } = require("../server");
const request = require("supertest");
const { Constants } = require("../constants/constants");
var session = require('supertest-session');
const TestAccount = Constants.TestAccount;
const UnAuthTestAccount = Constants.UnAuthorizedAccountTest;
var testSession = null;
beforeEach(function () {
    testSession = session(app);
  });
var auth = {};
prepareUser(TestAccount);//NOTE Add article using an authorized User
//SECTION Add article While being Authorized
test('TEST article', function () {
    
    request(app)
        .post(Constants.Routes.addArticle)
        .send(Constants.TestArticle)
        .set('Authorization', 'bearer ' + auth.token)
        .expect(200)
        .end(function (err, res) {
            if (err) {setTimeout(200,()=> console.log(err))
            };
        }).expect(201);
});
//SECTION Add Comment autorized
test('Add Comment with authentication', function () {
    request(app)
        .post(Constants.ArticleRoutes.Comments)
        .send(Constants.TestComment)
        .set('Authorization', 'bearer ' + auth.token)
        .expect(200)
        .end(function (err, res) {
            if (err) {setTimeout(200,()=> console.log(err))
            };
        }).expect(201);
});
//NOTE Add article using an unauthorized User
prepareUser(UnAuthTestAccount);
//SECTION TEST article with no Authentication
test('TEST article with no Authentication', function () {
        request(app)
        .post(Constants.Routes.addArticle)
        .send(Constants.TestArticle)
        .set('Authorization', 'bearer ' + auth.token)
        .end(function (err, res) {
            if (err) {setTimeout(200,()=> console.log(err))};
        }).expect(422);
});
//SECTION Add Comment autorized
test('Add Comment without authentication', function () {
    request(app)
        .post(Constants.ArticleRoutes.Comments)
        .send(Constants.TestComment)
        .set('Authorization', 'bearer ' + auth.token)
        .expect(422);
});
//TODO Fix this crap !
function loginUser(auth, Account) {
    return function (done) {
        request(app)
            .post(Constants.Routes.login)
            .send(Account)
            .expect(200)
            .end(onResponse);
        function onResponse(err, res) {
            auth.token = res.body.token;
            return done();
        }
    };
}
function prepareUser (Account) {
    auth = {};
    loginUser(auth, Account);
};