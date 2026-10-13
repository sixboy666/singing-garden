/* ============================================
   SINGING GARDEN - Premium Audio Engine
   Web Audio API synthesizer with:
   - Layered harmonics for richer timbres
   - Arpeggio sequencer for earworm melodies
   - Chord pad layer
   - Multi-tap delay + convolution reverb
   ============================================ */

/* ---- Vowel formant table (F1, F2, F3 in Hz) ---- */
var VOWEL_FORMANTS = {
    ah: [700, 1220, 2600],
    eh: [530, 1840, 2480],
    ee: [270, 2290, 3010],
    oh: [570, 840, 2410],
    oo: [300, 870, 2240],
    uh: [640, 1190, 2390]
};

/* ---- Signature humanoid voice per plant (absurd choir characters) ---- */
var VOICES = {
    hum:       { syllables: ['Mm', 'Hmm', 'Doo'], vowels: ['oo'], wave: 'sine', scoop: 0.05, vibrato: { rate: 4.5, depth: 6, delay: 0.25 }, breath: 0.02, dur: 0.3, reverb: 0.4, volume: 0.18 },
    sunflare:  { syllables: ['Ah', 'Lah', 'Hah', 'Wah'], vowels: ['oh', 'ah'], wave: 'sawtooth', scoop: 0.12, vibrato: { rate: 5.5, depth: 14, delay: 0.18 }, breath: 0.04, dur: 0.4, octaveEnd: true, reverb: 0.45, volume: 0.24 },
    toadstool: { syllables: ['Doo', 'Boo', 'Dum', 'Brr'], vowels: ['oo', 'oh'], wave: 'sawtooth', pitch: 0.5, scoop: 0.04, vibrato: { rate: 4, depth: 3, delay: 0.35 }, growl: 0.8, dur: 0.3, reverb: 0.35, delay: 0.12, volume: 0.3 },
    bluebelle: { syllables: ['Loo', 'Oo', 'Lah'], vowels: ['oo'], wave: 'triangle', scoop: 0.06, vibrato: { rate: 4.8, depth: 10, delay: 0.25 }, breath: 0.06, dur: 0.45, reverb: 0.55, volume: 0.2 },
    prickle:   { syllables: ['Nye', 'Nye', 'Ee'], vowels: ['ee', 'eh'], wave: 'sawtooth', q: 14, scoop: 0.03, vibrato: { rate: 6.5, depth: 6, delay: 0.1 }, breath: 0.02, dur: 0.3, reverb: 0.25, volume: 0.18 },
    fernella:  { syllables: ['Hah', 'Fah', 'Hoo'], vowels: ['ah', 'uh'], wave: 'triangle', scoop: 0.05, vibrato: { rate: 5, depth: 8, delay: 0.3 }, breath: 0.16, dur: 0.38, reverb: 0.4, volume: 0.2 },
    lumi:      { syllables: ['Ooo', 'Woo', 'Ahh'], vowels: ['oo', 'ah'], wave: 'sine', scoop: 0.18, vibrato: { rate: 4.2, depth: 12, delay: 0.4 }, breath: 0.05, dur: 0.5, slide: true, reverb: 0.6, volume: 0.2 },
    crysto:    { syllables: ['Tee', 'Din', 'Eee'], vowels: ['ee'], wave: 'sine', pitch: 2, q: 15, scoop: 0.02, vibrato: { rate: 7, depth: 5, delay: 0.08 }, breath: 0.03, dur: 0.4, reverb: 0.5, delay: 0.2, volume: 0.14 },
    pip:       { syllables: ['Dee', 'Doo', 'Bee'], vowels: ['ee', 'eh'], wave: 'square', pitch: 2.5, scoop: 0.05, vibrato: { rate: 8, depth: 4, delay: 0.05 }, dur: 0.16, stutter: true, reverb: 0.2, delay: 0.15, volume: 0.12 },
    bublo:     { syllables: ['Wob', 'Bul', 'Woh'], vowels: ['oh', 'oo'], wave: 'triangle', scoop: 0.1, vibrato: { rate: 11, depth: 30, delay: 0.02 }, dur: 0.3, reverb: 0.3, delay: 0.18, volume: 0.2 },
    drago:     { syllables: ['Rawr', 'Groh', 'Hmm'], vowels: ['oh', 'ah'], wave: 'sawtooth', pitch: 0.45, scoop: 0.15, vibrato: { rate: 3.5, depth: 8, delay: 0.3 }, growl: 1, dur: 0.5, reverb: 0.4, volume: 0.3 },
    flama:     { syllables: ['Fyah', 'Bah', 'Dah'], vowels: ['ah'], wave: 'sawtooth', scoop: 0.09, vibrato: { rate: 6, depth: 9, delay: 0.15 }, growl: 0.3, dur: 0.28, reverb: 0.3, delay: 0.22, volume: 0.2 },
    shimmer:   { syllables: ['Ding', 'Dah', 'Doo'], vowels: ['ee', 'oh'], wave: 'triangle', scoop: 0.03, vibrato: { rate: 5, depth: 6, delay: 0.2 }, dur: 0.35, reverb: 0.5, delay: 0.25, volume: 0.18 },
    puffer:    { syllables: ['Brr', 'Pff', 'Frr'], vowels: ['uh'], wave: 'triangle', scoop: 0.06, vibrato: { rate: 9, depth: 18, delay: 0.05 }, breath: 0.08, dur: 0.22, stutter: true, reverb: 0.25, volume: 0.18 },
    vinio:     { syllables: ['Whe', 'Eee', 'Loo'], vowels: ['oo', 'ee'], wave: 'sine', scoop: 0.3, dur: 0.4, slide: true, reverb: 0.35, delay: 0.15, volume: 0.2 },
    echo:      { syllables: ['Eho', 'Hal', 'Lah'], vowels: ['ah'], wave: 'triangle', scoop: 0.07, vibrato: { rate: 4.5, depth: 10, delay: 0.3 }, dur: 0.4, reverb: 0.65, delay: 0.5, volume: 0.2 },
    twinkle:   { syllables: ['Yo', 'Lay', 'Ee', 'Oh'], vowels: ['oh', 'ee'], wave: 'triangle', scoop: 0.08, vibrato: { rate: 5, depth: 8, delay: 0.2 }, dur: 0.3, octaveHop: true, reverb: 0.4, volume: 0.2 }
};

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.compressor = null;
        this.reverbNode = null;
        this.reverbGain = null;
        this.delayNode = null;
        this.delayGain = null;
        this.delayFeedback = null;
        this.chorusNode = null;
        this.chorusGain = null;
        this.muted = false;
        this.initialized = false;
        this._arpTimer = null;
    }

    /* Initialize after first user gesture */
    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();

            /* Compressor for glue + limiting */
            this.compressor = this.ctx.createDynamicsCompressor();
            this.compressor.threshold.value = -12;
            this.compressor.knee.value = 10;
            this.compressor.ratio.value = 4;
            this.compressor.attack.value = 0.003;
            this.compressor.release.value = 0.25;

            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.45;

            this.compressor.connect(this.masterGain);
            this.masterGain.connect(this.ctx.destination);

            /* Reverb: longer, denser impulse */
            this.reverbNode = this.ctx.createConvolver();
            this.reverbNode.buffer = this._createImpulseResponse(2.8, 2.2, true);
            this.reverbGain = this.ctx.createGain();
            this.reverbGain.gain.value = 0.85;
            this.reverbNode.connect(this.reverbGain);
            this.reverbGain.connect(this.compressor);

            /* Multi-tap delay (stereo spread) */
            this.delayNode = this.ctx.createDelay(1.5);
            this.delayNode.delayTime.value = 0.32;
            this.delayGain = this.ctx.createGain();
            this.delayGain.gain.value = 0.55;
            this.delayFeedback = this.ctx.createGain();
            this.delayFeedback.gain.value = 0.42;
            this.delayNode.connect(this.delayGain);
            this.delayNode.connect(this.delayFeedback);
            this.delayFeedback.connect(this.delayNode);
            this.delayGain.connect(this.compressor);

            /* Chorus: subtle modulation for movement */
            this.chorusNode = this.ctx.createDelay(0.05);
            this.chorusNode.delayTime.value = 0.025;
            this.chorusGain = this.ctx.createGain();
            this.chorusGain.gain.value = 0.35;
            this.chorusNode.connect(this.chorusGain);
            this.chorusGain.connect(this.compressor);
            var chorusLfo = this.ctx.createOscillator();
            var chorusLfoGain = this.ctx.createGain();
            chorusLfo.frequency.value = 0.6;
            chorusLfoGain.gain.value = 0.005;
            chorusLfo.connect(chorusLfoGain);
            chorusLfoGain.connect(this.chorusNode.delayTime);
            chorusLfo.start();

            this.initialized = true;
        } catch (e) {
            console.warn('AudioEngine init failed:', e);
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    /* Generate reverb impulse with optional stereo decorrelation */
    _createImpulseResponse(duration, decay, stereo) {
        var sampleRate = this.ctx.sampleRate;
        var length = Math.max(1, Math.floor(sampleRate * duration));
        var impulse = this.ctx.createBuffer(2, length, sampleRate);
        for (var ch = 0; ch < 2; ch++) {
            var data = impulse.getChannelData(ch);
            var offset = stereo ? (ch === 0 ? 0 : 19) : 0;
            for (var i = 0; i < length; i++) {
                var env = Math.pow(1 - i / length, decay);
                var noise = (Math.sin(i * 0.5 + offset) + (Math.random() * 2 - 1) * 0.5);
                data[i] = noise * env * 0.5;
            }
        }
        return impulse;
    }

    /* Play a note with layered harmonics and effects
     * audioConfig: plant's audio config
     * waterLevel: 0-3
     * specificFreq: optional override
     */
    playNote(audioConfig, waterLevel, specificFreq) {
        if (!this.initialized || this.muted) return;
        if (!audioConfig || !audioConfig.waterEffects) return;
        if (!specificFreq && !audioConfig.notes) return;

        var wl = Math.max(0, Math.min(waterLevel, 3));
        var water = audioConfig.waterEffects[wl];
        var baseFreq = specificFreq || audioConfig.notes[0];
        var freq = baseFreq * water.pitchMultiplier;

        var now = this.ctx.currentTime;
        var env = audioConfig.envelope;
        var vol = audioConfig.volume || 0.22;
        var dur = audioConfig.noteDuration || 0.4;
        var totalDur = env.attack + env.decay + dur + env.release;

        /* Main oscillator */
        var mainOsc = this.ctx.createOscillator();
        mainOsc.type = audioConfig.waveform;
        mainOsc.frequency.value = freq;

        /* Layered harmonics (sub-oscillators at integer multiples) */
        var harmonics = audioConfig.harmonics || [1];
        var harmonicGainNodes = [];
        var fundGain = this.ctx.createGain();
        fundGain.gain.value = 1.0;
        mainOsc.connect(fundGain);

        var harmonicOscs = [];
        for (var h = 1; h < harmonics.length; h++) {
            var mult = h + 1;
            var harmOsc = this.ctx.createOscillator();
            harmOsc.type = audioConfig.waveform;
            harmOsc.frequency.value = freq * mult;
            var harmG = this.ctx.createGain();
            harmG.gain.value = harmonics[h] * (1 + water.harmonicBoost * 0.15);
            harmOsc.connect(harmG);
            harmG.connect(fundGain);
            harmonicOscs.push(harmOsc);
        }

        /* Filter */
        var filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = (audioConfig.filterFreq || 3000) + water.harmonicBoost * 1500;
        filter.Q.value = audioConfig.filterQ || 1;

        /* Amplitude envelope */
        var amp = this.ctx.createGain();
        amp.gain.setValueAtTime(0, now);
        amp.gain.linearRampToValueAtTime(vol, now + env.attack);
        amp.gain.linearRampToValueAtTime(vol * env.sustain, now + env.attack + env.decay);
        amp.gain.setValueAtTime(vol * env.sustain, now + env.attack + env.decay + dur);
        amp.gain.linearRampToValueAtTime(0, now + totalDur);

        fundGain.connect(filter);
        filter.connect(amp);

        /* Dry signal */
        amp.connect(this.compressor);

        /* Reverb send */
        var reverbAmt = (audioConfig.reverb || 0) + water.reverbBoost;
        if (reverbAmt > 0) {
            var reverbSend = this.ctx.createGain();
            reverbSend.gain.value = Math.min(reverbAmt, 0.85);
            amp.connect(reverbSend);
            reverbSend.connect(this.reverbNode);
        }

        /* Delay send */
        var delayAmt = (audioConfig.delay || 0) + (water.delayBoost || 0);
        if (delayAmt > 0) {
            var delaySend = this.ctx.createGain();
            delaySend.gain.value = Math.min(delayAmt, 0.7);
            amp.connect(delaySend);
            delaySend.connect(this.delayNode);
        }

        /* Chorus send */
        var chorusSend = this.ctx.createGain();
        chorusSend.gain.value = 0.4;
        amp.connect(chorusSend);
        chorusSend.connect(this.chorusNode);

        /* Vibrato (LFO on pitch) */
        if (water.vibrato > 0) {
            var lfo = this.ctx.createOscillator();
            var lfoGain = this.ctx.createGain();
            lfo.frequency.value = 5.2;
            lfoGain.gain.value = water.vibrato;
            lfo.connect(lfoGain);
            lfoGain.connect(mainOsc.frequency);
            for (var k = 0; k < harmonicOscs.length; k++) {
                lfoGain.connect(harmonicOscs[k].frequency);
            }
            lfo.start(now);
            lfo.stop(now + totalDur + 0.1);
        }

        /* Start all oscillators */
        mainOsc.start(now);
        for (var m = 0; m < harmonicOscs.length; m++) {
            harmonicOscs[m].start(now);
            harmonicOscs[m].stop(now + totalDur + 0.1);
        }
        mainOsc.stop(now + totalDur + 0.1);
    }

    /* Play an arpeggio sequence (catchy earworm layer) */
    playArpeggio(audioConfig, waterLevel, notes) {
        if (!this.initialized || this.muted) return;
        var self = this;
        var seq = notes || audioConfig.notes;
        var stepMs = 110;
        for (var i = 0; i < seq.length; i++) {
            (function(idx) {
                setTimeout(function() {
                    self.playNote(audioConfig, waterLevel, seq[idx]);
                }, idx * stepMs);
            })(i);
        }
    }

    /* Play a chord (all notes simultaneously) */
    playChord(audioConfig, waterLevel, notes) {
        if (!this.initialized || this.muted) return;
        var seq = notes || audioConfig.notes;
        for (var i = 0; i < seq.length; i++) {
            this.playNote(audioConfig, waterLevel, seq[i]);
        }
    }

    /* ============================================
       HUMANOID VOICE SYNTH (formant singing)
       Each plant sings nonsense syllables with
       vowel formants, pitch scoops, delayed
       vibrato, breath noise and a signature quirk.
       ============================================ */

    _noiseBuffer() {
        if (!this._noiseBuf) {
            var len = this.ctx.sampleRate;
            this._noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
            var d = this._noiseBuf.getChannelData(0);
            for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        }
        return this._noiseBuf;
    }

    /* Sing ONE syllable. Returns the syllable text for visuals. */
    playVoice(voiceId, freq, waterLevel, delayMs, opts) {
        if (!this.initialized || this.muted) return null;
        var voice = VOICES[voiceId] || VOICES.hum;
        opts = opts || {};
        var wl = Math.max(0, Math.min(waterLevel || 0, 3));
        var vol = (opts.volume !== undefined ? opts.volume : 1) * (voice.volume || 0.2);
        var now = this.ctx.currentTime + (delayMs || 0) / 1000;
        var dur = opts.dur || voice.dur || 0.32;
        var target = freq * (voice.pitch || 1);
        if (opts.transpose) target *= Math.pow(2, opts.transpose / 12);
        if (voice.octaveHop && !opts.noStutter) target *= Math.random() < 0.5 ? 2 : 1;

        /* Glottal source with a human pitch scoop */
        var osc = this.ctx.createOscillator();
        osc.type = voice.wave || 'sawtooth';
        osc.frequency.setValueAtTime(target * (1 - (voice.scoop || 0.06)), now);
        osc.frequency.exponentialRampToValueAtTime(target, now + 0.07);
        if (opts.slideFrom) {
            osc.frequency.cancelScheduledValues(now);
            osc.frequency.setValueAtTime(opts.slideFrom, now);
            osc.frequency.exponentialRampToValueAtTime(target, now + 0.14);
        }
        if (voice.octaveEnd && opts.last) {
            osc.frequency.setValueAtTime(target, now + dur * 0.5);
            osc.frequency.exponentialRampToValueAtTime(target * 2, now + dur + 0.1);
        }

        /* Delayed vibrato (humans don't vibrate instantly) */
        var vibDepth = voice.vibrato ? voice.vibrato.depth + wl * 8 : 0;
        if (vibDepth > 0) {
            var lfo = this.ctx.createOscillator();
            lfo.frequency.value = voice.vibrato.rate + wl * 0.4;
            var lg = this.ctx.createGain();
            lg.gain.setValueAtTime(0, now);
            lg.gain.linearRampToValueAtTime(vibDepth, now + (voice.vibrato.delay || 0.2));
            lfo.connect(lg);
            lg.connect(osc.detune);
            lfo.start(now);
            lfo.stop(now + dur + 0.4);
        }

        /* Formant bank: glide vowel start -> end ("wah", "loo"...) */
        var v0 = VOWEL_FORMANTS[voice.vowels[0]];
        var v1 = VOWEL_FORMANTS[voice.vowels[voice.vowels.length - 1]];
        var bus = this.ctx.createGain();
        var fGains = [1, 0.5, 0.22];
        for (var i = 0; i < 3; i++) {
            var bp = this.ctx.createBiquadFilter();
            bp.type = 'bandpass';
            bp.Q.value = Math.max(4, (voice.q || 9) - i * 2);
            bp.frequency.setValueAtTime(v0[i], now);
            bp.frequency.exponentialRampToValueAtTime(v1[i] * (1 + wl * 0.03), now + 0.09);
            var fg = this.ctx.createGain();
            fg.gain.value = fGains[i];
            osc.connect(bp);
            bp.connect(fg);
            fg.connect(bus);
        }
        /* Warm body under the formants */
        var bodyF = this.ctx.createBiquadFilter();
        bodyF.type = 'lowpass';
        bodyF.frequency.value = 420 + wl * 120;
        var bodyG = this.ctx.createGain();
        bodyG.gain.value = 0.22;
        osc.connect(bodyF);
        bodyF.connect(bodyG);
        bodyG.connect(bus);

        /* Breath noise */
        var bAmt = (voice.breath || 0) + wl * 0.02;
        if (bAmt > 0.005) {
            var noise = this.ctx.createBufferSource();
            noise.buffer = this._noiseBuffer();
            noise.loop = true;
            var nf = this.ctx.createBiquadFilter();
            nf.type = 'bandpass';
            nf.frequency.value = 1700;
            nf.Q.value = 0.7;
            var ng = this.ctx.createGain();
            ng.gain.setValueAtTime(0, now);
            ng.gain.linearRampToValueAtTime(bAmt, now + 0.05);
            ng.gain.linearRampToValueAtTime(0, now + dur);
            noise.connect(nf);
            nf.connect(ng);
            ng.connect(bus);
            noise.start(now);
            noise.stop(now + dur + 0.1);
        }

        /* Monster growl: sub square with AM wobble */
        if (voice.growl) {
            var sub = this.ctx.createOscillator();
            sub.type = 'square';
            sub.frequency.value = target / 2;
            var sg = this.ctx.createGain();
            sg.gain.value = voice.growl * 0.25;
            var am = this.ctx.createOscillator();
            am.frequency.value = 26;
            var amg = this.ctx.createGain();
            amg.gain.value = voice.growl * 0.12;
            am.connect(amg);
            amg.connect(sg.gain);
            sub.connect(sg);
            sg.connect(bus);
            sub.start(now);
            sub.stop(now + dur + 0.2);
            am.start(now);
            am.stop(now + dur + 0.2);
        }

        /* Soft vocal envelope */
        var env = this.ctx.createGain();
        env.gain.setValueAtTime(0, now);
        env.gain.linearRampToValueAtTime(vol, now + 0.045);
        env.gain.setValueAtTime(vol, now + Math.max(0.05, dur * 0.55));
        env.gain.linearRampToValueAtTime(0.0001, now + dur + 0.18);
        bus.connect(env);

        var dry = this.ctx.createGain();
        dry.gain.value = 0.8;
        env.connect(dry);
        dry.connect(this.compressor);
        var rv = voice.reverb !== undefined ? voice.reverb : 0.3;
        if (rv > 0) {
            var rs = this.ctx.createGain();
            rs.gain.value = Math.min(rv, 0.85);
            env.connect(rs);
            rs.connect(this.reverbNode);
        }
        if (voice.delay) {
            var ds = this.ctx.createGain();
            ds.gain.value = Math.min(voice.delay, 0.6);
            env.connect(ds);
            ds.connect(this.delayNode);
        }

        osc.start(now);
        osc.stop(now + dur + 0.3);

        /* Stutter quirk: repeat the syllable quickly */
        if (voice.stutter && !opts.noStutter && Math.random() < 0.5) {
            this.playVoice(voiceId, freq, wl, (delayMs || 0) + dur * 900,
                { dur: dur * 0.55, noStutter: true, volume: opts.volume });
        }

        var syls = voice.syllables;
        return syls[Math.floor(Math.random() * syls.length)];
    }

    /* Sing a phrase of syllables; returns [{text, t, f}] for visuals.
       Well-watered plants auto-harmonize (third), lush adds a fifth. */
    singPhrase(voiceId, freqs, waterLevel, opts) {
        if (!this.initialized || this.muted) return [];
        opts = opts || {};
        var wl = Math.max(0, Math.min(waterLevel || 0, 3));
        var stepMs = opts.stepMs || 250;
        var out = [];
        var prev = null;
        var self = this;
        var voice = VOICES[voiceId] || VOICES.hum;
        for (var i = 0; i < freqs.length; i++) {
            (function(idx) {
                var t = idx * stepMs;
                var f = freqs[idx];
                var o = {};
                if (prev && voice.slide) o.slideFrom = prev;
                if (opts.transpose) o.transpose = opts.transpose;
                if (idx === freqs.length - 1) o.last = true;
                var text = self.playVoice(voiceId, f, wl, t, o);
                out.push({ text: text, t: t, f: f });
                if (wl >= 2) {
                    self.playVoice(voiceId, f * 1.26, wl, t, { volume: 0.4, noStutter: true });
                }
                if (wl >= 3) {
                    self.playVoice(voiceId, f * 1.498, wl, t + 120, { volume: 0.28, noStutter: true });
                }
                prev = f * (voice.pitch || 1);
            })(i);
        }
        return out;
    }

    setMuted(muted) {
        this.muted = muted;
        if (this.masterGain) {
            var now = this.ctx.currentTime;
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.45, now + 0.1);
        }
    }
}
