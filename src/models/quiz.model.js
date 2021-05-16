const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
        course_id :{
        type : String,
        required: true
    },
    full_mark : {
        type : Number,
        required: true
    },
    students : [{
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Student'
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
