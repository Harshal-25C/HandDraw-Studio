# ✦ Hand Draw Studio — Air Canvas(HarshTechDiary)

Draw in mid-air using only your hand and a webcam. Powered by [MediaPipe Hands](https://mediapipe.dev/).

---

## Features💡

| Feature | Detail |
|---|---|
| ✋ Hand Tracking | Pinch thumb + index finger to draw🤏 |
| 🎨 Color Palette | 7 colors — click toolbar or press `1–7` |
| 🧹 Eraser Mode | Toggle eraser with `E` or toolbar button |
| ↩ Undo | `Ctrl+Z` or toolbar button |
| 🗑 Clear | `Space` or toolbar button |
| 💾 Save Image | Press `S` or toolbar — saves a timestamped PNG |
| 🖌 Brush Size | Range slider in toolbar, live preview |
| ⌛ Loading screen | Animated while MediaPipe initialises |
| ✨ Smooth curves | Quadratic Bézier instead of straight lines |
| 🔔 Toast notifications | Feedback for every action |

---

## Project Structure📂

```
Hand-Draw-Studio/
├── index.html          ← Entry point
├── css/
│   └── style.css       ← All styles & theme variables
├── js/
│   ├── events.js       ← Tiny event bus
│   ├── engine.js       ← Canvas rendering & stroke engine
│   ├── ui.js           ← Toolbar, toast, keyboard shortcuts
│   ├── tracker.js      ← MediaPipe Hands + Camera setup
│   └── app.js          ← Boot / wiring
└── README.md
```

---

## Run Locally▶️

Because MediaPipe requires camera access, you need a local server (not just `file://`):

```bash
# Python 3
python -m http.server 8080

# Node (npx)
npx serve .

# VS Code
# Use the "Live Server" extension — right-click index.html → Open with Live Server
```

Then open **http://localhost:8080** in Chrome, Edge or any browser.

---

## Deploy to GitHub Pages

### One-time setup

1. **Create a GitHub repo** — e.g. `harsh-diary`

2. **Push the project:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit — Harsh Diary Air Canvas"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/harsh-diary.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repo on GitHub
   - Settings → Pages
   - Source: **Deploy from a branch**
   - Branch: `main` / `/ (root)`
   - Click **Save**

4. **Your site will be live at:**
   ```
   https://<YOUR_USERNAME>.github.io/harsh-diary/
   ```

> Note: GitHub Pages serves over HTTPS, which is required for camera access. ✅

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `1–7` | Select colour |
| `E` | Toggle eraser |
| `S` | Save image |
| `Ctrl+Z` | Undo last stroke |
| `Space` | Clear all |

---

## Tech Stack

- Vanilla HTML / CSS / JavaScript (no build step needed)
- [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands) — hand landmark detection
- Google Fonts — Cinzel + IM Fell English

---

## Author👨‍💻

[Harshal Choudhary](https://github.com/Harshal-25C) - Software Developer👨‍💻 | Cloud Enthusiast            
B.Tech - `[Computer Science & Engineering]` 
