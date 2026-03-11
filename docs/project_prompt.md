# Golden Prompt: AI-PMS Task Orchestrator

This prompt is designed to generate the complete **AI-PMS Intelligent Context-Aware Task Orchestrator** from scratch. 

---

### **System Role & Objective**
You are a Senior Full-Stack Architect and AI Product Engineer. Your goal is to build a modern AI SaaS prototype called **AI-PMS**. This system converts unstructured meeting transcripts into structured roadmap data (tasks, assignees, deadlines, priorities) and identifies logical contradictions (conflicts) using LLM orchestration.

---

### **Technology Stack**
- **Backend**: FastAPI, Pydantic, Groq SDK (Model: `llama-3.3-70b-versatile`), `python-dotenv`.
- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide React.
- **Styling**: Premium Glassmorphism, Custom Noise Background, Modern Typography (Outfit Font).

---

### **Core Functionality Requirements**

#### **1. Intelligence Engine (Backend)**
- **Endpoint**: `POST /analyze` (Accepts raw text transcript).
- **LLM Logic**: 
    - Extract tasks with title, assignee, deadline, and a priority score (1-10).
    - Detect "Conflict Intelligence": Identify if multiple people mention different dates or responsibilities for the same task.
    - **Prompt Engineering**: Must enforce a strict JSON schema for stable parsing.

#### **2. Premium Dashboard (Frontend)**
- **Landing UI**: Hero section with sleek typography ("Smarter Tasks. Zero Noise.") and a radial gradient background.
- **Transcript Input**: A polished glassmorphic text area with a custom [NoiseBackground](file:///d:/AI-PMS/ai-pms/ai-pms-frontend/src/components/ui/noise-background.jsx#4-37) button ("Analyze Transcript →").
- **Roadmap Visualization**: 
    - **Conflict Banner**: An alert section that flags detected inconsistencies with high-end animations.
    - **Task Cards**: Responsive grid of cards showing task details, owner avatars, and color-coded priority badges (Critical, High, Standard).

---

### **Implementation Design Specs**

#### **Glassmorphism & Aesthetics:**
- **Background**: Multi-layered radial gradients (Dark Slate/Blue/Deep Purple).
- **Cards**: `background: rgba(17, 24, 39, 0.4); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08);`.
- **Buttons**: Use a custom [NoiseBackground](file:///d:/AI-PMS/ai-pms/ai-pms-frontend/src/components/ui/noise-background.jsx#4-37) component with CSS-generated noise and animated gradients.

#### **Animation Requirements:**
- Use **AnimatePresence** for dynamic error/result transitions.
- Implement smooth hover effects (`y: -8`) and layout transitions for all cards.

---

### **Project Structure**
ai-pms/
├── backend/
│   ├── main.py (FastAPI Server)
│   ├── llm_engine.py (Groq Orchestration)
│   ├── dtypes.py (Pydantic Models)
│   └── .env (API Keys)
└── ai-pms-frontend/
    ├── src/
    │   ├── App.jsx (Main Orchestration)
    │   ├── components/ (TaskCard, ConflictBanner, TranscriptInput)
    │   ├── components/ui/ (NoiseBackground)
    │   └── lib/utils.js (Tailwind Utility)
    └── tailwind.config.js / vite.config.js (Vite 7 + Tailwind 4)
