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
