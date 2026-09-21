### Part 1: Front-End UI Structure (`<style>` and Menu Layout)

This part controls all user interface (UI) elements, including the HUD (crosshair, hotbar, hint), the start screen, settings, hotkey configuration, world list manager, and modal popups.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Block Build</title>
<style>
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
    position:fixed; bottom:14px; right:14px; z-index:6; cursor:pointer;
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
  .bb-logo-img { height:140px; width:auto; max-width:40%; object-fit:contain; display:block; flex:0 0 auto; }
  .bb-logo-sm { height:44px; width:auto; object-fit:contain; display:block; flex:0 0 auto; margin-right:12px; }
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
  .bb-bullets { text-align:left; font-size:1.1em; line-height:1.6; }
  .bb-bullets ul { margin:0; padding-left:22px; }

  .bb-dyn-pill {
    display:inline-flex; align-items:center; justify-content:center;
    min-width:64px; padding:10px 14px;
    background:linear-gradient(#5c7c49, #46613a); border:2px solid #26361c;
    border-radius:12px; box-shadow:0 4px 0 #1e2b14, 0 6px 8px rgba(0,0,0,0.3);
    color:#fff; font-weight:800; text-shadow:0 2px 0 rgba(0,0,0,0.5);
    cursor:pointer; text-align:center; font-family:'Segoe UI', Arial, sans-serif;
    box-sizing:border-box;
  }
  .bb-dyn-pill.bb-listening { background:linear-gradient(#8a6a2a,#6b501e); animation:bbPulse 0.8s infinite alternate; }
  @keyframes bbPulse { from { opacity:1; } to { opacity:0.55; } }
  .bb-world-pill { border-radius:40px; min-width:280px; padding:14px 28px; font-size:1.15em; flex:1 1 auto; }
  .bb-pencil-btn {
    display:inline-flex; align-items:center; justify-content:center;
    width:52px; height:52px; flex:0 0 auto; font-size:1.2em;
    background:linear-gradient(#5c7c49, #46613a); border:2px solid #26361c;
    border-radius:12px; box-shadow:0 4px 0 #1e2b14; cursor:pointer;
  }
  .bb-pencil-btn:hover { background:linear-gradient(#6c8e58, #536e46); }
  .bb-pencil-btn:active { transform:translateY(2px); box-shadow:0 2px 0 #1e2b14; }

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
  .bb-world-row { display:flex; align-items:center; gap:12px; width:100%; }

  #bbRenameModal {
    position:fixed; inset:0; z-index:260; display:none; align-items:center; justify-content:center;
    background:rgba(10,15,10,0.55);
  }
  #bbRenameModal.bb-open { display:flex; }
  #bbRenameModal .bb-panel { display:flex; flex-direction:column; gap:12px; align-items:stretch; min-width:300px; }
  #bbDeleteConfirmModal {
    position:fixed; inset:0; z-index:270; display:none; align-items:center; justify-content:center;
    background:rgba(10,15,10,0.6);
  }
  #bbDeleteConfirmModal.bb-open { display:flex; }
  #bbDeleteConfirmModal .bb-panel { display:flex; flex-direction:column; gap:14px; align-items:stretch; max-width:340px; text-align:center; }
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
  #bbHotkeyGrid {
    width:100%; display:grid; grid-template-columns:repeat(auto-fit, minmax(230px, 1fr)); gap:14px;
  }
  .bb-hotkey-row {
    display:flex; align-items:center; justify-content:space-between; gap:12px;
    background:#4b6c45; border:2px solid #26361c; border-radius:12px;
    box-shadow:0 4px 0 #1e2b14; padding:10px 12px; font-weight:800;
    text-shadow:0 2px 0 rgba(0,0,0,0.45);
  }
  .bb-hotkey-row .bb-hk-label { font-size:1em; }

  .bb-about-text { max-width:640px; text-align:center; font-size:1.15em; line-height:1.5; }
  .bb-link-btn { flex-direction:column; gap:4px; min-width:320px; }
  .bb-link-btn .bb-link-url { text-decoration:underline; font-size:0.95em; }

  .bb-screen { background-size:cover; background-position:center; background-repeat:no-repeat; background-attachment:fixed; }
  #bbStart { background-image:url('data:image/jpeg;base64,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を高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# clear the previous canvas visual structure HTML layout controls UI standard logic markup elements

```

---

### Part 2: HTML UI Layer Markup

This section defines the document structure, HUD containers, world settings menus, hotbar layout, and popups.

```html
</style>
</head>
<body>

<div id="crosshair"></div>
<div id="hint">Press [E] to inventory/controls &bull; Scroll/Keys 1-8 for blocks</div>
<div id="worldLabel">World: Default</div>
<button id="newWorldBtn" onclick="openWorldManagerScreen()">World Manager</button>

<div id="overlay">
  <h1>BLOCK BUILD</h1>
  <p>Click anywhere to start playing</p>
  <p style="margin-top:14px;"><span class="key">W A S D</span> Move &nbsp; <span class="key">Space</span> Jump &nbsp; <span class="key">Shift</span> Fly Down</p>
  <p><span class="key">Left Click</span> Mine &nbsp; <span class="key">Right Click</span> Place &nbsp; <span class="key">E</span> Inventory / Pause</p>
  <p><span class="key">F</span> Fly Mode &nbsp; <span class="key">1 - 8</span> Select Block</p>
</div>

<a id="feedbackBtn" href="https://forms.gle/vP313m34P44m11111" target="_blank" rel="noopener">Feedback</a>

<div id="hotbar"></div>

<div id="blockMenuTitle">SELECT BLOCK FOR SLOT</div>
<div id="blockMenu"><div id="blockMenuGrid"></div></div>

<!-- MAIN MENU -->
<div id="bbStart" class="bb-screen bb-open">
  <div class="bb-canvas">
    <div class="bb-topbar">
      <img src="https://images.cooltext.com/5732732.png" alt="Block Build" class="bb-logo-img">
      <button class="bb-btn bb-btn-sm bb-clickable" onclick="bbOpenScreen('bbSettings')">Settings</button>
    </div>
    <div class="bb-panel bb-tagline">
      A lightweight 3D voxel sandbox game built entirely with HTML, CSS, and Three.js.
    </div>
    <div class="bb-menu-stack">
      <button class="bb-btn bb-clickable" onclick="bbStartGame()">Play Game</button>
      <button class="bb-btn bb-clickable" onclick="bbOpenScreen('bbWorldMgr')">World Manager</button>
      <button class="bb-btn bb-clickable" onclick="bbOpenScreen('bbHotkeys')">Controls / Hotkeys</button>
      <button class="bb-btn bb-clickable" onclick="bbOpenScreen('bbAbout')">About Game</button>
    </div>
  </div>
</div>

<!-- WORLD MANAGER SCREEN -->
<div id="bbWorldMgr" class="bb-screen">
  <div class="bb-canvas">
    <div class="bb-topbar">
      <img src="https://images.cooltext.com/5732732.png" alt="Logo" class="bb-logo-sm">
      <div class="bb-title">World Manager</div>
      <button class="bb-btn bb-btn-back bb-clickable" onclick="bbBackFromWorldMgr()">Back</button>
    </div>
    <button class="bb-btn bb-clickable" onclick="bbCreateWorldPrompt()">+ Create New World</button>
    <div id="bbWorldList"></div>
  </div>
</div>

<!-- RENAME MODAL -->
<div id="bbRenameModal">
  <div class="bb-panel">
    <div style="font-size:1.2em; text-align:center;">Rename World</div>
    <input type="text" id="bbRenameInput" maxlength="24" placeholder="Enter new world name...">
    <div style="display:flex; gap:10px; justify-content:center; margin-top:4px;">
      <button class="bb-btn bb-btn-sm bb-clickable" onclick="bbConfirmRename()">Save</button>
      <button class="bb-btn bb-btn-sm bb-clickable" onclick="bbCloseRenameModal()">Cancel</button>
    </div>
  </div>
</div>

<!-- DELETE CONFIRM MODAL -->
<div id="bbDeleteConfirmModal">
  <div class="bb-panel">
    <div style="font-size:1.2em; text-align:center;">Delete World?</div>
    <div id="bbDeleteModalText" style="font-size:0.95em; opacity:0.9;">Are you sure you want to delete this world? This cannot be undone.</div>
    <div style="display:flex; gap:10px; justify-content:center; margin-top:4px;">
      <button class="bb-btn bb-btn-sm bb-clickable" style="background:linear-gradient(#a33838, #7a2424);" onclick="bbConfirmDeleteWorld()">Delete</button>
      <button class="bb-btn bb-btn-sm bb-clickable" onclick="bbCloseDeleteModal()">Cancel</button>
    </div>
  </div>
</div>

<!-- SETTINGS SCREEN -->
<div id="bbSettings" class="bb-screen">
  <div class="bb-canvas">
    <div class="bb-topbar">
      <img src="https://images.cooltext.com/5732732.png" alt="Logo" class="bb-logo-sm">
      <div class="bb-title">Settings</div>
      <button class="bb-btn bb-btn-back bb-clickable" onclick="bbBackFromSettings()">Back</button>
    </div>
    <div class="bb-settings-grid">
      <div class="bb-panel bb-slider-card">
        <div class="bb-slider-head">
          <span>FOV (Field of View)</span>
          <span id="bbFovVal">75</span>
        </div>
        <input type="range" id="bbFovSlider" min="50" max="110" value="75" oninput="bbUpdateFov(this.value)">
      </div>
      <div class="bb-panel bb-slider-card">
        <div class="bb-slider-head">
          <span>Mouse Sensitivity</span>
          <span id="bbSensVal">1.0</span>
        </div>
        <input type="range" id="bbSensSlider" min="0.2" max="3.0" step="0.1" value="1.0" oninput="bbUpdateSens(this.value)">
      </div>
      <div class="bb-panel bb-slider-card">
        <div class="bb-slider-head">
          <span>Render Distance</span>
          <span id="bbRenderVal">40</span>
        </div>
        <input type="range" id="bbRenderSlider" min="20" max="80" step="5" value="40" oninput="bbUpdateRenderDist(this.value)">
      </div>
    </div>
  </div>
</div>

<!-- HOTKEYS SCREEN -->
<div id="bbHotkeys" class="bb-screen">
  <div class="bb-canvas">
    <div class="bb-topbar">
      <img src="https://images.cooltext.com/5732732.png" alt="Logo" class="bb-logo-sm">
      <div class="bb-title">Controls / Hotkeys</div>
      <button class="bb-btn bb-btn-back bb-clickable" onclick="bbOpenScreen('bbStart')">Back</button>
    </div>
    <div class="bb-panel bb-tagline">Click any binding below, then press a key to rebind it.</div>
    <div id="bbHotkeyGrid"></div>
    <button class="bb-btn bb-btn-sm bb-clickable" style="margin-top:10px;" onclick="bbResetHotkeys()">Reset Defaults</button>
  </div>
</div>

<!-- ABOUT SCREEN -->
<div id="bbAbout" class="bb-screen">
  <div class="bb-canvas">
    <div class="bb-topbar">
      <img src="https://images.cooltext.com/5732732.png" alt="Logo" class="bb-logo-sm">
      <div class="bb-title">About Game</div>
      <button class="bb-btn bb-btn-back bb-clickable" onclick="bbOpenScreen('bbStart')">Back</button>
    </div>
    <div class="bb-panel bb-about-text">
      Block Build is a web-based 3D voxel game inspired by classic block-building sandboxes.
      Features include procedurally generated terrain, dynamic block placing/destroying, custom world saving via LocalStorage, flying mode, and configurable hotkeys.
    </div>
    <div class="bb-panel bb-bullets">
      <ul>
        <li>3D engine: Three.js (WebGL)</li>
        <li>Storage: Browser LocalStorage</li>
        <li>100% Client-side JavaScript execution</li>
      </ul>
    </div>
    <a class="bb-btn bb-link-btn bb-clickable" href="https://forms.gle/vP313m34P44m11111" target="_blank" rel="noopener">
      <span>Feedback Form</span>
      <span class="bb-link-url">https://forms.gle/vP313m34P44m11111</span>
    </a>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>

```

---

### Part 3: Front-End UI Management Scripts

This segment includes the front-end logic: screen transitions, world storage creation, hotkey rebinding, settings management, and UI event binding.

```javascript
/* =========================================================================
   FRONT-END MENU SYSTEM & LOCAL STORAGE STATE
   ========================================================================= */
var bbHotkeys = {
  forward:  { label: 'Move Forward', key: 'KeyW', display: 'W' },
  backward: { label: 'Move Backward', key: 'KeyS', display: 'S' },
  left:     { label: 'Move Left', key: 'KeyA', display: 'A' },
  right:    { label: 'Move Right', key: 'KeyD', display: 'D' },
  jump:     { label: 'Jump', key: 'Space', display: 'Space' },
  flyDown:  { label: 'Fly Down', key: 'ShiftLeft', display: 'Shift' },
  flyToggle:{ label: 'Toggle Fly', key: 'KeyF', display: 'F' },
  inventory:{ label: 'Inventory', key: 'KeyE', display: 'E' }
};

var bbSettingsState = { fov: 75, sensitivity: 1.0, renderDistance: 40 };
var bbCurrentWorldId = 'default';
var bbWorldList = [];
var listeningAction = null;
var renamingWorldId = null;
var deletingWorldId = null;

function bbOpenScreen(screenId) {
  var screens = document.querySelectorAll('.bb-screen');
  screens.forEach(function(s) { s.classList.remove('bb-open'); });
  var target = document.getElementById(screenId);
  if (target) target.classList.add('bb-open');
  if (screenId === 'bbWorldMgr') bbRenderWorldList();
  if (screenId === 'bbHotkeys') bbRenderHotkeys();
}

function bbStartGame() {
  var screens = document.querySelectorAll('.bb-screen');
  screens.forEach(function(s) { s.classList.remove('bb-open'); });
  if (typeof initGameEngine === 'function') {
    initGameEngine();
  }
}

function bbBackFromWorldMgr() {
  if (typeof gameInitialized !== 'undefined' && gameInitialized) {
    var screens = document.querySelectorAll('.bb-screen');
    screens.forEach(function(s) { s.classList.remove('bb-open'); });
  } else {
    bbOpenScreen('bbStart');
  }
}

function bbBackFromSettings() {
  if (typeof gameInitialized !== 'undefined' && gameInitialized) {
    var screens = document.querySelectorAll('.bb-screen');
    screens.forEach(function(s) { s.classList.remove('bb-open'); });
  } else {
    bbOpenScreen('bbStart');
  }
}

function openWorldManagerScreen() {
  if (document.pointerLockElement) {
    document.exitPointerLock();
  }
  bbOpenScreen('bbWorldMgr');
}

/* Local Storage World Management */
function bbLoadWorldsData() {
  try {
    var raw = localStorage.getItem('bb_worlds_index');
    if (raw) bbWorldList = JSON.parse(raw);
    else bbWorldList = [{ id: 'default', name: 'Default World', created: Date.now() }];
  } catch(e) {
    bbWorldList = [{ id: 'default', name: 'Default World', created: Date.now() }];
  }
}

function bbSaveWorldsData() {
  try {
    localStorage.setItem('bb_worlds_index', JSON.stringify(bbWorldList));
  } catch(e) {}
}

function bbRenderWorldList() {
  bbLoadWorldsData();
  var container = document.getElementById('bbWorldList');
  container.innerHTML = '';
  bbWorldList.forEach(function(w) {
    var row = document.createElement('div');
    row.className = 'bb-world-row';

    var btn = document.createElement('button');
    btn.className = 'bb-btn bb-world-pill bb-clickable';
    btn.textContent = w.name + (w.id === bbCurrentWorldId ? ' (Active)' : '');
    btn.onclick = function() { bbSelectWorld(w.id); };

    var ren = document.createElement('button');
    ren.className = 'bb-pencil-btn bb-clickable';
    ren.innerHTML = '&#9998;';
    ren.title = 'Rename World';
    ren.onclick = function(e) { e.stopPropagation(); bbOpenRenameModal(w.id); };

    var del = document.createElement('button');
    del.className = 'bb-pencil-btn bb-clickable';
    del.style.background = 'linear-gradient(#a33838, #7a2424)';
    del.innerHTML = '&#128465;';
    del.title = 'Delete World';
    del.onclick = function(e) { e.stopPropagation(); bbOpenDeleteModal(w.id); };

    row.appendChild(btn);
    row.appendChild(ren);
    row.appendChild(del);
    container.appendChild(row);
  });
}

function bbSelectWorld(id) {
  bbCurrentWorldId = id;
  var w = bbWorldList.find(function(x) { return x.id === id; });
  var name = w ? w.name : 'Default';
  document.getElementById('worldLabel').textContent = 'World: ' + name;
  if (typeof switchWorld === 'function') switchWorld(id);
  bbBackFromWorldMgr();
}

function bbCreateWorldPrompt() {
  var name = prompt('Enter new world name:', 'My New World');
  if (!name) return;
  var id = 'world_' + Date.now();
  bbWorldList.push({ id: id, name: name, created: Date.now() });
  bbSaveWorldsData();
  bbSelectWorld(id);
}

function bbOpenRenameModal(id) {
  renamingWorldId = id;
  var w = bbWorldList.find(function(x) { return x.id === id; });
  document.getElementById('bbRenameInput').value = w ? w.name : '';
  document.getElementById('bbRenameModal').classList.add('bb-open');
}

function bbCloseRenameModal() {
  renamingWorldId = null;
  document.getElementById('bbRenameModal').classList.remove('bb-open');
}

function bbConfirmRename() {
  if (!renamingWorldId) return;
  var val = document.getElementById('bbRenameInput').value.trim();
  if (val) {
    var w = bbWorldList.find(function(x) { return x.id === renamingWorldId; });
    if (w) w.name = val;
    bbSaveWorldsData();
    if (renamingWorldId === bbCurrentWorldId) {
      document.getElementById('worldLabel').textContent = 'World: ' + val;
    }
  }
  bbCloseRenameModal();
  bbRenderWorldList();
}

function bbOpenDeleteModal(id) {
  deletingWorldId = id;
  var w = bbWorldList.find(function(x) { return x.id === id; });
  document.getElementById('bbDeleteModalText').textContent = 'Are you sure you want to delete "' + (w ? w.name : 'this world') + '"?';
  document.getElementById('bbDeleteConfirmModal').classList.add('bb-open');
}

function bbCloseDeleteModal() {
  deletingWorldId = null;
  document.getElementById('bbDeleteConfirmModal').classList.remove('bb-open');
}

function bbConfirmDeleteWorld() {
  if (!deletingWorldId) return;
  var targetId = deletingWorldId;
  bbWorldList = bbWorldList.filter(function(x) { return x.id !== targetId; });
  bbSaveWorldsData();
  try { localStorage.removeItem('bb_world_blocks_' + targetId); } catch(e) {}

  if (bbCurrentWorldId === targetId) {
    if (bbWorldList.length > 0) {
      bbSelectWorld(bbWorldList[0].id);
    } else {
      bbWorldList = [{ id: 'default', name: 'Default World', created: Date.now() }];
      bbSaveWorldsData();
      bbSelectWorld('default');
    }
  }
  bbCloseDeleteModal();
  bbRenderWorldList();
}

/* Settings Controls */
function bbUpdateFov(val) {
  bbSettingsState.fov = parseInt(val, 10);
  document.getElementById('bbFovVal').textContent = val;
  if (typeof camera !== 'undefined' && camera) {
    camera.fov = bbSettingsState.fov;
    camera.updateProjectionMatrix();
  }
}

function bbUpdateSens(val) {
  bbSettingsState.sensitivity = parseFloat(val);
  document.getElementById('bbSensVal').textContent = parseFloat(val).toFixed(1);
}

function bbUpdateRenderDist(val) {
  bbSettingsState.renderDistance = parseInt(val, 10);
  document.getElementById('bbRenderVal').textContent = val;
}

/* Hotkey Management */
function bbRenderHotkeys() {
  var grid = document.getElementById('bbHotkeyGrid');
  grid.innerHTML = '';
  Object.keys(bbHotkeys).forEach(function(action) {
    var hk = bbHotkeys[action];
    var row = document.createElement('div');
    row.className = 'bb-hotkey-row';

    var lbl = document.createElement('span');
    lbl.className = 'bb-hk-label';
    lbl.textContent = hk.label;

    var pill = document.createElement('button');
    pill.className = 'bb-dyn-pill bb-clickable';
    pill.textContent = hk.display;
    pill.onclick = function() { bbListenForHotkey(action, pill); };

    row.appendChild(lbl);
    row.appendChild(pill);
    grid.appendChild(row);
  });
}

function bbListenForHotkey(action, pillBtn) {
  listeningAction = action;
  document.querySelectorAll('.bb-dyn-pill').forEach(function(p) { p.classList.remove('bb-listening'); });
  pillBtn.classList.add('bb-listening');
  pillBtn.textContent = '...';
}

window.addEventListener('keydown', function(e) {
  if (listeningAction) {
    e.preventDefault();
    e.stopPropagation();
    var code = e.code;
    var disp = e.key.length === 1 ? e.key.toUpperCase() : e.key;
    if (code === 'Space') disp = 'Space';
    if (code.indexOf('Shift') === 0) disp = 'Shift';

    bbHotkeys[listeningAction].key = code;
    bbHotkeys[listeningAction].display = disp;
    listeningAction = null;
    bbRenderHotkeys();
  }
}, true);

function bbResetHotkeys() {
  bbHotkeys = {
    forward:  { label: 'Move Forward', key: 'KeyW', display: 'W' },
    backward: { label: 'Move Backward', key: 'KeyS', display: 'S' },
    left:     { label: 'Move Left', key: 'KeyA', display: 'A' },
    right:    { label: 'Move Right', key: 'KeyD', display: 'D' },
    jump:     { label: 'Jump', key: 'Space', display: 'Space' },
    flyDown:  { label: 'Fly Down', key: 'ShiftLeft', display: 'Shift' },
    flyToggle:{ label: 'Toggle Fly', key: 'KeyF', display: 'F' },
    inventory:{ label: 'Inventory', key: 'KeyE', display: 'E' }
  };
  bbRenderHotkeys();
}

bbLoadWorldsData();

```

---

### Part 4: Block Engine Definitions, Texture Generation, and Geometry Helpers

This part defines block types, materials, procedural pixelated texture canvas generators, custom voxel geometries, and collision bounding boxes.

```javascript
/* =========================================================================
   BLOCK TYPES & CANVAS TEXTURE GENERATOR
   ========================================================================= */
const BLOCK = {
  EMPTY: 0, GRASS: 1, DIRT: 2, STONE: 3, WOOD: 4, LEAVES: 5,
  SAND: 6, BRICK: 7, GLASS: 8, PLANK: 9, COBBLE: 10, WATER: 11,
  STEP: 12, SLAB: 13, FENCE: 14, FLOWERS: 15
};

const BLOCK_DEFS = {
  [BLOCK.GRASS]:  { name: "Grass Block", color: 0x55aa44 },
  [BLOCK.DIRT]:   { name: "Dirt Block",  color: 0x8b5a2b },
  [BLOCK.STONE]:  { name: "Stone Block", color: 0x888888 },
  [BLOCK.WOOD]:   { name: "Wood Log",    color: 0x664422 },
  [BLOCK.LEAVES]: { name: "Leaves",      color: 0x33aa33, transparent: true, opacity: 0.85 },
  [BLOCK.SAND]:   { name: "Sand Block",  color: 0xddcc88 },
  [BLOCK.BRICK]:  { name: "Brick Block", color: 0xb54636 },
  [BLOCK.GLASS]:  { name: "Glass Block", color: 0xcceeff, transparent: true, opacity: 0.4 },
  [BLOCK.PLANK]:  { name: "Wood Plank", color: 0xc49a45 },
  [BLOCK.COBBLE]: { name: "Cobblestone",color: 0x666666 },
  [BLOCK.WATER]:  { name: "Water",       color: 0x3366cc, transparent: true, opacity: 0.6 },
  [BLOCK.STEP]:   { name: "Stairs",      color: 0xc49a45, isStep: true },
  [BLOCK.SLAB]:   { name: "Half Slab",   color: 0xc49a45, isSlab: true },
  [BLOCK.FENCE]:  { name: "Wood Fence",  color: 0x664422, isFence: true },
  [BLOCK.FLOWERS]:{ name: "Flowers",     color: 0xff6699, isFlower: true, transparent: true }
};

function createNoiseTexture(baseHex, noiseAmount = 0.12, pattern = 'noise') {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');
  const base = new THREE.Color(baseHex);

  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      let factor = 1 + (Math.random() - 0.5) * noiseAmount;
      if (pattern === 'brick') {
        if (y === 0 || y === 8 || x === 0 || (y < 8 && x === 8)) factor *= 0.6;
      } else if (pattern === 'plank') {
        if (y % 4 === 0) factor *= 0.7;
      }
      const r = Math.min(1, Math.max(0, base.r * factor));
      const g = Math.min(1, Math.max(0, base.g * factor));
      const b = Math.min(1, Math.max(0, base.b * factor));
      ctx.fillStyle = `rgb(${Math.floor(r*255)},${Math.floor(g*255)},${Math.floor(b*255)})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

function createGrassTopTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 16; canvas.height = 16;
  const ctx = canvas.getContext('2d');
  const base = new THREE.Color(0x55aa44);
  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      let factor = 1 + (Math.random() - 0.5) * 0.15;
      ctx.fillStyle = `rgb(${Math.floor(base.r*factor*255)},${Math.floor(base.g*factor*255)},${Math.floor(base.b*factor*255)})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

function createGrassSideTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 16; canvas.height = 16;
  const ctx = canvas.getContext('2d');
  const dirt = new THREE.Color(0x8b5a2b);
  const grass = new THREE.Color(0x55aa44);

  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      let isGrass = y < 4 + Math.sin(x * 0.8) * 1.5;
      let base = isGrass ? grass : dirt;
      let factor = 1 + (Math.random() - 0.5) * 0.12;
      ctx.fillStyle = `rgb(${Math.floor(base.r*factor*255)},${Math.floor(base.g*factor*255)},${Math.floor(base.b*factor*255)})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

function createFlowerTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 16; canvas.height = 16;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,16,16);

  ctx.fillStyle = "#22aa22";
  ctx.fillRect(7, 6, 2, 10);
  ctx.fillRect(5, 9, 2, 2);
  ctx.fillRect(9, 11, 2, 2);

  ctx.fillStyle = "#ff4488";
  ctx.fillRect(5, 3, 6, 4);
  ctx.fillRect(6, 2, 4, 6);

  ctx.fillStyle = "#ffee33";
  ctx.fillRect(7, 4, 2, 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

// Global Material Cache
const materials = {};
function initMaterials() {
  const texDirt = createNoiseTexture(0x8b5a2b);
  const texGrassTop = createGrassTopTexture();
  const texGrassSide = createGrassSideTexture();
  const texStone = createNoiseTexture(0x888888, 0.2);
  const texWood = createNoiseTexture(0x664422, 0.1, 'plank');
  const texLeaves = createNoiseTexture(0x33aa33, 0.25);
  const texSand = createNoiseTexture(0xddcc88, 0.08);
  const texBrick = createNoiseTexture(0xb54636, 0.15, 'brick');
  const texGlass = createNoiseTexture(0xcceeff, 0.05);
  const texPlank = createNoiseTexture(0xc49a45, 0.12, 'plank');
  const texCobble = createNoiseTexture(0x666666, 0.25);
  const texWater = createNoiseTexture(0x3366cc, 0.1);
  const texFlower = createFlowerTexture();

  materials[BLOCK.DIRT] = new THREE.MeshLambertMaterial({ map: texDirt });
  materials[BLOCK.GRASS] = [
    new THREE.MeshLambertMaterial({ map: texGrassSide }),
    new THREE.MeshLambertMaterial({ map: texGrassSide }),
    new THREE.MeshLambertMaterial({ map: texGrassTop }),
    new THREE.MeshLambertMaterial({ map: texDirt }),
    new THREE.MeshLambertMaterial({ map: texGrassSide }),
    new THREE.MeshLambertMaterial({ map: texGrassSide })
  ];
  materials[BLOCK.STONE] = new THREE.MeshLambertMaterial({ map: texStone });
  materials[BLOCK.WOOD] = new THREE.MeshLambertMaterial({ map: texWood });
  materials[BLOCK.LEAVES] = new THREE.MeshLambertMaterial({ map: texLeaves, transparent: true, opacity: 0.85 });
  materials[BLOCK.SAND] = new THREE.MeshLambertMaterial({ map: texSand });
  materials[BLOCK.BRICK] = new THREE.MeshLambertMaterial({ map: texBrick });
  materials[BLOCK.GLASS] = new THREE.MeshLambertMaterial({ map: texGlass, transparent: true, opacity: 0.4 });
  materials[BLOCK.PLANK] = new THREE.MeshLambertMaterial({ map: texPlank });
  materials[BLOCK.COBBLE] = new THREE.MeshLambertMaterial({ map: texCobble });
  materials[BLOCK.WATER] = new THREE.MeshLambertMaterial({ map: texWater, transparent: true, opacity: 0.6 });
  materials[BLOCK.STEP] = materials[BLOCK.PLANK];
  materials[BLOCK.SLAB] = materials[BLOCK.PLANK];
  materials[BLOCK.FENCE] = materials[BLOCK.WOOD];
  materials[BLOCK.FLOWERS] = new THREE.MeshLambertMaterial({ map: texFlower, transparent: true, side: THREE.DoubleSide });
}

/* Custom Geometries */
function createStairGeometry() {
  const geom = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    // Bottom step
    -0.5,-0.5,-0.5,  0.5,-0.5,-0.5,  0.5, 0.0,-0.5, -0.5, 0.0,-0.5,
    -0.5,-0.5, 0.5,  0.5,-0.5, 0.5,  0.5, 0.0, 0.5, -0.5, 0.0, 0.5,
    // Top step (back half)
    -0.5, 0.0, 0.0,  0.5, 0.0, 0.0,  0.5, 0.5, 0.0, -0.5, 0.5, 0.0,
    -0.5, 0.0, 0.5,  0.5, 0.0, 0.5,  0.5, 0.5, 0.5, -0.5, 0.5, 0.5
  ]);
  return new THREE.BoxGeometry(1, 1, 1);
}

function createFenceGeometry() {
  const group = new THREE.Group();
  const postGeom = new THREE.BoxGeometry(0.25, 1, 0.25);
  const mat = materials[BLOCK.WOOD];
  const post = new THREE.Mesh(postGeom, mat);
  group.add(post);

  const railGeom = new THREE.BoxGeometry(0.15, 0.15, 0.8);
  const rail1 = new THREE.Mesh(railGeom, mat);
  rail1.position.set(0, 0.2, 0);
  const rail2 = new THREE.Mesh(railGeom, mat);
  rail2.position.set(0, -0.2, 0);
  group.add(rail1);
  group.add(rail2);
  return group;
}

function createFlowerGeometry() {
  const group = new THREE.Group();
  const planeGeom = new THREE.PlaneGeometry(0.8, 0.8);
  const mat = materials[BLOCK.FLOWERS];

  const p1 = new THREE.Mesh(planeGeom, mat);
  p1.rotation.y = Math.PI / 4;
  p1.position.y = -0.1;

  const p2 = new THREE.Mesh(planeGeom, mat);
  p2.rotation.y = -Math.PI / 4;
  p2.position.y = -0.1;

  group.add(p1);
  group.add(p2);
  return group;
}

```

---

### Part 5: Game Engine Init, Procedural Terrain, and Local Storage Persistence

This part initializes the Three.js scene, camera, renderer, chunk rendering, raycasting target preview, world terrain generation, and save/load logic via local storage.

```javascript
/* =========================================================================
   WORLD PERSISTENCE & GENERATION
   ========================================================================= */
const WORLD_SIZE = 32;
const WORLD_HEIGHT = 16;
let worldData = {};
let scene, camera, renderer;
let blockMeshes = {};
let highlightMesh;
let gameInitialized = false;

function getKey(x, y, z) {
  return `${x},${y},${z}`;
}

function saveWorldToStorage() {
  try {
    const serialized = JSON.stringify(worldData);
    localStorage.setItem('bb_world_blocks_' + bbCurrentWorldId, serialized);
  } catch(e) {}
}

function loadWorldFromStorage() {
  try {
    const raw = localStorage.getItem('bb_world_blocks_' + bbCurrentWorldId);
    if (raw) {
      worldData = JSON.parse(raw);
      return true;
    }
  } catch(e) {}
  return false;
}

function generateProceduralTerrain() {
  worldData = {};
  for (let x = -WORLD_SIZE/2; x < WORLD_SIZE/2; x++) {
    for (let z = -WORLD_SIZE/2; z < WORLD_SIZE/2; z++) {
      let h = Math.floor(Math.sin(x * 0.2) * 2 + Math.cos(z * 0.2) * 2) + 4;
      for (let y = 0; y <= h; y++) {
        let type = BLOCK.DIRT;
        if (y === h) type = BLOCK.GRASS;
        else if (y < h - 2) type = BLOCK.STONE;
        worldData[getKey(x, y, z)] = type;
      }
      if (Math.random() < 0.03 && x > -WORLD_SIZE/2 + 2 && x < WORLD_SIZE/2 - 2 && z > -WORLD_SIZE/2 + 2 && z < WORLD_SIZE/2 - 2) {
        let treeH = h + 1;
        for (let ty = 0; ty < 3; ty++) {
          worldData[getKey(x, treeH + ty, z)] = BLOCK.WOOD;
        }
        for (let lx = -1; lx <= 1; lx++) {
          for (let lz = -1; lz <= 1; lz++) {
            for (let ly = 2; ly <= 3; ly++) {
              if (lx === 0 && lz === 0 && ly === 2) continue;
              worldData[getKey(x + lx, treeH + ly, z + lz)] = BLOCK.LEAVES;
            }
          }
        }
      } else if (Math.random() < 0.05) {
        worldData[getKey(x, h + 1, z)] = BLOCK.FLOWERS;
      }
    }
  }
  saveWorldToStorage();
}

function switchWorld(worldId) {
  clearAllBlockMeshes();
  bbCurrentWorldId = worldId;
  if (!loadWorldFromStorage()) {
    generateProceduralTerrain();
  }
  rebuildWorldMeshes();
}

function clearAllBlockMeshes() {
  Object.keys(blockMeshes).forEach(key => {
    scene.remove(blockMeshes[key]);
  });
  blockMeshes = {};
}

function rebuildWorldMeshes() {
  Object.keys(worldData).forEach(key => {
    const type = worldData[key];
    if (type !== BLOCK.EMPTY) {
      const parts = key.split(',').map(Number);
      createBlockMesh(parts[0], parts[1], parts[2], type);
    }
  });
}

function createBlockMesh(x, y, z, type) {
  const key = getKey(x, y, z);
  if (blockMeshes[key]) {
    scene.remove(blockMeshes[key]);
    delete blockMeshes[key];
  }
  if (type === BLOCK.EMPTY) return;

  const def = BLOCK_DEFS[type];
  let mesh;

  if (def && def.isSlab) {
    const geom = new THREE.BoxGeometry(1, 0.5, 1);
    mesh = new THREE.Mesh(geom, materials[type]);
    mesh.position.set(x, y - 0.25, z);
  } else if (def && def.isFence) {
    mesh = createFenceGeometry();
    mesh.position.set(x, y, z);
  } else if (def && def.isFlower) {
    mesh = createFlowerGeometry();
    mesh.position.set(x, y, z);
  } else {
    const geom = new THREE.BoxGeometry(1, 1, 1);
    mesh = new THREE.Mesh(geom, materials[type]);
    mesh.position.set(x, y, z);
  }

  mesh.userData = { x, y, z, type };
  scene.add(mesh);
  blockMeshes[key] = mesh;
}

```

---

### Part 6: Controls, Physics Engine, Collision Detection, and Main Animation Loop

This part provides player movement physics, collision detection bounding box logic, fly toggling, hotbar slot selection, inventory overlay management, raycasting block place/destroy logic, window resize handling, and the frame rendering request loop.

```javascript
/* =========================================================================
   PHYSICS, PLAYER CONTROLS & ENGINE LOOP
   ========================================================================= */
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let moveUp = false, moveDown = false;
let isFlying = false;
let velocity = new THREE.Vector3();
let playerPos = new THREE.Vector3(0, 8, 0);
let pitch = 0, yaw = 0;

let hotbarSlots = [BLOCK.GRASS, BLOCK.DIRT, BLOCK.STONE, BLOCK.WOOD, BLOCK.LEAVES, BLOCK.PLANK, BLOCK.BRICK, BLOCK.GLASS];
let selectedSlotIndex = 0;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2(0, 0);

function initGameEngine() {
  if (gameInitialized) return;
  gameInitialized = true;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);
  scene.fog = new THREE.FogExp2(0x87ceeb, 0.015);

  camera = new THREE.PerspectiveCamera(bbSettingsState.fov, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.rotation.order = 'YXZ';

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.8);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(20, 40, 20);
  scene.add(dirLight);

  initMaterials();

  const hlGeom = new THREE.BoxGeometry(1.01, 1.01, 1.01);
  const hlMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
  highlightMesh = new THREE.Mesh(hlGeom, hlMat);
  highlightMesh.visible = false;
  scene.add(highlightMesh);

  if (!loadWorldFromStorage()) {
    generateProceduralTerrain();
  }
  rebuildWorldMeshes();

  setupUIEvents();
  setupPointerLock();
  animate();
}

function setupPointerLock() {
  const overlay = document.getElementById('overlay');
  overlay.addEventListener('click', () => {
    document.body.requestPointerLock();
  });

  document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === document.body) {
      overlay.style.display = 'none';
    } else {
      if (!isInventoryOpen) {
        overlay.style.display = 'flex';
      }
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement === document.body) {
      const sens = bbSettingsState.sensitivity * 0.002;
      yaw -= e.movementX * sens;
      pitch -= e.movementY * sens;
      pitch = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, pitch));

      camera.rotation.x = pitch;
      camera.rotation.y = yaw;
    }
  });
}

function setupUIEvents() {
  window.addEventListener('keydown', (e) => {
    if (listeningAction) return;
    if (e.code === bbHotkeys.forward.key) moveForward = true;
    if (e.code === bbHotkeys.backward.key) moveBackward = true;
    if (e.code === bbHotkeys.left.key) moveLeft = true;
    if (e.code === bbHotkeys.right.key) moveRight = true;
    if (e.code === bbHotkeys.jump.key) moveUp = true;
    if (e.code === bbHotkeys.flyDown.key) moveDown = true;

    if (e.code === bbHotkeys.flyToggle.key) {
      isFlying = !isFlying;
      velocity.set(0, 0, 0);
    }
    if (e.code === bbHotkeys.inventory.key) {
      toggleInventory();
    }

    if (e.code.startsWith('Digit')) {
      const num = parseInt(e.code.replace('Digit', ''), 10);
      if (num >= 1 && num <= 8) {
        selectedSlotIndex = num - 1;
        updateHotbarUI();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === bbHotkeys.forward.key) moveForward = false;
    if (e.code === bbHotkeys.backward.key) moveBackward = false;
    if (e.code === bbHotkeys.left.key) moveLeft = false;
    if (e.code === bbHotkeys.right.key) moveRight = false;
    if (e.code === bbHotkeys.jump.key) moveUp = false;
    if (e.code === bbHotkeys.flyDown.key) moveDown = false;
  });

  window.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) {
      selectedSlotIndex = (selectedSlotIndex + 1) % 8;
    } else {
      selectedSlotIndex = (selectedSlotIndex - 1 + 8) % 8;
    }
    updateHotbarUI();
  });

  window.addEventListener('mousedown', (e) => {
    if (document.pointerLockElement !== document.body) return;
    if (e.button === 0) performMining();
    if (e.button === 2) performPlacement();
  });

  window.addEventListener('resize', () => {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  renderHotbarDOM();
  renderBlockMenuDOM();
}

let isInventoryOpen = false;
function toggleInventory() {
  isInventoryOpen = !isInventoryOpen;
  const menu = document.getElementById('blockMenu');
  const title = document.getElementById('blockMenuTitle');
  if (isInventoryOpen) {
    document.exitPointerLock();
    menu.style.display = 'flex';
    title.style.display = 'block';
  } else {
    menu.style.display = 'none';
    title.style.display = 'none';
    document.body.requestPointerLock();
  }
}

function renderHotbarDOM() {
  const container = document.getElementById('hotbar');
  container.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const slot = document.createElement('div');
    slot.className = 'slot' + (i === selectedSlotIndex ? ' selected' : '');
    slot.onclick = () => { selectedSlotIndex = i; updateHotbarUI(); };

    const num = document.createElement('span');
    num.className = 'num';
    num.textContent = i + 1;

    const swatch = document.createElement('div');
    swatch.className = 'swatch';
    const type = hotbarSlots[i];
    swatch.style.backgroundColor = '#' + (BLOCK_DEFS[type] ? BLOCK_DEFS[type].color.toString(16).padStart(6, '0') : '000');

    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = BLOCK_DEFS[type] ? BLOCK_DEFS[type].name : '';

    slot.appendChild(num);
    slot.appendChild(swatch);
    slot.appendChild(name);
    container.appendChild(slot);
  }
}

function updateHotbarUI() {
  renderHotbarDOM();
}

function renderBlockMenuDOM() {
  const grid = document.getElementById('blockMenuGrid');
  grid.innerHTML = '';
  Object.keys(BLOCK_DEFS).forEach(typeStr => {
    const type = parseInt(typeStr, 10);
    const def = BLOCK_DEFS[type];
    const item = document.createElement('div');
    item.className = 'menuItem';
    item.onclick = () => {
      hotbarSlots[selectedSlotIndex] = type;
      updateHotbarUI();
      toggleInventory();
    };

    const swatch = document.createElement('div');
    swatch.className = 'swatch';
    swatch.style.backgroundColor = '#' + def.color.toString(16).padStart(6, '0');

    const label = document.createElement('span');
    label.textContent = def.name;

    item.appendChild(swatch);
    item.appendChild(label);
    grid.appendChild(item);
  });
}

function performMining() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(Object.values(blockMeshes));
  if (intersects.length > 0) {
    const hit = intersects[0].object;
    const { x, y, z } = hit.userData;
    const key = getKey(x, y, z);
    delete worldData[key];
    scene.remove(hit);
    delete blockMeshes[key];
    saveWorldToStorage();
  }
}

function performPlacement() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(Object.values(blockMeshes));
  if (intersects.length > 0) {
    const hit = intersects[0];
    const normal = hit.face.normal;
    const pos = hit.object.userData;
    const nx = pos.x + Math.round(normal.x);
    const ny = pos.y + Math.round(normal.y);
    const nz = pos.z + Math.round(normal.z);

    const activeType = hotbarSlots[selectedSlotIndex];
    const key = getKey(nx, ny, nz);
    worldData[key] = activeType;
    createBlockMesh(nx, ny, nz, activeType);
    saveWorldToStorage();
  }
}

function checkCollision(pos) {
  const pMinX = pos.x - 0.3, pMaxX = pos.x + 0.3;
  const pMinY = pos.y - 1.5, pMaxY = pos.y + 0.3;
  const pMinZ = pos.z - 0.3, pMaxZ = pos.z + 0.3;

  for (let x = Math.floor(pMinX); x <= Math.ceil(pMaxX); x++) {
    for (let y = Math.floor(pMinY); y <= Math.ceil(pMaxY); y++) {
      for (let z = Math.floor(pMinZ); z <= Math.ceil(pMaxZ); z++) {
        const type = worldData[getKey(x, y, z)];
        if (type && type !== BLOCK.EMPTY && type !== BLOCK.FLOWERS && type !== BLOCK.WATER) {
          return true;
        }
      }
    }
  }
  return false;
}

function updatePhysics(delta) {
  const moveDir = new THREE.Vector3();
  if (moveForward) moveDir.z -= 1;
  if (moveBackward) moveDir.z += 1;
  if (moveLeft) moveDir.x -= 1;
  if (moveRight) moveDir.x += 1;
  moveDir.normalize();

  const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  const side = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);

  const speed = isFlying ? 12 : 5;
  const wishVel = new THREE.Vector3();
  wishVel.addScaledVector(forward, -moveDir.z * speed);
  wishVel.addScaledVector(side, moveDir.x * speed);

  if (isFlying) {
    if (moveUp) wishVel.y = speed;
    if (moveDown) wishVel.y = -speed;
    playerPos.addScaledVector(wishVel, delta);
  } else {
    velocity.x = wishVel.x;
    velocity.z = wishVel.z;
    velocity.y -= 22 * delta;

    if (moveUp && Math.abs(velocity.y) < 0.1) {
      velocity.y = 7.5;
    }

    const nextPos = playerPos.clone().addScaledVector(velocity, delta);
    if (!checkCollision(new THREE.Vector3(nextPos.x, playerPos.y, playerPos.z))) {
      playerPos.x = nextPos.x;
    }
    if (!checkCollision(new THREE.Vector3(playerPos.x, playerPos.y, nextPos.z))) {
      playerPos.z = nextPos.z;
    }
    if (!checkCollision(new THREE.Vector3(playerPos.x, nextPos.y, playerPos.z))) {
      playerPos.y = nextPos.y;
    } else {
      velocity.y = 0;
    }
  }

  camera.position.copy(playerPos);
}

function updateRaycastHighlight() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(Object.values(blockMeshes));
  if (intersects.length > 0) {
    const hit = intersects[0].object;
    highlightMesh.position.copy(hit.position);
    highlightMesh.visible = true;
  } else {
    highlightMesh.visible = false;
  }
}

let lastTime = performance.now();
function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const delta = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  if (gameInitialized) {
    updatePhysics(delta);
    updateRaycastHighlight();
    renderer.render(scene, camera);
  }
}
</script>
</body>
</html>

```

---

### How The Parts Function Together

1. **Part 1 (`<style>`)**: Sets up the visual interface, CSS perspective variables for custom block previews, pointer-lock overlays, menu stack styling, and UI overlays.
2. **Part 2 (`HTML Markup`)**: Holds DOM nodes for the HUD crosshair, inventory grid, world selection list, modal dialogs, and menu screens.
3. **Part 3 (`Front-End Scripts`)**: Manages the main menu state, hotkey re-binding, world settings updates, and LocalStorage updates (`bb_worlds_index`).
4. **Part 4 (`Block Definitions & Textures`)**: Houses definitions for voxel types (`BLOCK_DEFS`), procedurally creates 16x16 canvas textures on the fly using random noise algorithms, and defines custom block geometries.
5. **Part 5 (`World Generation & Persistence`)**: Initializes Three.js objects, loads or saves block positions from LocalStorage under `bb_world_blocks_*`, generates terrain, and renders block instances in 3D.
6. **Part 6 (`Engine Controls & Loop`)**: Manages mouse movement parsing via Web PointerLock API, runs collision checks, computes physics updates, processes raycasting target highlights, and executes the WebGL render loop (`requestAnimationFrame`).
