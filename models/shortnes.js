import mongoose from "mongoose"
const shortnerSchema=new mongoose.Schema({
    longurl:{
          type: String,
        required: true,
        trim: true
    },
    shorturl:{
        type: String,
    },
    count:{
        type:Number,
        default:0
    }
},{
     timestamps: true
})
export default mongoose.model("shortners",shortnerSchema)