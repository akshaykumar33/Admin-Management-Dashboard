# MERN Admin Dashboard Backend

This is the backend API for the MERN stack admin dashboard with Role-Based Access Control (RBAC).

---

## Features

- User authentication with JWT
- Role-Based Access Control (Admin & User roles)
- CRUD for Users, Learning Resources, Tool Resources, Interns, Projects
- Input validation and error handling
- File uploads support for documents and images
- Secure password hashing with bcrypt
- Rate limiting and CORS security
- Default admin user seeding script
- Fully typed with TypeScript

---

## Requirements

- Node.js 16+
- MongoDB (Local or Atlas)
- NPM or Yarn

---

## Setup

### 1. Install dependencies

`npm install`

### 2. Create `.env` file based on `.env.example`

Edit and fill out your environment variables:

- `PORT`: backend server port (default 5000)
- `MONGODB_URI`: your MongoDB connection string
- `JWT_SECRET`: strong secret for JWT signing (32+ chars)
- `ALLOWED_ORIGINS`: allowed CORS origins (comma separated)
- `DEFAULT_ADMIN_*`: default admin credentials

### 3. Seed Default Admin User

`npm run seed`

Default admin user credentials will be shown (or skipped if existing).

### 4. Run Server

- Development mode (auto reload)
  `npm run dev`

- Production mode
   `npm start`
   
Server will run on `http://localhost:<PORT>/api`

---

## API Documentation (Summary)

### Auth Routes

- POST /api/auth/register - Register new user (can restrict to admin)
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get logged-in user profile
- PUT /api/auth/profile - Update profile
- PUT /api/auth/change-password - Change password

### User Routes (Admin only)

- GET /api/users - List all users
- GET /api/users/:id - Get user by ID
- POST /api/users - Create new user
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Soft delete user
- POST /api/users/:id/reset-password - Reset password
- PUT /api/users/:id/settings - Update user settings (own user only)

### Learning Resources

- GET /api/learning-resources
- GET /api/learning-resources/:id
- POST /api/learning-resources
- PUT /api/learning-resources/:id
- DELETE /api/learning-resources/:id
- POST /api/learning-resources/:id/like

### Tools Resources

- GET /api/tools
- GET /api/tools/:id
- POST /api/tools
- PUT /api/tools/:id
- DELETE /api/tools/:id

### Interns

- GET /api/interns
- GET /api/interns/:id
- POST /api/interns (Admin only)
- PUT /api/interns/:id (Admin only)
- DELETE /api/interns/:id (Admin only)
- POST /api/interns/:id/comments
- POST /api/interns/:id/meeting-notes
- POST /api/interns/:id/projects (Admin only)

---

## Testing

Run test suite:

`npm test`

---

## Docker

Build and run using Docker (See Dockerfile)

---

## Contributing

Pull requests and issues welcome!

---

## License

MIT License


