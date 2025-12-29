# Encrypted Embrace - Chronos Sphere

A 100% 3D, personalized, story-driven love universe for **Aadi & Nanniii**.

## 🌟 Features Implemented
- **Dual Crystal Login**: 3D interactive login ritual with "Love Code" protection.
- **Cosmic Atrium**: A starfield hub with orbiting planets representing feature zones.
- **Timeline Planet (Serpent)**: A navigable 3D path of memories.
- **Gallery Planet (Holographic Cloud)**: Floating 3D photo frames with your personal photos.
- **Companions**:
  - **Firefly Cursor**: Glowing cursor that changes color based on mood.
  - **Jack**: Low-poly dog companion that follows you everywhere.
- **Tech Stack**: React, Vite, React Three Fiber, Zustand, Firebase.

## 🚀 How to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open http://localhost:5173

## 🔑 Access Keys (Default)
- **Love Code**: `15062024`
- **Personal Password**: `admin123`

## 🛠 Next Steps (For Developer)
1. **Firebase**: Create a Firebase project and update `.env` with real credentials.
2. **Deploy**: Push to GitHub and enable GitHub Pages via Actions.
3. **Content**: Edit `TimelinePlanet.jsx` and `GalleryPlanet.jsx` to add more specific memories.

## 📂 Project Structure
- `src/components/3D`: All 3D scenes (Login, Atrium, Planets, Jack).
- `src/components/UI`: Overlay UIs (Auth).
- `src/stores`: Zustand state management.
- `public/assets/images`: Your migrated photos.
