const {courseService} = require("../services/");
const statusMessageError = require("../utils/statusMessageError");

const multer = require('multer');
const fs = require('fs').promises;

const multerStorage = multer.diskStorage({

    destination : (req, file, cb) => {
        cb(null, "uploads/users");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null,`${new Date().toISOString()}-${file.originalname}`);
    }

});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.split('/')[1].match(/(png|jpg|jpeg)/)) {
        cb(null, true);
    } else {
        cb(new statusMessageError(400, 'Not an image! Please upload only images.'), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadImage = upload.single('image');
 

const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];

exports.createCourse = async(req, res, next) => {
   

    if(req.user.type !== "Professor"){
        return next (new statusMessageError(403,
            "You do not have the permission to perform this action"));
        
    }
    const check = checkCourseNameIsExist(req.body.name , req.user, next);

    if(check instanceof statusMessageError) return next (check);

    let imagePath;
    if(!req.file){ 
        imagePath = "uploads/courses/default.jpg";
    } 
    else {
        imagePath = req.file.path;
    }
    
    
    //console.log(req.file.path);
    let newCourse= {
    
        "name": req.body.name,
        "imgUrl": imagePath,
        "professor": req.user._id,

    }

    const course = await courseService.createCourse(newCourse, req.user);
   
    res.status(200).json({
        id : course._id,
        name: course.name,
        imgUrl: course.imgUrl,
        professor: course.professor,
        
    });
    
    
};
exports.getCourse = async (req, res, next) => {

    if(req.user.type === "Department"){
        return next(new statusMessageError(403, "You do not have the permission to perform this action"));
    }
    if(!checkUserHasThisCourse(req.params.id, req.user)){
        return  next(new statusMessageError(403,
             "You do not have the permission to perform this action"));
    }
    const course = await courseService.getCourse(req.params.id);

    if(!course) return next(new statusMessageError(400, "Invalid course id"));

    res.status(200).json(course);
}

exports.enrollOnCourse = async (req, res, next) => {

  
    if(req.user.type !== "Student") 
        return next(new statusMessageError(403,
             "You do not have the permission to perform this action"));
    const course = await courseService.getCourse(req.params.id);

    if(!course) return next(new statusMessageError(400,"Invalid course id"));

    if(checkUserHasThisCourse(course._id, req.user))
        return next(new statusMessageError(400,
             "Student is already enrolled in this course"));

    await courseService.enrollOnCourse(req.user, course);
    res.status(200).json({

        id: course._id,
        name: course.name,
        imgUrl: course.imgUrl,
        professor: course.professor,
        student: {
            id: req.user._id,
            name: req.user.name,
            imgUrl: req.user.imgUrl
        }

    });
}
exports.getCourseStudents = async (req,res, next) => {

    if(req.user.type !== "Professor"){
        return next(new statusMessageError(403, "You do not have the permission to perform this action"));
    }
    const course = await courseService.getCourse(req.params.id);

    if(!course) return next(new statusMessageError(400, "Invalid course id"));

    res.status(200).json({
        items: course.students.map(stud => {

            return {
                id: stud._id,
                name: stud.name,
                imgUrl: stud.imgUrl
            }
        }),
        total: course.students.length
    });

}
exports.getAllCourses = async(req, res, next) => {

    if(req.user.type === "Department"){
        return next(new statusMessageError(403,
             "You do not have the permission to perform this action"));
    }
    res.status(200).json(
        {
            items: req.user.courses.map(course => {
                return {
                        id : course._id,
                        name: course.name,
                        imgUrl: course.imgUrl,
                        professor:{
                            id: course.professor._id,
                            name: course.professor.name,
                            imgUrl: course.professor.imgUrl
                        } 
                    
                    }
        
                }
            ),
            total: req.user.courses.length

        }
    );

}

function checkCourseNameIsExist(courseName, user){
   
    let courseIndex = user.courses.findIndex((course, index) => {
        console.log(course.name);   
        if(course.name === courseName){
            
            return true;
        }      
    });
    if(courseIndex !== -1){
        return new statusMessageError(403, "Course name is already exist");
    }
   
};

function checkUserHasThisCourse(courseId, user){

    let check = 0;
    user.courses.forEach(element => {

        if(String(element._id) === String(courseId)){
            check = 1;
            return;
        }
    })
    
    if(check)
        return true;
    return false;    
}