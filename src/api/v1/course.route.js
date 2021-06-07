const express = require("express");
const {courseController} = require("../../controllers");
const catchAsync = require("../../utils/catchAsync");
const {authenticate} = require("../../midllewares/auth");

const statusMessageError = require("../../utils/statusMessageError");

const router = express.Router();

router
    .route("/me")
    .post(
        catchAsync(authenticate), 
        courseController.uploadImage, 
        catchAsync(courseController.createCourse)
    );
router
    .route("/:id/enroll")
    .post(
        catchAsync(authenticate),  
        catchAsync(courseController.enrollOnCourse)
    ); 

router
    .route("/all")
    .get(
        catchAsync(authenticate),  
        catchAsync(courseController.getAllCourses)
    );
router
    .route("/:id/students")
    .get(
        catchAsync(authenticate),   
        catchAsync(courseController.getCourseStudents)
    ); 

router
    .route("/:id")
    .get(
        catchAsync(authenticate),   
        catchAsync(courseController.getCourse)
    );       
     
       
module.exports= router;