# 🌱 Tarım Web v3 — IoT Dashboard for Smart Agriculture

A full-stack web application to monitor sensor data from IoT-enabled agricultural devices. This project is designed to support real-time device monitoring, DevOps best practices, and scalable deployment using modern tools.

---


## 🧰 Tech Stack

### 🖥️ Frontend
- [React](https://reactjs.org/) (via Vite)
- [Bootstrap 5](https://getbootstrap.com/)
- Axios for API communication

### ⚙️ Backend
- [FastAPI](https://fastapi.tiangolo.com/)
- PostgreSQL (hosted on AWS RDS)
- psycopg2-binary for DB connection
- dotenv for secure config

### 🛠️ DevOps & Deployment
- GitHub for version control
- Docker (planned)
- AWS EC2 (planned)
- GitHub Actions for CI/CD (planned)
- Prometheus + Grafana for monitoring (planned)

---

### 📁 Project Structure
tarim-web-v3/
├── backend/                     # FastAPI backend
│   ├── main.py
│   ├── database.py
│   ├── routers/
│   │   └── devices.py
│   ├── .env.example
│   └── requirements.txt
│
├── frontend/                    # React + Bootstrap frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── components/
│   │       ├── DeviceSelector.jsx
│   │       └── SensorTable.jsx
│   ├── public/
│   │   └── vite.svg
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md


---

## 🚀 How to Run the Project

### 🧪 Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
Ensure .env file is configured (see .env.example)

Runs at http://127.0.0.1:8000

Swagger docs available at /docs

### 🖥️ Frontend (React + Vite)
bash
Copy
Edit
cd frontend
npm install
npm run dev
Runs at http://localhost:5173

Axios fetches data from backend

### 🎯 Features
### 🌾 View latest N sensor readings per device

📉 Dynamic device selection with input control

🔄 Real-time data fetch (manual for now, auto-refresh planned)

🌀 Full-screen loading state on first load

🔒 .env support with example file

📦 CI/CD & DevOps (WIP)
This monorepo is being extended to include:

✅ GitHub Actions for automated test + deployment

✅ Docker support for backend and frontend

✅ EC2 deployment on AWS

✅ Monitoring using Prometheus and Grafana

✅ Infrastructure-as-Code (Terraform/Ansible planned)

📌 Future Improvements
 Add device online/offline indicator

 Add charts (moisture, temperature, etc.)

 Add login support for multiple users

 Export data to CSV

 Live alert popups via WebSocket or polling


📝 License
This project is not open-source and not free to use for any purposes.
If you have any questions, please don't hesitate to contact me.
---
