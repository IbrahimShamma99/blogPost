'use strict';
const { app } = require("../server");
const request = require("supertest");
const { Constants } = require("../constants/constants");

const TestAccount = Constants.TestAccount;
var auth = {};
loginUser(auth, TestAccount);//NOTE Add article using an authorized User

//SECTION Add article 
test('TEST article', function () {
    request(app)
        .post(Constants.Routes.addArticle)
        .send(Constants.TestArticle)
        .set('Authorization', 'bearer ' + auth.token)
        .expect(200)
        .end(function (err, res) {
            if (err) {setTimeout(2000,()=> console.log(err))};
        }).expect(201);
});


const UnAuthTestAccount = Constants.UnAuthorizedAccountTest;
auth = {};
loginUser(auth, UnAuthTestAccount);//NOTE Add article using an unauthorized User

//SECTION Add article 
test('TEST article', function () {
    request(app)
        .post(Constants.Routes.addArticle)
        .send(Constants.UnAuthTestAccount)
        .set('Authorization', 'bearer ' + auth.token)
        .end(function (err, res) {
            if (err) {setTimeout(2000,()=> console.log(err))};
        }).expect(422);
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