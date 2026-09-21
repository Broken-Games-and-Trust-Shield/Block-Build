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
