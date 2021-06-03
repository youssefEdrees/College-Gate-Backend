const express = require("express");
const {userController} = require("../../controllers");
const catchAsync = require("../../utils/catchAsync");
const {authenticate} = require("../../midllewares/auth");

const router = express.Router();


router.route("/student/signup")
    .post(catchAsync(userController.createStudent));

router.route("/student/login")
    .post(catchAsync(userController.StudentLogin));
    

router.route("/professor/signup")
    .post(catchAsync(userController.createProfessor));

router.route("/professor/login")
    .post(catchAsync(userController.professorLogin));


router.route("/department/signup")
    .post(catchAsync(userController.createDepartment));

router.route("/department/login")
    .post(catchAsync(userController.departmentLogin));

router.route("/department/list")
    .get(catchAsync(userController.getDepartmentNames));
    

router.route("/me")
    .get(catchAsync(authenticate),catchAsync(userController.getUser));




    module.exports= router;