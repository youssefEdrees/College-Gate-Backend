const statusMessageError = require("../utils/statusMessageError");

const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];
const dayNames = ["Sunday", "Monday", "Tuesday", "wednesday", "Thursday"
    , "Friday", "Saturday"];

exports.getDate = (d) => {
  
    let year = d.getFullYear();
    let m = d.getMonth();
    let day = d.getDay();
    let date = d.getDate();
   
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let seconds = d.getSeconds();

    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    seconds = seconds < 10 ? '0'+seconds : seconds;
    let strTime = hours + ':' + minutes + ':' + seconds +' ' + ampm;

    return `${dayNames[day]},${monthNames[m]} ${date},${year} ${strTime}`;

};
exports.validationOnCourse = (user, course) => {
    
   
    if(user.type === "Professor"){
        //check if prof is created this course
        if(String(course.professor._id )!== String(user._id)){
            return new statusMessageError(403,
                "this course is not created by this professor so check course ID");
        }
    }
    else if(user.type === "Student"){
        //check if stud enrolled in this course
        let student = course.students.findIndex(function (stud, index){
           
            if(stud._id.toString() === user._id.toString()){
                
                return true;
            }      
        });
        if(student === -1){
            return new statusMessageError(403,
                "student didn't enroll in this course so check course ID");
        }
    }
}
