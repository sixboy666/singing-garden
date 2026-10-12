/* ============================================
   SINGING GARDEN - Audio Engine
   Web Audio API based synthesizer
   ============================================ */

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.reverbNode = null;
        this.reverbGain = null;
        this.delayNode = null;
        this.delayGain = null;
        this.muted = false;
        this.initialized = false;
    }

    /* Initialize the audio context (must be called after user interaction) */
    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();

            // Master gain
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.4;
            this.masterGain.connect(this.ctx.destination);

            // Reverb chain
            this.reverbNode = this.ctx.createConvolver();
            this.reverbNode.buffer = this._createImpulseResponse(2.0, 2.5);
            this.reverbGain = this.ctx.createGain();
            this.reverbGain.gain.value = 1.0;
            this.reverbNode.connect(this.reverbGain);
            this.reverbGain.connect(this.masterGain);

            // Delay chain with feedback
            this.delayNode = this.ctx.createDelay(1.0);
            this.delayNode.delayTime.value = 0.28;
            this.delayGain = this.ctx.createGain();
            this.delayGain.gain.value = 1.0;
            const feedback = this.ctx.createGain();
            feedback.gain.value = 0.35;
            this.delayNode.connect(this.delayGain);
            this.delayNode.connect(feedback);
            feedback.connect(this.delayNode);
            this.delayGain.connect(this.masterGain);

            this.initialized = true;
        } catch (e) {
            console.warn('AudioEngine init failed:', e);
        }
    }

    /* Resume the audio context (browsers suspend it until user gesture) */
    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    /* Generate a simple reverb impulse response */
    _createImpulseResponse(duration, decay) {
        const sampleRate = this.ctx.sampleRate;
        const length = Math.max(1, Math.floor(sampleRate * duration));
        const impulse = this.ctx.createBuffer(2, length, sampleRate);
        for (let ch = 0; ch < 2; ch++) {
            const data = impulse.getChannelData(ch);
            for (let i = 0; i < length; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
            }
        }
        return impulse;
    }

    /* Play a single note
     * audioConfig: plant's audio configuration object
     * waterLevel: 0-3, affects pitch, vibrato, reverb, harmonics
     * specificFreq: optional, if provided overrides the default note
     */
    playNote(audioConfig, waterLevel, specificFreq) {
        if (!this.initialized || this.muted) return;

        const wl = Math.max(0, Math.min(waterLevel, 3));
        const water = audioConfig.waterEffects[wl];
        const baseFreq = specificFreq || audioConfig.notes[0];
        const freq = baseFreq * water.pitchMultiplier;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        // Oscillator
        osc.type = audioConfig.waveform;
        osc.frequency.value = freq;

        // Filter
        filter.type = 'lowpass';
        filter.frequency.value = (audioConfig.filterFreq || 3000) + water.harmonicBoost * 1500;
        filter.Q.value = audioConfig.filterQ || 1;

        // ADSR Envelope
        const env = audioConfig.envelope;
        const vol = audioConfig.volume || 0.25;
        const dur = audioConfig.noteDuration || 0.5;
        const totalDur = env.attack + env.decay + dur + env.release;

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vol, now + env.attack);
        gain.gain.linearRampToValueAtTime(vol * env.sustain, now + env.attack + env.decay);
        gain.gain.setValueAtTime(vol * env.sustain, now + env.attack + env.decay + dur);
        gain.gain.linearRampToValueAtTime(0, now + totalDur);

        // Connect main signal path
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        // Reverb send
        const reverbAmt = (audioConfig.reverb || 0) + water.reverbBoost;
        if (reverbAmt > 0) {
            const reverbSend = this.ctx.createGain();
            reverbSend.gain.value = Math.min(reverbAmt, 0.8);
            gain.connect(reverbSend);
            reverbSend.connect(this.reverbNode);
        }

        // Delay send
        if (audioConfig.delay > 0) {
            const delaySend = this.ctx.createGain();
            delaySend.gain.value = audioConfig.delay;
            gain.connect(delaySend);
            delaySend.connect(this.delayNode);
        }

        // Vibrato (LFO modulating frequency)
        if (water.vibrato > 0) {
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            lfo.frequency.value = 5.0;
            lfoGain.gain.value = water.vibrato;
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start(now);
            lfo.stop(now + totalDur + 0.1);
        }

        // Start and stop
        osc.start(now);
        osc.stop(now + totalDur + 0.1);
    }

    /* Set mute state */
    setMuted(muted) {
        this.muted = muted;
        if (this.masterGain) {
            const now = this.ctx.currentTime;
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.4, now + 0.1);
        }
    }
}
