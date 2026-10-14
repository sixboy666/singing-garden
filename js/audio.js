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
        this.master.gain.value = 0.7;
        /* Master limiter: several plants can sing at once (harmony/chaos),
           so the bus goes through a compressor before the speakers. */
        this.comp = this.ctx.createDynamicsCompressor();
        this.comp.threshold.value = -16;
        this.comp.knee.value = 24;
        this.comp.ratio.value = 8;
        this.comp.attack.value = 0.004;
        this.comp.release.value = 0.22;
        this.master.connect(this.comp);
        this.comp.connect(this.ctx.destination);
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    }

    setMuted(m) {
        this.muted = m;
        if (this.master) this.master.gain.value = m ? 0 : 0.7;
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

        /* ADSR-ish envelope (gentle attack/release avoids clicks and peaks) */
        var g = ctx.createGain();
        var peak = voice.gain;
        var sustainEnd = Math.max(start + 0.04, start + dur - 0.07);
        g.gain.setValueAtTime(0.0001, start);
        g.gain.linearRampToValueAtTime(peak, start + 0.035);
        g.gain.setValueAtTime(peak, sustainEnd);
        g.gain.exponentialRampToValueAtTime(0.001, start + dur);
        g.connect(this.master);

        /* Formant summing bus. NOTE: the three vowel bandpass filters MUST
           run in PARALLEL — chaining narrow bandpass filters in series
           removes every frequency, which made every plant silent. */
        var formantSum = ctx.createGain();
        formantSum.gain.value = 0.8;
        formantSum.connect(g);

        /* Carriers: a sawtooth for vocal body + a softer triangle an octave
           up for "ah" air, mixed quietly so stacked voices stay smooth. */
        var carrierMix = ctx.createGain();
        carrierMix.gain.value = 0.7;

        var osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        var osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.value = freq * 2;
        var osc2Gain = ctx.createGain();
        osc2Gain.gain.value = 0.35;

        osc.connect(carrierMix);
        osc2.connect(osc2Gain);
        osc2Gain.connect(carrierMix);

        /* Parallel formant bank: each bandpass gets the same carrier, and
           each feeds the summing bus. Slightly widened bandwidth (lower Q)
           so a note always lands inside at least one vowel band. */
        var formantWeights = [1.0, 0.75, 0.5];
        for (var f = 0; f < voice.vowels.length; f++) {
            var bp = ctx.createBiquadFilter();
            bp.type = 'bandpass';
            bp.frequency.value = voice.vowels[f].f;
            bp.Q.value = Math.max(2.2, voice.vowels[f].q * 0.55);
            var fg = ctx.createGain();
            fg.gain.value = formantWeights[f] || 0.5;
            carrierMix.connect(bp);
            bp.connect(fg);
            fg.connect(formantSum);
        }

        /* watered plants get a gentle vibrato + shimmer */
        var lfo = null;
        if (waterLevel && waterLevel >= 1) {
            lfo = ctx.createOscillator();
            var lfoGain = ctx.createGain();
            lfo.frequency.value = 5;
            lfoGain.gain.value = Math.min(waterLevel * 1.5, 6);
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfoGain.connect(osc2.frequency);
            lfo.start(start);
            lfo.stop(start + dur + 0.05);
        }

        osc.start(start);
        osc.stop(start + dur + 0.05);
        osc2.start(start);
        osc2.stop(start + dur + 0.05);
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

        /* Voiced an octave above the old drone (C4-E4-G4-C5) so the night
           bed feels warm and airy instead of dark and murky. */
        var freqs = [261.63, 329.63, 392.00, 523.25];
        for (var i = 0; i < freqs.length; i++) {
            var osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freqs[i];
            var lp = this.ctx.createBiquadFilter();
            lp.type = 'lowpass';
            lp.frequency.value = 2400;
            var g = this.ctx.createGain();
            g.gain.value = 0.24;
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
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.2, t + 0.015);
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

    /* ---------- Extra anthropomorphic SFX (v11) ---------- */

    /* "Achoo!" — a sniffling inhale, then a bright noise burst */
    playSneeze() {
        if (!this.ctx) return;
        var ctx = this.ctx;
        var t = this.now();

        /* inhale sweep */
        var inhale = ctx.createOscillator();
        var ig = ctx.createGain();
        inhale.type = 'sine';
        inhale.frequency.setValueAtTime(220, t);
        inhale.frequency.exponentialRampToValueAtTime(620, t + 0.2);
        ig.gain.setValueAtTime(0.0001, t);
        ig.gain.linearRampToValueAtTime(0.07, t + 0.18);
        ig.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        inhale.connect(ig); ig.connect(this.master);
        inhale.start(t); inhale.stop(t + 0.24);

        /* "choo" — noise burst plus a falling body tone */
        var noise = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
        var data = noise.getChannelData(0);
        for (var i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
        }
        var src = ctx.createBufferSource();
        src.buffer = noise;
        var hp = ctx.createBiquadFilter();
        hp.type = 'highpass'; hp.frequency.value = 900;
        var ng = ctx.createGain(); ng.gain.value = 0.16;
        src.connect(hp); hp.connect(ng); ng.connect(this.master);
        src.start(t + 0.2);

        var choo = ctx.createOscillator();
        var cg = ctx.createGain();
        choo.type = 'triangle';
        choo.frequency.setValueAtTime(760, t + 0.2);
        choo.frequency.exponentialRampToValueAtTime(200, t + 0.5);
        cg.gain.setValueAtTime(0.0001, t + 0.2);
        cg.gain.linearRampToValueAtTime(0.13, t + 0.23);
        cg.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        choo.connect(cg); cg.connect(this.master);
        choo.start(t + 0.2); choo.stop(t + 0.52);
    }

    /* A tiny throat cough */
    playCough() {
        if (!this.ctx) return;
        var ctx = this.ctx;
        var t = this.now();
        for (var i = 0; i < 2; i++) {
            var st = t + i * 0.14;
            var noise = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
            var data = noise.getChannelData(0);
            for (var j = 0; j < data.length; j++) {
                data[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / data.length, 2);
            }
            var src = ctx.createBufferSource(); src.buffer = noise;
            var bp = ctx.createBiquadFilter();
            bp.type = 'bandpass'; bp.frequency.value = 500 + i * 180; bp.Q.value = 1.6;
            var g = ctx.createGain(); g.gain.value = 0.13;
            src.connect(bp); bp.connect(g); g.connect(this.master);
            src.start(st);
        }
    }

    /* "Ahem." — a cleared throat before making a point */
    playThroatClear() {
        if (!this.ctx) return;
        var ctx = this.ctx;
        var t = this.now();
        for (var i = 0; i < 2; i++) {
            var st = t + i * 0.16;
            var osc = ctx.createOscillator(); var g = ctx.createGain();
            var lp = ctx.createBiquadFilter();
            lp.type = 'lowpass'; lp.frequency.value = 900;
            osc.type = 'square';
            osc.frequency.setValueAtTime(200 - i * 20, st);
            osc.frequency.exponentialRampToValueAtTime(120, st + 0.09);
            g.gain.setValueAtTime(0.0001, st);
            g.gain.linearRampToValueAtTime(0.1, st + 0.012);
            g.gain.exponentialRampToValueAtTime(0.001, st + 0.11);
            osc.connect(lp); lp.connect(g); g.connect(this.master);
            osc.start(st); osc.stop(st + 0.13);
        }
    }

    /* Happy little two-note whistle with vibrato */
    playWhistle(freq) {
        if (!this.ctx) return;
        var ctx = this.ctx;
        var t = this.now();
        var base = freq || 1100;
        var osc = ctx.createOscillator(); var g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(base, t);
        osc.frequency.exponentialRampToValueAtTime(base * 1.35, t + 0.16);
        osc.frequency.exponentialRampToValueAtTime(base * 1.1, t + 0.34);
        var vib = ctx.createOscillator(); var vg = ctx.createGain();
        vib.frequency.value = 6; vg.gain.value = 12;
        vib.connect(vg); vg.connect(osc.frequency);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.09, t + 0.03);
        g.gain.setValueAtTime(0.09, t + 0.3);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.connect(g); g.connect(this.master);
        osc.start(t); osc.stop(t + 0.42);
        vib.start(t); vib.stop(t + 0.42);
    }

    /* Slide whistle — the conductor's baton. Pass false to slide back down. */
    playSlideWhistle(up) {
        if (!this.ctx) return;
        var ctx = this.ctx;
        var t = this.now();
        var osc = ctx.createOscillator(); var g = ctx.createGain();
        osc.type = 'sine';
        if (up === false) {
            osc.frequency.setValueAtTime(1200, t);
            osc.frequency.exponentialRampToValueAtTime(380, t + 0.35);
        } else {
            osc.frequency.setValueAtTime(380, t);
            osc.frequency.exponentialRampToValueAtTime(1200, t + 0.35);
        }
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.09, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.connect(g); g.connect(this.master);
        osc.start(t); osc.stop(t + 0.42);
    }

    /* "Mm-hm-hm" — a mouth-closed mumble, for gossiping plants */
    playMumble(freq) {
        if (!this.ctx) return;
        var ctx = this.ctx;
        var t = this.now();
        var base = freq || 150;
        var osc = ctx.createOscillator(); var g = ctx.createGain();
        var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 620; lp.Q.value = 3;
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(base, t);
        osc.frequency.linearRampToValueAtTime(base * 1.08, t + 0.5);
        var wob = ctx.createOscillator(); var wg = ctx.createGain();
        wob.frequency.value = 5.5; wg.gain.value = 0.05;
        wob.connect(wg); wg.connect(g.gain);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.11, t + 0.08);
        g.gain.setValueAtTime(0.11, t + 0.5);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.68);
        osc.connect(lp); lp.connect(g); g.connect(this.master);
        osc.start(t); osc.stop(t + 0.7);
        wob.start(t); wob.stop(t + 0.7);
    }

    /* "Blah blah blah" — short dialogue babble blips */
    playBabble(times) {
        if (!this.ctx) return;
        var ctx = this.ctx;
        var t = this.now();
        var n = times || 3;
        for (var i = 0; i < n; i++) {
            var st = t + i * 0.11;
            var osc = ctx.createOscillator(); var g = ctx.createGain();
            var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 620; bp.Q.value = 2.5;
            osc.type = 'square';
            osc.frequency.setValueAtTime(190 + Math.random() * 90, st);
            osc.frequency.exponentialRampToValueAtTime(150, st + 0.08);
            g.gain.setValueAtTime(0.0001, st);
            g.gain.linearRampToValueAtTime(0.08, st + 0.01);
            g.gain.exponentialRampToValueAtTime(0.001, st + 0.09);
            osc.connect(bp); bp.connect(g); g.connect(this.master);
            osc.start(st); osc.stop(st + 0.1);
        }
    }

    /* A soft, world-weary sigh */
    playSigh() {
        if (!this.ctx) return;
        var ctx = this.ctx;
        var t = this.now();
        var noise = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate);
        var data = noise.getChannelData(0);
        for (var i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.4);
        }
        var src = ctx.createBufferSource(); src.buffer = noise;
        var lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(1000, t);
        lp.frequency.exponentialRampToValueAtTime(320, t + 0.55);
        var g = ctx.createGain(); g.gain.value = 0.07;
        src.connect(lp); lp.connect(g); g.connect(this.master);
        src.start(t);

        var osc = ctx.createOscillator(); var og = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.exponentialRampToValueAtTime(190, t + 0.55);
        og.gain.setValueAtTime(0.0001, t);
        og.gain.linearRampToValueAtTime(0.06, t + 0.1);
        og.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
        osc.connect(og); og.connect(this.master);
        osc.start(t); osc.stop(t + 0.62);
    }

    /* Two little gulps (drinking water) */
    playGulp() {
        if (!this.ctx) return;
        var ctx = this.ctx;
        var t = this.now();
        for (var i = 0; i < 2; i++) {
            var st = t + i * 0.2;
            var osc = ctx.createOscillator(); var g = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(420, st);
            osc.frequency.exponentialRampToValueAtTime(140, st + 0.12);
            g.gain.setValueAtTime(0.0001, st);
            g.gain.linearRampToValueAtTime(0.12, st + 0.02);
            g.gain.exponentialRampToValueAtTime(0.001, st + 0.16);
            osc.connect(g); g.connect(this.master);
            osc.start(st); osc.stop(st + 0.18);
        }
    }

    /* Long relaxed hum (contented plants, night ambience) */
    playHum(freq) {
        if (!this.ctx) return;
        var ctx = this.ctx;
        var t = this.now();
        var base = freq || 165;
        var osc = ctx.createOscillator(); var g = ctx.createGain();
        var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
        osc.type = 'triangle';
        osc.frequency.value = base;
        var osc2 = ctx.createOscillator(); osc2.type = 'sine'; osc2.frequency.value = base * 1.5;
        var og2 = ctx.createGain(); og2.gain.value = 0.4;
        var vib = ctx.createOscillator(); var vg = ctx.createGain();
        vib.frequency.value = 4.5; vg.gain.value = 4;
        vib.connect(vg); vg.connect(osc.frequency);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.09, t + 0.25);
        g.gain.setValueAtTime(0.09, t + 0.9);
        g.gain.exponentialRampToValueAtTime(0.001, t + 1.3);
        osc.connect(lp); lp.connect(g);
        osc2.connect(og2); og2.connect(lp);
        g.connect(this.master);
        osc.start(t); osc.stop(t + 1.35);
        osc2.start(t); osc2.stop(t + 1.35);
        vib.start(t); vib.stop(t + 1.35);
    }

    /* A tiny crowd cheer — noise swell plus rising bells */
    playCheer() {
        if (!this.ctx) return;
        var ctx = this.ctx;
        var t = this.now();
        var noise = ctx.createBuffer(1, ctx.sampleRate * 0.7, ctx.sampleRate);
        var data = noise.getChannelData(0);
        for (var i = 0; i < data.length; i++) {
            var p = i / data.length;
            var env = p < 0.25 ? p / 0.25 : Math.pow(1 - (p - 0.25) / 0.75, 1.6);
            data[i] = (Math.random() * 2 - 1) * env;
        }
        var src = ctx.createBufferSource(); src.buffer = noise;
        var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1300; bp.Q.value = 0.8;
        var g = ctx.createGain(); g.gain.value = 0.09;
        src.connect(bp); bp.connect(g); g.connect(this.master);
        src.start(t);
        for (var k = 0; k < 4; k++) {
            var osc = ctx.createOscillator(); var og = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = 660 * Math.pow(2, k / 4);
            var st = t + 0.15 + k * 0.05;
            og.gain.setValueAtTime(0, st);
            og.gain.linearRampToValueAtTime(0.05, st + 0.05);
            og.gain.exponentialRampToValueAtTime(0.001, st + 0.4);
            osc.connect(og); og.connect(this.master);
            osc.start(st); osc.stop(st + 0.42);
        }
    }
}

if (typeof window !== 'undefined') window.AudioEngine = AudioEngine;
