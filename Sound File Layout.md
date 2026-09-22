### Folder Structure Overview

Place all audio files inside an `audio/` directory in your project root:

```text
project-root/
│
├── audio/
│   ├── blocks/
│   │   ├── break_grass.mp3
│   │   ├── break_stone.mp3
│   │   ├── break_wood.mp3
│   │   ├── place_grass.mp3
│   │   ├── place_stone.mp3
│   │   └── place_wood.mp3
│   ├── player/
│   │   ├── step_grass_1.mp3
│   │   ├── step_grass_2.mp3
│   │   ├── step_stone_1.mp3
│   │   └── jump.mp3
│   └── ui/
│       ├── click.mp3
│       └── select.mp3
│
├── index.html
├── style.css
└── app.js

```

---

### Complete Sound File Manifest

#### 1. Block Actions (`audio/blocks/`)

* **`break_grass.mp3`**: Plays when destroying dirt, grass, or plant blocks.
* **`break_stone.mp3`**: Plays when breaking stone, cobblestone, or brick blocks.
* **`break_wood.mp3`**: Plays when destroying wood logs or plank blocks.
* **`place_grass.mp3`**: Soft placement sound for soil and foliage.
* **`place_stone.mp3`**: Heavy click sound for stone-based blocks.
* **`place_wood.mp3`**: Medium impact sound for wooden blocks.

#### 2. Player Movement (`audio/player/`)

* **`step_grass_1.mp3`**: Alternating footstep sound 1 for walking on grass.
* **`step_grass_2.mp3`**: Alternating footstep sound 2 for walking on grass.
* **`step_stone_1.mp3`**: Hard footstep sound for stone surfaces.
* **`jump.mp3`**: Quick impulse/whoosh sound triggered on player jump (`Space`).

#### 3. User Interface (`audio/ui/`)

* **`click.mp3`**: Button click sound for front-end menu and screen navigation.
* **`select.mp3`**: Lightweight tick sound when scrolling or changing active hotbar slots (`1–9`).

---

### How to Load Sounds in `app.js`

You can pre-load these audio files using Web Audio or standard HTML5 `Audio` objects in JavaScript:

```javascript
// Sound Effect Registry
const sounds = {
  breakStone: new Audio('audio/blocks/break_stone.mp3'),
  placeStone: new Audio('audio/blocks/place_stone.mp3'),
  click: new Audio('audio/ui/click.mp3'),
  select: new Audio('audio/ui/select.mp3')
};

// Function to play sound with overlapping support
function playSound(name) {
  if (sounds[name]) {
    const soundClone = sounds[name].cloneNode();
    soundClone.volume = 0.5;
    soundClone.play().catch(() => {}); // Catches browser autoplay restrictions
  }
}

```
