const express = require("express");
const {announcementController} = require("../../controllers");
const catchAsync = require("../../utils/catchAsync");
const {authenticate} = require("../../midllewares/auth");

//const { route } = require("../api/v1");

const router = express.Router();

//router.use()
router
    .route("/me/course/:id")
    .post(catchAsync(authenticate), catchAsync(announcementController.createAnnouncement));

router
    .route("/course/:id")
    .get(catchAsync(authenticate), catchAsync(announcementController.getListOfAnnouncements));
router
    .route("/")
    .get(catchAsync(authenticate), catchAsync(announcementController.getAllAnnouncements));    
       
module.exports= router;