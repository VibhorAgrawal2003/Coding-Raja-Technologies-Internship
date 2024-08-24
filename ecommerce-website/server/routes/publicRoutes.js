import express from "express";
import { getProducts, getProductsByCategory } from "../controllers/products.js";

const router = express.Router();

// product routes
router.get("/products/:category", getProductsByCategory);
router.get("/products", getProducts);

export default router;
