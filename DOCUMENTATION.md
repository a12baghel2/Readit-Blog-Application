# Readit Blog Application - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technologies Used](#technologies-used)
4. [Project Structure](#project-structure)
5. [Core Files Documentation](#core-files-documentation)
6. [Models](#models)
7. [Routes](#routes)
8. [Authentication & Middleware](#authentication--middleware)
9. [Utilities](#utilities)
10. [Setup & Installation](#setup--installation)
11. [Features](#features)

---

## Project Overview

**Readit** is a markdown-based blog application that enables users to create, read, edit, and delete blog articles with full user authentication and authorization. The application provides a simple yet powerful interface for bloggers to share their content written in Markdown format.

### Key Characteristics:
- User authentication system with bcrypt password encryption
- Markdown to HTML conversion and sanitization
- RESTful API design
- MongoDB NoSQL database integration
- Session-based authentication using Passport.js
- Deployed on Vercel

---

## Architecture

### Technology Stack
```
Frontend: EJS (Embedded JavaScript Templates)
Backend: Express.js (Node.js)
Database: MongoDB (NoSQL)
Authentication: Passport.js with Local Strategy
Password Hashing: bcryptjs
Validation: @hapi/joi
Markdown Processing: marked.js
HTML Sanitization: dompurify
```

### Application Flow
```
User Request → Express Router → Middleware (Auth Check) → Route Handler → Database Query → Render/Response
```

---

## Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x | Runtime environment |
| Express | 4.17.1 | Web framework |
| MongoDB | - | Database |
| Mongoose | 5.11.15 | MongoDB ODM |
| Passport | 0.4.1 | Authentication middleware |
| EJS | 3.1.7 | Template engine |
| bcryptjs | 2.4.3 | Password hashing |
| @hapi/joi | 17.1.1 | Input validation |
| marked | 4.0.10 | Markdown parser |
| dompurify | 2.2.6 | HTML sanitization |
| slugify | 1.4.6 | URL-friendly slug generation |
| dotenv | 8.2.0 | Environment variables |
| body-parser | 1.19.0 | Request body parsing |
| method-override | 3.0.0 | HTTP method override |
| express-session | 1.17.1 | Session management |
| express-flash | 0.0.2 | Flash messages |
| nodemon | 2.0.7 | Development auto-reload |

---

## Project Structure

```
Readit-Blog-Application/
├── index.js                          # Application entry point
├── isAuth.js                         # Authentication middleware
├── validation.js                     # Input validation schemas
├── passport-config.js                # Passport.js configuration
├── package.json                      # Project dependencies
├── vercel.json                       # Vercel deployment config
├── README.md                         # Project README
├── DOCUMENTATION.md                  # This file
│
├── models/
│   ├── articles.js                   # Article schema and model
│   └── User.js                       # User schema and model
│
├── routes/
│   ├── articles.js                   # Article CRUD routes
│   ├── auth.js                       # Authentication routes
│   └── profile.js                    # User profile route
│
├── views/
│   ├── articles/
│   │   ├── _form_fields.ejs          # Article form template (reusable)
│   │   ├── index.ejs                 # Blog listing page
│   │   ├── new.ejs                   # Create article page
│   │   ├── edit.ejs                  # Edit article page
│   │   └── show.ejs                  # Full article display
│   └── user/
│       ├── login.ejs                 # Login page
│       ├── register.ejs              # Registration page
│       └── profile.ejs               # User profile page
│
└── public/
    ├── css/
    │   └── style.css                 # Application styling
    └── js/
        └── script.js                 # Client-side JavaScript
```

---

## Core Files Documentation

### 1. **index.js** - Application Entry Point

**Purpose:** Main server file that initializes and configures the Express application.

**Key Features:**
- Port configuration (default: 5000)
- Database connection to MongoDB
- Session and authentication setup
- Route middleware registration
- Static file serving

**Configuration:**
```javascript
const port = process.env.PORT || 5000;
```

**Database Connection:**
- Uses MongoDB connection string from environment variables
- Implements Mongoose connection with modern options (useNewUrlParser, useUnifiedTopology)

**Main Route Handlers:**
- `GET /` - Displays all articles sorted by creation date (latest first)
- Passes user name (or "Guest" for non-authenticated users) to the view

**Middleware Stack:**
1. Static file serving from `/public`
2. Session configuration
3. Passport initialization
4. Flash message handling
5. URL-encoded and JSON body parsing
6. Method override for HTTP verbs

---

### 2. **package.json** - Project Configuration

**Description:** Defines project metadata, dependencies, and scripts.

**Scripts:**
- `npm start` - Run production server
- `npm run devstart` - Run development server with nodemon (auto-reload on file changes)

**Node Version:** Requires Node.js 20.x

---

### 3. **isAuth.js** - Authentication Middleware

**Purpose:** Provides middleware functions for route protection.

**Functions:**

#### `ensureAuthenticated(req, res, next)`
- **Purpose:** Verify user is logged in before accessing protected routes
- **Behavior:** 
  - If authenticated → proceeds to next middleware
  - If not authenticated → redirects to login with error message
- **Used for:** Protected routes requiring login (create, edit, delete articles)

#### `forwardAuthenticated(req, res, next)`
- **Purpose:** Redirect already logged-in users away from auth pages
- **Behavior:**
  - If not authenticated → proceeds to next middleware
  - If authenticated → redirects to home page
- **Used for:** Login and registration pages

---

### 4. **validation.js** - Input Validation

**Purpose:** Defines validation schemas using Joi for user input.

**Validation Rules:**

#### `registerValidation(data)`
Validates registration form data:
- `name`: String, minimum 6 characters, required
- `username`: String, minimum 6 characters, required
- `email`: String, minimum 6 characters, valid email format, required
- `password`: String, minimum 6 characters, required

#### `loginValidation(data)`
Validates login form data:
- `email`: String, minimum 6 characters, valid email format, required
- `password`: String, minimum 6 characters, required

**Error Handling:** Returns validation error details that can be displayed to users.

---

### 5. **passport-config.js** - Authentication Configuration

**Purpose:** Configures Passport.js local authentication strategy.

**Local Strategy Setup:**
- Uses email as the username field
- Retrieves user from database by email
- Compares submitted password with stored hashed password using bcrypt

**Serialization:**
- `serializeUser()`: Stores user ID in session
- `deserializeUser()`: Retrieves full user object from database using ID

**Flow:**
1. User submits credentials (email + password)
2. User found in database
3. Password compared with bcrypt
4. If match → user authenticated
5. Session established with user ID

---

## Models

### 1. **models/articles.js** - Article Model

**Schema Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | Yes | Article title |
| `description` | String | No | Brief article description |
| `markdown` | String | Yes | Article content in Markdown format |
| `createdAt` | Date | No | Timestamp of creation (auto-generated) |
| `createdBy` | String | Yes | Username of article author |
| `slug` | String | Yes, Unique | URL-friendly identifier |
| `sanitizedHTML` | String | Yes | HTML version (sanitized) |

**Pre-validation Hook:**
- Auto-generates slug from title using slugify
- Converts Markdown to HTML using marked
- Sanitizes HTML using dompurify to prevent XSS attacks

**Process:** `Markdown Input → marked() → dompurify.sanitize() → Stored as sanitizedHTML`

---

### 2. **models/User.js** - User Model

**Schema Fields:**

| Field | Type | Required | Length | Description |
|-------|------|----------|--------|-------------|
| `name` | String | Yes | Min: 6 | Full name |
| `username` | String | Yes | 6-20 | Unique username |
| `email` | String | Yes | 6-255 | Unique email address |
| `password` | String | Yes | 6-1024 | Bcrypt hashed password |
| `date` | Date | No | - | Account creation date (auto-generated) |

**Notes:**
- All fields except `date` are required
- Email and username must be unique
- Password is stored as bcrypt hash (never plaintext)

---

## Routes

### 1. **routes/articles.js** - Article Management Routes

**Base Path:** `/articles`

#### GET `/articles/new` - Create Article Form
- **Access:** Requires authentication
- **Response:** Renders article creation form

#### GET `/articles/edit/:id` - Edit Article Form
- **Access:** Requires authentication
- **Parameter:** Article ID (MongoDB ObjectID)
- **Response:** Renders edit form with existing article data

#### GET `/articles/:slug` - View Full Article
- **Access:** Public
- **Parameter:** Article slug (URL-friendly identifier)
- **Response:** Renders complete article with HTML content

#### POST `/articles/` - Create New Article
- **Access:** Requires authentication
- **Body Parameters:** title, description, markdown
- **Process:**
  1. Creates new article object
  2. Saves article data
  3. Triggers schema pre-validation (slug generation, HTML sanitization)
  4. Redirects to article page
- **Error Handling:** Re-renders form with article data on validation error

#### PUT `/articles/:id` - Update Article
- **Access:** Requires authentication
- **Parameter:** Article ID
- **Body Parameters:** title, description, markdown
- **Process:** Similar to POST but updates existing article

#### DELETE `/articles/:id` - Delete Article
- **Access:** Requires authentication
- **Authorization:** Only article creator can delete
- **Validation:** Checks if logged-in user matches article creator
- **Process:** Deletes article and redirects to home

**Helper Function: `saveArticleAndRedirect(path)`**
- Handles both create and update operations
- Extracts form data
- Saves to database
- Handles errors gracefully

---

### 2. **routes/auth.js** - Authentication Routes

**Base Path:** `/user`

#### GET `/user/register` - Registration Form
- **Access:** Forward authenticated only (redirects logged-in users home)
- **Response:** Renders registration form

#### POST `/user/register` - Create User Account
- **Body Parameters:** name, username, email, password
- **Process:**
  1. Validates input using joi schema
  2. Checks if email already registered
  3. Checks if username already taken
  4. Hashes password with bcrypt (salt rounds: 10)
  5. Creates and saves user to database
  6. Redirects to login on success
- **Error Handling:** Returns specific error messages for validation/duplicate issues

#### GET `/user/login` - Login Form
- **Access:** Forward authenticated only
- **Response:** Renders login form

#### POST `/user/login` - Authenticate User
- **Body Parameters:** email, password
- **Authentication:** Uses Passport.js local strategy
- **Success:** Starts session and redirects to home
- **Failure:** Redirects back to login with error message
- **Flash Messages:** Uses express-flash for error display

#### DELETE `/user/logout` - Logout User
- **Access:** Requires authentication
- **Process:** Destroys session and redirects home

---

### 3. **routes/profile.js** - User Profile Route

**Base Path:** `/profile`

#### GET `/profile/:name` - User Profile
- **Access:** Requires authentication
- **Parameter:** Username
- **Query Process:** Fetches all articles created by the user, sorted by creation date (newest first)
- **Response:** Renders profile page with user's articles

---

## Authentication & Middleware

### Session Management
- **Session Storage:** In-memory (suitable for small deployments; consider Redis for production)
- **Secret:** Encrypted using MongoDB connection string
- **Session Options:** Resave enabled, saveUninitialized enabled

### Passport.js Flow
1. User logs in with credentials
2. LocalStrategy verifies email and password
3. User object serialized (ID only stored in session)
4. User data deserialized on subsequent requests
5. `req.user` available in all authenticated routes

### Flash Messages
Display temporary messages that persist across one redirect:
- `success_msg`: Success notifications
- `error_msg`: General error messages
- `error`: Authentication errors

---

## Utilities

### Markdown Processing
- **Parser:** marked.js (converts Markdown to HTML)
- **Sanitizer:** dompurify (prevents XSS by removing dangerous HTML)
- **Flow:** User input (Markdown) → marked() → dompurify.sanitize() → Stored HTML

### Slug Generation
- **Library:** slugify
- **Purpose:** Creates URL-friendly article identifiers from titles
- **Example:** "My First Blog Post" → "my-first-blog-post"
- **Uniqueness:** Enforced at database level (unique index)

### Password Security
- **Algorithm:** bcryptjs
- **Salt Rounds:** 10
- **Process:** Password hashed before storage, never stored plaintext
- **Verification:** bcrypt.compare() for login

### Input Validation
- **Library:** @hapi/joi
- **Applied:** User registration and login
- **Prevents:** Invalid data entry, malformed requests

---

## Setup & Installation

### Prerequisites
- Node.js 20.x
- MongoDB instance
- NPM or Yarn

### Installation Steps

```bash
# Clone repository
git clone https://github.com/a12baghel2/Readit-Blog-Application.git

# Navigate to project directory
cd Readit-Blog-Application

# Install dependencies
npm install

# Create .env file with configuration
echo "DB_CONNECTION=your_mongodb_connection_string
PORT=5000" > .env

# Run development server
npm run devstart

# Or run production server
npm start
```

### Environment Variables
Create a `.env` file in the root directory:
```
DB_CONNECTION=mongodb://[username]:[password]@[host]:[port]/[database]
PORT=5000
```

---

## Features

### User Management
- ✅ User registration with validation
- ✅ Secure password hashing with bcrypt
- ✅ User login/logout with sessions
- ✅ Session persistence
- ✅ User profile with their articles

### Article Management
- ✅ Create new articles in Markdown
- ✅ View full articles with HTML rendering
- ✅ Edit existing articles (author only)
- ✅ Delete articles (author only)
- ✅ Automatic slug generation
- ✅ XSS protection through HTML sanitization
- ✅ Sort articles by creation date (newest first)

### Security
- ✅ Password encryption with bcryptjs
- ✅ Session-based authentication
- ✅ HTML sanitization against XSS
- ✅ Input validation with joi
- ✅ Authorization checks (only authors can edit/delete)

### User Experience
- ✅ Markdown support for articles
- ✅ Real-time form validation
- ✅ Flash messages for feedback
- ✅ Responsive design with Bootstrap
- ✅ Deployed on Vercel for accessibility

---

## Deployment

### Vercel Configuration (vercel.json)
```json
{
  "version": 2,
  "builds": [{"src": "index.js", "use": "@vercel/node"}],
  "routes": [{"src": "/(.*)", "dest": "index.js"}]
}
```

**Deployment:** Application is deployed and accessible at [Readit Blog Application](https://readit-blog-application.vercel.app/)

---

## API Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/` | No | Home page with all articles |
| GET | `/articles/new` | Yes | Create article form |
| POST | `/articles` | Yes | Create article |
| GET | `/articles/edit/:id` | Yes | Edit article form |
| PUT | `/articles/:id` | Yes | Update article |
| DELETE | `/articles/:id` | Yes | Delete article |
| GET | `/articles/:slug` | No | View article |
| GET | `/user/register` | No | Registration form |
| POST | `/user/register` | No | Register user |
| GET | `/user/login` | No | Login form |
| POST | `/user/login` | No | Login user |
| DELETE | `/user/logout` | Yes | Logout user |
| GET | `/profile/:name` | Yes | User profile |

---

## Common Workflows

### Creating an Article
1. User logs in
2. Navigates to `/articles/new`
3. Fills form with title, description, markdown content
4. Submits form (POST `/articles`)
5. Markdown converted to HTML and sanitized
6. Article stored with auto-generated slug
7. User redirected to article view page

### Editing an Article
1. User navigates to `/articles/edit/:id`
2. Form pre-populated with existing article data
3. User modifies content
4. Submits form (PUT `/articles/:id`)
5. Database record updated
6. User redirected to updated article page

### User Authentication Flow
1. New user: Register at `/user/register`
   - Validates input
   - Hashes password
   - Stores in database
2. Existing user: Login at `/user/login`
   - Passport verifies credentials
   - Session created
   - Session ID stored in cookie
3. Subsequent requests: Passport deserializes user from session
4. Logout: Destroys session and clears authentication

---

## Error Handling

### Validation Errors
- Registration/login validation fails → Form re-rendered with error message
- Article creation fails → Form re-rendered with partial data

### Authorization Errors
- Non-authenticated user accessing protected route → Redirect to login
- Non-author trying to delete article → Delete request ignored
- Authenticated user accessing login/register → Redirect to home

### Database Errors
- Duplicate email/username → Error message displayed
- Article not found → Redirect to home
- Database connection failure → Connection logged, retry with Mongoose

---

## Future Enhancements

1. **Database:** Migrate to PostgreSQL or add caching layer (Redis)
2. **Security:** Add CSRF protection, rate limiting
3. **Features:** Comments, tags, search functionality
4. **UI:** Dark mode, article preview, syntax highlighting
5. **Admin:** Admin panel for user/content management
6. **Performance:** Pagination for article listings, image optimization

---

## Support & Resources

- **Repository:** https://github.com/a12baghel2/Readit-Blog-Application
- **Live Demo:** https://readit-blog-application.vercel.app/
- **MongoDB Docs:** https://docs.mongodb.com/
- **Express Docs:** https://expressjs.com/
- **Passport Docs:** http://www.passportjs.org/

---

**Documentation Version:** 1.0
**Last Updated:** January 2026
**Maintainer:** a12baghel2
