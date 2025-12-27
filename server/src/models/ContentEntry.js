import supabase from '../config/supabaseClient.js';

export const ContentEntryModel = {
    // Create a new content entry
    async create({ title, owner_id, category_id, raw_content, fingerprint, embedding_vector, certificate_id }) {
        const { data, error } = await supabase
            .from('content_entries')
            .insert([{
                title,
                owner_id,
                category_id,
                raw_content,
                fingerprint,
                embedding_vector,
                certificate_id
            }])
            .select(`
        *,
        owner:users(id, name, email),
        category:categories(id, name)
      `)
            .single();

        if (error) throw error;
        return data;
    },

    // Get all content entries
    async getAll() {
        const { data, error } = await supabase
            .from('content_entries')
            .select(`
        *,
        owner:users(id, name, email),
        category:categories(id, name)
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get content by owner ID
    async getByOwnerId(owner_id, limit = 50, offset = 0) {
        const { data, error } = await supabase
            .from('content_entries')
            .select(`
        *,
        category:categories(id, name)
      `)
            .eq('owner_id', owner_id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;
        return data;
    },

    // Get content by ID
    async findById(id) {
        const { data, error } = await supabase
            .from('content_entries')
            .select(`
        *,
        owner:users(id, name, email),
        category:categories(id, name)
      `)
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    // Get content by certificate ID
    async findByCertificateId(certificate_id) {
        const { data, error } = await supabase
            .from('content_entries')
            .select(`
        *,
        owner:users(id, name, email),
        category:categories(id, name)
      `)
            .eq('certificate_id', certificate_id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    // Delete content entry
    async delete(id) {
        const { error } = await supabase
            .from('content_entries')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    },

    // Get content count
    async count() {
        const { count, error } = await supabase
            .from('content_entries')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;
        return count;
    },

    // Get content count by owner
    async countByOwner(owner_id) {
        const { count, error } = await supabase
            .from('content_entries')
            .select('*', { count: 'exact', head: true })
            .eq('owner_id', owner_id);

        if (error) throw error;
        return count;
    },
};

export default ContentEntryModel;
