const express=require("express")
const cors= require("cors")
const bodyParser= require("body-parser")
const dotenv = require("dotenv")
const mongoose=require("mongoose")
const bcrypt=require('bcryptjs')
const signup=require('./model/db')
const port=7000
const app=express()
app.use(bodyParser.json())
app.use(cors())
dotenv.config()
mongoose.connect(process.env.MONGO_URL,()=>{
    console.log("connected to db");
})   
app.get('/',(req,res)=>{
    res.send('homepage')
})
app.post("/signup",async(req,res)=>{
     
    const emailExist=await signup.findOne({email:req.body.email,})
    let value=await req.body.password
    if(value != req.body.confirmPassword){
        res.status(400).send({message:"password does not match"})
    }
    else if(emailExist){
        res.status(400).send({message:"Email already exist"})
    }
    else{
        try {
            const salt=await bcrypt.genSalt(10)
            const hashedPassword=await bcrypt.hash(req.body.password, salt)
    let user=new signup({
        firstName:req.body.firstName,
         lastName:req.body.lastName,
        phoneNumber:req.body.phoneNumber,
      email:req.body.email,
        password:hashedPassword ,
    confirmPassword: hashedPassword
     })
     let savedUser=await user.save()
     res.send({message:"Account created!!"})
     console.log(savedUser)
}
              catch (error) {
            res.status(500).send
        }
    }

})
app.post("/login",async (req,res)=>{
    const userdt=await signup.findOne({ email:req.body.email})
    if(!userdt){
      return  res.status(400).send({message:"Username not found"})
    }
    else {
        const validatePassword=await bcrypt.compare(req.body.password,userdt.password)
        if(!validatePassword){
            return res.status(400).send({message:"email or password is wrong"})
        }
        else{
            res.status(200).send({message:"welcome!!"})
        }
    }
})
 

app.listen(port,(req,res)=>{
    console.log("listening on port" +port);
  })  