import dotenv from "dotenv";
import { getSupabase } from "../supabaseClient.js";
import multer from "multer";

// configuration
dotenv.config();
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

// Fetch a single product from database
export const getProduct = async (req, res) => {
    try {
        const supabase = getSupabase();
        const { id } = req.params;

        const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
        if (error) throw error;

        if (!data) {
            return res.status(404).json({ message: "No product found for this id" });
        } else {
            res.status(200).json(data);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch all products from database
export const getProducts = async (req, res) => {
    try {
        const supabase = getSupabase();

        const { data, error } = await supabase.from("products").select("*");
        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching products: ", error);
        res.status(500).json({ error: error.message });
    }
};

// Fetch products by category from database
export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        if (!category) {
            return res.status(400).json({ error: "Category parameter is required" });
        }

        const supabase = getSupabase();

        const { data, error } = await supabase.from("products").select("*").eq("category", category);
        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({ message: "No products found for this category" });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching products by category: ", error);
        res.status(500).json({ error: error.message });
    }
};

// Add new product if admin requests
export const addProduct = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: "File upload failed" });
        }

        try {
            const supabase = getSupabase();
            const { username, name, provider, category, cost, description } = req.body;
            let image_url = null;

            // Check admin status of username
            const { data: admin_data, error: admin_error } = await supabase
                .from("users")
                .select("admin")
                .eq("username", username)
                .single();
            if (admin_error) throw admin_error;

            if (!admin_data.admin) {
                return res.status(401).json({ error: "User must be ADMIN to add product." });
            }

            // Insert product information without image_url first
            const { data: product_data, error: insertError } = await supabase
                .from("products")
                .insert({
                    name,
                    provider,
                    category,
                    cost,
                    description,
                    image_url: null,
                })
                .select("id")
                .single();

            if (insertError) throw insertError;

            const productId = product_data.id;

            // Process the uploaded image if available
            if (req.file) {
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from("items")
                    .upload(`public/${productId}`, req.file.buffer, {
                        contentType: req.file.mimetype,
                    });

                if (uploadError) {
                    console.error("Upload Error:", uploadError.message);
                    throw uploadError;
                }

                image_url = `${process.env.ITEM_PATH}${uploadData.path}`;

                // Update the product's image_url in the database
                const { error: updateError } = await supabase
                    .from("products")
                    .update({ image_url })
                    .eq("id", productId);

                if (updateError) throw updateError;
            }

            res.status(201).json({ message: "Product added successfully" });
        } catch (error) {
            console.error("Error:", error.message);
            res.status(500).json({ error: error.message });
        }
    });
};
