import express from "express";
import { getPicture, getAdmin, getUser } from "../controllers/users.js";
import { addProduct, getProduct } from "../controllers/products.js";

const router = express.Router();

// product routes
router.post("/product/add", addProduct);
router.get("/product/:id", getProduct);

// user routes
router.get("/picture/:username", getPicture);
router.get("/admin/:username", getAdmin);
router.get("/user/:username", getUser);

export default router;
