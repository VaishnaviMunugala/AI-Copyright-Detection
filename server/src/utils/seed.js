import bcrypt from 'bcrypt';
import { UserModel } from '../models/User.js';
import { CategoryModel } from '../models/Category.js';
import { ThresholdModel } from '../models/Threshold.js';
import { ContentEntryModel } from '../models/ContentEntry.js';
import { generateFingerprint, generateCertificateId } from './fingerprint.js';
import { config } from '../config/env.js';

/**
 * Seed database with initial data
 */
async function seed() {
    console.log('🌱 Starting database seeding...\n');

    try {
        // 1. Create admin user
        console.log('👤 Creating admin user...');
        const adminPassword = await bcrypt.hash(config.admin.password, 10);

        const existingAdmin = await UserModel.findByEmail(config.admin.email);
        if (!existingAdmin) {
            await UserModel.create({
                name: 'Admin User',
                email: config.admin.email,
                password: adminPassword,
                role: 'admin',
            });
            console.log('✅ Admin user created');
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        // 2. Create sample regular user
        console.log('\n👤 Creating sample user...');
        const userPassword = await bcrypt.hash('user123', 10);

        const existingUser = await UserModel.findByEmail('user@example.com');
        let sampleUser;
        if (!existingUser) {
            sampleUser = await UserModel.create({
                name: 'Sample User',
                email: 'user@example.com',
                password: userPassword,
                role: 'user',
            });
            console.log('✅ Sample user created');
        } else {
            sampleUser = existingUser;
            console.log('ℹ️  Sample user already exists');
        }

        // 3. Create categories
        console.log('\n📁 Creating categories...');
        const categories = [
            { name: 'Code Snippets', description: 'Programming code and scripts' },
            { name: 'Articles', description: 'Written articles and blog posts' },
            { name: 'Poems', description: 'Poetry and creative writing' },
            { name: 'Research Papers', description: 'Academic and research documents' },
            { name: 'Blogs', description: 'Blog posts and online content' },
            { name: 'Reports', description: 'Business and technical reports' },
            { name: 'Documentation', description: 'Technical documentation and guides' },
            { name: 'Essays', description: 'Academic and personal essays' },
            { name: 'Stories', description: 'Short stories and narratives' },
            { name: 'Scripts', description: 'Screenplays and scripts' },
            { name: 'Other', description: 'Miscellaneous content' },
        ];

        for (const category of categories) {
            try {
                await CategoryModel.create(category);
                console.log(`✅ Created category: ${category.name}`);
            } catch (error) {
                if (error.code === '23505') {
                    console.log(`ℹ️  Category already exists: ${category.name}`);
                } else {
                    throw error;
                }
            }
        }

        // 4. Create thresholds
        console.log('\n⚙️  Creating detection thresholds...');
        const thresholds = [
            {
                threshold_type: 'original',
                min_score: 0.00,
                max_score: 0.29,
                semantic_weight: 0.40,
                structural_weight: 0.30,
                hash_weight: 0.30,
            },
            {
                threshold_type: 'partial',
                min_score: 0.30,
                max_score: 0.69,
                semantic_weight: 0.40,
                structural_weight: 0.30,
                hash_weight: 0.30,
            },
            {
                threshold_type: 'high',
                min_score: 0.70,
                max_score: 1.00,
                semantic_weight: 0.40,
                structural_weight: 0.30,
                hash_weight: 0.30,
            },
        ];

        for (const threshold of thresholds) {
            await ThresholdModel.upsert(threshold);
            console.log(`✅ Created/Updated threshold: ${threshold.threshold_type}`);
        }

        // 5. Create sample content
        console.log('\n📄 Creating sample registered content...');

        const allCategories = await CategoryModel.getAll();
        const codeCategory = allCategories.find(c => c.name === 'Code Snippets');
        const articleCategory = allCategories.find(c => c.name === 'Articles');

        const sampleContents = [
            {
                title: 'React Authentication Hook',
                content: `import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  return { user, loading };
};`,
                category_id: codeCategory?.id,
            },
            {
                title: 'Introduction to Machine Learning',
                content: `Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It focuses on the development of computer programs that can access data and use it to learn for themselves.

The process of learning begins with observations or data, such as examples, direct experience, or instruction, in order to look for patterns in data and make better decisions in the future based on the examples that we provide. The primary aim is to allow the computers to learn automatically without human intervention or assistance and adjust actions accordingly.

There are several types of machine learning algorithms, including supervised learning, unsupervised learning, and reinforcement learning. Each type has its own strengths and is suited for different types of problems.`,
                category_id: articleCategory?.id,
            },
            {
                title: 'Database Connection Utility',
                content: `const { Pool } = require('pg');

class Database {
  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
  }

  async query(text, params) {
    const start = Date.now();
    const res = await this.pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  }

  async getClient() {
    const client = await this.pool.connect();
    return client;
  }
}

module.exports = new Database();`,
                category_id: codeCategory?.id,
            },
        ];

        for (const content of sampleContents) {
            try {
                const { hash, embedding } = generateFingerprint(content.content);
                const certificate_id = generateCertificateId();

                await ContentEntryModel.create({
                    title: content.title,
                    owner_id: sampleUser.id,
                    category_id: content.category_id,
                    raw_content: content.content,
                    fingerprint: hash,
                    embedding_vector: embedding,
                    certificate_id,
                });

                console.log(`✅ Created sample content: ${content.title}`);
            } catch (error) {
                console.log(`⚠️  Error creating content: ${content.title}`, error.message);
            }
        }

        console.log('\n✅ Database seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log('   - Admin user: ' + config.admin.email);
        console.log('   - Sample user: user@example.com (password: user123)');
        console.log('   - Categories: ' + categories.length);
        console.log('   - Thresholds: ' + thresholds.length);
        console.log('   - Sample content: ' + sampleContents.length);
        console.log('\n');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seed()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

export default seed;
