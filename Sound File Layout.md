### Sound System Overview

Web Audio API generates sounds dynamically using code (no external MP3/WAV files required).

* **AudioContext**: Manages the main sound environment and master gain node.
* **Oscillators & Noise Buffers**: Synthesizes basic wave tones (sine, square) and white noise.
* **Gain & Filter Nodes**: Controls pitch, volume envelopes (fade-outs), and acoustic frequencies.

---

### Sound Layout & Definitions

| Event | Waveform / Type | Frequency / Pitch | Purpose |
| --- | --- | --- | --- |
| **Block Place** | Square Wave | $150\text{ Hz} \rightarrow 80\text{ Hz}$ | Quick low-pitch thud |
| **Block Destroy** | Noise Buffer + Filter | Bandpass Filter ($800\text{ Hz}$) | Crunchy breaking effect |
| **Player Jump** | Sine Wave | $180\text{ Hz} \rightarrow 350\text{ Hz}$ | Rising sweep |
| **Footstep** | Low Noise Pulse | Lowpass Filter ($400\text{ Hz}$) | Soft, short impact |

---

### Audio Code Implementation

Add this sound controller script to `app.js` or include it as a separate module:

```javascript
// Sound Controller using Web Audio API
class SoundManager {
  constructor() {
    this.ctx = null;
  }

  // AudioContext must be initialized after a user interaction
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Play a synthesized block placement sound (quick low thud)
  playPlace() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Play a synthesized block destroy sound (filtered noise)
  playDestroy() {
    this.init();
    const bufferSize = this.ctx.sampleRate * 0.1; // 100ms noise
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  // Play jump sound (rising frequency sweep)
  playJump() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(350, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }
}

const sounds = new SoundManager();

// Example Trigger Usage:
// document.addEventListener('mousedown', (e) => {
//   if (e.button === 0) sounds.playDestroy(); // Left Click
//   if (e.button === 2) sounds.playPlace();   // Right Click
// });

```
