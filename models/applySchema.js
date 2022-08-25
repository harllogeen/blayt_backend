const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs');


//apply Schema or Document Structure
const applySchema = new mongoose.Schema({
    firstname : {
        type: String,
        required : true,
      
    },
    lastname : {
        type: String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        
    },
    confirmemail : {
        type : String,
        required : true,
        
    },
    password : {
        type: String,
        required : true,
    },
    age : {
        type: Number,
        required : true,
    },
    
    track : {
        type: String,
        enum: ['Frontend', 'Backend', 'FullStack', 'UI/UX'] ,
        required : true 
    },
    about: {
        type: String,
        enum: ['Facebook', 'Twitter', 'Whatsapp', 'Linkedin', 'Others'],
        required : true 
    },
    message : {
        type : String,
        required : true
    },

    
})

//Hashing password to Secure
applySchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = bcryptjs.hashSync(this.password, 10)
    }
    next();
})


// Create Model
const Apply = new mongoose.model("APPLY", applySchema)  

module.exports = Apply;