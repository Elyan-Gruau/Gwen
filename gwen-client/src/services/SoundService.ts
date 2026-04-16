type Tone = { freq: number; duration: number; delay?: number; type?: OscillatorType };

class SoundService {
  private ctx: AudioContext | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    // Resume if suspended (browser autoplay policy)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private playTone({ freq, duration, delay = 0, type = 'sine' }: Tone, volume = 0.3): void {
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    } catch {
      // Silently ignore audio errors
    }
  }

  private playSequence(tones: Tone[], volume?: number): void {
    tones.forEach((tone) => this.playTone(tone, volume));
  }

  playCardPlace(): void {
    this.playTone({ freq: 440, duration: 0.12, type: 'triangle' }, 0.25);
    this.playTone({ freq: 600, duration: 0.08, delay: 0.06, type: 'triangle' }, 0.15);
  }

  playPassTurn(): void {
    this.playSequence([
      { freq: 330, duration: 0.15, type: 'sine' },
      { freq: 262, duration: 0.2, delay: 0.1, type: 'sine' },
    ], 0.2);
  }

  playRoundWin(): void {
    this.playSequence([
      { freq: 523, duration: 0.15, type: 'triangle' },
      { freq: 659, duration: 0.15, delay: 0.15, type: 'triangle' },
      { freq: 784, duration: 0.3, delay: 0.3, type: 'triangle' },
    ], 0.3);
  }

  playRoundLoss(): void {
    this.playSequence([
      { freq: 392, duration: 0.15, type: 'sine' },
      { freq: 330, duration: 0.15, delay: 0.15, type: 'sine' },
      { freq: 262, duration: 0.3, delay: 0.3, type: 'sine' },
    ], 0.25);
  }

  playGameWin(): void {
    this.playSequence([
      { freq: 523, duration: 0.12, type: 'triangle' },
      { freq: 659, duration: 0.12, delay: 0.13, type: 'triangle' },
      { freq: 784, duration: 0.12, delay: 0.26, type: 'triangle' },
      { freq: 1047, duration: 0.4, delay: 0.39, type: 'triangle' },
    ], 0.35);
  }

  playGameLoss(): void {
    this.playSequence([
      { freq: 392, duration: 0.2, type: 'sine' },
      { freq: 311, duration: 0.2, delay: 0.22, type: 'sine' },
      { freq: 262, duration: 0.4, delay: 0.44, type: 'sine' },
    ], 0.3);
  }

  playTimerTick(): void {
    this.playTone({ freq: 880, duration: 0.05, type: 'square' }, 0.1);
  }
}

export const soundService = new SoundService();
