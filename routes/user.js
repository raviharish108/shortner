import express from "express"
import {signup,activate,login,forgotPassword,changepassword,verify} from "../controllers/user.js"

const router=express.Router();

router.post("/signup", signup);
router.get("/activate", activate);
router.post("/login", login);
router.post("/forgot", forgotPassword);
router.post("/changepassword", changepassword);
router.get("/verify",verify);
export default router;