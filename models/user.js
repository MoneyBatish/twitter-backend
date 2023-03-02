const mongoose = require('mongoose');

const UserSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
    },
    phone:{
        type:String,
    },
    isAdmin:{
        type:Boolean,
        default:false, 
    },
    isBanned:{
        type:Boolean,
        default:false
    },
    DOB:{
        type:Date
    } 
},{
    timestamps:true,
})

module.exports=mongoose.model("User",UserSchema)