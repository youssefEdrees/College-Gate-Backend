const {Student} = require('./../models/student.model');

exports.createStudent = async (newStudent)=> {
    let student1 = await Student.create(newStudent);
    student1 = student1.toJSON();
    return student1;
}