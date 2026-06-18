/**
 * Harsh Tech Diary — Drawing Engine
 * Handles all canvas rendering, stroke management, and hand tracking integration.
 */

const DiaryEngine = (() => {
  //--------State---------------
  const state = {
    strokes: [],          // [{color, width, points[]}]  — NO eraser strokes stored
    currentStroke: null,
    isDrawing: false,
    isEraser: false,
    color: '#F5D061',
    brushWidth: 6,
    smoothX: null,
    smoothY: null,
    SMOOTH: 0.7,
    lastFrameTime: 0,
    fps: 0,
    prevX: null,
    prevY: null,
  };

  let canvas, ctx;

  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // -- Core render — runs every MediaPipe frame -------------------------
  function render(results) {
    const W = window.innerWidth, H = window.innerHeight;
    if (canvas.width !== W || canvas.height !== H) resize();

    const now = performance.now();
    state.fps = Math.round(1000 / Math.max(1, now - state.lastFrameTime));
    state.lastFrameTime = now;

    //1. Camera frame
    ctx.drawImage(results.image, 0, 0, W, H);

    //2. Dark cinematic overlay
    ctx.fillStyle = 'rgba(10, 6, 2, 0.82)';
    ctx.fillRect(0, 0, W, H);

    //3. All draw strokes
    _drawStrokes();

    //4. Hand skeleton + cursor
    if(results.multiHandLandmarks?.length > 0) {
      const lm = results.multiHandLandmarks[0];
      _drawHandSkeleton(lm, W, H);
      _processCursor(lm, W, H);
    }else {
      _resetCursor();
    }
  }

  // -- Draw stored strokes ------------------------
  function _drawStrokes() {
    for(const stroke of state.strokes) {
      if(stroke.points.length < 2) continue;
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = stroke.color;
      ctx.shadowColor = stroke.color;
      ctx.shadowBlur = 12;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for(let i=1; i<stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }
  }

  // -- Eraser: remove strokes whose points fall within eraser radius -------
  //This is clean — no compositing, no black blobs, just removes from array.
  //Canvas redraws everything from scratch each frame anyway.
  function _eraseAt(ex, ey) {
    const radius = Math.max(state.brushWidth * 4, 30);
    state.strokes = state.strokes.filter(stroke =>
      !stroke.points.some(p => Math.hypot(p.x - ex, p.y - ey) < radius)
    );
  }

  // -- Hand skeleton -------------------------------------------------
  function _drawHandSkeleton(lm, W, H) {
    drawConnectors(ctx, lm, HAND_CONNECTIONS, {
      color: 'rgba(245, 208, 97, 0.25)',
      lineWidth: 1.5
    });
    drawLandmarks(ctx, lm, {
      color: 'rgba(255,255,255,0.7)',
      fillColor: 'rgba(245,208,97,0.2)',
      lineWidth: 1,
      radius: 3
    });
  }

  // -- Cursor + pinch detection -------------------------------------
  function _processCursor(lm, W, H) {
    const tip   = lm[8];
    const thumb = lm[4];

    const rawX = tip.x * W;
    const rawY = tip.y * H;

    if(state.smoothX === null) {
      state.smoothX = rawX;
      state.smoothY = rawY;
    }else{
      state.smoothX += (rawX - state.smoothX) * state.SMOOTH;
      state.smoothY += (rawY - state.smoothY) * state.SMOOTH;
    }

    const sx = state.smoothX;
    const sy = state.smoothY;

    const pinchDist = Math.hypot(sx-thumb.x * W, sy-thumb.y * H);
    const isPinching = pinchDist<55;

    // -- Draw cursor ------------------------------------------
    ctx.save();
    const eraserR = Math.max(state.brushWidth * 4, 30);
    const cursorR = state.isEraser ? eraserR : (isPinching ? 5 : 10);

    ctx.beginPath();
    ctx.arc(sx, sy, cursorR, 0, Math.PI * 2);

    if(state.isEraser) {
      ctx.strokeStyle = isPinching ? 'rgba(255,107,107,1)' : 'rgba(255,107,107,0.55)';
      ctx.shadowColor = '#FF6B6B';
      ctx.lineWidth = isPinching ? 2.5 : 1.5;
      ctx.setLineDash([4, 4]);  // dashed ring = eraser look
    }else {
      ctx.strokeStyle = isPinching ? state.color : 'rgba(245,208,97,0.55)';
      ctx.shadowColor = state.color;
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
    }
    ctx.shadowBlur = 12;
    ctx.stroke();

    if(isPinching && !state.isEraser) {
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fillStyle = state.color;
      ctx.shadowBlur = 8;
      ctx.fill();
    }
    ctx.restore();

    // -- Handle actions --------------------------------------
    if(isPinching) {
      if(state.isEraser) {
        _eraseAt(sx, sy);
      }else {
        if(!state.isDrawing) {
          state.isDrawing = true;
          state.currentStroke = {
            color: state.color,
            width: state.brushWidth,
            points: []
          };
          state.strokes.push(state.currentStroke);
          state.prevX = sx;
          state.prevY = sy;
        }

        if(state.prevX !== null) {
          const dist = Math.hypot(sx - state.prevX, sy - state.prevY);
          if(dist > 8) {
            const steps = Math.ceil(dist / 6);
            for(let i=1; i<=steps; i++) {
              state.currentStroke.points.push({
                x: state.prevX + (sx-state.prevX) * (i/steps),
                y: state.prevY + (sy-state.prevY) * (i/steps),
              });
            }
          }else {
            state.currentStroke.points.push({ x: sx, y: sy });
          }
        }

        state.prevX = sx;
        state.prevY = sy;
      }
    }else {
      state.isDrawing = false;
      state.currentStroke = null;
      state.prevX = null;
      state.prevY = null;
    }

    Events.emit('cursor', { x: sx, y: sy, active: isPinching });
  }

  function _resetCursor() {
    state.smoothX = null;
    state.smoothY = null;
    state.isDrawing = false;
    state.currentStroke = null;
    Events.emit('cursor', null);
  }

  // -- Public API -----------------------------------------
  function setColor(c)      { state.color = c; state.isEraser = false; }
  function setEraser(on)    { state.isEraser = on; }
  function setBrushWidth(w) { state.brushWidth = w; }
  function clearAll()       { state.strokes = []; state.currentStroke = null; }
  function undo()           { if (state.strokes.length) state.strokes.pop(); }
  function getCanvas()      { return canvas; }
  function getState()       { return state; }

  return { init, render, setColor, setEraser, setBrushWidth, clearAll, undo, getCanvas, getState };
})();
