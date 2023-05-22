import mongoose from "mongoose";
const forgotSchema=new mongoose.Schema({
    owner: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true
    }},
{
    timestamps: true
})
export default mongoose.model("Tokens",forgotSchema);