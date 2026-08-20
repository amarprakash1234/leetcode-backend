# LeetCode Clone - Backend

The backend API for a LeetCode-style coding and DSA platform.

This project provides APIs for user authentication, coding problems, submissions, AI-powered doubt solving, and video-related features. It is built using **Node.js**, **Express**, **MongoDB**, and **Redis**.

## 🚀 Features

### 👤 User Authentication

* User signup
* User login
* Password hashing using `bcrypt`
* JWT-based authentication
* Cookie-based authentication support
* Protected routes
* User validation

### 📝 Problem Management

* Create coding problems
* Update existing problems
* Delete problems
* Fetch problem details
* Manage coding questions and related data

### 💻 Code Submission

* Submit solutions for coding problems
* Submission-related APIs
* Store and manage submission data

### 🤖 AI-Powered Doubt Solving

The backend includes an AI-related API for solving programming doubts using the Google GenAI SDK.

### 🎥 Video Features

* Video-related APIs
* Video content management
* Integration with Cloudinary for cloud-based media handling

### ⚡ Performance and Caching

* Redis integration
* Redis connection initialized when the server starts
* MongoDB and Redis connections are initialized before the application begins listening for requests

## 🛠️ Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **Redis**
* **JSON Web Token (JWT)**
* **bcrypt**
* **cookie-parser**
* **CORS**
* **Cloudinary**
* **Google GenAI**
* **Axios**
* **Validator**
* **Docker**
* **Docker Compose**

## 📁 Project Structure

```text
leetcode-backend/
│
├── src/
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── redis.js
│   │
│   ├── controllers/
│   │   ├── problem.js
│   │   ├── solveDoubt.js
│   │   ├── submission.js
│   │   ├── userAuth.js
│   │   └── videoSection.js
│   │
│   ├── middlewares/
│   │
│   ├── models/
│   │
│   ├── routes/
│   │   ├── aiChatting.js
│   │   ├── problem.js
│   │   ├── submission.js
│   │   ├── userAuth.js
│   │   └── videoCreator.js
│   │
│   ├── utils/
│   │
│   └── index.js
│
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
└── .gitignore
```

## 🔗 API Modules

The backend is organized into the following main API modules.

| Base Route    | Description                                 |
| ------------- | ------------------------------------------- |
| `/user`       | User authentication and user-related APIs   |
| `/problem`    | Coding problem management                   |
| `/submission` | Code submission-related APIs                |
| `/ai`         | AI-powered doubt-solving/chat functionality |
| `/video`      | Video-related functionality                 |

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* MongoDB
* Redis
* Git

You may also need accounts or credentials for services used by the application, such as:

* MongoDB
* Redis
* Cloudinary
* Google GenAI

## 1. Clone the Repository

```bash
git clone https://github.com/amarprakash1234/leetcode-backend.git
```

## 2. Move into the Project Directory

```bash
cd leetcode-backend
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Configure Environment Variables

Create a `.env` file in the root directory of the project.

Example:

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

REDIS_URL=your_redis_connection_url

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GEMINI_API_KEY=your_google_genai_api_key
```

> Use the environment variable names that match your actual configuration files. Never commit your `.env` file to GitHub.

## 5. Start MongoDB and Redis

Make sure both MongoDB and Redis are running and accessible using the configuration defined in your project.

The application initializes connections to both services before starting the Express server.

## 6. Start the Server

```bash
node src/index.js
```

If your environment variables and services are configured correctly, the server will start on the port defined in:

```env
PORT=3000
```

The API will then be available at:

```text
http://localhost:3000
```

## 🔐 Authentication Flow

```text
User
 │
 ▼
Signup / Login
 │
 ▼
Password Validation
 │
 ▼
bcrypt Password Handling
 │
 ▼
JWT Generation
 │
 ▼
Authentication Cookie / Token
 │
 ▼
Protected API Access
```

## 🏗️ Application Architecture

```text
Client Application
        │
        ▼
   Express Server
        │
        ├──────────────► User Routes
        │
        ├──────────────► Problem Routes
        │
        ├──────────────► Submission Routes
        │
        ├──────────────► AI Routes
        │
        └──────────────► Video Routes
                         │
                         ▼
                  Controllers
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
       MongoDB         Redis        External APIs
                                        │
                                        ├── Google GenAI
                                        └── Cloudinary
```

## 🌐 CORS Configuration

The backend uses CORS with credentials enabled so that the frontend can send authenticated requests.

For local development, configure the frontend origin appropriately.

Example:

```javascript
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
```

When deploying the application, replace the development origin with your production frontend URL.

## 🐳 Run with Docker

The repository includes a Dockerfile based on `node:22-alpine`.

### Build the Docker Image

```bash
docker build -t leetcode-backend .
```

### Run the Container

```bash
docker run -p 3000:3000 --env-file .env leetcode-backend
```

The server will be accessible at:

```text
http://localhost:3000
```

## 🐳 Run with Docker Compose

The project also contains a `docker-compose.yml` file.

Run:

```bash
docker compose up --build
```

To stop the containers:

```bash
docker compose down
```

## 👨‍💻 Author

**Amar Prakash**

GitHub: https://github.com/amarprakash1234

## ⭐ Support

If you like this project, consider giving the repository a star ⭐.
