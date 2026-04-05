# Assignment Workflow Portal - Frontend

Modern React application for managing assignments and student submissions.

## Features
- Sleek, premium dark mode UI
- Role-based redirection (Teacher Dashboard & Student Dashboard)
- State-driven workflow management (Draft → Published → Completed)
- One-click demo login buttons for quick testing
- Real-time toast notifications for alerts and success actions
- Axios intercepts for automatic JWT handling

## Prerequisites
- Node.js (v18+)
- npm

## Setup & Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure backend API**:
   Ensure the backend is running on `http://localhost:5000`. The Vite proxy is configured to forward `/api` requests automatically.

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Tech Stack
- Vite
- React
- TailwindCSS (v4)
- React Router (v6)
- Lucide React & React Icons
- Axios
- Framer Motion (can be added for animations)
- date-fns
- React Hot Toast

## Project Structure
- `src/context/AuthContext.jsx` - Global authentication and session management
- `src/pages/Login.jsx` - Single login screen with demo handlers
- `src/pages/TeacherDashboard.jsx` - Assignment CRUD and submissions management
- `src/pages/StudentDashboard.jsx` - Published assignments view and submission flow
- `src/components/AssignmentCard.jsx` - Reusable card component for different status and role views
- `src/api/axios.js` - API client configuration with JWT interceptors
