const express = require("express");
const {warningController} = require("../../controllers");
const catchAsync = require("../../utils/catchAsync");
const {authenticate} = require("../../midllewares/auth");


//const { route } = require("../api/v1");

const router = express.Router();

//router.use()
router
    .route("/me")
    .post(catchAsync(authenticate), catchAsync(warningController.createWarning));

router
    .route("")
    .get(catchAsync(authenticate),catchAsync(warningController.getListOfWarnings));
router
    .route("/:id")
    .get(catchAsync(warningController.getWarning));

module.exports= router;