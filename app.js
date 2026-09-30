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
