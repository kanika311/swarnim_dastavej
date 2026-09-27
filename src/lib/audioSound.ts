/**
 * Realistic procedural page turnover sound generator using Web Audio API
 * No external MP3 files required; instant execution with zero latency.
 */
let audioCtx: AudioContext | null = null;

export function playPageTurnSound() {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const ctx = audioCtx;
    const duration = 0.22; // 220ms page swoosh
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const channelData = buffer.getChannelData(0);

    // Generate textured noise resembling paper friction
    for (let i = 0; i < bufferSize; i++) {
      const progress = i / bufferSize;
      // Exponential decay envelope with subtle paper grain modulation
      const envelope = Math.sin(progress * Math.PI) * Math.exp(-progress * 2.5);
      const grain = (Math.random() * 2 - 1) * 0.8 + ((i % 17) / 17 - 0.5) * 0.2;
      channelData[i] = grain * envelope;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Bandpass filter to simulate newspaper sheet acoustic response (1200Hz - 2400Hz)
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1600, ctx.currentTime);
    bandpass.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + duration);
    bandpass.Q.setValueAtTime(1.5, ctx.currentTime);

    // Highpass to eliminate low thumps
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(400, ctx.currentTime);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.01, ctx.currentTime + duration);

    noiseSource.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start();
  } catch (e) {
    // Graceful fallback if audio is blocked by user browser settings
  }
}
