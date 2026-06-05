# 📊 Churnlytics — E-Commerce Customer Analytics Dashboard

A modern, high-performance, and visually stunning frontend dashboard built for **E-Commerce Customer Churn Analysis & Segmentation**. 

This application integrates with the Express/MongoDB backend to analyze over **15,000+ customer records**, display demographic trends, simulate rule-based churn predictions, and segment users into marketing cohorts (Premium, Loyal, Risky, Inactive).

---

## 🛠️ Tech Stack & Design System

The application leverages a premium developer-focused tech stack optimized for performance, scalability, and aesthetics:

*   **Framework:** [React v19](https://react.dev/) + [Vite v8](https://vite.dev/) (Lightning-fast HMR and building)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (High-performance CSS compilation and modern variables)
*   **Routing:** [React Router Dom v6](https://reactrouter.com/) (Single-page app navigation with protected routes)
*   **Data Visualization:** [Recharts](https://recharts.org/) (Interactive, responsiveSVG charts)
*   **Icons:** [Lucide React](https://lucide.dev/) (Clean vector icon set)
*   **API Client:** [Axios](https://axios-http.com/) (Structured HTTP client with automatic Bearer JWT injection)

---

## 📁 Folder Structure

The directory is structured using enterprise-grade modular React practices:

```text
frontend/
├── public/                  # Static assets
├── src/
│   ├── assets/              # SVG logos and images
│   ├── components/
│   │   ├── layout/          # Core layout elements
│   │   │   ├── Sidebar.jsx  # Primary side navigation bar
│   │   │   └── Navbar.jsx   # Top utility header & server health check
│   │   └── ui/              # Reusable styling primitives
│   │       ├── Button.jsx   # Variant-based button (indigo, emerald, outline...)
│   │       └── Card.jsx     # Sleek glassmorphism container card
│   ├── pages/               # Routed page views
│   │   ├── Dashboard.jsx    # Metrics cards & analytical graphs
│   │   ├── Customers.jsx    # Searchable, filterable customer database list
│   │   ├── Predictions.jsx  # Interactive churn scoring simulator
│   │   ├── Segments.jsx     # Customer marketing cohorts overview
│   │   ├── Settings.jsx     # API connections & diagnostic utilities
│   │   └── Login.jsx        # Credentials authentication screen
│   ├── services/            # API integration layer
│   │   ├── api.js           # Base Axios client & JWT headers interceptor
│   │   ├── authService.js   # Session storage & auth token logic
│   │   ├── customerService.js # Customer list, segments, and predictions API map
│   │   └── analyticsService.js # Aggregation pipelines and health check API map
│   ├── index.css            # Tailwind directives and global body styles
│   ├── main.jsx             # React DOM injection point
│   └── App.jsx              # Router layout and protected routes middleware
├── eslint.config.js         # ESLint configuration
├── vite.config.js           # Vite settings (Tailwind compiler plugin setup)
├── package.json             # NPM project metadata
└── README.md                # This manual
```

---

## 🚀 Getting Started

### 📋 Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   NPM (comes with Node)

### 💻 Installation & Startup

1.  **Navigate to the frontend folder:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The server will typically start on `http://localhost:5173`. Open this URL in your web browser.

4.  **Build for Production (Optional):**
    ```bash
    npm run build
    ```

---

## 🔌 Integrating with the Backend API

By default, the frontend is configured to connect to the backend server at `http://localhost:5000/api`.

### 1. Start the Backend API
Make sure you follow the backend setup instructions (import database, configure `.env` variables, and start the node server):
```bash
cd backend
npm run dev
```

### 2. Configure API Endpoint (If Port Changes)
If your backend is running on a port other than `5000`:
*   Navigate to **Settings & Diagnostics** page in the console dashboard.
*   Update the **Backend API URL Path** input field (e.g., `http://localhost:8080/api`) and click **Save Connection Configuration**.
*   Alternatively, create a `.env` file in the `frontend/` root folder and declare:
    ```env
    VITE_API_URL=http://localhost:YOUR_PORT/api
    ```

---

## 🔐 Authentication & Demo Mode

The console utilizes token-based authorization. 
*   **Protected Console:** If no token is found in browser session storage, the router will automatically redirect you to the `/login` portal.
*   **Default Credentials:** 
    *   **Email:** `admin@ecommerce.com`
    *   **Password:** `password123`
*   **Smart Demo Mode (Offline Fallback):** If your backend server is offline or not configured, the frontend login will **automatically bypass** authentication and activate **Local Admin Demo Mode**. It will load highly detailed mock data matching the real dataset metrics, allowing you to demo the UI, charts, database filters, and churn simulator immediately.

---

## 💡 Key Features Checked

1.  **Interactive KPIs:** Tracks total customer count, average customer lifetime value, average credit holdings, and overall churn percentage.
2.  **Visual Demographics:** Renders active vs. churned client divisions by country (France, Germany, Spain) and provides visual indicators of payment choices.
3.  **Customer Directory:** Full searching, multi-criteria filtering (by country, gender, status), and pagination options.
4.  **AI Churn Simulator:** Enables you to adjust age, credit scores, purchases, and cart abandonment percentages to test churn probability scores.
5.  **Cohort Exports:** Reviews user counts and downloads profiles for marketing segments like loyal or high-risk.
6.  **Server Diagnostics:** Real-time visual network check indicator inside the header navbar to monitor database connectivity.
