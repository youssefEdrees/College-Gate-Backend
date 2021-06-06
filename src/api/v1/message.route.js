const express = require("express");
const {messageController} = require("../../controllers");
const catchAsync = require("../../utils/catchAsync");
const {authenticate} = require("../../midllewares/auth");


//const { route } = require("../api/v1");

const router = express.Router();

//router.use()
router
    .route("/me/course/:id")
    .post(catchAsync(authenticate), catchAsync(messageController.createMessage));

router
    .route("/:type/course/:id")
    .get(catchAsync(authenticate),catchAsync(messageController.getListOfMessages));

router
    .route("/:id")
    .get(catchAsync(messageController.getMessage));
module.exports= router;