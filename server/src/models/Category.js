import supabase from '../config/supabaseClient.js';

export const CategoryModel = {
    // Create a new category
    async create({ name, description }) {
        const { data, error } = await supabase
            .from('categories')
            .insert([{ name, description }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get all categories
    async getAll() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    },

    // Get category by ID
    async findById(id) {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    // Update category
    async update(id, updates) {
        const { data, error } = await supabase
            .from('categories')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete category
    async delete(id) {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    },

    // Get category count
    async count() {
        const { count, error } = await supabase
            .from('categories')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;
        return count;
    },
};

export default CategoryModel;
