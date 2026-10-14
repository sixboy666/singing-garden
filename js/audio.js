/* ============================================================
   SINGING GARDEN v9 — AUDIO ENGINE
   Web Audio synthesis: formant vowel singing, ambient pad,
   watered harmonies, silly SFX, conduct-mode melody
   ============================================================ */

var VOICE_FORMANTS = {
    airy:    { vowels: [{f:800,q:8},{f:1200,q:6},{f:2500,q:4}], gain: 0.18 },
    warm:    { vowels: [{f:500,q:10},{f:900,q:7},{f:2300,q:5}], gain: 0.22 },
    bright:  { vowels: [{f:700,q:6},{f:1500,q:5},{f:3000,q:4}], gain: 0.16 },
    crystal: { vowels: [{f:1000,q:4},{f:2000,q:3},{f:3500,q:3}], gain: 0.14 },
    smooth:  { vowels: [{f:600,q:9},{f:1100,q:6},{f:2400,q:5}], gain: 0.20 },
    mellow:  { vowels: [{f:550,q:10},{f:1000,q:7},{f:2200,q:5}], gain: 0.21 },
    deep:    { vowels: [{f:350,q:12},{f:700,q:9},{f:1800,q:6}], gain: 0.24 }
};

var SYLLABLES = ['La', 'Lu', 'Li', 'Lo', 'Le', 'Ma', 'Na', 'Da', 'Ba', 'Ya'];

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.master = null;
        this.muted = false;
        this.padNodes = [];
        this.padGain = null;
        this.padPlaying = false;
    }

    init() {
        if (this.ctx) return;
        var AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.8;
        this.master.connect(this.ctx.destination);
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    }

    setMuted(m) {
        this.muted = m;
        if (this.master) this.master.gain.value = m ? 0 : 0.8;
    }

    now() { return this.ctx ? this.ctx.currentTime : 0; }

    /* ---------- Formant vowel singing ---------- */
    singPhrase(plantId, notes, waterLevel, opts) {
        if (!this.ctx) return [];
        opts = opts || {};
        var voice = VOICE_FORMANTS[plantId] || VOICE_FORMANTS.airy;
        /* Look up the plant's voice type from its audio config when possible */
        var voiceType = 'airy';
        if (typeof PLANT_TYPES !== 'undefined') {
            var p = getPlantById(plantId);
            if (p) voiceType = p.audio.voice || 'airy';
        }
        voice = VOICE_FORMANTS[voiceType] || VOICE_FORMANTS.airy;

        var transpose = opts.transpose || 0;
        var stepMs = opts.stepMs || 220;
        var sylls = [];
        var t0 = this.now() + 0.02;

        for (var i = 0; i < notes.length; i++) {
            var freq = notes[i] * Math.pow(2, transpose / 12);
            var start = t0 + i * stepMs / 1000;
            var dur = stepMs / 1000 * 0.9;
            var text = SYLLABLES[(i + (waterLevel || 0)) % SYLLABLES.length];
            this._singNote(freq, start, dur, voice, waterLevel);
            sylls.push({ t: i * stepMs, text: text });
        }
        return sylls;
    }

    _singNote(freq, start, dur, voice, waterLevel) {
        var ctx = this.ctx;
        var g = ctx.createGain();
        g.gain.setValueAtTime(0, start);
        g.gain.linearRampToValueAtTime(voice.gain, start + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, start + dur);

        /* carrier: sawtooth through formant filters */
        var osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;

        var filters = [];
        var src = osc;
        for (var f = 0; f < voice.vowels.length; f++) {
            var bp = ctx.createBiquadFilter();
            bp.type = 'bandpass';
            bp.frequency.value = voice.vowels[f].f;
            bp.Q.value = voice.vowels[f].q;
            src.connect(bp);
            src = bp;
        }

        /* watered plants get a gentle vibrato + shimmer */
        if (waterLevel && waterLevel >= 1) {
            var lfo = ctx.createOscillator();
            var lfoGain = ctx.createGain();
            lfo.frequency.value = 5;
            lfoGain.gain.value = waterLevel * 2;
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start(start);
            lfo.stop(start + dur + 0.05);
        }

        src.connect(g);
        g.connect(this.master);
        osc.start(start);
        osc.stop(start + dur + 0.05);
    }

    /* Single voice blip */
    playVoice(plantId, freq, waterLevel, delayMs) {
        if (!this.ctx) return;
        var voiceType = 'airy';
        if (typeof PLANT_TYPES !== 'undefined') {
            var p = getPlantById(plantId);
            if (p) voiceType = p.audio.voice || 'airy';
        }
        var voice = VOICE_FORMANTS[voiceType] || VOICE_FORMANTS.airy;
        var start = this.now() + (delayMs || 0) / 1000;
        this._singNote(freq, start, 0.3, voice, waterLevel);
    }

    /* ---------- Ambient pad (night mode) ---------- */
    startPad() {
        if (!this.ctx || this.padPlaying) return;
        this.padPlaying = true;
        this.padGain = this.ctx.createGain();
        this.padGain.gain.value = 0;
        this.padGain.gain.linearRampToValueAtTime(0.08, this.now() + 1.5);
        this.padGain.connect(this.master);

        var freqs = [130.81, 196.00, 261.63];
        for (var i = 0; i < freqs.length; i++) {
            var osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freqs[i];
            var lp = this.ctx.createBiquadFilter();
            lp.type = 'lowpass';
            lp.frequency.value = 600;
            var g = this.ctx.createGain();
            g.gain.value = 0.33;
            /* slow detune drift */
            var lfo = this.ctx.createOscillator();
            var lfoG = this.ctx.createGain();
            lfo.frequency.value = 0.1 + i * 0.07;
            lfoG.gain.value = 3;
            lfo.connect(lfoG);
            lfoG.connect(osc.frequency);
            osc.connect(lp);
            lp.connect(g);
            g.connect(this.padGain);
            osc.start();
            lfo.start();
            this.padNodes.push(osc, lfo);
        }
    }

    stopPad() {
        if (!this.padPlaying) return;
        this.padPlaying = false;
        var self = this;
        if (this.padGain) {
            this.padGain.gain.cancelScheduledValues(this.now());
            this.padGain.gain.setValueAtTime(this.padGain.gain.value, this.now());
            this.padGain.gain.linearRampToValueAtTime(0, this.now() + 1.2);
        }
        setTimeout(function() {
            for (var i = 0; i < self.padNodes.length; i++) {
                try { self.padNodes[i].stop(); } catch (e) {}
            }
            self.padNodes = [];
            self.padGain = null;
        }, 1400);
    }

    /* ---------- Silly SFX ---------- */
    playGiggle(freq) {
        if (!this.ctx) return;
        var base = freq || 520;
        var t = this.now();
        for (var i = 0; i < 4; i++) {
            var osc = this.ctx.createOscillator();
            var g = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(base + i * 60, t + i * 0.07);
            osc.frequency.exponentialRampToValueAtTime(base + i * 60 + 120, t + i * 0.07 + 0.06);
            g.gain.setValueAtTime(0, t + i * 0.07);
            g.gain.linearRampToValueAtTime(0.12, t + i * 0.07 + 0.01);
            g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.08);
            osc.connect(g); g.connect(this.master);
            osc.start(t + i * 0.07);
            osc.stop(t + i * 0.07 + 0.1);
        }
    }

    playYawn() {
        if (!this.ctx) return;
        var t = this.now();
        var osc = this.ctx.createOscillator();
        var g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(180, t + 0.5);
        osc.frequency.exponentialRampToValueAtTime(120, t + 0.9);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.15, t + 0.15);
        g.gain.linearRampToValueAtTime(0.1, t + 0.6);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.95);
        osc.connect(g); g.connect(this.master);
        osc.start(t); osc.stop(t + 1);
    }

    playHiccup() {
        if (!this.ctx) return;
        var t = this.now();
        for (var i = 0; i < 2; i++) {
            var osc = this.ctx.createOscillator();
            var g = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(180, t + i * 0.18);
            osc.frequency.exponentialRampToValueAtTime(90, t + i * 0.18 + 0.08);
            g.gain.setValueAtTime(0, t + i * 0.18);
            g.gain.linearRampToValueAtTime(0.1, t + i * 0.18 + 0.01);
            g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.18 + 0.1);
            osc.connect(g); g.connect(this.master);
            osc.start(t + i * 0.18); osc.stop(t + i * 0.18 + 0.12);
        }
    }

    playBurp() {
        if (!this.ctx) return;
        var t = this.now();
        var osc = this.ctx.createOscillator();
        var g = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.4);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.18, t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
        osc.connect(g); g.connect(this.master);
        osc.start(t); osc.stop(t + 0.5);
    }

    playSnore() {
        if (!this.ctx) return;
        var t = this.now();
        var osc = this.ctx.createOscillator();
        var g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, t);
        osc.frequency.linearRampToValueAtTime(110, t + 0.3);
        osc.frequency.linearRampToValueAtTime(70, t + 0.6);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.12, t + 0.15);
        g.gain.linearRampToValueAtTime(0.08, t + 0.4);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
        osc.connect(g); g.connect(this.master);
        osc.start(t); osc.stop(t + 0.7);
    }

    playSplat() {
        if (!this.ctx) return;
        var t = this.now();
        var buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.2, this.ctx.sampleRate);
        var data = buffer.getChannelData(0);
        for (var i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
        }
        var src = this.ctx.createBufferSource();
        src.buffer = buffer;
        var g = this.ctx.createGain();
        g.gain.value = 0.15;
        var lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 800;
        src.connect(lp); lp.connect(g); g.connect(this.master);
        src.start(t);
    }

    playBoing() {
        if (!this.ctx) return;
        var t = this.now();
        var osc = this.ctx.createOscillator();
        var g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.08);
        osc.frequency.exponentialRampToValueAtTime(150, t + 0.3);
        g.gain.setValueAtTime(0.2, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(g); g.connect(this.master);
        osc.start(t); osc.stop(t + 0.4);
    }

    playRaspberry() {
        if (!this.ctx) return;
        var t = this.now();
        var buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.4, this.ctx.sampleRate);
        var data = buffer.getChannelData(0);
        for (var i = 0; i < data.length; i++) {
            data[i] = Math.sin(i * 0.05) * Math.pow(1 - i / data.length, 1.5) * (Math.random() * 0.3 + 0.7);
        }
        var src = this.ctx.createBufferSource();
        src.buffer = buffer;
        var g = this.ctx.createGain();
        g.gain.value = 0.12;
        var bp = this.ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 400;
        bp.Q.value = 2;
        src.connect(bp); bp.connect(g); g.connect(this.master);
        src.start(t);
    }

    /* Sparkle for planting */
    playSparkle() {
        if (!this.ctx) return;
        var t = this.now();
        for (var i = 0; i < 3; i++) {
            var osc = this.ctx.createOscillator();
            var g = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = 880 + i * 440;
            g.gain.setValueAtTime(0, t + i * 0.04);
            g.gain.linearRampToValueAtTime(0.08, t + i * 0.04 + 0.01);
            g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.25);
            osc.connect(g); g.connect(this.master);
            osc.start(t + i * 0.04); osc.stop(t + i * 0.04 + 0.3);
        }
    }

    /* Welcome hum */
    playWelcome() {
        if (!this.ctx) return;
        this.singPhrase('luna', [261.63, 329.63, 392.00, 523.25], 1, { stepMs: 190 });
    }
}

if (typeof window !== 'undefined') window.AudioEngine = AudioEngine;
