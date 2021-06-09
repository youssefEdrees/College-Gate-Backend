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
    .route("/:id/me/response")
    .put(catchAsync(authenticate),catchAsync(complaintController.updateComplaint));


router
    .route("/type/:type")
    .get(catchAsync(authenticate),catchAsync(complaintController.getListOfComplaints));
router
    .route("/:id")
    .get(catchAsync(complaintController.getComplaint));
module.exports= router;