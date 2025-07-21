LMS Mega Project Backend

Overview
The LMS Mega Project Backend is a robust RESTful API for a Learning Management System (LMS), built with Node.js, Express.js, and MongoDB. It supports secure user authentication, profile management, and session handling using JSON Web Tokens (JWT) and Redis. The backend integrates Cloudinary for media uploads and Nodemailer for email notifications, providing a scalable and secure foundation for an LMS application.

Table of Contents

Features
Tech Stack
Project Structure
Prerequisites
Installation
Configuration
Running the Application
API Documentation
Contributing
License


Features

User Authentication: Secure registration, login, logout, and social authentication with JWT-based tokens.
Account Activation: Email-based account activation with a 6-digit code stored in Redis.
Session Management: Persistent sessions using Redis with automatic token refresh.
Profile Management: Update user details, password, and profile picture with Cloudinary integration.
Role-Based Access: Restrict routes based on user roles (user, admin).
Error Handling: Centralized error handling for consistent API responses.
File Uploads: Avatar uploads via Multer and Cloudinary.
Email Notifications: Account activation emails using Nodemailer and EJS templates.


Tech Stack

Runtime: Node.js
Framework: Express.js
Database: MongoDB with Mongoose
Caching: Redis
Authentication: JSON Web Tokens (JWT), bcryptjs
File Storage: Cloudinary
Email Service: Nodemailer with EJS templating
Middleware: Multer, CORS, Cookie-Parser
Environment: dotenv


Project Structure
lms-mega-project/
├── server/
│   ├── controllers/
│   │   └── user.controller.js       # User-related API logic
│   ├── middleware/
│   │   ├── auth.js                 # Authentication and authorization middleware
│   │   ├── catchAsyncErrors.js     # Async error handling
│   │   ├── error.js                # Global error handler
│   │   └── multer.js               # File upload middleware
│   ├── models/
│   │   └── user.model.js           # Mongoose schema for User
│   ├── routes/
│   │   └── user.route.js           # User API routes
│   ├── services/
│   │   └── user.service.js         # User-related service functions
│   ├── utils/
│   │   ├── cloudinary.js           # Cloudinary configuration
│   │   ├── db.js                   # MongoDB connection
│   │   ├── ErrorHandler.js         # Custom error handler
│   │   ├── jwt.js                  # JWT token generation
│   │   ├── redis.js                # Redis configuration
│   │   └── sendEmail.js            # Email sending utility
│   ├── mails/
│   │   └── activation-email.ejs    # Email template for activation
│   ├── app.js                      # Express app setup
│   └── server.js                   # Server entry point .env                            # Environment variables
├── package.json                    # Project dependencies and scripts
├── README.md                       # Project documentation
└── apiDocs.md                      # API documentation for frontend developers


Prerequisites

Node.js: v16.0.0 or higher
MongoDB: Local or cloud-based instance
Redis: Local or cloud-based instance
Cloudinary Account: For media uploads
SMTP Service: For email notifications (e.g., Gmail, SendGrid)


Installation

Clone the Repository:
git clone https://github.com/your-username/lms-mega-project.git
cd lms-mega-project


Install Dependencies:
npm install


Set Up Environment Variables:Create a .env file in the root directory with the following:
PORT=4000
DB_URI=mongodb://localhost:27017/lms
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESSTOKEN_EXPIRE=300
REFRESHTOKEN_EXPIRE=1200
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SERVICE=your_email_service
SMTP_MAIL=your_email@example.com
SMTP_PASSWORD=your_email_password
ORIGIN=http://localhost:3000
NODE_ENV=development




Configuration

MongoDB: Ensure MongoDB is running or provide a cloud-based URI.
Redis: Install Redis locally or use a cloud-based service.
Cloudinary: Add your Cloudinary credentials to the .env file.
SMTP: Configure an SMTP service for emails.
CORS: Set the ORIGIN variable to your frontend URL.


Running the Application

Start the Server:
npm start


Access the API:The server runs on http://localhost:4000. Test endpoints using Postman or a similar tool.

Test Endpoint:
GET http://localhost:4000/test

Response:
{
  "success": true,
  "message": "API is working"
}




API Documentation
For detailed API documentation, including endpoints, request/response formats, and error handling, refer to the apiDocs.md file. This is designed for frontend developers to integrate with the backend.

Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a Pull Request.


License
This project is licensed under the MIT License.
