# AI-PMS Intelligent Context-Aware Task Orchestrator

## Project Overview
AI-PMS is a premium AI-driven prototype that transforms unstructured meeting transcripts into structured, actionable tasks. It features an autonomous "Conflict Intelligence" engine that detects contradicting statements about deadlines or assignments.

## Features
- **Premium AI Dashboard**: Glassmorphic UI with noise-textured backgrounds and smooth Framer Motion animations.
- **Context-Aware Extraction**: Identifies tasks, assignees, deadlines, and priorities using LLMs.
- **Conflict Detection**: Flags inconsistencies (e.g., two people mentioning different dates for the same task).
- **Ultrafast Inference**: Powered by **Groq** (using Llama-3.3-70b-versatile).

## System Architecture
The system follows a decoupled client-server architecture:
- **Frontend (Vite + React)**: A high-end UI built with Tailwind CSS v4 and @tailwindcss/vite.
- **Backend (FastAPI)**: A Python-based REST API that orchestrates LLM calls and validates structured data.
- **Intelligence Layer (Groq)**: Performs semantic processing and entity extraction.

## How to Run

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- A Groq API Key

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```powershell
   cd ai-pms/backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
4. Configure your API key in `.env`:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```
5. Start the server:
   ```powershell
   python main.py
   ```

### 3. Frontend Setup
1. Navigate to the `ai-pms-frontend` directory:
   ```powershell
   cd ai-pms/ai-pms-frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the development server:
   ```powershell
   npm run dev
   ```

## Tech Stack
- **UI**: React 19, Tailwind CSS 4, Framer Motion, Lucide React, NoiseBackground
- **Server**: FastAPI, Pydantic, Uvicorn
- **AI**: Groq SDK (Llama 3.3 70B)

## Example Transcript
> "John: The dashboard should be ready by Friday.
> Sarah: Actually it might take until Monday.
> Mike: John will handle the UI and Sarah will build the API."

The system will extract:
- **Task**: Handle UI (Assignee: John, Priority: ~8)
- **Task**: Build API (Assignee: Sarah, Priority: ~8)
- **Conflict**: "Dashboard Deadline" - John says Friday, Sarah says Monday.
