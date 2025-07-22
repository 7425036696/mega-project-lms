# 📚 LMS Mega Project – Node.js + Express Backend

A scalable, production-ready Learning Management System (LMS) backend built with Node.js and Express. Features include robust authentication, role-based access, course management, Q&A, notifications, and multivendor support.
---

## 🚀 Overview

This backend powers a modern LMS platform, enabling:

- 🔐 **Authentication**: Secure registration, login, logout, JWT & refresh tokens
- 🧑‍💼 **User Roles**: Admin, instructor, student
- 🎓 **Course Management**: Create, edit, purchase, review courses
- ❓ **Q&A System**: Ask and answer questions on course content
- 🔔 **Notifications**: Real-time notifications for users and admins
- 🏪 **Multivendor**: Multiple instructors can manage their own courses

---

## 🛠 Tech Stack

- **Node.js** & **Express.js** – REST API server
- **MongoDB** & **Mongoose** – Database & ODM
- **Redis** – Advanced caching and session management
- **Cloudinary** – Media storage and image optimization
- **JWT** – Authentication tokens
- **Nodemailer** & **EJS** – Email notifications
- **Stripe** – Payment processing
- **Multer** – File uploads

---

## ⚡ Setup Instructions

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/lms-mega-project.git
   cd lms-mega-project/server
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env` and fill in your values.

4. **Start the server**
   ```sh
   npm start
   ```

---

## 📁 Folder Structure

```
server/
│
├── app.js
├── server.js
├── package.json
├── .env
├── controllers/
│   └── *.controller.js
├── models/
│   └── *.model.js
├── routes/
│   └── *.route.js
├── services/
│   └── *.service.js
├── middleware/
│   └── *.js
├── utils/
│   └── *.js
├── mails/
│   └── *.ejs
```

---

## 🔑 Environment Variables Example

```env
PORT=3000
DB_URI=mongodb://localhost:27017/lms
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESSTOKEN_EXPIRE=300
REFRESHTOKEN_EXPIRE=1200
REDIS_URL=redis://localhost:6379
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SERVICE=Gmail
SMTP_MAIL=your@email.com
SMTP_PASSWORD=yourpassword
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
ORIGIN=http://localhost:3000
```

---

## 📖 API Documentation

All endpoints are prefixed with `/app/v1`.

| Endpoint                              | Method | Params / Body         | Auth Required | Description                                 |
|----------------------------------------|--------|-----------------------|---------------|---------------------------------------------|
| `/registration`                       | POST   | `{name, email, password}` | No        | Register a new user                         |
| `/activate-user`                      | POST   | `{activation_code, activation_token}` | No | Activate user via email code                |
| `/login-user`                         | POST   | `{email, password}`   | No            | Login user                                  |
| `/logout`                             | GET    | -                     | Yes           | Logout user                                 |
| `/refresh`                            | GET    | -                     | Yes (refresh) | Refresh access token                        |
| `/me`                                 | GET    | -                     | Yes           | Get current user info                       |
| `/create-course`                      | POST   | Course fields         | Admin/Instructor | Create a new course                     |
| `/edit-course/:id`                    | PUT    | Course fields         | Admin/Instructor | Edit course                             |
| `/get-course/:id`                     | GET    | -                     | No            | Get single course (public)                  |
| `/get-courses`                        | GET    | -                     | No            | Get all courses (public)                    |
| `/get-course-content/:id`             | GET    | -                     | Yes           | Get course content for enrolled user        |
| `/add-question`                       | PUT    | `{question, courseId, contentId}` | Yes | Add question to course content              |
| `/add-answer`                         | PUT    | `{answer, courseId, contentId, questionId}` | Yes | Answer a question                           |
| `/add-review/:id`                     | PUT    | `{review, rating}`    | Yes           | Add review to course                        |
| `/add-reply`                          | PUT    | `{comment, courseId, reviewId}` | Yes | Reply to a review                           |
| `/create-order`                       | POST   | `{courseId, payment_info}` | Yes      | Purchase a course                           |
| `/get-orders`                         | GET    | -                     | Admin/Instructor | Get all orders                          |
| `/get-all-notifications`              | GET    | -                     | Admin/Instructor | Get all notifications                   |
| `/update-notification/:id`            | PUT    | -                     | Admin/Instructor | Mark notification as read                |
| `/get-users`                          | GET    | -                     | Admin         | Get all users                               |
| `/update-user`                        | PUT    | `{id, role}`          | Admin         | Update user role                            |
| `/delete-user/:id`                    | DELETE | -                     | Admin         | Delete user                                 |
| `/update-profile-picture`             | POST   | `avatar` (form-data)  | Yes           | Update user profile picture                 |

---

## 📝 Standard API Response Format

All API responses follow a consistent structure for easy integration and error handling:

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": { /* resource-specific data */ }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message describing the issue."
}
```

---

## 📦 Example Endpoint Responses

### User Registration

**Request**
```http
POST /app/v1/registration
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securePassword123"
}
```

**Success Response**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to activate your account.",
  "data": {
    "activationToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response**
```json
{
  "success": false,
  "message": "Email already exists."
}
```

---

### Course Creation

**Request**
```http
POST /app/v1/create-course
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "title": "Node.js Masterclass",
  "description": "Learn Node.js from scratch",
  "price": 49.99,
  "category": "Programming"
}
```

**Success Response**
```json
{
  "success": true,
  "message": "Course created successfully.",
  "data": {
    "course": {
      "_id": "64b1f2c8e2b1a2c3d4e5f6a7",
      "title": "Node.js Masterclass",
      "instructor": "64b1f2c8e2b1a2c3d4e5f6a1",
      "price": 49.99,
      "category": "Programming"
    }
  }
}
```

**Error Response**
```json
{
  "success": false,
  "message": "Course title already exists."
}
```

---

### Advanced Features

- **Cloudinary**: All media uploads (course images, user avatars) are stored and optimized via Cloudinary.
- **Redis**: Frequently accessed data (e.g., course lists, user sessions) are cached for high performance.
- **MongoDB**: All persistent data is stored in a scalable NoSQL database.
- **Centralized Error Handling**: All errors are processed by a global middleware, ensuring consistent error responses.
- **Role-Based Access Control**: Middleware restricts access to sensitive endpoints.
- **Validation**: All input is validated and sanitized.
- **Security**: Uses HTTP-only cookies for tokens, rate limiting, helmet, and CORS.
- **Scalable Structure**: Modular controllers, services, and models for maintainability.
- **Comprehensive Logging**: All requests and errors are logged for monitoring and debugging.

---

## 🤝 Contribution

Contributions are welcome! Please:

1. Fork the repo & create your branch.
2. Commit your changes with clear messages.
3. Open a pull request describing your changes.

---

## 📄 License

This project is licensed under the # 📚 LMS Mega Project – Node.js + Express Backend

A scalable, production-ready Learning Management System (LMS) backend built with Node.js and Express. Features include robust authentication, role-based access, course management, Q&A, notifications, and multivendor support.

---

## 🚀 Overview

This backend powers a modern LMS platform, enabling:

- 🔐 **Authentication**: Secure registration, login, logout, JWT & refresh tokens
- 🧑‍💼 **User Roles**: Admin, instructor, student
- 🎓 **Course Management**: Create, edit, purchase, review courses
- ❓ **Q&A System**: Ask and answer questions on course content
- 🔔 **Notifications**: Real-time notifications for users and admins
- 🏪 **Multivendor**: Multiple instructors can manage their own courses

---

## 🛠 Tech Stack

- **Node.js** & **Express.js** – REST API server
- **MongoDB** & **Mongoose** – Database & ODM
- **Redis** – Advanced caching and session management
- **Cloudinary** – Media storage and image optimization
- **JWT** – Authentication tokens
- **Nodemailer** & **EJS** – Email notifications
- **Stripe** – Payment processing
- **Multer** – File uploads

---

## ⚡ Setup Instructions

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/lms-mega-project.git
   cd lms-mega-project/server
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env` and fill in your values.

4. **Start the server**
   ```sh
   npm start
   ```

---

## 📁 Folder Structure

```
server/
│
├── app.js
├── server.js
├── package.json
├── .env
├── controllers/
│   └── *.controller.js
├── models/
│   └── *.model.js
├── routes/
│   └── *.route.js
├── services/
│   └── *.service.js
├── middleware/
│   └── *.js
├── utils/
│   └── *.js
├── mails/
│   └── *.ejs
```

---

## 🔑 Environment Variables Example

```env
PORT=3000
DB_URI=mongodb://localhost:27017/lms
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESSTOKEN_EXPIRE=300
REFRESHTOKEN_EXPIRE=1200
REDIS_URL=redis://localhost:6379
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SERVICE=Gmail
SMTP_MAIL=your@email.com
SMTP_PASSWORD=yourpassword
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
ORIGIN=http://localhost:3000
```

---

## 📖 API Documentation

All endpoints are prefixed with `/app/v1`.

| Endpoint                              | Method | Params / Body         | Auth Required | Description                                 |
|----------------------------------------|--------|-----------------------|---------------|---------------------------------------------|
| `/registration`                       | POST   | `{name, email, password}` | No        | Register a new user                         |
| `/activate-user`                      | POST   | `{activation_code, activation_token}` | No | Activate user via email code                |
| `/login-user`                         | POST   | `{email, password}`   | No            | Login user                                  |
| `/logout`                             | GET    | -                     | Yes           | Logout user                                 |
| `/refresh`                            | GET    | -                     | Yes (refresh) | Refresh access token                        |
| `/me`                                 | GET    | -                     | Yes           | Get current user info                       |
| `/create-course`                      | POST   | Course fields         | Admin/Instructor | Create a new course                     |
| `/edit-course/:id`                    | PUT    | Course fields         | Admin/Instructor | Edit course                             |
| `/get-course/:id`                     | GET    | -                     | No            | Get single course (public)                  |
| `/get-courses`                        | GET    | -                     | No            | Get all courses (public)                    |
| `/get-course-content/:id`             | GET    | -                     | Yes           | Get course content for enrolled user        |
| `/add-question`                       | PUT    | `{question, courseId, contentId}` | Yes | Add question to course content              |
| `/add-answer`                         | PUT    | `{answer, courseId, contentId, questionId}` | Yes | Answer a question                           |
| `/add-review/:id`                     | PUT    | `{review, rating}`    | Yes           | Add review to course                        |
| `/add-reply`                          | PUT    | `{comment, courseId, reviewId}` | Yes | Reply to a review                           |
| `/create-order`                       | POST   | `{courseId, payment_info}` | Yes      | Purchase a course                           |
| `/get-orders`                         | GET    | -                     | Admin/Instructor | Get all orders                          |
| `/get-all-notifications`              | GET    | -                     | Admin/Instructor | Get all notifications                   |
| `/update-notification/:id`            | PUT    | -                     | Admin/Instructor | Mark notification as read                |
| `/get-users`                          | GET    | -                     | Admin         | Get all users                               |
| `/update-user`                        | PUT    | `{id, role}`          | Admin         | Update user role                            |
| `/delete-user/:id`                    | DELETE | -                     | Admin         | Delete user                                 |
| `/update-profile-picture`             | POST   | `avatar` (form-data)  | Yes           | Update user profile picture                 |

---

## 📝 Standard API Response Format

All API responses follow a consistent structure for easy integration and error handling:

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": { /* resource-specific data */ }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message describing the issue."
}
```

---

## 📦 Example Endpoint Responses

### User Registration

**Request**
```http
POST /app/v1/registration
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securePassword123"
}
```

**Success Response**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to activate your account.",
  "data": {
    "activationToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response**
```json
{
  "success": false,
  "message": "Email already exists."
}
```

---

### Course Creation

**Request**
```http
POST /app/v1/create-course
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "title": "Node.js Masterclass",
  "description": "Learn Node.js from scratch",
  "price": 49.99,
  "category": "Programming"
}
```

**Success Response**
```json
{
  "success": true,
  "message": "Course created successfully.",
  "data": {
    "course": {
      "_id": "64b1f2c8e2b1a2c3d4e5f6a7",
      "title": "Node.js Masterclass",
      "instructor": "64b1f2c8e2b1a2c3d4e5f6a1",
      "price": 49.99,
      "category": "Programming"
    }
  }
}
```

**Error Response**
```json
{
  "success": false,
  "message": "Course title already exists."
}
```

---

### Advanced Features

- **Cloudinary**: All media uploads (course images, user avatars) are stored and optimized via Cloudinary.
- **Redis**: Frequently accessed data (e.g., course lists, user sessions) are cached for high performance.
- **MongoDB**: All persistent data is stored in a scalable NoSQL database.
- **Centralized Error Handling**: All errors are processed by a global middleware, ensuring consistent error responses.
- **Role-Based Access Control**: Middleware restricts access to sensitive endpoints.
- **Validation**: All input is validated and sanitized.
- **Security**: Uses HTTP-only cookies for tokens, rate limiting, helmet, and CORS.
- **Scalable Structure**: Modular controllers, services, and models for maintainability.
- **Comprehensive Logging**: All requests and errors are logged for monitoring and debugging.

---

## 🤝 Contribution

Contributions are welcome! Please:

1. Fork the repo & create your branch.
2. Commit your changes with clear messages.
3. Open a pull request describing your changes.

---

## 📄 License

This project is licensed under the # 📚 LMS Mega Project – Node.js + Express Backend

A scalable, production-ready Learning Management System (LMS) backend built with Node.js and Express. Features include robust authentication, role-based access, course management, Q&A, notifications, and multivendor support.

---

## 🚀 Overview

This backend powers a modern LMS platform, enabling:

- 🔐 **Authentication**: Secure registration, login, logout, JWT & refresh tokens
- 🧑‍💼 **User Roles**: Admin, instructor, student
- 🎓 **Course Management**: Create, edit, purchase, review courses
- ❓ **Q&A System**: Ask and answer questions on course content
- 🔔 **Notifications**: Real-time notifications for users and admins
- 🏪 **Multivendor**: Multiple instructors can manage their own courses

---

## 🛠 Tech Stack

- **Node.js** & **Express.js** – REST API server
- **MongoDB** & **Mongoose** – Database & ODM
- **Redis** – Advanced caching and session management
- **Cloudinary** – Media storage and image optimization
- **JWT** – Authentication tokens
- **Nodemailer** & **EJS** – Email notifications
- **Stripe** – Payment processing
- **Multer** – File uploads

---

## ⚡ Setup Instructions

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/lms-mega-project.git
   cd lms-mega-project/server
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env` and fill in your values.

4. **Start the server**
   ```sh
   npm start
   ```

---

## 📁 Folder Structure

```
server/
│
├── app.js
├── server.js
├── package.json
├── .env
├── controllers/
│   └── *.controller.js
├── models/
│   └── *.model.js
├── routes/
│   └── *.route.js
├── services/
│   └── *.service.js
├── middleware/
│   └── *.js
├── utils/
│   └── *.js
├── mails/
│   └── *.ejs
```

---

## 🔑 Environment Variables Example

```env
PORT=3000
DB_URI=mongodb://localhost:27017/lms
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESSTOKEN_EXPIRE=300
REFRESHTOKEN_EXPIRE=1200
REDIS_URL=redis://localhost:6379
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SERVICE=Gmail
SMTP_MAIL=your@email.com
SMTP_PASSWORD=yourpassword
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
ORIGIN=http://localhost:3000
```

---

## 📖 API Documentation

All endpoints are prefixed with `/app/v1`.

| Endpoint                              | Method | Params / Body         | Auth Required | Description                                 |
|----------------------------------------|--------|-----------------------|---------------|---------------------------------------------|
| `/registration`                       | POST   | `{name, email, password}` | No        | Register a new user                         |
| `/activate-user`                      | POST   | `{activation_code, activation_token}` | No | Activate user via email code                |
| `/login-user`                         | POST   | `{email, password}`   | No            | Login user                                  |
| `/logout`                             | GET    | -                     | Yes           | Logout user                                 |
| `/refresh`                            | GET    | -                     | Yes (refresh) | Refresh access token                        |
| `/me`                                 | GET    | -                     | Yes           | Get current user info                       |
| `/create-course`                      | POST   | Course fields         | Admin/Instructor | Create a new course                     |
| `/edit-course/:id`                    | PUT    | Course fields         | Admin/Instructor | Edit course                             |
| `/get-course/:id`                     | GET    | -                     | No            | Get single course (public)                  |
| `/get-courses`                        | GET    | -                     | No            | Get all courses (public)                    |
| `/get-course-content/:id`             | GET    | -                     | Yes           | Get course content for enrolled user        |
| `/add-question`                       | PUT    | `{question, courseId, contentId}` | Yes | Add question to course content              |
| `/add-answer`                         | PUT    | `{answer, courseId, contentId, questionId}` | Yes | Answer a question                           |
| `/add-review/:id`                     | PUT    | `{review, rating}`    | Yes           | Add review to course                        |
| `/add-reply`                          | PUT    | `{comment, courseId, reviewId}` | Yes | Reply to a review                           |
| `/create-order`                       | POST   | `{courseId, payment_info}` | Yes      | Purchase a course                           |
| `/get-orders`                         | GET    | -                     | Admin/Instructor | Get all orders                          |
| `/get-all-notifications`              | GET    | -                     | Admin/Instructor | Get all notifications                   |
| `/update-notification/:id`            | PUT    | -                     | Admin/Instructor | Mark notification as read                |
| `/get-users`                          | GET    | -                     | Admin         | Get all users                               |
| `/update-user`                        | PUT    | `{id, role}`          | Admin         | Update user role                            |
| `/delete-user/:id`                    | DELETE | -                     | Admin         | Delete user                                 |
| `/update-profile-picture`             | POST   | `avatar` (form-data)  | Yes           | Update user profile picture                 |

---

## 📝 Standard API Response Format

All API responses follow a consistent structure for easy integration and error handling:

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": { /* resource-specific data */ }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message describing the issue."
}
```

---

## 📦 Example Endpoint Responses

### User Registration

**Request**
```http
POST /app/v1/registration
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securePassword123"
}
```

**Success Response**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to activate your account.",
  "data": {
    "activationToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response**
```json
{
  "success": false,
  "message": "Email already exists."
}
```

---

### Course Creation

**Request**
```http
POST /app/v1/create-course
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "title": "Node.js Masterclass",
  "description": "Learn Node.js from scratch",
  "price": 49.99,
  "category": "Programming"
}
```

**Success Response**
```json
{
  "success": true,
  "message": "Course created successfully.",
  "data": {
    "course": {
      "_id": "64b1f2c8e2b1a2c3d4e5f6a7",
      "title": "Node.js Masterclass",
      "instructor": "64b1f2c8e2b1a2c3d4e5f6a1",
      "price": 49.99,
      "category": "Programming"
    }
  }
}
```

**Error Response**
```json
{
  "success": false,
  "message": "Course title already exists."
}
```

---

### Advanced Features

- **Cloudinary**: All media uploads (course images, user avatars) are stored and optimized via Cloudinary.
- **Redis**: Frequently accessed data (e.g., course lists, user sessions) are cached for high performance.
- **MongoDB**: All persistent data is stored in a scalable NoSQL database.
- **Centralized Error Handling**: All errors are processed by a global middleware, ensuring consistent error responses.
- **Role-Based Access Control**: Middleware restricts access to sensitive endpoints.
- **Validation**: All input is validated and sanitized.
- **Security**: Uses HTTP-only cookies for tokens, rate limiting, helmet, and CORS.
- **Scalable Structure**: Modular controllers, services, and models for maintainability.
- **Comprehensive Logging**: All requests and errors are logged for monitoring and debugging.

---

## 🤝 Contribution

Contributions are welcome! Please:

1. Fork the repo & create your branch.
2. Commit your changes with clear messages.
3. Open a pull request describing your changes.

---

## 📄 License

This project is licensed under the [LMS ACADEMY](LICENSE)
