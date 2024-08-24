import dotenv from "dotenv";
import { getSupabase } from "../supabaseClient.js";

// configuration
dotenv.config();

// Get user's profile information
export const getUser = async (req, res) => {
    try {
        const supabase = getSupabase();
        const { username } = req.params;
        const { data, error } = await supabase
            .from("users")
            .select("username, email, phone, address, picture_url")
            .eq("username", username)
            .single();
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

// Get user's admin status
export const getAdmin = async (req, res) => {
    try {
        const supabase = getSupabase();
        const { username } = req.params;
        const { data, error } = await supabase.from("users").select("admin").eq("username", username).single();
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

// Get user's profile picture
export const getPicture = async (req, res) => {
    try {
        const supabase = getSupabase();
        const { username } = req.params;

        const { data: picture_data, error: picture_error } = await supabase
            .from("users")
            .select("picture_url")
            .eq("username", username)
            .single();

        if (picture_error) throw picture_error;

        if (picture_data) {
            res.status(200).json(picture_data);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
