import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getSupabase } from "../supabaseClient.js";

// configuration
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const DEFAULT_PIC = process.env.PICTURE_PATH + "default.png";

// Helper function to hash a password
const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return { salt, hashedPassword };
};

// Helper function to verify a password
const verifyPassword = (password, salt, hashedPassword) => {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return hashedPassword === hash;
};

// Send new user details for sign up
export const signup = async (req, res) => {
    try {
        const supabase = getSupabase();
        const { email, password, username } = req.body;

        // Validate the request body
        if (!email || !password || !username) {
            return res.status(400).json({ error: "Email, password, and username are required" });
        }

        // Hash the password
        const { salt, hashedPassword } = hashPassword(password);

        // Insert the new user into the database
        const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .insert([{ email, username, password: hashedPassword, salt }]);
        if (profileError) throw profileError;

        // Insert basic user customization into the database
        const { data: userData, error: userError } = await supabase
            .from("users")
            .insert([{ username, admin: 0, bio: "Hello, I am new to this website!", picture_url: DEFAULT_PIC }]);
        if (userError) throw userError;

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Send old user details for log in
export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        const supabase = getSupabase();

        // Fetch the user from the database
        const { data: userData, error: userError } = await supabase
            .from("profiles")
            .select("*")
            .eq("username", username)
            .single();

        if (userError || !userData) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Compare the provided password with the hashed password in the database
        const validPassword = verifyPassword(password, userData.salt, userData.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate a JWT
        const token = jwt.sign({ id: userData.id, username: userData.username }, JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
