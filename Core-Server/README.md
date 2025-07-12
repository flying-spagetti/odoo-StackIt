# 📘 StackIt API – v1

> **Base URL:** `http://localhost:8080/api/v1`

---

## 🔐 Auth Endpoints

### `POST /auth/register`
Register a new user.

**Headers:**
- `Content-Type: application/json`

**Body:**
```json
{
    "username": "gnan",
    "email": "gnan@test.com",
    "password": "secret123"
}
```

---

### `POST /auth/login`
Log in and receive a JWT token.

**Headers:**
- `Content-Type: application/json`

**Body:**
```json
{
    "email": "gnan@test.com",
    "password": "secret123"
}
```

**Response:**
```json
{
    "token": "<JWT_TOKEN>",
    "message": "Login successful"
}
```

---

## ❓ Questions

### `POST /questions/`
Create a new question.  
**Auth required**

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

**Body:**
```json
{
    "title": "What is a goroutine?",
    "description": "<p>Explain goroutines in Go</p>",
    "tags": ["golang", "concurrency"]
}
```

---

### `GET /questions/`
Fetch all questions.

**Optional query params:**
- `page` (e.g., 1)
- `limit` (e.g., 10)
- `tag` (e.g., golang)
- `search` (text query)

**Example:**
```
GET /questions?page=1&limit=5&tag=golang
```

---

## 💬 Answers

### `POST /questions/:id/answers`
Post an answer to a question.  
**Auth required**

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

**Body:**
```json
{
    "content": "<p>You can use goroutines to run code concurrently</p>"
}
```

---

### `POST /answers/:id/vote`
Upvote or downvote an answer.  
**Auth required**

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

**Body:**
```json
{
    "vote": "up"
}
```

---

### `PATCH /answers/:id/accept`
Mark an answer as accepted.  
**Auth required**

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

---

## 🧪 Utility

### `GET /health`
Check if server is running.

### `GET /db-status`
Check if MongoDB is reachable.

---

## 🔐 JWT Usage

For all protected routes, add this header:

```
Authorization: Bearer <JWT_TOKEN>
```