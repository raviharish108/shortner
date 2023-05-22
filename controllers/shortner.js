
import shortners from "../models/shortnes.js";
import { nanoid } from "nanoid";
export const shortner=async(req,res)=>{
    try{
      const {base_url}=req.body;
      const shortId = nanoid(8);
     const newUrl=await new shortners({longurl:`${base_url}`,shorturl:`${shortId}`})
     await newUrl.save();
      return res.status(200).json({msg:"successfully created"});
    }catch(err){
        return res.status(400).json({msg:err.message})
    }
}

export const getall=async(req,res)=>{
  try{
    const geturls=await shortners.find();
    return res.status(200).json(geturls);
  }catch(err){
     return res.status(400).json({msg:err.msg})
  }
}

export const trend = async (req,res) => {
  try {
    const urls = await shortners.find().sort({ count: -1 }).limit(3);
    res.status(200).json(urls);
  } catch (err) {
    return res.status(400).json({msg:err.msg})
  }
};

export const update=async(req,res)=>{
  try{
    const{id}=req.params;
   await shortners.findByIdAndUpdate({_id:id},{ $inc: { count: 1 }});
    return res.status(200).send({msg:"updated successfully"});
  }catch(err){
    return res.status(400).json({msg:err.msg})
  }
};