const express=require("express")
const joi=require('joi').extend(require('@joi/date'));
const bcrypt=require('bcrypt')
const router=express.Router();
const User=require("../models/user");
const genToken = require("../Token");

const UserSchema=joi.object(
    {
        username:joi.string().min(4).required(),
        email:joi.string().email(),
        password:joi.string().required().min(6),
        phone:joi.string().min(10).max(10),
        DOB:joi.date().required().format("YYYY/MM/DD").raw(),
    }
).or("email","phone")

router.post("/signup",async(req,res)=>{
    const {username,email,password,DOB,phone}=req.body;
    var {error}=await UserSchema.validate({username,email,password,DOB,phone});
    if(error){
        res.status(400);
        error=error.details[0].message.replace( /\"/g, "" );
        return res.json({message:error});
    }
    const keyword={
        $or: [
            {
                $and:[
                    {email:{$eq:email}},
                    {email:{$ne:null}}
                ]
            },
            {
                $and:[
                    {username:{$eq:username}},
                    {username:{$ne:null}}
                ]
            },
            {
                $and:[
                    {phone:{$eq:phone}},
                    {phone:{$ne:null}}
                ]
            }
        ]
    }
    const userExist=await User.findOne(keyword)
    if(userExist){
        res.status(409)
        if(email!==undefined && userExist.email===email){
            return res.json({message:'Another account is using the same email.'});
        }
        else if(username!==undefined && userExist.username===username){
            return res.json({message:"This username isn't available. Please try another."})
        }
        else{
            return res.json({message:"Another account is using the same Phone number"})
        }
    }
    var user=await User.create({username,email,password,DOB:new Date(DOB),phone});
    const id=user._id;
        user=user._doc;
        //deleting unneccesary object properties
        delete user._id;delete user.password;delete user.createdAt;delete user.updatedAt;delete user.__v;delete user.isAdmin;
    res.status(201).json({
        ...user,
        token:await genToken(id),
    });
})


module.exports=router;
