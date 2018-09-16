/* Unit test code for users model */

const {
    createUser, getAllUsers, isValidUser
} = require('../models/users');

function testCreateUser() {
    // Create a course document
    createUser({
        username: "mubeen",
        password: "secret",
    }).then((res) => console.log(res))
        .catch((err) => console.log(err.message));
}

function testGetAllUsers() {
    getAllUsers()
        .then((res) => console.log(res))
        .catch((err) => console.log(err.message));
}

function testIsValidUser() {
    var user = {username: 'mubeen', password: 'secret'};

    isValidUser(user)
        .then((res) => {
            if (res)
                console.log("User credentials match");
            else
                console.log("Invalid user credentials");
        })
        .catch((err) => console.log(err.message));
}

setTimeout(() => {
    testCreateUser();
    //testGetAllUsers();
    //testIsValidUser();
    //testUpdateCourse();
}, 3000);

