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
