const {Course} = require("../models/course.model");

exports.createCourse = async(newCourse) => {

    let course = await(await Course.create(newCourse))
    .populate("professor", "name")
    //.populate({path : "course", select: "_id name" })
    .execPopulate();

    /*return _.pick(announcement, 
        '_id',
        'genres',
        'images',
        'displayName',
        'bio',
        'popularSongs'
    );*/


    announcement = announcement.toJSON();
    return announcement;

};
