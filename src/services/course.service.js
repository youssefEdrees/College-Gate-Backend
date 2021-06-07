const {Course} = require("../models/course.model");



exports.createCourse = async(newCourse , user) => {

    
    let course = await(await Course.create(newCourse))
    .populate("professor", "name imgUrl")
    .execPopulate();
    
    course = course.toJSON();
    await updateUserCourses(user, course);
    return course;

};
exports.enrollOnCourse = async (user, course) => {
    
    course.students.push(user);
    await Course.findOneAndUpdate({_id:course._id}, course);

    await updateUserCourses(user, course);

   
};
exports.getCourse = async (id) => {
    
    let course =  Course.findById(id)
    .populate("professor", "name imgUrl")
    .populate("students", "name imgUrl");
     
    [course] = await Promise.all([course]);

    if(!course) return null;

    course = course.toJSON();
    return course;
};
updateUserCourses = async (user, course) => {

    user.courses.push(course);
    await user.save();

}
