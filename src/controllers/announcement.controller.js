const {announcementService} = require("../services/");
const statusMessageError = require("../utils/statusMessageError");

exports.createAnnouncement = async(req, res, next) => {
    const announcement = await announcementService.createAnnouncement(req.body);
    if(announcement == null){
        next (new statusMessageError(401,"incorrect username or password"));
    }
    res.status(200).json(announcement);
};