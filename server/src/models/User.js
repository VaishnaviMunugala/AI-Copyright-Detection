import supabase from '../config/supabaseClient.js';

export const UserModel = {
    // Create a new user
    async create({ name, email, password, role = 'user' }) {
        const { data, error } = await supabase
            .from('users')
            .insert([{ name, email, password, role }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Find user by email
    async findByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    // Find user by ID
    async findById(id) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    // Update user
    async update(id, updates) {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get all users (admin only)
    async getAll() {
        const { data, error } = await supabase
            .from('users')
            .select('id, name, email, role, created_at')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get user count
    async count() {
        const { count, error } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;
        return count;
    },
};

export default UserModel;
