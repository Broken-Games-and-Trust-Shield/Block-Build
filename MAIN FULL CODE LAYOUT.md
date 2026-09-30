### File Layout

### File 1: `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Block Build</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

  <div id="crosshair"></div>

  <div id="overlay">
    <h1>BLOCK BUILD</h1>
    <p>Click anywhere to start</p>
    <p><span class="key">WASD</span> Move | <span class="key">Space</span> Jump | <span class="key">Shift</span> Fly Down</p>
    <p><span class="key">Left Click</span> Destroy | <span class="key">Right Click</span> Place</p>
    <p><span class="key">1-9</span> / <span class="key">Scroll</span> Select Block | <span class="key">E</span> Inventory</p>
  </div>

  <div id="hint">Press E to open Block Menu</div>
  <button id="newWorldBtn">New World</button>
  <div id="worldLabel">World: Default</div>
  <a id="feedbackBtn" href="#">Feedback</a>

  <!-- Hotbar -->
  <div id="hotbar">
    <div class="slot selected" data-slot="0"><span class="num">1</span><div class="swatch" style="background:#8b5a2b;"></div><span class="name">Dirt</span></div>
    <div class="slot" data-slot="1"><span class="num">2</span><div class="swatch" style="background:#2e8b57;"></div><span class="name">Grass</span></div>
    <div class="slot" data-slot="2"><span class="num">3</span><div class="swatch" style="background:#808080;"></div><span class="name">Stone</span></div>
    <div class="slot" data-slot="3"><span class="num">4</span><div class="swatch" style="background:#a0522d;"></div><span class="name">Wood</span></div>
    <div class="slot" data-slot="4"><span class="num">5</span><div class="swatch" style="background:#228b22;"></div><span class="name">Leaves</span></div>
    <div class="slot" data-slot="5"><span class="num">6</span><div class="swatch" style="background:#b22222;"></div><span class="name">Brick</span></div>
    <div class="slot" data-slot="6"><span class="num">7</span><div class="swatch" style="background:#ffd700;"></div><span class="name">Sand</span></div>
    <div class="slot" data-slot="7"><span class="num">8</span><div class="swatch" style="background:#4682b4;"></div><span class="name">Glass</span></div>
    <div class="slot" data-slot="8"><span class="num">9</span><div class="swatch" style="background:#ff69b4;"></div><span class="name">Planks</span></div>
  </div>

  <!-- Block Selector Menu -->
  <div id="blockMenuTitle">SELECT A BLOCK FOR YOUR HOTBAR</div>
  <div id="blockMenu">
    <div id="blockMenuGrid"></div>
  </div>

  <!-- Front-End Menu System -->
  <div id="bbStart" class="bb-screen bb-open">
    <div class="bb-canvas">
      <div class="bb-topbar">
        <div class="bb-title">BLOCK BUILD</div>
      </div>
      <div class="bb-panel bb-tagline">
        Build, explore, and create in your browser.
      </div>
      <div class="bb-menu-stack">
        <button class="bb-btn" id="bbPlayBtn">Play Game</button>
        <button class="bb-btn" id="bbWorldsBtn">World Manager</button>
        <button class="bb-btn" id="bbSettingsBtn">Settings</button>
        <button class="bb-btn" id="bbAboutBtn">About</button>
      </div>
    </div>
  </div>

  <!-- World Manager Screen -->
  <div id="bbWorlds" class="bb-screen">
    <div class="bb-canvas">
      <div class="bb-topbar">
        <div class="bb-title">WORLDS</div>
        <button class="bb-btn bb-btn-back" onclick="showScreen('bbStart')">Back</button>
      </div>
      <div id="bbWorldList"></div>
      <button class="bb-btn" id="bbCreateWorldBtn">+ Create World</button>
    </div>
  </div>

  <!-- Settings Screen -->
  <div id="bbSettings" class="bb-screen">
    <div class="bb-canvas">
      <div class="bb-topbar">
        <div class="bb-title">SETTINGS</div>
        <button class="bb-btn bb-btn-back" onclick="showScreen('bbStart')">Back</button>
      </div>
      <div class="bb-section-title">Controls</div>
      <div class="bb-panel bb-settings-grid">
        <div class="bb-slider-card">
          <div class="bb-slider-head">
            <span>Mouse Sensitivity</span>
            <span id="bbSensVal">1.0</span>
          </div>
          <input type="range" id="bbSensSlider" min="0.1" max="3.0" step="0.1" value="1.0">
        </div>
        <div class="bb-slider-card">
          <div class="bb-slider-head">
            <span>Field of View (FOV)</span>
            <span id="bbFovVal">75</span>
          </div>
          <input type="range" id="bbFovSlider" min="60" max="110" step="1" value="75">
        </div>
      </div>
    </div>
  </div>

  <!-- About Screen -->
  <div id="bbAbout" class="bb-screen">
    <div class="bb-canvas">
      <div class="bb-topbar">
        <div class="bb-title">ABOUT</div>
        <button class="bb-btn bb-btn-back" onclick="showScreen('bbStart')">Back</button>
      </div>
      <div class="bb-panel bb-about-text">
        Block Build is a lightweight 3D browser game built using web technologies.
      </div>
    </div>
  </div>

  <!-- Modals -->
  <div id="bbRenameModal">
    <div class="bb-panel">
      <h3>Rename World</h3>
      <input type="text" id="bbRenameInput" placeholder="New Name">
      <div style="display:flex; gap:10px; justify-content:flex-end;">
        <button class="bb-btn bb-btn-sm" id="bbRenameSaveBtn">Save</button>
        <button class="bb-btn bb-btn-sm" onclick="closeModals()">Cancel</button>
      </div>
    </div>
  </div>

  <div id="bbDeleteConfirmModal">
    <div class="bb-panel">
      <h3>Delete World?</h3>
      <p>This action cannot be undone.</p>
      <div style="display:flex; gap:10px; justify-content:center;">
        <button class="bb-btn bb-btn-sm" id="bbDeleteConfirmBtn" style="background:linear-gradient(#a33,#722);">Delete</button>
        <button class="bb-btn bb-btn-sm" onclick="closeModals()">Cancel</button>
      </div>
    </div>
  </div>

  <script src="app.js"></script>
</body>
</html>

```

---

### File 2: `style.css`

```css
html, body { margin:0; padding:0; overflow:hidden; background:#87ceeb; height:100%; }
canvas { display:block; }

#crosshair {
  position:fixed; top:50%; left:50%; width:20px; height:20px;
  transform:translate(-50%,-50%); pointer-events:none; z-index:5;
}
#crosshair::before, #crosshair::after {
  content:""; position:absolute; background:rgba(255,255,255,0.85);
}
#crosshair::before { left:9px; top:2px; width:2px; height:16px; }
#crosshair::after { top:9px; left:2px; height:2px; width:16px; }

#overlay {
  position:fixed; inset:0; background:rgba(20,25,35,0.88); color:#fff;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  font-family: 'Segoe UI', Arial, sans-serif; z-index:20; text-align:center; cursor:pointer;
}
#overlay h1 { font-size:2.4em; margin:0 0 10px; letter-spacing:2px; }
#overlay p { margin:4px 0; opacity:0.85; font-size:1.02em; }
#overlay .key { background:#333; padding:2px 8px; border-radius:4px; border:1px solid #666; font-family:monospace; }

#hotbar {
  position:fixed; bottom:18px; left:50%; transform:translateX(-50%);
  display:flex; gap:5px; z-index:5; font-family: 'Segoe UI', Arial, sans-serif;
}
.slot {
  width:52px; height:64px; background:rgba(30,30,30,0.55); border:2px solid rgba(255,255,255,0.35);
  border-radius:6px; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; gap:3px;
}
.slot.selected { border-color:#fff; box-shadow:0 0 8px rgba(255,255,255,0.8); background:rgba(60,60,60,0.7); }
.slot .swatch { width:26px; height:26px; border-radius:3px; border:1px solid rgba(0,0,0,0.3); }
.icon3d-wrap { width:28px; height:28px; display:flex; align-items:center; justify-content:center; perspective:120px; }
.icon3d {
  position:relative; width:30px; height:30px; transform-style:preserve-3d;
  transform: rotateX(-30deg) rotateY(-45deg);
}
.icon3d .f { position:absolute; width:30px; height:30px; left:0; top:0; }
.icon3d .f.top   { transform: rotateX(90deg) translateZ(15px); filter:brightness(1.15); }
.icon3d .f.front { transform: translateZ(15px); filter:brightness(0.9); }
.icon3d .f.side  { transform: rotateY(90deg) translateZ(15px); filter:brightness(0.68); }
.icon3d.icon3d-half { transform: rotateX(-30deg) rotateY(-45deg) scaleY(0.5) translateY(7.5px); }
.icon3d.icon3d-fence { transform: rotateX(-30deg) rotateY(-45deg) scaleX(0.34) scaleZ(0.34); }
.icon3d-multi { position:relative; width:30px; height:30px; }
.icon3d-multi .icon3d { position:absolute; top:0; left:0; }
.icon3d.icon3d-step-top { transform: rotateX(-30deg) rotateY(-45deg) scale(0.55) translate3d(0px, -9px, -6px); }
.icon2d { width:30px; height:30px; image-rendering:pixelated; }
.slot .num { position:absolute; top:2px; left:4px; font-size:10px; color:#fff; opacity:0.8; }
.slot .name { font-size:9px; color:#fff; opacity:0.9; text-align:center; line-height:1.1; }

#newWorldBtn {
  position:fixed; top:14px; right:14px; z-index:6; cursor:pointer;
  font-family:'Segoe UI', Arial, sans-serif; font-size:13px; color:#fff;
  background:rgba(0,0,0,0.45); border:1px solid rgba(255,255,255,0.35);
  padding:7px 14px; border-radius:6px; opacity:0.9;
}
#newWorldBtn:hover { background:rgba(0,0,0,0.65); opacity:1; }
#worldLabel {
  position:fixed; top:14px; right:420px; z-index:5; color:#fff;
  font-family:'Segoe UI', Arial, sans-serif; font-size:12px; opacity:0.7;
  background:rgba(0,0,0,0.35); padding:6px 10px; border-radius:6px;
}
#hint {
  position:fixed; top:14px; left:calc(50% - 260px); transform:translateX(-50%); z-index:5;
  color:#fff; font-family:'Segoe UI', Arial, sans-serif; font-size:13px;
  background:rgba(0,0,0,0.35); padding:6px 14px; border-radius:6px; opacity:0.85;
}
#feedbackBtn {
  position:fixed; bottom:14px; left:14px; z-index:6; cursor:pointer;
  font-family:'Segoe UI', Arial, sans-serif; font-size:13px; font-weight:600; color:#1a1a1a;
  background:#ff8c1a; border:1px solid rgba(0,0,0,0.25);
  padding:9px 16px; border-radius:8px; text-decoration:none;
  box-shadow:0 2px 6px rgba(0,0,0,0.35);
}
#feedbackBtn:hover { background:#ffa143; }
#blockMenu {
  position:fixed; inset:0; background:rgba(10,12,18,0.72); z-index:15;
  display:none; align-items:center; justify-content:center;
}
#blockMenuGrid {
  display:grid; grid-template-columns:repeat(4, 92px); gap:12px;
  background:rgba(28,28,34,0.95); padding:22px; border-radius:10px;
  border:1px solid rgba(255,255,255,0.2);
}
.menuItem {
  width:92px; height:100px; background:rgba(255,255,255,0.06); border:2px solid rgba(255,255,255,0.25);
  border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px;
  cursor:pointer; color:#fff; font-family:'Segoe UI', Arial, sans-serif; font-size:12px;
}
.menuItem:hover { border-color:#fff; background:rgba(255,255,255,0.16); }
.menuItem .swatch { width:38px; height:38px; border-radius:4px; border:1px solid rgba(0,0,0,0.3); }
#blockMenuTitle {
  position:fixed; top:14%; left:50%; transform:translateX(-50%); z-index:16;
  color:#fff; font-family:'Segoe UI', Arial, sans-serif; font-size:14px; opacity:0.85;
  display:none;
}

.bb-screen {
  position:fixed; inset:0; z-index:200; display:none;
  flex-direction:column; align-items:center; justify-content:flex-start;
  font-family:'Segoe UI', Arial, sans-serif; color:#fff;
  background:linear-gradient(#bfe6fa, #9fd7f2);
  overflow:auto; user-select:none;
}
.bb-screen.bb-open { display:flex; }
.bb-canvas {
  position:relative; width:100%; max-width:1100px;
  padding:24px 24px 48px; box-sizing:border-box;
  display:flex; flex-direction:column; align-items:center; gap:22px;
  margin:0 auto;
}
.bb-clickable { cursor:pointer; }

.bb-topbar {
  position:relative; width:100%; min-height:96px; display:flex; align-items:center; justify-content:space-between;
  gap:16px; flex-wrap:wrap;
}
.bb-title {
  position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
  text-align:center; white-space:nowrap; display:flex; align-items:center; justify-content:center;
  background:linear-gradient(#5c7c49, #46613a); border:2px solid #26361c;
  border-radius:14px; box-shadow:0 5px 0 #1e2b14, 0 8px 12px rgba(0,0,0,0.25);
  padding:12px 26px; font-size:1.6em; font-weight:800; letter-spacing:1px;
  text-shadow:0 2px 0 rgba(0,0,0,0.5);
}

.bb-btn {
  display:inline-flex; align-items:center; justify-content:center;
  min-width:220px; padding:14px 28px; margin:0;
  background:linear-gradient(#5c7c49, #46613a); border:2px solid #26361c;
  border-radius:40px; box-shadow:0 5px 0 #1e2b14, 0 8px 10px rgba(0,0,0,0.3);
  color:#fff; font-weight:800; font-size:1.15em; letter-spacing:0.5px;
  text-shadow:0 2px 0 rgba(0,0,0,0.5); cursor:pointer; text-align:center;
  transition:transform 0.08s ease, background 0.12s ease;
  box-sizing:border-box; line-height:1.2;
}
.bb-btn:hover { background:linear-gradient(#6c8e58, #536e46); }
.bb-btn:active { transform:translateY(3px); box-shadow:0 2px 0 #1e2b14, 0 4px 6px rgba(0,0,0,0.25); }
.bb-btn.bb-btn-sm { min-width:0; padding:10px 16px; font-size:0.95em; }
.bb-btn.bb-btn-back { min-width:0; padding:10px 20px; font-size:1em; border-radius:14px; flex:0 0 auto; }

.bb-menu-stack { display:flex; flex-direction:column; align-items:center; gap:20px; margin-top:10px; }
.bb-menu-stack .bb-btn { min-width:280px; font-size:1.3em; padding:18px 32px; }

.bb-panel {
  background:#4b6c45; border:2px solid #26361c;
  border-radius:14px; box-shadow:0 6px 0 #1e2b14, 0 10px 14px rgba(0,0,0,0.3);
  padding:16px 22px; color:#fff; font-weight:700; text-shadow:0 2px 0 rgba(0,0,0,0.45);
  box-sizing:border-box; max-width:100%;
}
.bb-tagline { text-align:center; font-size:1.15em; line-height:1.4; max-width:520px; }

#bbWorldList {
  width:100%; max-width:620px;
  display:flex; flex-direction:column; align-items:stretch; gap:16px;
}
#bbWorldList:empty::after {
  content:"No worlds yet -- press Create World to start one.";
  display:block; text-align:center; color:#fff; font-weight:700;
  background:rgba(20,30,18,0.7); border:2px solid #26361c; border-radius:12px;
  padding:12px 18px; text-shadow:0 2px 0 rgba(0,0,0,0.5);
}

#bbRenameModal, #bbDeleteConfirmModal {
  position:fixed; inset:0; z-index:260; display:none; align-items:center; justify-content:center;
  background:rgba(10,15,10,0.55);
}
#bbRenameModal.bb-open, #bbDeleteConfirmModal.bb-open { display:flex; }
#bbRenameModal .bb-panel, #bbDeleteConfirmModal .bb-panel { display:flex; flex-direction:column; gap:12px; min-width:300px; }
#bbRenameInput {
  padding:10px 12px; border-radius:8px; border:2px solid #2c3f22; font-size:1em;
  background:#eef6e8; color:#233318; font-family:inherit;
}

.bb-settings-grid {
  width:100%; display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:18px;
}
.bb-slider-card { display:flex; flex-direction:column; gap:12px; align-items:stretch; }
.bb-slider-card .bb-slider-head { display:flex; align-items:center; justify-content:space-between; gap:12px; font-size:1.15em; }
.bb-slider-card input[type=range] { width:100%; accent-color:#26361c; }
.bb-section-title {
  background:linear-gradient(#5c7c49, #46613a); border:2px solid #26361c; border-radius:14px;
  box-shadow:0 5px 0 #1e2b14; padding:10px 24px; font-weight:800; font-size:1.25em;
  text-shadow:0 2px 0 rgba(0,0,0,0.5);
}
.bb-about-text { max-width:640px; text-align:center; font-size:1.15em; line-height:1.5; }

```

---

### File 3: `app.js`

```javascript
// Navigation Screen Management
function showScreen(screenId) {
  const screens = document.querySelectorAll('.bb-screen');
  screens.forEach(screen => screen.classList.remove('bb-open'));
  
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('bb-open');
  }
}

// Modal Control
function closeModals() {
  document.getElementById('bbRenameModal').classList.remove('bb-open');
  document.getElementById('bbDeleteConfirmModal').classList.remove('bb-open');
}

// UI Event Handlers
document.addEventListener('DOMContentLoaded', () => {
  // Navigation Buttons
  document.getElementById('bbPlayBtn')?.addEventListener('click', () => {
    showScreen(''); // Hide all UI screens to show the game overlay/canvas
    document.getElementById('overlay').style.display = 'flex';
  });

  document.getElementById('bbWorldsBtn')?.addEventListener('click', () => showScreen('bbWorlds'));
  document.getElementById('bbSettingsBtn')?.addEventListener('click', () => showScreen('bbSettings'));
  document.getElementById('bbAboutBtn')?.addEventListener('click', () => showScreen('bbAbout'));

  // Overlay Click to Enter Pointer Lock
  const overlay = document.getElementById('overlay');
  overlay?.addEventListener('click', () => {
    overlay.style.display = 'none';
  });

  // Settings Sliders
  const sensSlider = document.getElementById('bbSensSlider');
  const sensVal = document.getElementById('bbSensVal');
  sensSlider?.addEventListener('input', (e) => {
    sensVal.textContent = e.target.value;
  });

  const fovSlider = document.getElementById('bbFovSlider');
  const fovVal = document.getElementById('bbFovVal');
  fovSlider?.addEventListener('input', (e) => {
    fovVal.textContent = e.target.value;
  });

  // Hotbar Selection Handling
  const slots = document.querySelectorAll('#hotbar .slot');
  slots.forEach(slot => {
    slot.addEventListener('click', () => {
      slots.forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
    });
  });

  // Keyboard Navigation for Inventory / Hotbar
  window.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '9') {
      const index = parseInt(e.key) - 1;
      if (slots[index]) {
        slots.forEach(s => s.classList.remove('selected'));
        slots[index].classList.add('selected');
      }
    }

    if (e.key.toLowerCase() === 'e') {
      const menu = document.getElementById('blockMenu');
      const title = document.getElementById('blockMenuTitle');
      if (menu && title) {
        const isOpen = menu.style.display === 'flex';
        menu.style.display = isOpen ? 'none' : 'flex';
        title.style.display = isOpen ? 'none' : 'block';
      }
    }
  });
});

```
