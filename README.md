# CraveCraft - Frontend (fullstack-frontend)

Modern, high-performance, responsive food delivery and ordering web application built with **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS**.

Inspired by industry-standard UX patterns from platforms like **Swiggy** and **Zomato**, designed to seamlessly integrate with `fullstack-backend`.

---

## ✨ Features

- **Gourmet Food Catalogue**: Dynamic food browsing with Indian Rupee (`₹`) pricing, 5% GST calculations, ratings, and preparation time indicators.
- **FSSAI Dietary Indicator**: Authentic green square dot (🟢) Pure Veg & red triangle (🔴) Non-Veg badges with instant 1-click filter toggle.
- **Live Order Tracking**: Interactive step-by-step progress stepper (`PENDING` → `PREPARING` → `READY` → `OUT_FOR_DELIVERY` → `DELIVERED`).
- **Live Route Map Animation**: Dynamic SVG route map with animated delivery scooter partner (`🛵 Ramesh Kumar`, 4.9 ★) and live ETA countdown.
- **4-Digit Delivery Handshake OTP**: Cryptographic completion verification OTP (`OTP: 4921`) generated per order.
- **Interactive Kitchen Hub**: Staff operations view for managing incoming order tickets and updating dish statuses in real-time.
- **1-Click Auto-Pilot Live Demo**: Autonomous simulation that places orders, cooks, dispatches, and verifies delivery with zero manual setup.
- **Smart Offline Fallback Mode**: If the backend REST server is offline or restarting, the frontend smoothly switches to offline demo mode with mock data and visual status badges.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Language**: [TypeScript 5+](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Project Structure

```text
fullstack-frontend/
├── src/
│   ├── components/
│   │   ├── CartDrawer.tsx       # Shopping cart slide-over with GST & address form
│   │   ├── FoodCard.tsx         # Food dish card with veg badges and steppers
│   │   ├── KitchenHub.tsx       # Live kitchen queue and order status dispatcher
│   │   ├── Navbar.tsx           # Navigation header with live API connection pill
│   │   └── OrderTracker.tsx     # Order stepper, delivery partner card & SVG map
│   ├── services/
│   │   └── api.ts               # REST API client with intelligent mock fallback
│   ├── types/
│   │   └── index.ts             # Comprehensive TypeScript data models
│   ├── App.tsx                  # Root application view
│   ├── index.css                # Tailwind CSS v4 design system
│   └── main.tsx                 # React DOM mount point
├── .env.example                 # Configurable environment variable reference
├── .gitignore                   # Excludes node_modules, dist, and local .env files
├── index.html                   # HTML entry point with metadata
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript project configuration
└── vite.config.ts               # Vite configuration with Tailwind CSS plugin
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20 or v22 LTS ([NodeJS.org](https://nodejs.org/))
- **npm**: v10+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/prudvirajanika-gif/fullstack-frontend.git
   cd fullstack-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Set `VITE_API_BASE_URL` to your backend server URL (default: `http://localhost:5000/api`).

4. Start Development Server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. Production Build:
   ```bash
   npm run build
   npm run preview
   ```
