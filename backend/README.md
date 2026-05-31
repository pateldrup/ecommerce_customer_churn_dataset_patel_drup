# E-Commerce Customer Analytics API

A comprehensive, industry-ready Node.js backend for E-Commerce Customer Churn Analysis. Built with Express.js, MongoDB (Mongoose), and JWT Authentication following MVC architecture.

## 🚀 Features

- **Full CRUD Operations** — Create, Read, Update, Delete (single & bulk)
- **Advanced MongoDB Queries** — Filtering, Sorting, Pagination, Search
- **Aggregation Pipelines** — Analytics, Statistics, Churn Analysis, Predictions
- **JWT Authentication** — Register, Login, Protected Routes, Token Management
- **Role-Based Access Control** — Admin & User roles
- **Rate Limiting** — Protect APIs from abuse
- **Request Validation** — express-validator based input checks
- **Error Handling** — Global error handler with consistent responses
- **Logging Middleware** — Request logging with timing
- **CORS Enabled** — Cross-origin requests supported
- **15,259 Customer Records** — Real dataset fully integrated

---

## 📁 Folder Structure

```
ecommerce_customer_churn_dataset_patel_drup/
├── src/
│   ├── config/
│   │   └── db.js                    # MongoDB Atlas connection
│   ├── controllers/
│   │   ├── customerController.js    # CRUD + Query Builder
│   │   ├── authController.js        # Auth + JWT token management
│   │   ├── analyticsController.js   # Aggregation pipelines
│   │   ├── statsController.js       # Statistics queries
│   │   └── advancedController.js    # Predictions, Segments, Insights
│   ├── middlewares/
│   │   ├── authMiddleware.js        # JWT verification + role auth
│   │   ├── errorHandler.js          # Global error handler
│   │   ├── logger.js                # Request logging
│   │   ├── rateLimiter.js           # API rate limiting
│   │   └── validation.js            # Input validation rules
│   ├── models/
│   │   ├── Customer.js              # Customer schema (indexed)
│   │   └── User.js                  # User schema (bcrypt hashed)
│   ├── routes/
│   │   ├── customerRoutes.js        # All customer CRUD + filter routes
│   │   ├── authRoutes.js            # Authentication routes
│   │   ├── jwtRoutes.js             # JWT management routes
│   │   ├── analyticsRoutes.js       # Analytics aggregation routes
│   │   ├── statsRoutes.js           # Statistics routes
│   │   ├── searchRoutes.js          # Search routes
│   │   ├── advancedRoutes.js        # Predictions, Segments, Dashboard
│   │   └── middlewareRoutes.js      # Admin, Protected, Demo routes
│   ├── services/                    # Business logic layer
│   ├── utils/
│   │   └── apiFeatures.js           # Dynamic Query Builder
│   └── server.js                    # Express entry point
├── .env                             # Environment variables
├── package.json
├── import-data.js                   # Dataset import script
├── migrate-data.js                  # Data type migration script
└── ecommerce_customer_churn_dataset.json  # Raw dataset (15,259 records)
```

---

## 🛠️ Project Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
# Clone the repository
git clone https://github.com/pateldrup/ecommerce_customer_churn_dataset_patel_drup.git
cd ecommerce_customer_churn_dataset_patel_drup

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your MongoDB URI and JWT secret

# Import dataset to MongoDB
node import-data.js

# Fix data types (convert strings to numbers)
node migrate-data.js

# Start the server
npm start

# Or for development with auto-reload
npm run dev
```

### Environment Variables (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce_db
JWT_SECRET=your_jwt_secret_key
```

---

## 📊 API Endpoints

### Base URL: `http://localhost:5000/api`

---

### 🔐 Authentication Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/logout` | Logout (protected) |
| GET | `/auth/profile` | Get profile (protected) |
| PATCH | `/auth/profile` | Update profile (protected) |
| DELETE | `/auth/profile` | Delete account (protected) |
| POST | `/auth/change-password` | Change password (protected) |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password |
| POST | `/auth/verify-email` | Verify email |
| POST | `/auth/send-otp` | Send OTP |
| POST | `/auth/verify-otp` | Verify OTP |
| POST | `/auth/resend-verification` | Resend verification |
| GET | `/auth/session` | Get active session (protected) |
| DELETE | `/auth/session` | Logout all sessions (protected) |

---

### 🔑 JWT Routes (`/api/jwt`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/jwt/generate-token` | Generate JWT token |
| POST | `/jwt/verify-token` | Verify JWT token |
| POST | `/jwt/refresh-token` | Refresh access token |
| DELETE | `/jwt/revoke-token` | Revoke token (protected) |
| GET | `/jwt/profile` | Protected profile |
| GET | `/jwt/dashboard` | Protected dashboard |
| GET | `/jwt/private-customers` | Protected customer records |
| GET | `/jwt/private-stats` | Protected analytics |
| GET | `/jwt/admin` | Admin only route |
| GET | `/jwt/customer-insights` | Customer insight dashboard |

---

### 👥 Basic CRUD Routes (`/api/customers`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers` | Fetch all customers (paginated) |
| GET | `/customers/:id` | Fetch single customer |
| POST | `/customers` | Create customer |
| PUT | `/customers/:id` | Replace customer |
| PATCH | `/customers/:id` | Update customer fields |
| DELETE | `/customers/:id` | Delete customer |
| GET | `/customers/exists/:id` | Check if customer exists |
| POST | `/customers/bulk-create` | Bulk create customers |
| PATCH | `/customers/bulk-update` | Bulk update customers |
| DELETE | `/customers/bulk-delete` | Bulk delete customers |

---

### 🔍 Customer Information Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers/country/:country` | Filter by country |
| GET | `/customers/city/:city` | Filter by city |
| GET | `/customers/gender/:gender` | Filter by gender |
| GET | `/customers/age/:age` | Filter by age |
| GET | `/customers/signup-quarter/:quarter` | Filter by signup quarter |
| GET | `/customers/churned` | Get churned customers |
| GET | `/customers/active` | Get active customers |
| GET | `/customers/high-value` | High lifetime value customers |
| GET | `/customers/high-purchases` | High purchase customers |
| GET | `/customers/high-credit` | High credit balance |
| GET | `/customers/high-engagement` | Highly engaged customers |
| GET | `/customers/high-mobile-usage` | High mobile app usage |
| GET | `/customers/high-discount-users` | High discount usage |
| GET | `/customers/recent-buyers` | Recently active buyers |
| GET | `/customers/inactive` | Inactive customers |
| GET | `/customers/top-reviewers` | Top reviewers |
| GET | `/customers/high-cart-abandonment` | High cart abandonment |
| GET | `/customers/frequent-logins` | Frequent login activity |
| GET | `/customers/loyal` | Loyal customers |
| GET | `/customers/premium` | Premium customers |

---

### 🎯 Route Parameters

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers/login-frequency/:value` | By login frequency |
| GET | `/customers/session-duration/:value` | By session duration |
| GET | `/customers/purchases/:value` | By total purchases |
| GET | `/customers/lifetime/:value` | By lifetime value |
| GET | `/customers/credit/:value` | By credit balance |
| GET | `/customers/churn-status/:status` | By churn status |
| GET | `/customers/mobile-usage/:value` | By mobile usage |
| GET | `/customers/discount-rate/:value` | By discount usage |
| GET | `/customers/reviews/:value` | By review count |

---

### 🔎 Query Parameters (`GET /api/customers?...`)

| Parameter | Example | Description |
|-----------|---------|-------------|
| `country` | `?country=France` | Filter by country |
| `city` | `?city=Manchester` | Filter by city |
| `gender` | `?gender=Male` | Filter by gender |
| `minAge` | `?minAge=30` | Minimum age |
| `maxAge` | `?maxAge=50` | Maximum age |
| `membershipYears` | `?membershipYears=2` | Min membership years |
| `minPurchases` | `?minPurchases=10` | Min purchases |
| `minLifetime` | `?minLifetime=1000` | Min lifetime value |
| `minCredit` | `?minCredit=2000` | Min credit balance |
| `churned` | `?churned=1` | Churn status (0 or 1) |
| `signupQuarter` | `?signupQuarter=Q4` | Signup quarter |
| `minLoginFrequency` | `?minLoginFrequency=10` | Min login frequency |
| `minMobileUsage` | `?minMobileUsage=20` | Min mobile usage |
| `minDiscountRate` | `?minDiscountRate=40` | Min discount rate |
| `minSessionDuration` | `?minSessionDuration=30` | Min session duration |
| `page` | `?page=1` | Page number |
| `limit` | `?limit=10` | Records per page |
| `sort` | `?sort=lifetimeValue` | Sort field |
| `q` | `?q=france` | Search keyword |

**Combination Example:**
```
GET /api/customers?country=France&minLifetime=1000&sort=lifetimeValue&page=1&limit=10
```

---

### 📊 Filter Routes (`/api/customers/filter/...`)

| Endpoint | Description |
|----------|-------------|
| `/filter/high-purchases` | High purchases (≥20) |
| `/filter/high-lifetime` | High lifetime value (≥2000) |
| `/filter/high-credit` | High credit (≥3000) |
| `/filter/high-login` | High login frequency (≥25) |
| `/filter/high-mobile` | High mobile usage (≥30) |
| `/filter/high-discount` | High discount usage (≥50) |
| `/filter/high-cart-abandonment` | High cart abandonment (≥80%) |
| `/filter/high-engagement` | High engagement |
| `/filter/high-reviews` | High reviews (≥15) |
| `/filter/churned` | Churned customers |
| `/filter/active` | Active customers |
| `/filter/low-session` | Low session duration |
| `/filter/high-session` | High session duration |
| `/filter/high-order-value` | High order value (≥200) |
| `/filter/loyal` | Loyal customers (≥4 years) |

---

### 🔃 Sort Routes (`/api/customers/sort/...`)

| Endpoint | Description |
|----------|-------------|
| `/sort/age-desc` | Oldest first |
| `/sort/purchases-desc` | Highest purchases first |
| `/sort/lifetime-desc` | Highest lifetime value first |
| `/sort/login-desc` | Most active first |
| `/sort/credit-desc` | Highest credit first |

---

### 🔍 Search Routes (`/api/search/customers?q=...`)

Search across Country, City, Gender, and Signup Quarter fields using keyword matching.

---

### 📈 Analytics Routes (`/api/analytics/customers/...`)

| Endpoint | Description |
|----------|-------------|
| `/top-buyers` | Top 10 purchasing customers |
| `/top-lifetime` | Top 10 lifetime value |
| `/top-credit` | Top 10 credit balance |
| `/top-engagement` | Top 10 engaged customers |
| `/top-mobile-users` | Top 10 mobile users |
| `/top-discount-users` | Top 10 discount users |
| `/top-reviewers` | Top 10 reviewers |
| `/churn-analysis` | Churn vs Active analysis |
| `/retention` | Retention by membership years |
| `/session-analysis` | Session duration by country |
| `/purchase-analysis` | Purchase patterns by quarter |
| `/country-analysis` | Country-wise distribution |
| `/city-analysis` | City-wise distribution |
| `/signup-analysis` | Signup quarter distribution |
| `/payment-analysis` | Payment method diversity |

---

### 📊 Statistics Routes (`/api/stats/customers/...`)

| Endpoint | Description |
|----------|-------------|
| `/count` | Total customer count |
| `/average-age` | Average age |
| `/average-lifetime` | Average lifetime value |
| `/average-credit` | Average credit balance |
| `/average-order-value` | Average order value |
| `/highest-purchases` | Customer with most purchases |
| `/highest-lifetime` | Customer with highest lifetime |
| `/highest-credit` | Customer with highest credit |
| `/country-count` | Customers per country |
| `/city-count` | Customers per city |
| `/gender-count` | Customers per gender |
| `/churn-count` | Churned vs Active count |
| `/signup-quarter-count` | Signup quarter distribution |
| `/review-count` | Total & average reviews |
| `/mobile-usage` | Mobile usage statistics |

---

### 🧠 Advanced Routes (`/api/customers/...`)

| Endpoint | Description |
|----------|-------------|
| `/random` | Random customer |
| `/trending` | Trending customers |
| `/recent` | Recently active customers |
| `/recommendations` | Marketing campaign recommendations |
| `/predictions/churn` | Churn prediction (rule-based) |
| `/predictions/retention` | Retention prediction |
| `/segments/premium` | Premium segment |
| `/segments/high-value` | High-value segment |
| `/segments/loyal` | Loyal segment |
| `/segments/risky` | Risky segment |
| `/segments/inactive` | Inactive segment |
| `/heatmap/countries` | Country heatmap data |
| `/heatmap/cities` | City heatmap data |
| `/insights/purchases` | Purchase insights |
| `/insights/mobile-usage` | Mobile usage insights |
| `/insights/discounts` | Discount insights |
| `/insights/engagement` | Engagement insights |
| `/alerts/high-churn` | High churn risk alerts |
| `/alerts/inactive-users` | Inactive user alerts |
| `/alerts/high-cart-abandonment` | Cart abandonment alerts |
| `/system/health` | API health check |
| `/system/version` | API version info |
| `/system/config` | Public configuration |
| `/cache/clear` | Clear cache (protected) |
| `/logs` | System logs (protected) |
| `/activity` | Recent activity (protected) |
| `/live-search?q=...` | Live customer search |
| `/dashboard/summary` | Dashboard summary |
| `/dashboard/revenue` | Revenue analytics |

---

### 🛡️ Admin & Middleware Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/customers` | Admin protected customers |
| GET | `/admin/stats` | Admin statistics |
| GET | `/admin/churn-analysis` | Admin churn analysis |
| POST | `/protected/customers` | Protected create |
| PATCH | `/protected/customers/:id` | Protected update |
| DELETE | `/protected/customers/:id` | Protected delete |
| GET | `/middleware/logger` | Logger demo |
| GET | `/middleware/auth` | Auth demo (protected) |
| GET | `/middleware/rate-limit` | Rate limit demo |
| GET | `/middleware/error-handler` | Error handler demo |
| GET | `/middleware/request-time` | Request timing demo |

---

### HEAD & OPTIONS Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| HEAD | `/customers` | Headers with X-Total-Count |
| HEAD | `/customers/:id` | Headers with X-Exists |
| HEAD | `/customers/country/:country` | Country count headers |
| HEAD | `/stats/customers/count` | Stats headers |
| HEAD | `/customers/system/health` | Health status headers |
| OPTIONS | `/customers` | Supported methods |
| OPTIONS | `/customers/:id` | Supported methods |
| OPTIONS | `/auth/login` | Supported methods |
| OPTIONS | `/admin/customers` | Supported methods |
| OPTIONS | `/search/customers` | Supported methods |

---

## 🏗️ Architecture

- **MVC Pattern** — Models, Controllers, Routes (Views replaced by JSON API)
- **Service Layer** — Business logic separation
- **Middleware Chain** — Auth → Validation → Controller
- **Error Handling** — Centralized global error handler
- **MongoDB Indexing** — Optimized queries on Country, Churned, Lifetime_Value

---

## 🧪 Testing with Postman

Import the API collection into Postman and test all endpoints.

### Sample Requests:

**Register:**
```json
POST /api/auth/register
{
  "name": "Test User",
  "email": "test@test.com",
  "password": "password123"
}
```

**Login:**
```json
POST /api/auth/login
{
  "email": "test@test.com",
  "password": "password123"
}
```

**Protected Route (use Bearer token from login):**
```
GET /api/auth/profile
Headers: Authorization: Bearer <your_token>
```

---

## 👨‍💻 Author

**Drup Patel**

---

## 📝 License

ISC