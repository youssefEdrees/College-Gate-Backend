const express = require("express");
const {complaintController} = require("../../controllers");
const catchAsync = require("../../utils/catchAsync");
const {authenticate} = require("../../midllewares/auth");


//const { route } = require("../api/v1");

const router = express.Router();

//router.use()
router
    .route("/me")
    .post(catchAsync(authenticate), catchAsync(complaintController.createComplaint));

router
    .route("/me/response")
    .post(catchAsync(authenticate),catchAsync(complaintController.createComplaint));
router
    .route("/:type")
    .get(catchAsync(authenticate),catchAsync(complaintController.getListOfComplaints));
router
    .route("/:id")
    .get(catchAsync(complaintController.getComplaint));

module.exports= router;