import supabase from '../config/supabaseClient.js';

export const ThresholdModel = {
    // Create or update threshold
    async upsert({ threshold_type, min_score, max_score, semantic_weight, structural_weight, hash_weight }) {
        const { data, error } = await supabase
            .from('thresholds')
            .upsert([{
                threshold_type,
                min_score,
                max_score,
                semantic_weight,
                structural_weight,
                hash_weight
            }], { onConflict: 'threshold_type' })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get all thresholds
    async getAll() {
        const { data, error } = await supabase
            .from('thresholds')
            .select('*')
            .order('threshold_type', { ascending: true });

        if (error) throw error;
        return data;
    },

    // Get threshold by type
    async findByType(threshold_type) {
        const { data, error } = await supabase
            .from('thresholds')
            .select('*')
            .eq('threshold_type', threshold_type)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    // Update threshold
    async update(id, updates) {
        const { data, error } = await supabase
            .from('thresholds')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get thresholds as object for easy lookup
    async getThresholdsMap() {
        const thresholds = await this.getAll();
        const map = {};
        thresholds.forEach(t => {
            map[t.threshold_type] = t;
        });
        return map;
    },
};

export default ThresholdModel;
