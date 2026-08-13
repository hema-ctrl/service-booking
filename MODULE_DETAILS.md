# 🛎️ ServiceBooking — Module Details

---

## ✅ MODULE 1 – Authentication & Role System

### 🎯 Goal
Secure login system with role-based access.

**Roles:** `USER` | `PROVIDER` | `ADMIN`

### 🎨 Frontend

**Pages:**
- Register
- Login
- Role selection
- Protected routes
- Dashboard placeholder

**Features:**
- JWT stored in localStorage
- Role-based redirects
- Logout

### ⚙ Backend

**APIs:**
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

**Logic:**
- bcrypt password hashing
- JWT authentication
- Role middleware

### 🗄 Database

**Users Collection:**
```json
{
  "_id": "",
  "name": "",
  "email": "",
  "password": "",
  "role": "",
  "phone": "",
  "createdAt": ""
}
```

### 📦 Deliverable
✔ Secure authentication system working.

---

    ## 🔹 MODULE 2 – Service Management (Admin Approval System)

    ### 🎯 Goal
    Providers submit services → Admin approves → Users see only approved services.

    ### 🎨 Frontend

    **Provider Dashboard:**
    - Add Service
    - Edit Service
    - Delete Service
    - View My Services
    - Status badge: `Pending` | `Approved` | `Rejected`

    **Admin Dashboard:**
    - View all services
    - Filter by status
    - Approve service
    - Reject service

    **User Side:**
    - Service listing page
    - View only approved services

    ### ⚙ Backend

    **Provider APIs:**
    ```
    POST   /api/services
    GET    /api/services/provider
    PUT    /api/services/:id
    DELETE /api/services/:id
    ```

    **User API:**
    ```
    GET /api/services
    ```
    > Returns only: `approvalStatus = APPROVED` and `isActive = true`

    **Admin APIs:**
    ```
    GET   /api/admin/services
    PATCH /api/admin/services/:id/approve
    PATCH /api/admin/services/:id/reject
    ```

    ### 🗄 Database

    **Services Collection:**
    ```json
    {
    "_id": "",
    "providerId": "",
    "serviceName": "",
    "category": "",
    "description": "",
    "price": 0,
    "duration": "",
    "isActive": true,
    "approvalStatus": "PENDING | APPROVED | REJECTED",
    "rejectionReason": "",
    "createdAt": ""
    }
    ```

    ### 🔐 Security
    - Provider cannot approve service
    - Only admin can approve/reject
    - Users see only approved services

    ### 🧪 Testing
    - ✔ Provider creates service → Pending
    - ✔ Admin approves → visible to users
    - ✔ Rejected services hidden

    ### 📦 Deliverable
    Marketplace-style service system.

    ---

## 🔹 MODULE 3 – Booking Management (Core Feature)

### 🎯 Goal
Users book services → Providers accept/reject.

### 🎨 Frontend

**User:**
- Book service form
- Choose date/time/location
- My bookings page

**Provider:**
- Booking request list
- Accept / Reject

### ⚙ Backend

**APIs:**
```
POST  /api/bookings
GET   /api/bookings/user
GET   /api/bookings/provider
PATCH /api/bookings/status
```

**Logic:**
- Default status = `PENDING`
- Prevent double booking

### 🗄 Database

**Bookings Collection:**
```json
{
  "_id": "",
  "userId": "",
  "providerId": "",
  "serviceId": "",
  "date": "",
  "time": "",
  "location": "",
  "status": "PENDING | CONFIRMED | REJECTED | COMPLETED | CANCELLED",
  "paymentStatus": "",
  "createdAt": ""
}
```

### 🔐 Security
- Only users create bookings
- Only providers update booking status

### 🧪 Testing
- ✔ Booking created successfully
- ✔ Double slot prevention
- ✔ Correct user visibility

### 📦 Deliverable
Complete booking request workflow.

---

## 🔹 MODULE 4 – Booking Lifecycle & Dashboards

### 🎯 Goal
Manage booking lifecycle and admin overview.

### 🎨 Frontend

**User:**
- Booking history
- Cancel booking

**Provider:**
- Mark booking as completed

**Admin:**
- View all users
- View all bookings
- Analytics cards

### ⚙ Backend

**APIs:**
```
PATCH /api/bookings/cancel
GET   /api/admin/bookings
GET   /api/admin/users
```

**Logic:**
- Prevent cancelling completed booking
- Validate transitions

### 🧪 Testing
- ✔ Cancel allowed only when pending
- ✔ Completed bookings locked

### 📦 Deliverable
Full booking lifecycle.

---

## 🔹 MODULE 5 – Payment Integration (Demo)

### 🎯 Goal
Simulate payment after booking confirmation.

### 🎨 Frontend
- Pay Now button
- Payment success page

### ⚙ Backend

**APIs:**
```
POST /api/payments
```
> Updates booking `paymentStatus`.

### 🗄 Database

**Booking collection update:**
```json
{
  "paymentId": "",
  "paymentStatus": "UNPAID | PAID"
}
```

### 🔐 Security
- Verify booking ownership
- Do not trust frontend payment data

### 🧪 Testing
- ✔ Payment linked to booking
- ✔ Cannot pay twice

### 📦 Deliverable
Booking + Payment flow.

---

## 🔹 MODULE 6 – Reviews & Ratings

### 🎯 Goal
Allow feedback after completed service.

### 🎨 Frontend
- Add review form
- Display ratings

### ⚙ Backend

**APIs:**
```
POST /api/reviews
GET  /api/reviews/:serviceId
```

### 🗄 Database

**Reviews Collection:**
```json
{
  "_id": "",
  "userId": "",
  "serviceId": "",
  "rating": 0,
  "comment": "",
  "createdAt": ""
}
```

### 🧪 Testing
- ✔ Only completed booking can review
- ✔ Prevent duplicate review

### 📦 Deliverable
Review & rating system for services.

---

## 📊 Development Flow

```
Module 1 → Authentication              ✅ Completed
Module 2 → Service Management          🔲 Pending
Module 3 → Booking System              🔲 Pending
Module 4 → Booking Lifecycle           🔲 Pending
Module 5 → Payment                     🔲 Pending
Module 6 → Reviews                     🔲 Pending
```
