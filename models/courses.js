/*
 * Title: The course model implementation
 * Description: Implements APIs for performing CRUD operations
 * on MongoDB.
 * APIs can be invoked by route handlers. 
 */

// Import mongoose module
const mongoose = require('mongoose');

// Connect to MongoDB database 'courses=db'
// live mongodb ************************************************ */


mongoose.connect('mongodb://imagenie:#mlab234A@ds137600.mlab.com:37600/courses-db', { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error: Unable to connect to MongoDB", err));


//local mongodb ************************************************ */
// mongoose.connect('mongodb://localhost:27017/courses-db', { useNewUrlParser: true })
//     .then(() => console.log("Connected to MongoDB"))
//     .catch((err) => console.log("Error: Unable to connect to MongoDB", err));
//************************************************ */


// Create Course Schema
const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 60
    },
    author: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 60
    },
    tags: [String],
    date: { type: Date, default: Date.now },
    price: {
        type: Number,
        required: function () {
            return this.isPublished;
        }
    },
    isPublished: Boolean
});

// Create a model from the Schema (Course is a model (Class))
const Course = mongoose.model('Course', courseSchema);

/* Get All courses 
 * IN: None. TODO: Add filter params
 * OUT: Courses collection in JSON format
 */
async function getAllCourses() {
    try {
        const courses = await Course.find();
        return courses;
    }
    catch (err) {
        console.log("Error: Unable to query database");
        throw err;
    }
}

/* Get course by ID
 * IN: id (course object ID)
 * OUT: Single course object
 */
async function getCourseById(id) {
    try {
        const course = await Course.findById(id);
        return course;
    }
    catch (err) {
        console.log("Error: Unable to query database");
        throw err;
    }
}


/* Get course by ID
 * IN: id (course object ID)
 * OUT: Single course object
 */
async function getCourseByName(courseName) {
    try {
        const course = await Course.find({name:courseName})
        return course;
    }
    catch (err) {
        console.log("Error: Unable to query database");
        throw err;
    }
}

/* Create a course
 * IN: Course object
 * Output: Course Object, including object id
 */
async function createCourse(courseInfo) {
    // Instantiate the Course. Here course represents a document object
    const course = new Course(courseInfo);

    // Validate and save the document
    try {
        // Use validate method to validate a document
        var result = await course.validate();
        result = await course.save();
        return result;
    }
    catch (err) {
        console.log("Error: Could not save document");
        throw err;
    }
}



/* Update a course by ID
 * IN: Course object, including object id
 * OUT: Updated course object
 */
async function updateCourse(courseInfo) {
    const id = courseInfo._id;
    // find the document - findById()
    try {
        let course = await Course.findById(id);
        if (!course) {
            console.log("Error: Cannot find course with ID: ", id);
            throw new Error("Course not found");
        }

        // Modify its properties
        course.set(courseInfo);
        // save the document - save()
        const result = await course.save();
        return result;
    }
    catch(err) {
        console.log("Error: Cannot save course with ID: ", id);
        throw err;
    }
}


async function deleteCourseById(id) {
    console.log("ID: ", id);
    // find the document - findById()
    try {
        let course = await Course.findById(id);
        if (!course) {
            console.log("Error: Cannot find course with ID: ", id);
            throw new Error("Course not found");
        }
  
        // delete the document - findOneAndDelete()
        console.log("Delete this "+id)
       const result = await course.remove()
       return result;
    }
    catch(err) {
        console.log("Error: Cannot delete course with ID: ", id);
        throw err;
    }
}

/* Delete a course by ID
 * IN: id (course object ID)
 */

module.exports.createCourse = createCourse;
module.exports.getAllCourses = getAllCourses;
module.exports.getCourseById = getCourseById;
module.exports.getCourseByName = getCourseByName
module.exports.updateCourse = updateCourse;
module.exports.deleteCourseById = deleteCourseById;
