'use strict';
const { app } = require("../server");
const request = require("supertest");
const { Constants } = require("../constants/constants");

const TestAccount = Constants.TestAccount;
const auth = {};
loginUser(auth);

//SECTION Add article
test('TEST article', function () {
        request(app)
            .post(Constants.Routes.addArticle)
            .send(Constants.TestArticle)
            .set('Authorization', 'bearer ' + auth.token)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Array);
            }).expect(201);
    });

//TODO Fix this crap !
function loginUser(auth) {
    return function (done) {
        request(app)
            .post(Constants.Routes.login)
            .send(TestAccount)
            .expect(200)
            .end(onResponse);
        function onResponse(err, res) {
            auth.token = res.body.token;
            return done();
        }
    };
}