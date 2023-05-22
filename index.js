import express from "express";
import { connect } from "./dbconnect.js";
import * as dotenv from "dotenv";
import cors from "cors";
import userrouter from "./routes/user.js"
import shortnerrouter from "./routes/shortner.js"
dotenv.config();
const PORT= 5000;
const app=express();
app.use(express.json());
app.use(cors());
app.get("/",(req,res)=>{
    res.send("hello world")
})
app.use("/api/user",userrouter);
app.use("/api/url",shortnerrouter);
app.listen(PORT, async() => {
    await connect();
    await console.log('Server is running on port', PORT)
})