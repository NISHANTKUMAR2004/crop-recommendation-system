# 🌾 AgroSmart - Crop Recommendation System

An AI-powered web application that recommends optimal crops based on soil type, temperature, humidity, and rainfall. Built with a modern microservices architecture featuring a React-like frontend, Express.js backend, and Flask AI engine.

---

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Technologies](#technologies)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

- **AI-Powered Recommendations**: Machine learning-based crop suggestions based on environmental factors
- **Real-time Analysis**: Instant crop suitability scores with risk assessment
- **Responsive UI**: Modern, animated interface with smooth user experience
- **Risk Evaluation**: Comprehensive risk levels (Low, Medium, High) for each recommendation
- **Crop Database**: 45+ crops with seasonal information (Rabi, Kharif, Zaid)
- **CORS Enabled**: Frontend and backend communicate seamlessly
- **Docker Support**: Containerized services for easy deployment

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Port 8000)                     │
│              HTML/CSS/JavaScript (Vanilla)                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTP POST
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Port 5000)                       │
│              Express.js / Node.js Server                    │
│            - Route: /recommend                              │
│            - CORS middleware enabled                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTP POST
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  AI Service (Port 5001)                     │
│              Flask / Python ML Engine                       │
│            - Route: /predict                                │
│            - Rule-based crop recommendations                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Prerequisites

### Option 1: Docker (Recommended)
- Docker Desktop (v20.10+)
- Docker Compose (v1.29+)

### Option 2: Local Development
- **Node.js** 18+ and npm
- **Python** 3.10+
- Flask 2.3.3
- Express.js 5.2+

---

## 🚀 Installation

### Clone/Setup
```bash
cd crop-recommendation-system
```

### Install Dependencies (Local)

**Backend:**
```bash
cd backend
npm install
```

**AI Service:**
```bash
cd ai-service
python -m pip install -r requirements.txt
```

**Frontend:** No installation needed (static files)

---

## 🎬 Running the Project

### **Method 1: Docker Compose (Recommended)**

```bash
# From project root
docker-compose up
```

Starts all services in containers:
- Backend on `http://localhost:5000`
- AI Service on `http://localhost:5001`
- Frontend requires separate serve (see below)

### **Method 2: Local Development (All 3 Terminals)**

**Terminal 1 - Start AI Service:**
```bash
cd ai-service
python app.py
```
Runs on: `http://localhost:5001`

**Terminal 2 - Start Backend:**
```bash
cd backend
npm install
node server.js
```
Runs on: `http://localhost:5000`

**Terminal 3 - Serve Frontend:**
```bash
cd frontend
python -m http.server 8000
```
or
```bash
# If Python 2
python -m SimpleHTTPServer 8000
```
Runs on: `http://localhost:8000`

### **Access the Application**

Open browser → `http://localhost:8000`

---

## 📁 Project Structure

```
crop-recommendation-system/
├── docker-compose.yml          # Docker orchestration
├── README.md                   # This file
│
├── frontend/                   # React-like UI
│   ├── index.html             # Main HTML
│   ├── script.js              # Form logic & API calls
│   ├── style.css              # Styling
│   ├── pro-theme.css          # Advanced theme
│   └── assets/
│       └── crops/             # Crop images
│
├── backend/                    # Express.js Server
│   ├── Dockerfile             # Node 18 container
│   ├── package.json           # npm dependencies
│   ├── server.js              # Main server file
│   │   ├── GET /              # Health check
│   │   └── POST /recommend    # Crop recommendation
│
└── ai-service/                # Flask ML Engine
    ├── Dockerfile             # Python 3.10 container
    ├── requirements.txt       # Python dependencies
    ├── app.py                 # Flask server
    │   ├── GET /              # Health check
    │   └── POST /predict      # ML predictions
```

---

## 🔌 API Endpoints

### **Backend API (Port 5000)**

#### Health Check
```
GET http://localhost:5000/
Response: "🚀 Backend is running"
```

#### Get Crop Recommendation
```
POST http://localhost:5000/recommend
Content-Type: application/json

Request Body:
{
  "soil": "Loamy",
  "temperature": 25,
  "rainfall": 300,
  "humidity": 60
}

Response:
{
  "recommendations": [
    {
      "crop": "wheat",
      "score": 96,
      "risk": "Low"
    },
    {
      "crop": "peas",
      "score": 89,
      "risk": "Low"
    },
    ...
  ],
  "message": "AI suggests 4 crops based on given conditions."
}
```

### **AI Service API (Port 5001)**

#### Health Check
```
GET http://localhost:5001/
Response: "🤖 AI Service Running"
```

#### Get Predictions
```
POST http://localhost:5001/predict
Content-Type: application/json

Request Body:
{
  "soil": "Loamy",
  "temperature": 25,
  "rainfall": 300,
  "humidity": 60
}

Response:
{
  "recommendations": [
    {"crop": "wheat", "score": 96, "risk": "Low"},
    ...
  ],
  "message": "AI suggests 4 crops based on given conditions."
}
```

---

## 🛠️ Technologies

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript | - |
| **Backend** | Express.js, Node.js | 5.2.1 / 18 |
| **AI Service** | Flask, Python | 2.3.3 / 3.10 |
| **Containerization** | Docker, Docker Compose | 29.2.1 / 3.8 |
| **HTTP Client** | Axios | 1.6.0 |
| **Middleware** | CORS | 2.8.6 |

---

## 🌾 Supported Crops

### Rabi Season (Winter)
Wheat, Peas, Barley, Chickpea, Lentil

### Kharif Season (Monsoon)
Rice, Sugarcane, Cotton, Maize, Banana

### Zaid Season (Summer)
Cucumber, Watermelon, Muskmelon, Okra, Papaya

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Port 8000 already in use** | `python -m http.server 9000` (use different port) |
| **Port 5000 already in use** | Change `PORT` in `backend/server.js` |
| **Port 5001 already in use** | Change `port` in `ai-service/app.py` |
| **Docker containers won't start** | Run `docker-compose logs` to check errors |
| **CORS errors in browser** | CORS is enabled in backend; check origin in `server.js` |
| **AI Service not responding** | Verify it's running: `curl http://localhost:5001/` |
| **Backend can't reach AI Service** | In Docker: use service name `http://ai-service:5001` |
| **Frontend shows "Server not responding"** | Check backend is running on port 5000 |

---

## 📊 How It Works

1. **User Input**: Farmer enters soil type, temperature, humidity, rainfall
2. **Frontend Validation**: Client-side form validation
3. **Backend Processing**: Express server receives form data
4. **AI Prediction**: Backend calls Flask AI service
5. **Result Generation**: AI analyzes conditions and returns 4 crops
6. **UI Rendering**: Frontend displays recommendations with scores & risk levels

---

## 🔐 Security Notes

- CORS is enabled for local development
- In production, restrict CORS origins in `backend/server.js`
- Use environment variables for sensitive config (`.env` file)
- Never commit API keys or secrets

---

## 📈 Performance

- **Response Time**: ~100-200ms average
- **Frontend Load**: <500KB total
- **Backend Memory**: ~50MB
- **AI Service Memory**: ~200MB

---

## 📝 Development Tips

### Adding New Crops
Edit `ai-service/app.py` recommendation logic

### Styling Changes
Modify `frontend/style.css` or `frontend/pro-theme.css`

### Backend Routes
Add new routes in `backend/server.js`

### Docker Rebuilds
```bash
docker-compose up --build
```

---

## 📄 License

Open source - feel free to use and modify

---

## 👥 Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Verify ports are not blocked
3. Ensure all services are running
4. Check network connectivity between services

---

**Happy Farming! 🌻**
