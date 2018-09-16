/*
 * Title: The user model implementation
 * Description: Implements APIs for performing CRUD operations
 * on MongoDB.
 * APIs can be invoked by route handlers. 
 */

// Import mongoose module
const mongoose = require('mongoose');

// Connect to MongoDB database 'courses=db'
mongoose.connect('mongodb://localhost:27017/courses-db', { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error: Unable to connect to MongoDB", err));

// Create Course Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 60
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 60
    }
});
//------------------------------------------------------------------------------------------------------

// Create User model from the userSchema
const User = mongoose.model('User', userSchema);

/* Get All users 
 * IN: None. TODO: Add filter params
 * OUT: Courses collection in JSON format
 */
async function getAllUsers() {
    try {
        const users = await User.find().select('-password');
        return users;
    }
    catch (err) {
        console.log("Error: Unable to query database");
        throw err;
    }
}
//------------------------------------------------------------------------------------------------------

/* Get user by name
 * IN: user (username is unique)
 * OUT: Single user object
 */
async function getUserByUsername(username) {
    try {
        const user = await User.findOne({ username: username });
        //console.log("Got user ", user);
        return user;
    }
    catch (err) {
        console.log("Error: Unable to query database");
        throw err;
    }
}
//------------------------------------------------------------------------------------------------------

/* Create a new user, if it does not exist
 * IN: User object
 * Output: User Object, including object id
 */
async function createUser(userInfo) {
    try {
        // Check if user already exists
        const user = await getUserByUsername(userInfo.username);
        if (user) {
            // User exits, throw an error
            console.log(`Error: User ${user} already exists`);
            var err = new Error("User already exists");
            throw err;
        }
        else {
            // Create a new user as it does not exit in db
            // TODO: password should be hashed before storing
            const user = new User(userInfo);

            // Validate and save the document
            try {
                // Use validate method to validate a document
                var result = await user.validate();
                result = await user.save();
                return result;
            }
            catch (err) {
                console.log("Error: Could not save document");
                throw err;
            }
        }
    }
    catch (err) {
        throw err;
    }
}
//------------------------------------------------------------------------------------------------------
/* Update a user by ID
 * IN: user object, including object id
 * OUT: Updated user object
 */
async function updateUser(userInfo) {
	const id = userInfo._id;
	console.log(userInfo);
	// find the document - findById()
	try {
		console.log(id);
		let user = await User.findById(id);
		if (!user) {
			console.log("Error: Cannot find user with ID: ", id);
			throw new Error("user not found");
		}

		// Modify its properties
		user.set(userInfo);
		// save the document - save()
		const result = await user.save();
		return result;
	}
	catch (err) {
		console.log("Error: Cannot save user with ID: ", id);
		throw err;
	}
}
//------------------------------------------------------------------------------------------------------

// Verify user credentials
async function isValidUser(userInfo) {
    try {
        // Check if user already exists
        const user = await getUserByUsername(userInfo.username);
        if (user) {
            // User exits, check for password
            return (userInfo.password === user.password);
        }
        else {
            console.log(`Error: Invalid user ${user}`);
            return false;
        }
    }
    catch (err) {
        throw err;
    }
}
//------------------------------------------------------------------------------------------------------
async function deleteUserById(id) {
	console.log("ID: ", id);
	// find the document - findById()
	try {
		let user = await User.findById(id);
		if (!user) {
			console.log("Error: Cannot find user with ID: ", id);
			throw new Error("user not found");
		}

		// delete the document - findOneAndDelete()
		console.log("Delete this " + id)
		const result = await user.remove()
		return result;
	}
	catch (err) {
		console.log("Error: Cannot delete user with ID: ", id);
		throw err;
	}
}

//------------------------------------------------------------------------------------------------------
/* Get user by username
 * IN: username (user object username)
 * OUT: Single user object
 */
async function getuserByUserName(username) {
	try {
		const user = await User.findOne({ username: username }).select('-password').select('-_id').select('-__v').select('-isAdmin')
		return user;
	}
	catch (err) {
		console.log("Error: Unable to query database");
		throw err;
	}
}
//------------------------------------------------------------------------------------------------------

// Export the functions
module.exports.createUser = createUser;
module.exports.getAllUsers = getAllUsers;
module.exports.getuserByUserName = getuserByUserName;
module.exports.updateUser = updateUser;
module.exports.deleteUserById = deleteUserById;
module.exports.isValidUser = isValidUser;