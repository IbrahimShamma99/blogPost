'use strict';
const { app } = require("../server");
const request = require("supertest");
const { Constants } = require("../constants/constants");
var session = require('supertest-session');
const TestAccount = Constants.TestAccount;
var testSession = null;

beforeEach(function () {
    testSession = session(app);
  });
var auth = {};
loginUser(auth, TestAccount);//NOTE Add article using an authorized User
//SECTION Add article 
test('TEST article', function () {
    
    testSession
        .post(Constants.Routes.addArticle)
        .send(Constants.TestArticle)
        .set('Authorization', 'bearer ' + auth.token)
        .expect(200)
        .end(function (err, res) {
            if (err) {setTimeout(2000,()=> console.log(err))
            
            
            };
        }).expect(201);
});


const UnAuthTestAccount = Constants.UnAuthorizedAccountTest;
auth = {};
loginUser(auth, UnAuthTestAccount);//NOTE Add article using an unauthorized User

//SECTION TEST article with no Authentication
test('TEST article with no Authentication', function () {
        testSession
        .post(Constants.Routes.addArticle)
        .send(Constants.UnAuthTestAccount)
        .set('Authorization', 'bearer ' + auth.token)
        .end(function (err, res) {
            if (err) {setTimeout(2000,()=> console.log(err))};
        })
        .expect(422);
});

var auth = {};
loginUser(auth, TestAccount);//NOTE Add article using an authorized User

//SECTION Add Comment 
test('Add Comment', function () {
    testSession
        .post(Constants.ArticleRoutes.Comments)
        .send(Constants.TestComment)
        .set('Authorization', 'bearer ' + auth.token)
        .expect(200)
        .end(function (err, res) {
            if (err) {setTimeout(2000,()=> console.log(err))
            };
        }).expect(201);
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