import { getSupabase } from "../supabaseClient.js";
import multer from "multer";

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("picture");

// Fetch all users
export const getUsersAll = async (req, res) => {
    try {
        const supabase = getSupabase();

        const { data, error, count } = await supabase
            .from("users")
            .select("*", { count: "exact" })
            .order("username", { ascending: true });

        if (error) throw error;

        res.status(200).json({
            users: data,
            totalUsers: count,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch user by username
export const getUser = async (req, res) => {
    try {
        const supabase = getSupabase();
        const { username } = req.params;
        const { data, error } = await supabase.from("users").select("*").eq("username", username).single();

        if (error) throw error;

        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Customize user data
export const editUser = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: "File upload failed" });
        }

        try {
            const supabase = getSupabase();
            const { bio } = req.body;
            const username = req.user.username;
            let picture_url = null;

            // Process the uploaded picture if available
            if (req.file) {
                const { data, error: uploadError } = await supabase.storage
                    .from("pictures")
                    .upload(`public/${username}-${req.file.originalname}`, req.file.buffer, {
                        contentType: req.file.mimetype,
                    });

                if (uploadError) {
                    console.error("Upload Error:", uploadError.message);
                    throw uploadError;
                }
                picture_url = `${process.env.PICTURE_PATH}${data.path}`;
            }

            console.log(picture_url);

            // Update user's bio and picture_url
            const updates = {
                bio,
                ...(picture_url && { picture_url }),
            };

            const { error } = await supabase.from("users").update(updates).eq("username", username);

            if (error) throw error;

            res.status(200).json({ message: "Profile updated successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

// Search users by username
export const searchUsers = async (req, res) => {
    try {
        const supabase = getSupabase();
        const { q } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { data, error, count } = await supabase
            .from("users")
            .select("*", { count: "exact" })
            .ilike("username", `%${q}%`)
            .range(offset, offset + limit - 1)
            .order("username", { ascending: true });

        if (error) throw error;

        res.status(200).json({
            users: data,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalUsers: count,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
