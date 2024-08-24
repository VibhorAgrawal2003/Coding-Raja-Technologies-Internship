import express from "express";
import { signup, login } from "../controllers/auth.js";
import { showSignup, showLogin } from "../controllers/testing.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/signup", showSignup);
router.get("/login", showLogin);

export default router;
