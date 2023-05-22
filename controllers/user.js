import users from "../models/user.js"
import Tokens from "../models/forgot.js";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";
import { sentEmail } from "../sendEmail.js";
import { successEmail } from "../sendsuccess.js";
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export const signup=async(req,res)=>{
    try{
        const{username,email,password}=req.body;
        if(!username || !email || !password){
            return res.status(400).json({msg: "Please fill in all fields."})
    }
    if(!validateEmail(email)){
        return res.status(400).json({msg:"invalid emails"})
      }
    const user = await users.findOne({email:email})
    if(user) return res.status(400).json({msg: "This email already exists."})
    if(password.length<6){
        return res.status(400).json({msg:"password must be atleast above 6 characters"})
       }
       const password_hash=await bcrypt.hash(password,12);
       const payload = { "username":username,"email":email,"password":password_hash}
       const activation_token =await  jwt.sign(payload,process.env.secretkey, {expiresIn: "5m"});
       const url=`${process.env.frontendurl}/activate?token=${activation_token}`
       await sentEmail(email,url,"verify your email address")
       return res.status(200).json({msg:"Register Success! Please activate your email to start."})
    }catch(err){
        return res.status(400).json({msg:err.message})
    }
}

export const activate=async(req,res)=>{
    try{
       const{token}=req.query;
       if(!token){
        re.status(400).json({msg:"invalid token"})
       }
        const user= jwt.verify(token,process.env.secretkey);
        if(!user) return res.status(400).json({msg: "This email does not exist."})
        const{username,email,password}=user
        const check = await users.findOne({email:email})
        if(check) return res.status(400).json({msg: "This email already exists."})
        const newUser=await new users({"username":username,"email":email,"password":password})
       await newUser.save();
        await successEmail(email,"Account has been Activated!");
       return res.status(200).json({msg:"Account has been Activated!"});
    }catch(err){
        return res.status(400).json({msg:err.message})
    }
}

export const login=async(req,res)=>{
    try{
  const {email,password}=req.body;
  const user=await users.findOne({email:email})
  if(!user){
    return res.status(400).json({msg:"this email is not available"})
  }
  const ismatch=await bcrypt.compare(password,user.password)
  if(!ismatch){
    return res.status(400).json({msg:"password is not correct"})
  }
  const payload = {id: user._id, name: user.username}
  const token = jwt.sign(payload,process.env.loginsecretkey, {expiresIn: "1d"})
  return res.json({username:user.username,email:user.email,token:token})
  }catch(err){
    return res.status(500).json({msg:err.message})
  }
  }

  export const forgotPassword= async (req, res) => {
    try {
        const {email} = req.body
        const user = await users.findOne({email:email})
        if(!user)
        {
          return res.status(400).json({msg: "This user does not exist."})
        }
        const payload = {email: user.email}
        const forgotpassword_token =await jwt.sign(payload,process.env.tokensecret,{expiresIn: "10m"});
        const token_hash=await bcrypt.hash(forgotpassword_token,12);
        const newtoken=await new Tokens({"owner":user._id,"token":token_hash});
        await newtoken.save();
        const url=`${process.env.frontendurl}/changepassword?token=${forgotpassword_token}&id=${user._id}`
         await sentEmail(email,url,"please click the link and change your password");
        return res.status(200).json({msg:"password change link send to your mail id"});
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
  }

  export const changepassword=async(req,res)=>{
    try{
      const{token,id}=req.query;
      if(!token||!id){
        return res.status(400).json({msg:"token invalid"});
      }
     
      const user=await users.findById(id)
      if(!user){
        return res.status(400).json({msg:"user cannot found!"})
      }
       const resettoken=await Tokens.findOne({owner:user._id})
       if(!resettoken){
        return res.status(400).json({msg:"reset token not found!!"})
       }
       const isCorrect = await bcrypt.compare(token,resettoken.token);
       if (!isCorrect){
        return res.status(400).json({msg:"wrong credentials"})
      }
      const {password}=req.body;
       const issamepassword = await bcrypt.compare(password, user.password);
      if(issamepassword){
      return res.status(400).json({msg:"dont give same password"})
      }
     if(password.length<6){
       return res.status(400).json({msg:"password must be atleast above 6 characters"})
     }
    const passwordhash=await bcrypt.hash(password,12)
    await users.findOneAndUpdate({_id:id},{password:passwordhash})
    await Tokens.findByIdAndDelete(resettoken._id);
     await successEmail(user.email,"successfully changed password");
    return res.status(200).json({msg:"password successfully changed"});
    }catch(err){
      return res.status(500).json({msg:err.message})
    }
  }
  export const verify=async(req,res)=>{
    try{
      const{token,id}=req.query;
      if(!token||!id){
        return res.status(400).json({msg:"token invalid"});
      }
     
      const user=await users.findById(id)
      if(!user){
        return res.status(400).json({msg:"user cannot found!"})
      }
       const resettoken=await Tokens.findOne({owner:user._id})
       if(!resettoken){
        return res.status(400).json({msg:"reset token not found!!"})
       }
       const isCorrect = await bcrypt.compare(token,resettoken.token);
       if (!isCorrect){
        return res.status(400).json({msg:"wrong credentials"})
      }
      return res.status(200).json({msg:"token verified successfully!!"});
    }catch(err){
        return res.status(500).json({msg:err.message})
      }
  }