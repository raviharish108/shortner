import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        index: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    }},
{
    timestamps: true
})
export default mongoose.model("users",userSchema)