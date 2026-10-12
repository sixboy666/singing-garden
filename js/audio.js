/* ============================================
   SINGING GARDEN - Premium Audio Engine
   Web Audio API synthesizer with:
   - Layered harmonics for richer timbres
   - Arpeggio sequencer for earworm melodies
   - Chord pad layer
   - Multi-tap delay + convolution reverb
   ============================================ */

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

    setMuted(muted) {
        this.muted = muted;
        if (this.masterGain) {
            var now = this.ctx.currentTime;
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.45, now + 0.1);
        }
    }
}
