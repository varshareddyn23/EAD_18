const mongoose = require('mongoose')


const alienSchema = new mongoose.Schema
({

    sname: 
    {
        type: String,
        required: true
    },
    branch: 
    {
        type: String,
        required: true
    },
    grade: 
   {
        type: Boolean,
        required: true,
        default: false
    },
    rollno:
    {
        required: true,
        type:Number
    }

})

module.exports = mongoose.model('Alien',alienSchema)
