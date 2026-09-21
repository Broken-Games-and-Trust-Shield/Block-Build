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
