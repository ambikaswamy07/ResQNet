# ResQNet – Smart Emergency Response & Disaster Coordination Platform

ResQNet is an enterprise-grade emergency response platform designed to facilitate coordination between victims, emergency dispatchers, and field rescuers.

## Project Structure

- `/client` - Frontend Single Page Application (React 19, Vite, TypeScript, Tailwind CSS, Leaflet)
- `/server` - Backend REST and WebSocket API (Node.js, Express, TypeScript, Socket.IO, Mongoose)

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- MongoDB Atlas account (or local MongoDB server)

### Setup Instructions

1. **Clone the repository**
2. **Install Dependencies**
   - Client: `cd client && npm install`
   - Server: `cd server && npm install`
3. **Configure Environment Variables**
   - Set up `.env` files in both `/client` and `/server` directories matching their respective `.env.example` templates.
4. **Run Development Services**
   - Server: `cd server && npm run dev` (starts on Port 5000)
   - Client: `cd client && npm run dev` (starts on Port 5173)

## Features

- **One-Tap SOS Alerting**: Quick location-tagged emergency reporting with network failover caching.
- **Interactive Command Grid**: Dynamic map tracking active incidents, rescuers, and safety perimeters.
- **Automated AI Triage**: Categorizes victim messages and auto-grades severity level using the Gemini API.
- **Rescuer Routing**: Safe turn-by-turn routing around active disaster perimeters.
- **Resource Management**: Direct dispatching tracking shelter capacities and emergency inventories.
