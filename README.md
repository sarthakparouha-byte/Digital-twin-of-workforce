# TwinForge AI — Digital Workforce Twin

> **Simulate before you implement.** TwinForge is an AI-powered Digital Workforce Twin that lets enterprise leaders predict the real impact of digital workplace changes on employee productivity, experience, and ROI — before a single rupee is spent on rollout.

---

## 🏆 Built For

**Srijan Atos Hackathon 2026**
Problem Statement: *Digital Twin of the Workforce*

---

## 🚀 Live Demo

🔗 [TwinForge AI – Live App](https://twinforge.vercel.app) *(replace with your deployed URL)*
📹 [Demo Video](https://youtube.com/your-link) *(replace with your video link)*

---

## 📌 The Problem

Enterprises invest heavily in digital workplace tools based on assumptions, vendor benchmarks, or gut instinct — with no reliable way to predict their real impact on employees before rollout. This leads to:

- Poor ROI on technology investments
- Low adoption rates
- Resistance to change
- Degraded employee experience

---

## 💡 The Solution — TwinForge

TwinForge creates a **living simulation** of your workforce's digital environment. Adjust parameters, run what-if scenarios, and get AI-driven recommendations — all before making a single change in production.

---

## ✨ Key Features

### 🎛️ Simulation Control Panel
Adjust 8 real-world digital workplace dimensions via interactive sliders:
- Hardware Performance
- Network Reliability
- Software Integration
- IT Support MTTR (Mean Time To Repair)
- Shadow IT Risk
- Digital Dexterity
- Collaboration Effectiveness
- Automation Coverage

Each dimension gets a live risk label: **STABLE / AT RISK / CRITICAL**

### 📊 Live KPI Dashboard
Real-time computation of:
- **Employee EX Score** — weighted experience index
- **Projected ROI %** — baseline-anchored ROI model
- **Productivity Index** — across all departments
- **Adoption Rate** — technology acceptance score

### 🕸️ Workforce Impact Radar
Hexagonal radar chart showing 6 workforce dimensions (Productivity, Collaboration, Experience, Security, Adoption, Efficiency) broken down by **Engineering, Sales, and Operations** teams with persona-specific weighting.

### 🤖 AI Copilot (Powered by Claude + Gemini)
Real generative AI analysis of your current simulation state — running on the backend via both Anthropic Claude and Google Gemini APIs. The copilot:
- Identifies critical friction points across all 8 dimensions
- Recommends which metric to prioritize for maximum ROI impact
- Suggests relevant enterprise tools from the marketplace

### 🛒 Technology Investment Catalog
Browse and model the impact of real enterprise tools before purchasing:
- Filter by category: AI Productivity, Hardware, Network & Security, IT Support, Collaboration, and more
- See projected EX Score Delta and ROI Delta before adding to simulation
- Live Investment Summary with total Annual Cost/User

### 📈 6-Month ROI Projection
Animated line chart showing projected ROI trajectory over 6 months based on current simulation parameters.

### 📁 Scenario History & Comparison
- Save named simulation snapshots — **persisted in MongoDB**
- Side-by-side comparison of any two scenarios across all 8 dimensions
- Restore any previous state instantly

### 🔐 Role-Based Access
- **Admin** — full simulation access
- **Viewer** — read-only dashboard

---

## 🧠 Simulation Engine

TwinForge uses a **domain-validated weighted scoring model** — not a black box.

### Core Category Formulas

| Category | Formula |
|---|---|
| Productivity | Hardware×25% + Network×20% + Software×20% + Automation×20% + Dexterity×15% |
| Collaboration | Collaboration×40% + Network×30% + Software×30% |
| Experience | Hardware×20% + MTTR×25% + Dexterity×20% + Collaboration×20% + (100-ShadowIT)×15% |
| Security | (100-ShadowIT)×50% + Software×30% + Dexterity×20% |
| Adoption | Dexterity×35% + MTTR×30% + Collaboration×35% |
| Efficiency | Automation×40% + MTTR×30% + Software×30% |

### Top-Level KPIs

```
EX Score = (Productivity + Experience + Adoption) / 3
ROI %    = 38 + (EX Score - 52) × 1.8
```

### Persona Multipliers

Different departments weight dimensions differently:

| Dimension | Engineering | Sales | Operations |
|---|---|---|---|
| Hardware | 1.4x | 0.9x | 1.0x |
| Automation | 1.5x | 0.8x | 1.3x |
| Collaboration | 0.9x | 1.5x | 1.1x |
| MTTR | 0.8x | 1.4x | 1.2x |

> The weighted engine is architected to be swappable with an ML model trained on real telemetry (Microsoft 365 logs, ServiceNow tickets, device health APIs) without any frontend changes.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│              React + Vite Frontend               │
│         (Dashboard, Copilot, Marketplace)        │
│                  Port 5173                       │
└──────────────────────┬──────────────────────────┘
                       │ REST API (fetch)
                       │ /api/scenarios
                       │ /api/settings
┌──────────────────────▼──────────────────────────┐
│           Node.js + Express Backend              │
│                  Port 5000                       │
│                                                  │
│  ┌─────────────┐      ┌──────────────────────┐  │
│  │  Mongoose   │      │     AI Layer         │  │
│  │  Models     │      │  Anthropic Claude    │  │
│  │  Scenario   │      │  Google Gemini       │  │
│  │  Settings   │      └──────────────────────┘  │
│  └──────┬──────┘                                 │
└─────────┼───────────────────────────────────────┘
          │
┌─────────▼──────────┐
│      MongoDB        │
│  (Scenarios +       │
│   Settings)         │
└────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express 5 |
| Database | MongoDB + Mongoose |
| AI — Primary | Anthropic Claude API (`@anthropic-ai/sdk`) |
| AI — Secondary | Google Gemini API (`@google/generative-ai`) |
| Charts | Recharts |
| Logging | Morgan |
| Styling | Tailwind CSS |

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI
- Anthropic API key → [platform.anthropic.com](https://platform.anthropic.com)
- Google Gemini API key → [aistudio.google.com](https://aistudio.google.com)

### 1. Clone the Repository

```bash
git clone https://github.com/sarthakparouha-byte/Digital-tw.git
cd Digital-tw
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
MONGODB_URI=your_mongodb_connection_string
ANTHROPIC_API_KEY=your_anthropic_api_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

Start the backend:

```bash
npm start
# or for development with auto-reload:
npm run dev
```

Backend runs on → `http://localhost:5000`

### 3. Setup the Frontend

Open a new terminal in the project root:

```bash
npm install
npm run dev
```

Frontend runs on → `http://localhost:5173`

### 4. Login

Use the **"Try Demo"** button on the login page — no credentials needed.

---

## 📁 Project Structure

```
TwinForge/
├── src/                        # React frontend
│   ├── components/
│   │   ├── Dashboard.jsx       # Main simulation dashboard
│   │   ├── AICopilot.jsx       # AI-powered analysis page
│   │   ├── Marketplace.jsx     # Technology investment catalog
│   │   ├── History.jsx         # Scenario history + comparison
│   │   └── Login.jsx           # Auth + onboarding
│   ├── engine.js               # Core weighted simulation math
│   ├── App.jsx                 # Routing + global state
│   └── index.css               # Global styles
│
├── server/                     # Node.js + Express backend
│   ├── models/
│   │   ├── Scenario.js         # MongoDB schema for saved scenarios
│   │   └── Settings.js         # MongoDB schema for org settings
│   ├── index.js                # Express server + all API routes
│   ├── .env                    # Environment variables (never commit)
│   └── package.json
│
├── index.html
├── vite.config.js
└── package.json
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/scenarios` | Fetch all saved scenarios |
| POST | `/api/scenarios` | Save a new scenario to MongoDB |
| DELETE | `/api/scenarios/:id` | Delete a scenario |
| GET | `/api/settings` | Fetch organization settings |
| POST | `/api/settings` | Save organization settings |

---

## 🗺️ Roadmap

- [ ] Microsoft Graph API connector for real M365 telemetry
- [ ] ServiceNow ITSM live data ingestion
- [ ] Slack workspace analytics integration
- [ ] ML model replacing rule-based engine (XGBoost on real telemetry)
- [ ] PDF export of simulation reports
- [ ] Collaboration network graph visualization
- [ ] Multi-tenant enterprise accounts

---

## 🔒 Security Notes

- `.env` is listed in `.gitignore` — API keys are never committed
- CORS configured on backend to accept only frontend origin
- MongoDB credentials stored server-side only, never exposed to frontend

---

## 👤 Author

**Sarthak Parouha**
School of Computer Engineering & Technology
MIT World Peace University, Pune

---

## 📄 License

This project was built for the Srijan ATOS Hackathon 2026. All rights reserved.
