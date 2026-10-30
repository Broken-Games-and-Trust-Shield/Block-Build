// Game State & Configuration
const state = {
    isPaused: true,
    activeSlot: 0,
    inventory: ['grass', 'dirt', 'stone', 'wood', 'leaves', 'brick', 'sand', 'glass', 'planks'],
    selectedBlock: 'grass'
};

// DOM References
const canvas = document.getElementById('gameCanvas');
const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('startBtn');
const blockMenu = document.getElementById('blockMenu');
const closeBlockMenu = document.getElementById('closeBlockMenu');
const hotbarSlots = document.querySelectorAll('#hotbar .slot');

// Pointer Lock & Pause Handler
function requestLock() {
    canvas.requestPointerLock();
}

startBtn.addEventListener('click', () => {
    requestLock();
});

document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === canvas) {
        state.isPaused = false;
        overlay.classList.add('hidden');
    } else {
        state.isPaused = true;
        overlay.classList.remove('hidden');
    }
});

// Input Handling
window.addEventListener('keydown', (e) => {
    // Hotbar selection (Keys 1-9)
    if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        selectHotbarSlot(index);
    }
    
    // Toggle Inventory Menu (E or B)
    if ((e.key.toLowerCase() === 'e' || e.key.toLowerCase() === 'b') && !state.isPaused) {
        blockMenu.classList.toggle('hidden');
    }
});

// Mouse Scroll Hotbar Navigation
window.addEventListener('wheel', (e) => {
    if (state.isPaused) return;
    if (e.deltaY > 0) {
        selectHotbarSlot((state.activeSlot + 1) % 9);
    } else {
        selectHotbarSlot((state.activeSlot - 1 + 9) % 9);
    }
});

// Select Hotbar Slot
function selectHotbarSlot(index) {
    hotbarSlots[state.activeSlot].classList.remove('selected');
    state.activeSlot = index;
    hotbarSlots[state.activeSlot].classList.add('selected');
    state.selectedBlock = state.inventory[index];
}

// Slot Click Listeners
hotbarSlots.forEach((slot, idx) => {
    slot.addEventListener('click', () => selectHotbarSlot(idx));
});

closeBlockMenu.addEventListener('click', () => {
    blockMenu.classList.add('hidden');
});

// Primary Game Loop (Rendering & Controls Placeholder)
function gameLoop() {
    if (!state.isPaused) {
        // Update physics, camera rotation, and block rendering here
    }
    requestAnimationFrame(gameLoop);
}

// Start Main Loop
requestAnimationFrame(gameLoop);
