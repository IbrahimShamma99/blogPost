const request = require("supertest");
const {
    app
} = require("../server");
const {
    Constants
} = require("../constants/constants");

const randomizer = Math.random();

//Uncorrect name or password
test(Constants.TestNames.uncorrectassigneduserTest,function () {
    request(app).post(Constants.TestRoutes.signup).send({
        
            user:{
                email:"hi@gmail.com",
                password:"niggaknowshit"
            }
        
    }).expect(422);
});
//NOTE Register new user
test(Constants.TestNames.newuser, function () {

    request(app).post(Constants.TestRoutes.signup).send({
        user: {
            username: "Ibrahismjaws",
            email: "ininseeainin1" + randomizer.toString() + "@gmail.com",
            password: "macgeetheking"
        }
    }).expect(201);
});

//NOTE login 
test(Constants.TestNames.loginTest, function () {

    request(app).post(Constants.TestRoutes.login).send({
        user: {
            email: "ininseeainin1" + randomizer.toString() + "@gmail.com",
            password: "macgeetheking"
        }
    }).expect(201);
});