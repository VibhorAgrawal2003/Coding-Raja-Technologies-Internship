import { getSupabase } from "../supabaseClient.js";

// Fetch all comments from blog ID
export const getCommentsBlog = async (req, res) => {
    try {
        const supabase = getSupabase();
        const { blogId } = req.params;

        const { data, error, count } = await supabase
            .from("comments")
            .select("*")
            .eq("bid", blogId)
            .order("date_upload", { ascending: false });

        if (error) throw error;

        res.status(200).json({
            comments: data,
            totalComments: count,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch all comments from username
export const getCommentsUser = async (req, res) => {
    try {
        const supabase = getSupabase();
        const { username } = req.params;

        const { data, error, count } = await supabase
            .from("comments")
            .select("*")
            .eq("author", username)
            .order("date_upload", { ascending: false });

        if (error) throw error;

        res.status(200).json({
            comments: data,
            totalComments: count,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a comment
export const updateComment = async (req, res) => {
    try {
        const supabase = getSupabase();
        const { id } = req.params;
        const { content } = req.body;

        const { data, error } = await supabase.from("comments").update({ content }).eq("cid", id).select();

        if (error) throw error;

        if (data.length > 0) {
            res.status(200).json(data[0]);
        } else {
            res.status(404).json({ error: "Comment not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a comment
export const deleteComment = async (req, res) => {
    try {
        const supabase = getSupabase();
        const { id } = req.params;

        const { error } = await supabase.from("comments").delete().eq("cid", id);

        if (error) throw error;

        res.status(200).json({ message: "Comment deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
