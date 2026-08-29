import { LanguageId } from '../types';
import { LANGUAGES } from '../data/languages';

class SoundController {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  // Play a soft pleasant UI click or flip sound
  playFlipSound(enabled = true) {
    if (!enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // ignore
    }
  }

  // Play correct quiz answer chime
  playCorrectSound(enabled = true) {
    if (!enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.06);
        
        gain.gain.setValueAtTime(0.12, now + index * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.06 + 0.25);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + index * 0.06);
        osc.stop(now + index * 0.06 + 0.25);
      });
    } catch {
      // ignore
    }
  }

  // Play incorrect quiz sound
  playIncorrectSound(enabled = true) {
    if (!enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // ignore
    }
  }

  // Play level completion fanfare
  playCompletionFanfare(enabled = true) {
    if (!enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.5];
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      });
    } catch {
      // ignore
    }
  }
}

export const soundFx = new SoundController();

/**
 * Text-to-Speech pronunciation using native Web Speech API
 */
export function speakWord(text: string, languageId: LanguageId, rate = 0.9): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve(false);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // stop previous speech

      const langConfig = LANGUAGES[languageId];
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langConfig?.bcp47 || 'en-US';
      utterance.rate = rate;
      utterance.pitch = 1.0;

      // Try to find native voice
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const targetVoice = voices.find(v => v.lang.startsWith(langConfig?.code.toLowerCase() || '')) ||
                            voices.find(v => v.lang.includes(langConfig?.bcp47 || ''));
        if (targetVoice) {
          utterance.voice = targetVoice;
        }
      }

      utterance.onend = () => resolve(true);
      utterance.onerror = () => resolve(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      resolve(false);
    }
  });
}
