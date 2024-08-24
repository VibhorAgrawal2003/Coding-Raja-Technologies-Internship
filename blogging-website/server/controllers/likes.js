import { getSupabase } from "../supabaseClient.js";

export const addLike = async (req, res) => {
    const { bid, username } = req.body;

    if (!bid || !username) {
        return res.status(400).json({ error: "Invalid input" });
    }

    const supabase = getSupabase();

    try {
        // Fetch the blog with the given bid
        const { data: blog, error } = await supabase.from("blogs").select("liked_by").eq("bid", bid).single();

        if (error || !blog) {
            throw error || new Error("Blog not found");
        }

        console.log(blog);

        // Check if the user already liked the blog
        if (blog.liked_by.includes(username)) {
            return res.status(400).json({ message: "User already liked this blog" });
        }

        // Add the username to the liked_by array
        const updatedLikedBy = [...blog.liked_by, username];

        // Update the blog record
        const { error: updateError } = await supabase.from("blogs").update({ liked_by: updatedLikedBy }).eq("bid", bid);

        if (updateError) {
            throw updateError;
        }

        res.status(200).json({ message: "Like added successfully" });
    } catch (error) {
        console.error("Error adding like:", error);
        res.status(500).json({ error: "Failed to add like" });
    }
};

export const removeLike = async (req, res) => {
    const { bid, username } = req.body;

    if (!bid || !username) {
        return res.status(400).json({ error: "Invalid input" });
    }

    const supabase = getSupabase();

    try {
        // Fetch the blog with the given bid
        const { data: blog, error } = await supabase.from("blogs").select("liked_by").eq("bid", bid).single();

        if (error || !blog) {
            throw error || new Error("Blog not found");
        }

        // Check if the user hasn't liked the blog
        if (!blog.liked_by.includes(username)) {
            return res.status(400).json({ message: "User has not liked this blog" });
        }

        // Remove the username from the liked_by array
        const updatedLikedBy = blog.liked_by.filter((user) => user !== username);

        // Update the blog record
        const { error: updateError } = await supabase.from("blogs").update({ liked_by: updatedLikedBy }).eq("bid", bid);

        if (updateError) {
            throw updateError;
        }

        res.status(200).json({ message: "Like removed successfully" });
    } catch (error) {
        console.error("Error removing like:", error);
        res.status(500).json({ error: "Failed to remove like" });
    }
};
