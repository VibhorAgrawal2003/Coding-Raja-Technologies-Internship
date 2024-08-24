import express from "express";
import { getBlogsAll } from "../controllers/blogs.js";

const router = express.Router();

// Home Page Content
router.get("/blogs", getBlogsAll);

export default router;
