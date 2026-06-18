/**
 * Harsh Diary — UI Controller
 * Manages toolbar interactions, toasts, status badge, and save functionality.
 */

const UI = (() => {

  const COLORS = [
    { id: 'gold',    hex: '#F5D061', label: 'Gold' },
    { id: 'white',   hex: '#FFFFFF', label: 'White' },
    { id: 'crimson', hex: '#E05252', label: 'Crimson' },
    { id: 'sage',    hex: '#6BBF84', label: 'Sage' },
    { id: 'sky',     hex: '#5BA8D8', label: 'Sky' },
    { id: 'rose',    hex: '#D46A8A', label: 'Rose' },
    { id: 'amber',   hex: '#FF9F45', label: 'Amber' },
  ];

  let activeColorId = 'gold';
  let eraserOn = false;
  let toastTimer = null;

  function init() {
    _buildToolbar();
    _bindKeys();
    _bindCursorEvents();
    _autoHideToolbar();
  }

  // -- Build toolbar DOM ----------------------------------------------
  function _buildToolbar() {
    const tb = document.getElementById('toolbar');
    tb.innerHTML = '';

    // Color swatches
    COLORS.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'color-btn' + (c.id === activeColorId ? ' active' : '');
      btn.style.background = c.hex;
      btn.title = c.label;
      btn.dataset.id = c.id;
      btn.addEventListener('click', () => _selectColor(c.id, c.hex));
      tb.appendChild(btn);
    });

    //Separator
    tb.appendChild(_sep());

    //Brush size
    const sizeWrap = document.createElement('div');
    sizeWrap.className = 'size-track';
    sizeWrap.innerHTML = `<label>Size</label>
      <input type="range" id="sizeSlider" min="2" max="24" value="6">`;
    tb.appendChild(sizeWrap);

    document.getElementById('sizeSlider').addEventListener('input', (e) => {
      DiaryEngine.setBrushWidth(Number(e.target.value));
    });

    // Separator
    tb.appendChild(_sep());

    // Eraser
    const eraserBtn = _toolBtn('🧹', 'Eraser  (E)', 'eraser-btn');
    eraserBtn.addEventListener('click', () => _toggleEraser());
    tb.appendChild(eraserBtn);

    //Undo
    const undoBtn = _toolBtn('↩', 'Undo  (Ctrl+Z)', 'undo-btn');
    undoBtn.addEventListener('click', () => { DiaryEngine.undo(); toast('Stroke undone'); });
    tb.appendChild(undoBtn);

    // Clear
    const clearBtn = _toolBtn('🗑', 'Clear All  (Space)', 'clear-btn');
    clearBtn.addEventListener('click', () => _confirmClear());
    tb.appendChild(clearBtn);

    //Separator
    tb.appendChild(_sep());

    // Save
    const saveBtn = _toolBtn('💾', 'Save Image  (S)', 'save-btn');
    saveBtn.addEventListener('click', () => _saveImage());
    tb.appendChild(saveBtn);
  }

  function _sep() {
    const d = document.createElement('div');
    d.className = 'tool-sep';
    return d;
  }

  function _toolBtn(icon, title, cls) {
    const b = document.createElement('button');
    b.className = `tool-btn ${cls}`;
    b.title = title;
    b.textContent = icon;
    return b;
  }

  // -- Color select ------------------------------------------------------------
  function _selectColor(id, hex) {
    activeColorId = id;
    eraserOn = false;
    DiaryEngine.setColor(hex);
    DiaryEngine.setEraser(false);
    _refreshColorBtns();
    _refreshEraserBtn();
    _updateModeTag();
  }

  function _refreshColorBtns() {
    document.querySelectorAll('.color-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.id === activeColorId);
    });
  }

  // -- Eraser -----------------------------------------------------------
  function _toggleEraser() {
    eraserOn = !eraserOn;
    DiaryEngine.setEraser(eraserOn);
    _refreshEraserBtn();
    _updateModeTag();
  }

  function _refreshEraserBtn() {
    const btn = document.querySelector('.eraser-btn');
    if(!btn) return;
    btn.classList.toggle('eraser-active', eraserOn);
    if(eraserOn) {
      document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    }else {
      _refreshColorBtns();
    }
  }

  // -- Clear confirmation ---------------------------------------------------
  function _confirmClear() {
    DiaryEngine.clearAll();
    toast('Canvas cleared');
  }

  // -- Save image ------------------------------------------------------
  function _saveImage() {
    const src = DiaryEngine.getCanvas();

    // The canvas draws in natural (unmirrored) pixel space.
    // CSS scaleX(-1) is purely visual. So we mirror the saved image
    // so it looks like what the user saw on screen.
    const off = document.createElement('canvas');
    off.width = src.width;
    off.height = src.height;
    const octx = off.getContext('2d');
    octx.save();
    octx.scale(-1, 1);
    octx.translate(-src.width, 0);
    octx.drawImage(src, 0, 0);
    octx.restore();

    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    const link = document.createElement('a');
    link.download = `harsh-diary-${ts}.png`;
    link.href = off.toDataURL('image/png');
    link.click();
    toast('✦ Image saved');
  }

  // -- Keyboard shortcuts --------------------------------------------------
  function _bindKeys() {
    window.addEventListener('keydown', (e) => {
      if(e.code === 'Space') { DiaryEngine.clearAll(); toast('Canvas cleared'); }
      if(e.key === 'e' || e.key === 'E') { _toggleEraser(); }
      if(e.key === 's' || e.key === 'S') { _saveImage(); }
      if((e.ctrlKey || e.metaKey) && e.key === 'z') { DiaryEngine.undo(); toast('Stroke undone'); }
      // Number keys for color
      const n = parseInt(e.key);
      if(n >= 1 && n <= COLORS.length) {
        const c = COLORS[n - 1];
        _selectColor(c.id, c.hex);
        toast(`Color: ${c.label}`);
      }
    });
  }

  // -- Auto-hide toolbar -----------------------------------------------------
  function _autoHideToolbar() {
    const tb = document.getElementById('toolbar');
    let hideTimer;
    const resetHide = () => {
      tb.style.opacity = '1';
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => { tb.style.opacity = '0.35'; }, 4000);
    };
    document.addEventListener('mousemove', resetHide);
    document.addEventListener('click', resetHide);
    resetHide();
  }

  // -- Mode tag ---------------------------------------------------------------
  function _updateModeTag() {
    const el = document.getElementById('modeTag');
    if(eraserOn) {
      el.textContent = 'Eraser';
      el.className = 'eraser';
    }else {
      const c = COLORS.find(c => c.id === activeColorId);
      el.textContent = c ? c.label : 'Draw';
      el.className = '';
    }
  }

  // -- Cursor events → status badge -------------------------------------------
  function _bindCursorEvents() {
    const statusEl = document.getElementById('status');
    Events.on('cursor', (data) => {
      if(!data) {
        statusEl.textContent = 'Show your hand to the camera';
        statusEl.classList.remove('drawing');
      }else if(data.active) {
        statusEl.textContent = 'Drawing…';
        statusEl.classList.add('drawing');
      }else {
        statusEl.textContent = 'Pinch to draw';
        statusEl.classList.remove('drawing');
      }
    });
  }

  // -- Toast ----------------------------------------------------------------
  function toast(msg, duration = 2000) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), duration);
  }

  return { init, toast };
})();
