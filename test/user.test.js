const request = require("supertest");
const {
    app
} = require("../server");
const {
    TestConstants
} = require("../constants/constants");

const randomizer = Math.random();

//Uncorrect name or password
test(TestConstants.TestNames.uncorrectassigneduserTest,function () {
    request(app).post(TestConstants.TestRoutes.signup).send({
        
            user:{
                email:"hi@gmail.com",
                password:"niggaknowshit"
            }
        
    }).expect(422);
});
//NOTE Register new user
test(TestConstants.TestNames.newuser, function () {

    request(app).post(TestConstants.TestRoutes.signup).send({
        user: {
            username: "Ibrahismjaws",
            email: "ininseeainin1" + randomizer.toString() + "@gmail.com",
            password: "macgeetheking"
        }
    }).expect(201);
});

//NOTE login 
test(TestConstants.TestNames.loginTest, function () {

    request(app).post(TestConstants.TestRoutes.login).send({
        user: {
            email: "ininseeainin1" + randomizer.toString() + "@gmail.com",
            password: "macgeetheking"
        }
    }).expect(201);
});

// TODO Add article , Profile , tags tests