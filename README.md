# Service Booking App - Module 1: Authentication

## 1. Local Setup Instructions

### Backend Setup
1. Open a terminal in the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
   Server will start on port 5000 and connect to MongoDB.

### Frontend Setup
1. Open a new terminal in the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. Open your browser at the URL shown (usually `http://localhost:5173`).

---

## 2. Postman Testing Instructions

Set your environment variable `URL` to `http://localhost:5000/api/auth`.

### 1. Register User
- **Method**: POST
- **URL**: `{{URL}}/register`
- **Body** (JSON):
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "USER",
    "phone": "1234567890"
  }
  ```
- **Expected**: 201 Created, returns user object + token.

### 2. Register Provider
- **Method**: POST
- **URL**: `{{URL}}/register`
- **Body** (JSON):
  ```json
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123",
    "role": "PROVIDER",
    "phone": "0987654321"
  }
  ```

### 3. Login
- **Method**: POST
- **URL**: `{{URL}}/login`
- **Body** (JSON):
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Expected**: 200 OK, returns user object + token.
- **Action**: Copy the `token` from the response.

### 4. Get Current User (Protected)
- **Method**: GET
- **URL**: `{{URL}}/me`
- **Headers**:
  - Key: `Authorization`
  - Value: `Bearer <YOUR_COPIED_TOKEN>`
- **Expected**: 200 OK, returns your user profile.
- **Test**: Try without token -> 401 Unauthorized.
