// Game initialization and logic goes here
console.log("Block Build Game initialized.");

// Example listener for start screen button
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("overlay");
  const playBtn = document.getElementById("btnPlay");
  const startScreen = document.getElementById("bbStart");

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      startScreen.classList.remove("bb-open");
    });
  }

  if (overlay) {
    overlay.addEventListener("click", () => {
      overlay.style.display = "none";
    });
  }
});
