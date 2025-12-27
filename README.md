# AI Copyright Detection + Owner Verification System

A comprehensive full-stack MERN application for detecting copyright infringement and verifying content ownership using AI-powered similarity analysis.

## 🚀 Features

### Core Features
- **AI Similarity Detection**: Advanced algorithms combining semantic analysis, structural comparison, and cryptographic fingerprinting
- **Content Registration**: Register original works with timestamped ownership certificates
- **Ownership Verification**: Verify authenticity and ownership of registered content
- **AI-Powered Insights**: Real-time recommendations, risk assessments, and actionable insights
- **Admin Dashboard**: Manage detection thresholds, categories, and view system analytics
- **User Authentication**: Secure JWT-based authentication with role-based access control

### Technical Features
- Hybrid fingerprinting system (SHA-256 + TF-IDF embeddings)
- Configurable similarity thresholds
- Dark mode support
- Responsive mobile-first design
- Real-time toast notifications
- Pagination for large datasets

## 🛠️ Tech Stack

### Frontend
- **React** 18.2 with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Day.js** for date handling
- **Context API** for state management

### Backend
- **Node.js** with Express
- **Supabase** (PostgreSQL) for database
- **JWT** for authentication
- **bcrypt** for password hashing
- **Natural** (NLP library) for text analysis
- **crypto** for fingerprinting

## 📁 Project Structure

```
vibe/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                # Node.js backend
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── models/       # Database models
│   │   ├── controllers/  # Route controllers
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Express middleware
│   │   ├── utils/        # Utility functions & AI engine
│   │   └── server.js     # Server entry point
│   └── package.json
├── .env.example          # Environment variables template
├── .gitignore
├── package.json          # Root package.json
└── README.md
```

## 🔧 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### 1. Clone the repository
```bash
git clone <repository-url>
cd vibe
```

### 2. Install dependencies
```bash
npm run install-all
```

This will install dependencies for both client and server.

### 3. Set up Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Go to Project Settings > API to get your credentials
3. Go to SQL Editor and run the schema from `server/src/config/supabase-setup.sql`

### 4. Configure environment variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Admin Configuration (for seeding)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### 5. Seed the database

```bash
npm run seed
```

This will create:
- Admin user (email: admin@example.com, password: admin123)
- Sample user (email: user@example.com, password: user123)
- 11 content categories
- Default similarity thresholds
- Sample registered content

### 6. Run the application

Development mode (runs both client and server):
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Detection Endpoints

#### Detect Content
```http
POST /api/detect
Content-Type: application/json

{
  "content": "Your content to analyze...",
  "title": "Optional title",
  "category_id": "optional-category-uuid"
}
```

#### Get Detection Result
```http
GET /api/detection/:id
```

#### Get User Detection History
```http
GET /api/detections/user?limit=20&offset=0
Authorization: Bearer <token>
```

### Content Registration Endpoints

#### Register Content
```http
POST /api/content
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Your original content...",
  "title": "Content title",
  "category_id": "category-uuid"
}
```

#### Get User's Registered Content
```http
GET /api/content/user?limit=20&offset=0
Authorization: Bearer <token>
```

#### Verify Ownership
```http
POST /api/content/verify
Content-Type: application/json

{
  "content": "Content to verify...",
  "certificate_id": "CERT-XXXXXXXXXX"
}
```

#### Delete Content
```http
DELETE /api/content/:id
Authorization: Bearer <token>
```

### Admin Endpoints

All admin endpoints require authentication with admin role.

#### Get Analytics Overview
```http
GET /api/admin/analytics/overview
Authorization: Bearer <admin-token>
```

#### Get/Update Thresholds
```http
GET /api/admin/thresholds
PUT /api/admin/thresholds/:id
Authorization: Bearer <admin-token>
```

#### Manage Categories
```http
GET /api/admin/categories
POST /api/admin/categories
PUT /api/admin/categories/:id
DELETE /api/admin/categories/:id
Authorization: Bearer <admin-token>
```

## 🎨 UI Design

### Color Palette
- **Primary**: #2563EB (Royal Blue)
- **Secondary**: #10B981 (Green Mint)
- **Background**: #F1F5F9 (Soft Neutral White)
- **Text**: #111827 (Slate Black)

### Typography
- **Headings**: Poppins
- **Body**: Inter

### Design Features
- Glassmorphism navbar
- Smooth animations and transitions
- Dark mode support
- Mobile-first responsive design
- Custom scrollbars

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Row Level Security (RLS) in Supabase
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 🚀 Deployment

### Replit Deployment

1. Import the project to Replit
2. Add environment variables in Replit Secrets
3. Run `npm run install-all`
4. Run `npm run seed`
5. Run `npm run dev`

### Production Deployment

1. Set `NODE_ENV=production` in environment variables
2. Build the client: `cd client && npm run build`
3. Serve the built files with the Express server
4. Use a process manager like PM2 for the Node.js server
5. Set up a reverse proxy (nginx) if needed

## 📝 License

This project is licensed under the ISC License.

## 👥 Support

For issues and questions, please open an issue on the repository.

---

Built with ❤️ using React, Node.js, and Supabase
