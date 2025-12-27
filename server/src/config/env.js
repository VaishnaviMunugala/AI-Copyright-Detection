import dotenv from 'dotenv';

dotenv.config();

export const config = {
    supabase: {
        url: process.env.SUPABASE_URL,
        anonKey: process.env.SUPABASE_ANON_KEY,
        serviceKey: process.env.SUPABASE_SERVICE_KEY,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        expiresIn: '7d',
    },
    server: {
        port: process.env.PORT || 5000,
        env: process.env.NODE_ENV || 'development',
    },
    admin: {
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
    },
};

// Validate required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_KEY'];

requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        console.warn(`Warning: ${varName} is not set in environment variables`);
    }
});

export default config;
