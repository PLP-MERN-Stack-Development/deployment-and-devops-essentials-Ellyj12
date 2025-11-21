## 🛠 Deployment & Maintenance

### Deployment Pipeline
- **Backend:** Deploys automatically to **Render** whenever code is pushed to the `main` branch.
- **Frontend:** Deploys automatically to **Vercel** on push to `main`.
- **CI:** GitHub Actions runs tests on every push to ensure build stability.

### 🔄 Rollback Procedure
If a bad deployment breaks the production site:
1. **Frontend (Vercel):**
   - Go to Vercel Dashboard > Deployments.
   - Find the last working deployment (green status).
   - Click the three dots (...) and select **"Redeploy"** or **"Promote to Production"**.
2. **Backend (Render):**
   - Go to Render Dashboard > specific service > "Events" or "History".
   - Find the previous successful build.
   - Click **"Rollback to this deploy"**.

### 🏥 Monitoring & Maintenance Plan
- **Uptime:** Monitored via UptimeRobot (pings `/health` every 5 mins).
- **Database Backups:** MongoDB Atlas "Cloud Backups" enabled (Point-in-Time Recovery).
- **Logs:** Production logs are accessible via the Render Dashboard console.
- **Security:** HTTP headers secured via `helmet`; API access restricted via CORS `CLIENT_URL`.
