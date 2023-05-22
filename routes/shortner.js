import express from "express";
import {shortner, getall, trend, update} from "../controllers/shortner.js";
const router=express.Router();
router.post("/shorturl",shortner);
router.get("/getall",getall);
router.get("/trend",trend);
router.put("/clicks/:id",update);
export default router;