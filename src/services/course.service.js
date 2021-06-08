const {Course} = require("../models/course.model");
const {Professor} = require("../models/professor.model");
const {Student} = require("../models/student.model");

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
    const updatedCourse = await Course.findOneAndUpdate({_id:course._id}, course);

    await updateUserCourses(user, updatedCourse);

   
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
    if(user.type === "Professor")
        await Professor.findOneAndUpdate({_id: user._id}, user);
    else
        await Student.findOneAndUpdate({_id: user._id}, user);
}

exports.createCourseKey = async () => {
    let newKey =0;
    console.log("INSIDE create");
    while(true){
        newKey = Math.floor(Math.random()*100000);
        value = await Course.findOne({key : newKey});
        if(!value){
            break;
        }
    }
    console.log(newKey);
    return newKey;
};
