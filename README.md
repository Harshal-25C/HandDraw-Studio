![HandDraw Studio](https://readme-typing-svg.demolab.com?font=EB+Garamond&size=48&duration=3000&pause=1000&color=F5D061&center=true&vCenter=true&width=800&height=90&lines=✦+HandDraw+Studio+✦;Draw+in+the+Air+with+Your+Hand;No+Touch.+No+Stylus.+Just+You.)
 
![Status](https://img.shields.io/badge/Status-Live%20✦-gold?style=for-the-badge&labelColor=0a0602&color=F5D061)
![MediaPipe](https://img.shields.io/badge/Made%20with-MediaPipe-blue?style=for-the-badge&labelColor=0a0602&color=5BA8D8)
![Vanilla JS](https://img.shields.io/badge/Vanilla-HTML%20%2F%20CSS%20%2F%20JS-orange?style=for-the-badge&labelColor=0a0602&color=FF9F45)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge&labelColor=0a0602&color=6BBF84)
 
[![Live Demo](https://img.shields.io/badge/✦%20LIVE%20DEMO%20✦-Visit%20HandDraw%20Studio-F5D061?style=for-the-badge&labelColor=1a1208&color=F5D061)](https://harshal-25c.github.io/HandDraw-Studio/)
 
> *"Awaken the canvas — paint the air with your fingertips."*
>
> **HandDraw Studio** is a cinematic, browser-based air-drawing experience that turns your webcam into a magic canvas. Using **Google MediaPipe Hand Tracking**, it detects your hand in real time and lets you draw glowing strokes in the air by simply **pinching your thumb and index finger together** — no hardware, no plugins, just your browser and your hand.
 
---
 
## ✦ Live Demo
 
🌐 **[https://harshal-25c.github.io/HandDraw-Studio/](https://harshal-25c.github.io/HandDraw-Studio/)**
 
*Open in Chrome or Edge for best performance. Allow camera access when prompted.*
 
---
 
## ✦ Features
 
![Features](https://readme-typing-svg.demolab.com?font=EB+Garamond&size=20&duration=2500&pause=800&color=F5D061&center=true&vCenter=true&width=600&lines=Real-Time+Hand+Tracking;Pinch+to+Draw;7+Neon+Colors;Undo+%2F+Erase+%2F+Clear;Save+Your+Artwork;Cinematic+Dark+Aesthetic)
 
| Feature | Details |
|---|---|
| 🖐 **Hand Tracking** | Powered by **Google MediaPipe Hands** — detects 21 landmarks in real time |
| ✌️ **Pinch-to-Draw** | Pinch thumb + index finger → draw; release → pause. Zero latency |
| 🎨 **7 Brush Colors** | Gold · White · Crimson · Sage · Sky · Rose · Amber — all glow with neon light |
| 📏 **Adjustable Brush Size** | Slider from 2 px to 24 px for fine lines or bold strokes |
| 🧹 **Smart Eraser** | Pinch-erases entire stroke segments — no black blobs, pure canvas redraw |
| ↩️ **Undo** | Removes last stroke. Keyboard shortcut: `Ctrl+Z` |
| 🗑️ **Clear Canvas** | Wipes all strokes cleanly. Keyboard shortcut: `Space` |
| 💾 **Save Image** | Exports canvas as a `.png` download with all strokes intact |
| 🩶 **Cinematic Overlay** | Dark sepia-toned camera feed with hand-skeleton constellation overlay |
| ⚡ **Smooth Strokes** | Exponential smoothing (α = 0.7) eliminates jitter for fluid lines |
| 🏎️ **Optimised Pipeline** | Lite MediaPipe model @ 640×360, real-time FPS, no back-end |
| ⌨️ **Keyboard Shortcuts** | `E` → Eraser · `Ctrl+Z` → Undo · `S` → Save · `Space` → Clear |
 
---
 
## ✦ How to Use
 
```
1. 🌐  Open the live link in Chrome / Edge
2. 📸  Allow camera access when prompted
3. ⏳  Wait for the cinematic splash screen to load
4. 🖐  Raise your hand to the camera — you'll see the skeleton overlay
5. ✌️  Pinch thumb + index finger together to start drawing
6. 🎨  Use the toolbar at the bottom to switch colors / sizes
7. 💾  Press S or the save button to export your artwork
```
 
---
 
## ✦ Pinch Gesture Guide
 
```
  ┌─────────────────────────────────────────────────┐
  │                                                 │
  │   Index Tip (8) ──────────────── ◉ ─────────   │
  │                                  │              │
  │                                  │  PINCH!      │
  │                                  │              │
  │   Thumb Tip  (4) ─────────────── ◉ ─────────    │
  │                                                 │
  │   Distance < threshold  →  ✏️  DRAWING          │
  │   Distance ≥ threshold  →  ✋  HOVERING         │
  │                                                 │
  └─────────────────────────────────────────────────┘
```
 
---
 
## ✦ Project Structure
 
```
HandDraw-Studio/
│
├── index.html          # App shell — loading screen, canvas, toolbar container
│
├── css/
│   └── style.css       # Cinematic dark theme, toolbar, animations
│
├── js/
│   ├── app.js          # Entry point — boots engine, tracker, UI
│   ├── engine.js       # Drawing engine — canvas rendering, stroke mgmt, pinch detection
│   ├── tracker.js      # MediaPipe Hands init + camera pipeline
│   ├── ui.js           # Toolbar, color swatches, toasts, save, keyboard shortcuts
│   └── events.js       # Global event bus
│
└── LICENSE
```
 
---
 
## ✦ Tech Stack
 
| Technology | Role |
|---|---|
| **HTML5 Canvas** | All drawing is rendered here every frame |
| **Google MediaPipe Hands** | Real-time 21-landmark hand detection via webcam |
| **MediaPipe Camera Utils** | Wraps `getUserMedia`, feeds frames to model |
| **MediaPipe Drawing Utils** | Renders the hand skeleton constellation |
| **Vanilla JavaScript (ES6)** | Zero frameworks — pure modular JS |
| **CSS3 Animations** | Loading screen, toolbar hover effects, glow |
| **GitHub Pages** | Hosting |
 
---
 
## ✦ Architecture
 
```
Camera Feed (webcam)
      │
      ▼
  HandTracker.init()
      │  feeds frames to MediaPipe Hands
      ▼
  MediaPipe Hands Model (Lite, 640×360)
      │  returns 21 landmarks per frame
      ▼
  DiaryEngine.render(results)
      │
      ├── drawImage()         ← camera frame
      ├── dark cinematic overlay
      ├── _drawStrokes()      ← all saved strokes with glow
      ├── _drawHandSkeleton() ← constellation overlay
      └── _processCursor()
              │
              ├── Exponential smoothing (α=0.7)
              ├── Pinch detection (Euclidean distance)
              ├── Draw stroke / Erase stroke
              └── Update status badge + cursor ring
```
 
---
 
## ✦ Keyboard Shortcuts
 
| Key | Action |
|---|---|
| `E` | Toggle Eraser mode |
| `Ctrl + Z` | Undo last stroke |
| `S` | Save canvas as PNG |
| `Space` | Clear all strokes |
 
---
 
## ✦ Getting Started Locally
 
```bash
# Clone the repository
git clone https://github.com/harshal-25c/HandDraw-Studio.git
 
# Navigate into the directory
cd HandDraw-Studio
 
# Open with a local server (required for camera access)
npx serve .
# or
python -m http.server 8000
```
 
Then open `http://localhost:8000` in Chrome or Edge.
 
> ⚠️ Camera access requires either `localhost` or an `https://` origin. Direct `file://` opening will not work.
 
---
 
## ✦ Browser Compatibility
 
| Browser | Status |
|---|---|
| Google Chrome | ✅ Fully supported (recommended) |
| Microsoft Edge | ✅ Fully supported |
| Firefox | ⚠️ Works but slightly slower MediaPipe inference |
| Safari | ⚠️ Limited — camera API differences |
| Mobile Browsers | ⚠️ Limited — desktop webcam experience recommended |
 
---
 
## ✦ Performance Tips
 
- Use **Chrome** for best MediaPipe performance
- Ensure **good lighting** so the hand is clearly visible
- Keep your hand **30–60 cm** from the camera for optimal detection
- The lite model (`modelComplexity: 0`) is used intentionally for smooth real-time performance
---
 
## ✦ License
 
This project is licensed under the **MIT License** — feel free to fork, remix, and build on it.
 
---
 
![Footer](https://readme-typing-svg.demolab.com?font=EB+Garamond&size=22&duration=4000&pause=1500&color=F5D061&center=true&vCenter=true&width=600&lines=Built+with+✦+by+Harsh+Tech+Diary;Awakening+the+canvas...;One+pinch+at+a+time.)
 
⭐ **[Star this repo](https://github.com/harshal-25c/HandDraw-Studio)** · 🌐 **[Try Live Demo](https://harshal-25c.github.io/HandDraw-Studio/)**
 
*Harsh Tech Diary — Where technology meets art.*

[Harshal Choudhary](https://github.com/Harshal-25C) - Software Developer👨‍💻 | Cloud Enthusiast            
B.Tech - `[Computer Science & Engineering]`         
Java | Maven | OOPs | Clean Architecture 

---
