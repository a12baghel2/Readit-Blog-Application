# Readit Blog Application - Production Grade Structure

## 📁 Project Structure

```
Readit-Blog-Application/
├── src/                          # Source code
│   ├── config/                   # Configuration files
│   │   ├── database.js           # Database connection
│   │   └── passport.js           # Passport authentication config
│   ├── controllers/              # Business logic (for future expansion)
│   ├── middleware/               # Express middleware
│   │   └── auth.js               # Authentication middleware
│   ├── models/                   # Database models
│   │   ├── Article.js
│   │   └── User.js
│   ├── routes/                   # API routes
│   │   ├── index.js              # Route aggregator
│   │   ├── articles.js
│   │   ├── auth.js
│   │   └── profile.js
│   ├── utils/                    # Utility functions
│   │   └── validation.js         # Input validation
│   ├── views/                    # EJS templates
│   │   ├── articles/
│   │   └── user/
│   ├── public/                   # Static files (CSS, JS, images)
│   ├── app.js                    # Express app setup
│   └── server.js                 # Server entry point
│
├── .env                          # Environment variables (DO NOT COMMIT)
├── .env.example                  # Example environment variables
├── .eslintrc.json                # ESLint configuration
├── .gitignore                    # Git ignore file
├── package.json
├── package-lock.json
├── index.js                      # Root entry point
├── README.md
├── DOCUMENTATION.md
└── vercel.json                   # Vercel deployment config
```

## 🚀 Key Improvements

1. **Separation of Concerns**: Code organized by functionality
2. **Scalability**: Easy to add controllers and services
3. **Maintainability**: Clear directory structure and naming conventions
4. **Configuration**: Centralized config files
5. **Middleware**: Organized middleware files
6. **Utils**: Reusable utility functions

## 📦 Installation & Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your MongoDB connection string and other variables

4. Start the server:
   ```bash
   npm start
   ```

## 🔧 Available Scripts

- `npm start` - Start the server
- `npm run dev` - Start with nodemon (development)
- `npm run lint` - Run ESLint

## 📝 Notes

- All source code is in the `src/` directory
- Environment variables should be stored in `.env`
- Static files are served from `src/public/`
- Views are in `src/views/`
