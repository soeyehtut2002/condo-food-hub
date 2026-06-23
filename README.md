# 🏢 Condo Food Hub

A private marketplace for condominium residents to order food, drinks, and services from local vendors inside the building. Inspired by Foodpanda and GrabFood.

## Features

### Residents
- Register/Login with room number
- Browse vendors and products
- Search and filter by category
- Add items to cart, checkout
- View order history
- Room-number-based delivery

### Vendors
- Create and manage a shop
- Add/edit/delete products with images
- Receive and manage orders (Pending → Preparing → Delivered)
- Dashboard with stats

### Admin
- Platform statistics dashboard
- Manage users (suspend/activate)
- Approve/suspend vendors
- Manage all products

## Tech Stack

- **Frontend:** React 18, React Router, Axios, Lucide Icons, Vite
- **Backend:** Node.js, Express.js, Sequelize ORM
- **Database:** PostgreSQL
- **Auth:** JWT (jsonwebtoken + bcryptjs)
- **Upload:** Multer

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Setup Database
```bash
# Create database in PostgreSQL
psql -U postgres
CREATE DATABASE condo_food_hub;
\q
```

### 2. Backend Setup
```bash
cd backend
npm install

# Edit .env if needed (DB credentials)
# Start the server
npm run dev
```

### 3. Seed Demo Data
```bash
cd backend
npm run seed
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 5. Open the App
Visit `http://localhost:3000`

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@condofoodhub.com | password123 |
| Resident | sarah@resident.com | password123 |
| Resident | mike@resident.com | password123 |
| Vendor | arun@vendor.com | password123 |
| Vendor | noi@vendor.com | password123 |
| Vendor | david@vendor.com | password123 |

## Project Structure

```
condo-food-hub/
├── backend/
│   ├── config/db.js          # PostgreSQL connection
│   ├── middleware/            # Auth, role, upload
│   ├── models/index.js       # Sequelize models
│   ├── routes/               # API routes
│   ├── seed/seed.js          # Demo data
│   └── server.js             # Express entry
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI
│   │   ├── context/          # Auth & Cart
│   │   ├── pages/            # All pages
│   │   └── services/api.js   # Axios API
│   └── vite.config.js
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/vendors | List vendors |
| GET | /api/vendors/:id | Vendor details |
| GET | /api/products | Search products |
| POST | /api/cart | Add to cart |
| POST | /api/orders | Place order |
| GET | /api/admin/stats | Platform stats |

## License
MIT
