const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    course :{
        type : mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    full_mark : {
        type : Number,
        required: true
    },
    avg : {
        type : Number,
        required: true
    },
    max : {
        type : Number,
        required: true
    },

    students : [{
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Student',
        //grade: String
    }
    ],
    grades :[{
        type : Number,
        required: true
    }
    ]
        
});


const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = { Quiz, quizSchema };
