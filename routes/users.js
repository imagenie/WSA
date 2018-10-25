// Include the required modules
const { createUser, 
        getAllUsers, 
        getuserByUserName, 
        deleteUserById, 
        updateUser
    } = require('../models/users');
const express = require('express');
const Joi = require('joi'); // JSON validation

const route = express.Router();

//"/api/users - URL"
// Route handler for get all users
route.get('/', (req, res) => {
    // Get all users
    getAllUsers()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.status(500);
            res.send("Error: Unable to get user\n" + err.message);
            console.log("Error: Unable to get user\n", err);
        })
});

//API with param id
route.get('/:username', (req, res) => {
    const username = req.params.username;
    // Get the user object using id
    getuserByUserName(username)
    .then((result) => {
        res.send(result);
    })
    .catch((err) => {
        res.status(404);
        res.send("Error: Unable to get user\n" + err.message);
        console.log("Error: Unable to get user\n", err);
    })
});

/****************** END: get requests *************/

/****************** BEGIN: post requests *************/

// http://localhost/api/user - POST - {JSON user}
// POST API to create a new user
route.post('/', (req, res) => {
    // Validate the user info
    const { error } = validateuser(req.body); //Joi
    
    if (error) {
        res.status(400);
        res.send(error.details[0].message); // Sending 1st error message
        console.log(error);
        return;
    }

    // Add user to db
    createUser(req.body) // JSON user object
        .then((result) => {
            res.send(result); //  Send the result (new user object) back to user
            console.log("Created a new user: ", result.name);
        })
        .catch((err) => {
            res.status(500);
            res.send("Error: Unable to create user\n" + err.message);
            console.log("Error: Unable to create user\n", err);
        });
});

/****************** END: post requests *************/

/****************** BEGIN: PUT requests *************/
// Handler to update a user using put method
route.put('/:id', (req, res) => {
    // Look up the user. If not found return 404

});

// Handler to delete a user using delete method
route.delete('/', (req, res) => {
    // Look up the user. If not found return 404
    const id = req.body._id
    // Get the user object using id
    console.log("------------ "+id);
    deleteUserById(id)
    .then((result) => {
        res.send(result);
    })
    .catch((err) => {
        res.status(404);
        res.send("Error: Unable to get user\n" + err.message);
        console.log("Error: Unable to get user\n", err);
    })

});

// Validate function
function validateuser(user) {
    // Define schema
    const schema = {
        username: Joi.string().min(4).max(60).required(),
        password: Joi.string().min(8).max(20).required(),
        userrole: Joi.string().required()
    };

    // Validate
    const result = Joi.validate(user, schema);
    return result;
}

module.exports = route;