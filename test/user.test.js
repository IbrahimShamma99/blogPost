const request = require("supertest");
const {
    app
} = require("../server");
const {
    Constants
} = require("../constants/constants");
var superagent = require('superagent');
var agent = superagent.agent();
const randomizer = Math.random();

//SECTION Uncorrect name or password
test(Constants.TestNames.uncorrectassigneduserTest,function () {
    request(app).post(Constants.Routes.signup).send({
        
            user:{
                email:"hi@gmail.com",
                password:"niggaknowshit"
            }
        
    }).expect(422);
});
//SECTION Register new user
test(Constants.TestNames.newuserTest, function () {

    request(app).post(Constants.Routes.signup).send({
        user: {
            username: "Ibrahismjaws",
            email: "ininseeainin1" + randomizer.toString() + "@gmail.com",
            password: "macgeetheking"
        }
    }).expect(201);
});

//SECTION login
test(Constants.TestNames.loginTest, function () {

    request(app).post(Constants.Routes.login).send({
        user: {
            email: "ininseeainin1" + randomizer.toString() + "@gmail.com",
            password: "macgeetheking"
        }
    }).expect(201);
});

//SECTION login with mistaken password or 
test(Constants.TestNames.loginWithMistakenEmailTest, function () {

    request(app).post(Constants.Routes.login).send({
        user: {
            email: "ininseeainin2" + randomizer.toString() + "@gmail.com",
            password: "macgeetheking"
        }
    }).expect(422);
});

