import { getSupabase } from "../supabaseClient.js";

// Fetch all blogs
export const getBlogsAll = async (req, res) => {
    try {
        const supabase = getSupabase();
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const { data, error, count } = await supabase
            .from("blogs")
            .select("*", { count: "exact" })
            .range(offset, offset + limit - 1)
            .order("date_upload", { ascending: false });

        if (error) throw error;

        res.status(200).json({
            blogs: data,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalBlogs: count,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch blog by id
export const getBlogsId = async (req, res) => {
    try {
        const supabase = getSupabase();
        const { id } = req.params;

        const { data, error } = await supabase.from("blogs").select("*").eq("bid", id).single();
        if (error) throw error;

        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: "Blog not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch blogs by user
export const getBlogsUser = async (req, res) => {
    try {
        const supabase = getSupabase();
        const { username } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { data, error, count } = await supabase
            .from("blogs")
            .select("*", { count: "exact" })
            .eq("author", username)
            .range(offset, offset + limit - 1)
            .order("date_upload", { ascending: false });

        if (error) throw error;

        res.status(200).json({
            blogs: data,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalBlogs: count,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new blog
export const createBlog = async (req, res) => {
    try {
        const supabase = getSupabase();
        const { title, description, content, user, tags } = req.body;

        const { data, error } = await supabase
            .from("blogs")
            .insert([{ title, description, author: user, likes: 0, content, tags }])
            .select();

        if (error) throw error;

        res.status(200).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a blog
export const updateBlog = async (req, res) => {
    try {
        const supabase = getSupabase();
        const { id } = req.params;
        const { title, content } = req.body;

        const { data, error } = await supabase.from("blogs").update({ title, content }).eq("bid", id).select();

        if (error) throw error;

        if (data.length > 0) {
            res.status(200).json(data[0]);
        } else {
            res.status(404).json({ error: "Blog not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a blog
export const deleteBlog = async (req, res) => {
    try {
        const supabase = getSupabase();
        const { id } = req.params;

        const { error } = await supabase.from("blogs").delete().eq("bid", id);

        if (error) throw error;

        res.status(200).json({ message: "Blog deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Search blogs by title
export const searchBlogs = async (req, res) => {
    try {
        const supabase = getSupabase();
        const { q } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { data, error, count } = await supabase
            .from("blogs")
            .select("*", { count: "exact" })
            .or(`title.ilike.%${q}%, content.ilike.%${q}%`)
            .range(offset, offset + limit - 1)
            .order("date_upload", { ascending: false });

        if (error) throw error;

        res.status(200).json({
            blogs: data,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalBlogs: count,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
