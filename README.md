![Header](https://capsule-render.vercel.app/api?type=waving&color=0%3A3178C6%2C100%3A007ACC&height=200&section=header&text=Odoo+Stackit&fontSize=45&fontColor=ffffff&fontAlign=50&fontAlignY=35&desc=%F0%9F%9A%80+TypeScript+Web_App+%E2%80%A2+TypeScript+%2B+React&descSize=18&descAlign=50&descAlignY=55&animation=fadeIn)

<div align="center">

# StackIt – A Minimal Q&A Forum Platform 🚀

### A modern, curated Q&A platform for developers, built with Go and Next.js.

[![GitHub last commit](https://img.shields.io/github/last-commit/gowtham-2oo5/odoo-StackIt?style=for-the-badge&color=007ACC&labelColor=0d1117)](https://github.com/gowtham-2oo5/odoo-StackIt/commits/main)
[![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white&labelColor=0d1117)](https://go.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white&labelColor=0d1117)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=0d1117)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white&labelColor=0d1117)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white&labelColor=0d1117)](https://tailwindcss.com/)

</div>

---

## ✨ Project Overview

Odoo Stackit is a robust, full-stack question and answer platform designed for developers. It features a powerful Go backend for high-performance API services and a dynamic Next.js frontend for a seamless user experience. The platform emphasizes content moderation, user engagement, and a clean, intuitive interface, making it an ideal hub for knowledge sharing within a technical community.

## 🏗️ Architecture

Odoo Stackit employs a **monorepo structure** housing a Go-based API server and a Next.js frontend application. This decoupled architecture ensures scalability, maintainability, and clear separation of concerns, allowing independent development and deployment of both components.

-   **`Core-Server/`**: Handles all backend logic, API endpoints, authentication, and database interactions.
-   **`client/`**: The user-facing web application, responsible for rendering UI, managing state, and consuming API services.

## 🌟 Key Features

1.  **Secure User Authentication**: Robust user registration and login powered by JWT for secure session management.
2.  **Dynamic Q&A System**: Users can ask questions with rich markdown descriptions and tags, and provide answers.
3.  **Content Moderation (Admin Panel)**: Dedicated administrative dashboard for managing users, reviewing pending questions, and monitoring platform activity.
4.  **Interactive User Dashboards**: Personalized dashboards for users to track their questions, answers, and notifications.
5.  **Cloud-based Media Uploads**: Seamless integration with Cloudinary for secure and efficient image/video uploads within question and answer content.

## 🚀 Quick Start

Get Odoo Stackit up and running in minutes!

### Prerequisites

Ensure you have the following installed:

-   [**Go**](https://go.dev/doc/install) (v1.21 or higher)
-   [**Node.js**](https://nodejs.org/en/download/) (v18 or higher) & [**npm**](https://www.npmjs.com/get-npm)
-   [**MongoDB**](https://www.mongodb.com/docs/manual/installation/) (local or cloud instance)
-   [**Cloudinary Account**](https://cloudinary.com/users/register/free) (for media uploads)

### ⚙️ Configuration

1.  **Environment Variables**:
    Create a `.env` file in the `Core-Server/` directory and a `.env.local` file in the `client/` directory.

    **`Core-Server/.env`**:
    ```env
    PORT=8080
    MONGODB_URI="mongodb://localhost:27017/stackit" # Or your MongoDB Atlas URI
    MONGODB_NAME="stackit" # Default is 'stackit'
    JWT_SECRET="your_super_secret_jwt_key" # Generate a strong, random key
    GIN_MODE="debug" # or "release"
    ```

    **`client/.env.local`**:
    ```env
    NEXT_PUBLIC_API_BASE_URL="http://localhost:8080/api/v1"
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
    CLOUDINARY_API_KEY="your_cloudinary_api_key"
    CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
    ```

### 🛠️ Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/gowtham-2oo5/odoo-StackIt.git
    cd odoo-StackIt
    ```

2.  **Start the Backend (Go Server):**
    ```bash
    cd Core-Server
    go mod tidy
    go run main.go
    # The server will run on http://localhost:8080
    ```

3.  **Start the Frontend (Next.js App):**
    Open a new terminal.
    ```bash
    cd client
    npm install
    npm run dev
    # The client will run on http://localhost:3000
    ```

You should now have both the backend API and the frontend application running!

## 🌐 API Endpoints

The Go backend provides a RESTful API. All endpoints are prefixed with `/api/v1`.

### Authentication

-   `POST /api/v1/auth/register`
    -   **Body**: `{ "username": "string", "email": "string", "password": "string" }`
    -   Registers a new user.
-   `POST /api/v1/auth/login`
    -   **Body**: `{ "email": "string", "password": "string" }`
    -   Logs in a user and returns a JWT token.

### Questions

-   `POST /api/v1/questions` (Auth Required)
    -   **Body**: `{ "title": "string", "description": "string", "tags": ["string"] }`
    -   Creates a new question.
-   `GET /api/v1/questions`
    -   **Query Params**: `page`, `limit`, `tag`, `search`
    -   Fetches a list of questions with optional filtering.

### Answers

-   `POST /api/v1/questions/:id/answers` (Auth Required)
    -   **Body**: `{ "content": "string" }`
    -   Posts an answer to a specific question.
-   `POST /api/v1/answers/:id/vote` (Auth Required)
    -   **Body**: `{ "vote": "up" | "down" }`
    -   Records a vote for an answer.
-   `PATCH /api/v1/answers/:id/accept` (Auth Required)
    -   Accepts an answer for a question (typically by the question's author).

## 📞 Contact

For any questions or inquiries, please open an issue on the GitHub repository.

---

![Conclusion](https://readme-typing-svg.demolab.com/?lines=Thanks+for+checking+out+Odoo+Stackit%21%3BStar+this+repo+if+you+found+it+helpful%3BBuilt+with+love+for+the+developer+community&font=JetBrains+Mono&size=22&duration=4000&pause=1000&color=3178C6&center=true&width=600&height=80&background=0d1117)