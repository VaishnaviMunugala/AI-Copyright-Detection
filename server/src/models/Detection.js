import supabase from '../config/supabaseClient.js';

export const DetectionModel = {
    // Create a new detection
    async create({ input_content, similarity_score, match_level, matched_sources, explanation, user_id }) {
        const { data, error } = await supabase
            .from('detections')
            .insert([{
                input_content,
                similarity_score,
                match_level,
                matched_sources,
                explanation,
                user_id
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get detection by ID
    async findById(id) {
        const { data, error } = await supabase
            .from('detections')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    // Get detections by user ID
    async getByUserId(user_id, limit = 50, offset = 0) {
        const { data, error } = await supabase
            .from('detections')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;
        return data;
    },

    // Get all detections (admin)
    async getAll(limit = 100, offset = 0) {
        const { data, error } = await supabase
            .from('detections')
            .select('*')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;
        return data;
    },

    // Get detection count
    async count() {
        const { count, error } = await supabase
            .from('detections')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;
        return count;
    },

    // Get detection count by user
    async countByUser(user_id) {
        const { count, error } = await supabase
            .from('detections')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user_id);

        if (error) throw error;
        return count;
    },

    // Get recent detections for analytics
    async getRecent(days = 7) {
        const date = new Date();
        date.setDate(date.getDate() - days);

        const { data, error } = await supabase
            .from('detections')
            .select('*')
            .gte('created_at', date.toISOString())
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },
};

export default DetectionModel;
