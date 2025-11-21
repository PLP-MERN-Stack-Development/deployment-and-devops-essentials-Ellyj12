
##  Live Deployment
- **Frontend (Vercel):** [https://deployment-and-devops-essentials-el.vercel.app/items ]
- **Backend API (Render):** [ https://backend-week-7.onrender.com/ ]
## 🛠 Deployment & Maintenance

### Deployment Pipeline
- **Backend:** Deploys automatically to **Render** whenever code is pushed to the `main` branch.
- **Frontend:** Deploys automatically to **Vercel** on push to `main`.
- **CI:** GitHub Actions runs tests on every push to ensure build stability.

### Rollback Procedure
If a bad deployment breaks the production site:
1. **Frontend (Vercel):**
   - Go to Vercel Dashboard > Deployments.
   - Find the last working deployment (green status).
   - Click the three dots (...) and select **"Redeploy"** or **"Promote to Production"**.
2. **Backend (Render):**
   - Go to Render Dashboard > specific service > "Events" or "History".
   - Find the previous successful build.
   - Click **"Rollback to this deploy"**.

### Monitoring & Maintenance Plan
- **Uptime:** Monitored via UptimeRobot (pings `/health` every 5 mins).
- **Database Backups:** MongoDB Atlas "Cloud Backups" enabled (Point-in-Time Recovery).
- **Logs:** Production logs are accessible via the Render Dashboard console.
- **Security:** HTTP headers secured via `helmet`; API access restricted via CORS `CLIENT_URL`.

- ### API End Points
# API Endpoints

| Method | Endpoint               | Description                     |
|--------|-------------------------|---------------------------------|
| GET    | `/health`              | System Status Check             |
| POST   | `/api/auth/register`   | User Registration               |
| POST   | `/api/auth/login`      | User Login                      |
| GET    | `/api/items`           | Fetch Items (Search/Filter)     |
| POST   | `/api/swaps`           | Initiate Swap Request           |

## Documentation
## CI Pipeline
<img width="917" height="395" alt="CI Pipeline" src="https://github.com/user-attachments/assets/f74ebdd0-47d4-45c9-9c39-61d6741765c5" />

## CD Pipeline
<img width="926" height="457" alt="CD Pipeline" src="https://github.com/user-attachments/assets/4c126949-eeca-4128-b4d0-17406415b0dc" />

#  Deployment Guide

This guide details the step-by-step process to deploy the **Swapper** MERN stack application to production using **MongoDB Atlas**, **Render** (Backend), and **Vercel** (Frontend).

---

## Prerequisites
Before starting, ensure you have:
1.  A GitHub repository with the latest code pushed to the `main` branch.
2.  Accounts on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), [Render](https://render.com/), and [Vercel](https://vercel.com/).

---

## Phase 1: Database Setup (MongoDB Atlas)

1.  **Create Cluster:**
    - Log in to MongoDB Atlas and create a new **M0 (Free)** or **M10 (Dedicated)** cluster.

2.  **Network Access:**
    - Go to **Network Access** → **Add IP Address**.
    - Select **"Allow Access from Anywhere"** (`0.0.0.0/0`).
    - *Note: This is required for Render/Vercel dynamic IPs to connect.*

3.  **Database User:**
    - Go to **Database Access** → **Add New Database User**.
    - Create a user with **Read and write to any database** privileges.
    - **Save the password securely.**

4.  **Get Connection String:**
    - Click **Connect** → **Drivers** (Node.js).
    - Copy the connection string (e.g., `mongodb+srv://<user>:<password>@cluster...`).

---

## Phase 2: Backend Deployment (Render)

1.  **Create Web Service:**
    - Log in to your Render Dashboard.
    - Click **New +** → **Web Service**.
    - Connect your GitHub repository.

2.  **Configuration:**
    - **Name:** ``
    - **Region:** Same as MongoDB Atlas.
    - **Branch:** `main`
    - **Root Directory:** `server` (Important!)
    - **Runtime:** `Node`
    - **Build Command:** `npm install`
    - **Start Command:** `npm start`

3.  **Environment Variables:**
    - Scroll down to "Environment Variables" and add the following:

    | Key | Value |
    | :--- | :--- |
    | `NODE_ENV` | `production` |
    | `MONGO_URI` | *(Your Atlas Connection String)* |
    | `JWT_SECRET` | *(A long, random secure string)* |
    | `CLIENT_URL` | `https://your-frontend-project.vercel.app` (Add this *after* deploying frontend) |
    | `CLOUDINARY_CLOUD_NAME` | *(Your Cloudinary Name)* |
    | `CLOUDINARY_API_KEY` | *(Your Cloudinary Key)* |
    | `CLOUDINARY_API_SECRET` | *(Your Cloudinary Secret)* |

4.  **Deploy:** Click **Create Web Service**. Wait for the logs to say "Server is listening".

---

## Phase 3: Frontend Deployment (Vercel)

1.  **Create Project:**
    - Log in to Vercel and click **Add New** → **Project**.
    - Import your GitHub repository.

2.  **Configuration:**
    - **Framework Preset:** Vite (Auto-detected).
    - **Root Directory:** Click "Edit" and select `client`.

3.  **Environment Variables:**
    - Expand the "Environment Variables" section.
    - Add the backend URL (from Phase 2):

    | Key | Value |
    | :--- | :--- |
    | `VITE_API_URL` | `https://swapper-backend.onrender.com` |

    *> **Important:** Do NOT include a trailing slash `/` or `/api` unless your code logic specifically requires it.*

4.  **Deploy:** Click **Deploy**.

---

## Phase 4: Final Connection (CORS)

Once Vercel finishes deploying:

1.  Copy your new **Frontend Domain** (e.g., `https://frontend.vercel.app`).
2.  Go back to **Render Dashboard** → **Environment Variables**.
3.  Update (or Add) the `CLIENT_URL` variable with your Vercel domain.
4.  **Save Changes** to restart the backend server.

---

