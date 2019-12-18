const request = require("supertest");
const {
    app
} = require("../server");
const {
    routes
} = require("../constants/constants");

const randomizer = Math.random();

test("assign new user", function () {

    request(app).post(routes.signup).send({
        user: {
            username: "Ibrahismjaws",
            email: "ininseeainin1" + randomizer.toString() + "@gmail.com",
            password: "macgeetheking"
        }
    }).expect(201);
});


test("Login Same user we assigned", function () {

    request(app).post(routes.signup).send({
        user: {
            email: "ininseeainin1" + randomizer.toString() + "@gmail.com",
            password: "macgeetheking"
        }
    }).expect(201);
});

// TODO Add article , Profile , tags tests