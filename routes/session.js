// Include the required modules
const { isValidUser } = require('../models/users');
const express = require('express');
const Joi = require('joi'); // JSON validation
const {generateToken, verifyToken} = require('../utils/auth');

const route = express.Router();

// http://localhost/api/session - POST - {JSON userInfo}
// POST API to create a new session (Login)
route.post('/', (req, res) => {
    // Validate the course info
    const { error } = validateUser(req.body); //Joi
    if (error) {
        res.status(400);
        res.send(error.details[0].message); // Sending 1st error message
        console.log(error);
        return;
    }
    // Validate user credentials
    isValidUser(req.body) // JSON user object
        .then((result) => {
            if (result) {
                // Create JWT, and send it
                var payload = {username: req.body.username};
                generateToken(payload, function (err, token) {
                    if(!err) {
                        var tokenObj = {"token": token};
                        res.status(200).send(tokenObj);
                        console.log("Token111: ", tokenObj);
                        
                    }
                    else {
                        res.status(500).send("Token generation failed");
                        console.log("Error: Token generation failed");
                    }
                })
            }
            else {
                res.status(422).send(result);
            }
        })
        .catch((err) => {
            res.status(500);
            res.send("Error: Unable to validate user\n" + err.message);
            console.log("Error: Unable to validate user\n", err);
        });
});

// Validate function
function validateUser(userInfo) {
    // Define schema
    const schema = {
        username: Joi.string().min(4).max(60).required(),
        password: Joi.string().min(4).max(60).required(),
       // role: Joi.string().required()
    };

    // Validate
    const result = Joi.validate(userInfo, schema);

    return result;
}


module.exports = route;