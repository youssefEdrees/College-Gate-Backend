const {Announcement} = require("../models/announcement.model");

exports.createAnnouncement = async(newAnnouncement) => {

    let announcement = await(await Announcement.create(newAnnouncement))
    .populate({path : "professor", select: "_id name imgUrl" })
    .populate({path : "course", select: "_id name" })
    .execPopulate();

    announcement = announcement.toJSON();
    return announcement;

};
