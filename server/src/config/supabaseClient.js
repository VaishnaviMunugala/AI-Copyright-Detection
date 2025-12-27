import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('⚠️  Missing Supabase environment variables. App will run in limited/demo mode.');
}

// Helper to safely create client or mock
const createSafeClient = (url, key) => {
    if (!url || !key || url.includes('placeholder')) {
        console.warn('⚠️  Supabase Not Configured: Using mock client. Database operations will fail or be mocked.');

        // Mock chainable builder that is also 'thenable' (resolves to empty data)
        // Mock chainable builder that preserves state
        const mockBuilder = (state = { type: 'select', data: null }) => {
            const builder = {
                select: () => {
                    // If we are already in an insert state, keep it (so we return the inserted data)
                    if (state.type === 'insert') return mockBuilder(state);
                    return mockBuilder({ ...state, type: 'select' });
                },
                insert: (data) => {
                    const mockData = { id: 'mock-user-id-' + Date.now(), ...data[0], created_at: new Date().toISOString() };
                    return mockBuilder({ type: 'insert', data: mockData });
                },
                update: () => mockBuilder({ ...state, type: 'update' }),
                delete: () => mockBuilder({ ...state, type: 'delete' }),
                eq: () => mockBuilder({ ...state, type: 'filter' }),
                order: () => mockBuilder({ ...state, type: 'filter' }),
                limit: () => mockBuilder({ ...state, type: 'filter' }),
                range: () => mockBuilder({ ...state, type: 'filter' }),
                match: () => mockBuilder({ ...state, type: 'filter' }),
                gte: () => mockBuilder({ ...state, type: 'filter' }),
                single: () => {
                    // Logic based on the FINAL state of the chain
                    if (state.type === 'insert') {
                        return Promise.resolve({ data: state.data, error: null });
                    }
                    if (state.type === 'filter' || state.type === 'select') {
                        // Simulate "User Not Found" for registration check
                        return Promise.resolve({ data: null, error: { code: 'PGRST116', message: 'No rows' } });
                    }
                    return Promise.resolve({ data: {}, error: null });
                },
                then: (resolve, reject) => resolve({ data: [], error: null, count: 0 })
            };
            return builder;
        };

        return {
            from: () => mockBuilder(),
            auth: {
                getUser: () => Promise.resolve({ data: { user: null } }),
                getSession: () => Promise.resolve({ data: { session: null } }),
                signInWithPassword: () => Promise.resolve({ data: { session: { access_token: 'mock-token' }, user: { id: 'mock-id' } }, error: null }),
                signUp: () => Promise.resolve({ data: { session: { access_token: 'mock-token' }, user: { id: 'mock-id' } }, error: null }),
                signOut: () => Promise.resolve({ error: null })
            }
        };
    }
    return createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
};

// Service role client for admin operations
export const supabase = createSafeClient(supabaseUrl, supabaseServiceKey);

// Anon client for regular operations
export const supabaseAnon = createSafeClient(supabaseUrl, process.env.SUPABASE_ANON_KEY);

export default supabase;
