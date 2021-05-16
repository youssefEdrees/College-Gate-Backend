const {userService} =  require('./../services');

exports.createStudent = async (req,res,next)=> {
    const student = await userService.createStudent(req.body);
    res.status(200).json(student);
};