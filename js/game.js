/* ============================================================
   SINGING GARDEN v9 — GAME CONTROLLER
   Aurora Bloom: growth stages, day/night, conduct mode,
   plant/water modes, melody/harmony/chaos, silly reactions
   ============================================================ */

var SILLY_LINES = {
    click: [
        "Again! Again!", "Do I know you?", "That tickles!",
        "I was BORN ready.", "Encore? Obviously.",
        "I practice 8 hours a day.", "You are poking a masterpiece.",
        "Ahem. AHEM. Thanks."
    ],
    plant: [
        "A new bloom!", "Hello, world!", "I have arrived.",
        "Feed me applause.", "Finally, the spotlight!"
    ],
    water: [
        "Hydration station!", "Mmm, vintage rain.",
        "Right in the roots!", "Spa day! Spa day!",
        "Just what the doctor ordered."
    ],
    overwater: [
        "*BUUURP* ...pardon.", "I am full! I am FULL!",
        "Blub blub. Help. Blub.", "Water... everywhere...",
        "I said SIP, not OCEAN."
    ],
    wake: [
        "Five more minutes...", "I was not sleeping! I swear!",
        "Wha— who is there?!", "Morning already?",
        "*yawn* ...I was dreaming of applause."
    ],
    dizzy: [
        "Whoa whoa WHOA...", "The garden is SPINNING!",
        "Too! Many! Pokes!", "I see stars... pretty stars..."
    ],
    tickle: [
        "Hee hee hee!", "Not the LEAVES!", "Stooop! ...okay continue.",
        "Eeheeheehee!", "Ha! HA! Mercy!"
    ],
    bloom: [
        "I BLOOMED!", "Behold my glory!", "Full flower power!",
        "Now I can REALLY sing."
    ],
    sneeze: [
        "Achoo! ...sorry.", "ATCHOO! Excuse me.", "*sniff* A sneeze petal!",
        "Achoo!! Bless me."
    ],
    cough: [
        "*cough* Ahem.", "Koff! Too much drama.", "*hack* ...I am FINE."
    ],
    gossip: [
        "Psst... the fern never waters.", "I heard the rose is fake.",
        "Rumor: the moon watches us.", "Do not tell... but I love roots."
    ],
    blush: [
        "Oh! Still here?", "Stop staring, I might wilt.",
        "I was not posing. You were.", "Look away, I am shy."
    ],
    bored: [
        "Are you just watching?", "Anytime now, human.",
        "This is the poke part.", "I am not a statue, you know."
    ],
    sleeptalk: [
        "...five more blooms...", "...zzz... encore...",
        "...do not poke the moon...", "...mm... more rain..."
    ],
    day: [
        "Aaah! Too bright!", "Who turned on the sun?",
        "Finally, vitamin D!", "*blink blink* My eyes!"
    ],
    nightStart: [
        "Ooh. Mood lighting.", "Now we GLOW.",
        "The night is ours.", "*sparkle* Showtime."
    ],
    twin: [
        "Hey, twin!", "Copycat!", "Twinsies! Harmonize?",
        "Twins! Unison time."
    ]
};

var SLEEP_AFTER_MS = 28000;
var DIZZY_CLICKS = 4;
var DIZZY_WINDOW_MS = 1800;
var DIZZY_LAST_MS = 2000;
var TICKLE_COOLDOWN_MS = 1400;
var STAGE_SEED_MS = 900;
var STAGE_SPROUT_MS = 1100;

var MODES = { PLANT: 'plant', CONDUCT: 'conduct', WATER: 'water' };

class Game {
    constructor() {
        this.audio = new AudioEngine();
        this.effects = new EffectsCanvas();
        this.plots = [];
        this.mode = MODES.PLANT;
        this.selectedPlantType = null;
        this.muted = false;
        this.isNight = true;
        this.isPlayingMelody = false;
        this.melodyStopped = false;
        this._toastTimer = null;
        this._idleTimer = null;
        this._leanRaf = 0;
        this._cursorX = -9999;
        this._cursorY = -9999;
        this._pointerDown = false;
        this._conductPath = [];
        this._conducting = false;
        this._lastConductIndex = -1;
        this._hoverIndex = -1;
        this._chatterTimer = null;
        this._boredTimer = null;
    }

    init() {
        this.createToast();
        this.createPlots();
        this.createPlantButtons();
        this.setupStartScreen();
        this.setupControls();
        this.setupKeyboard();
        this.effects.init(document.getElementById('effects-canvas'));
        this.selectedPlantType = PLANT_TYPES[0].id;
        this.applyDayNight();
        this.updateUI();
        this.startAnimationLoop();
        this._startIdleLoop();
        this._setupLean();
        this._setupTickle();
        this._setupConduct();
        this._startChatterLoop();
        this._startBoredLoop();
    }

    /* ---- Toast ---- */
    createToast() {
        var toast = document.createElement('div');
        toast.id = 'toast';
        document.getElementById('game-container').appendChild(toast);
    }

    showToast(msg) {
        var toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.style.opacity = '1';
        clearTimeout(this._toastTimer);
        var self = this;
        this._toastTimer = setTimeout(function() {
            toast.style.opacity = '0';
        }, 2200);
    }

    /* ---- Start screen ---- */
    setupStartScreen() {
        var self = this;
        document.getElementById('start-btn').addEventListener('click', function() {
            self.audio.init();
            self.audio.resume();
            self.showGardenScreen();
            self.audio.playWelcome();
        });
    }

    showGardenScreen() {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('garden-screen').classList.remove('hidden');
        var self = this;
        setTimeout(function() { self.effects.resize(); }, 150);
    }

    /* ---- Plots ---- */
    createPlots() {
        var container = document.getElementById('plots-container');
        var self = this;
        for (var i = 0; i < 8; i++) {
            var plot = document.createElement('div');
            plot.className = 'plot';
            plot.dataset.index = i;
            plot.innerHTML =
                '<div class="soil"></div>' +
                '<div class="water-level-indicator"></div>' +
                '<div class="plant-container"></div>';
            (function(plotEl) {
                plotEl.addEventListener('click', function() {
                    var idx = parseInt(plotEl.dataset.index);
                    self.handlePlotClick(idx);
                });
            })(plot);
            container.appendChild(plot);
            this.plots.push({
                planted: false,
                plantType: null,
                waterLevel: 0,
                element: plot,
                lastTouch: Date.now(),
                sleeping: false,
                dizzy: false,
                clickTimes: [],
                lastTickle: 0,
                lastBlush: 0,
                stage: 0,
                growTimers: []
            });
        }
    }

    /* ---- Speech bubble ---- */
    _speak(index, text) {
        var plot = this.plots[index];
        if (!plot) return;
        var old = plot.element.querySelector('.speech-bubble');
        if (old) old.remove();
        var bubble = document.createElement('div');
        bubble.className = 'speech-bubble';
        bubble.textContent = text;
        plot.element.appendChild(bubble);
        setTimeout(function() { bubble.classList.add('bubble-out'); }, 1800);
        setTimeout(function() { if (bubble.parentNode) bubble.remove(); }, 2200);
    }

    _speakRandom(index, context) {
        var lines = SILLY_LINES[context];
        if (!lines) return;
        this._speak(index, lines[Math.floor(Math.random() * lines.length)]);
    }

    /* ---- Wake sleeping plant ---- */
    _wakePlot(index) {
        var plot = this.plots[index];
        plot.sleeping = false;
        plot.element.classList.remove('plant-sleeping');
        this.audio.playYawn();
        this._speakRandom(index, 'wake');
    }

    /* ---- Idle sleep loop ---- */
    _startIdleLoop() {
        var self = this;
        this._idleTimer = setInterval(function() {
            var now = Date.now();
            var gardenVisible = !document.getElementById('garden-screen').classList.contains('hidden');
            if (!gardenVisible) return;
            for (var i = 0; i < self.plots.length; i++) {
                var plot = self.plots[i];
                if (!plot.planted) continue;
                if (!plot.sleeping && !plot.dizzy && now - plot.lastTouch > SLEEP_AFTER_MS) {
                    plot.sleeping = true;
                    plot.element.classList.add('plant-sleeping');
                }
                if (plot.sleeping) {
                    if (Math.random() < 0.5) self.effects.spawnZzz(plot.element);
                    if (Math.random() < 0.12) self.audio.playSnore();
                    if (Math.random() < 0.10) {
                        self.audio.playMumble(115 + Math.random() * 50);
                        self._speakRandom(i, 'sleeptalk');
                    }
                }
            }
        }, 1400);
    }

    /* ---- Chatter loop: awake plants gossip and hum to themselves ---- */
    _startChatterLoop() {
        var self = this;
        this._chatterTimer = setInterval(function() {
            if (self.muted) return;
            if (document.getElementById('garden-screen').classList.contains('hidden')) return;
            var awake = [];
            for (var i = 0; i < self.plots.length; i++) {
                var p = self.plots[i];
                if (p.planted && !p.sleeping && !p.dizzy && p.stage >= 1) awake.push(i);
            }
            if (!awake.length) return;
            var idx = awake[Math.floor(Math.random() * awake.length)];
            if (Math.random() < 0.6) {
                self.audio.playMumble(120 + Math.random() * 90);
                self._speakRandom(idx, 'gossip');
            } else {
                self.audio.playHum(150 + Math.random() * 70);
                self._speak(idx, '*humming*');
            }
        }, 8500);
    }

    /* ---- Bored loop: plants nag when the player just stares at them ---- */
    _startBoredLoop() {
        var self = this;
        this._boredTimer = setInterval(function() {
            if (self.muted) return;
            if (document.getElementById('garden-screen').classList.contains('hidden')) return;
            var latest = 0;
            var awake = [];
            for (var i = 0; i < self.plots.length; i++) {
                var p = self.plots[i];
                if (!p.planted) continue;
                if (p.lastTouch > latest) latest = p.lastTouch;
                if (!p.sleeping && !p.dizzy && p.stage >= 1) awake.push(i);
            }
            if (!awake.length) return;
            if (Date.now() - latest < 9500) return;
            var idx = awake[Math.floor(Math.random() * awake.length)];
            if (Math.random() < 0.5) self.audio.playThroatClear();
            else self.audio.playBabble(3);
            self.effects.spawnSoundWave(self.plots[idx].element, '#a78bfa');
            self._speakRandom(idx, 'bored');
        }, 11000);
    }

    /* ---- Contagious sneeze (overwatering spreads through the garden) ---- */
    _sneeze(index, depth) {
        var plot = this.plots[index];
        if (!plot || !plot.planted) return;
        var self = this;
        plot.lastTouch = Date.now();
        this.audio.playSneeze();
        this.effects.spawnSneeze(plot.element);
        plot.element.classList.add('plant-sneeze');
        setTimeout(function() { plot.element.classList.remove('plant-sneeze'); }, 900);
        if (depth < 2) this._speakRandom(index, 'sneeze');
        if (depth >= 3) return;
        /* Only grid neighbours can catch it; the chain fades with distance. */
        var cols = 4;
        var cand = [index - 1, index + 1, index - cols, index + cols];
        var nbrs = [];
        for (var n = 0; n < cand.length; n++) {
            var j = cand[n];
            if (j < 0 || j >= this.plots.length) continue;
            if (j === index - 1 && index % cols === 0) continue;
            if (j === index + 1 && index % cols === cols - 1) continue;
            nbrs.push(j);
        }
        nbrs.forEach(function(j, k) {
            if (Math.random() > 0.5) return;
            var np = self.plots[j];
            if (!np.planted || np.dizzy) return;
            /* A sneeze is loud enough to jolt a napping neighbour awake. */
            if (np.sleeping) {
                np.sleeping = false;
                np.element.classList.remove('plant-sleeping');
            }
            setTimeout(function() { self._sneeze(j, depth + 1); }, 280 + k * 150);
        });
    }

    /* ---- Reaction to the day / night switch ---- */
    _reactDayNight() {
        var self = this;
        var roster = [];
        for (var i = 0; i < this.plots.length; i++) {
            var p = this.plots[i];
            if (p.planted && !p.sleeping) roster.push(i);
        }
        if (!roster.length) return;
        var ctxName = this.isNight ? 'nightStart' : 'day';
        roster.forEach(function(idx, k) {
            setTimeout(function() { self._speakRandom(idx, ctxName); }, k * 240);
        });
        if (this.isNight) this.audio.playHum(165);
        else this.audio.playSigh();
    }

    /* ---- Cursor lean ---- */
    _setupLean() {
        var self = this;
        var garden = document.getElementById('garden-stage');
        garden.addEventListener('pointermove', function(e) {
            self._cursorX = e.clientX;
            self._cursorY = e.clientY;
            self._checkHover(e);
            if (!self._leanRaf) {
                self._leanRaf = requestAnimationFrame(function() {
                    self._leanRaf = 0;
                    self._applyLean();
                });
            }
        });
        garden.addEventListener('pointerleave', function() {
            self._cursorX = -9999;
            self._cursorY = -9999;
            self._hoverIndex = -1;
            for (var i = 0; i < self.plots.length; i++) {
                self.plots[i].element.style.setProperty('--lean', '0deg');
            }
        });
    }

    _applyLean() {
        for (var i = 0; i < this.plots.length; i++) {
            var plot = this.plots[i];
            if (!plot.planted || plot.sleeping || plot.dizzy) {
                if (!plot.planted) plot.element.style.setProperty('--lean', '0deg');
                continue;
            }
            var r = plot.element.getBoundingClientRect();
            var dx = this._cursorX - (r.left + r.width / 2);
            var dy = this._cursorY - (r.top + r.height / 2);
            var dist = Math.sqrt(dx * dx + dy * dy);
            var maxLean = 7;
            var strength = Math.max(0, 1 - dist / 480);
            var deg = Math.max(-maxLean, Math.min(maxLean, (dx / 60) * strength * maxLean));
            plot.element.style.setProperty('--lean', deg.toFixed(2) + 'deg');
        }
    }

    /* ---- Hover blush: a plant gets shy when the cursor lingers on it ---- */
    _checkHover(e) {
        if (this.mode === MODES.CONDUCT || this._conducting) return;
        var el = document.elementFromPoint(e.clientX, e.clientY);
        var plotEl = el ? el.closest('.plot') : null;
        if (!plotEl) {
            this._hoverIndex = -1;
            return;
        }
        var idx = parseInt(plotEl.dataset.index);
        if (idx === this._hoverIndex) return;
        this._hoverIndex = idx;
        var plot = this.plots[idx];
        if (!plot || !plot.planted || plot.sleeping || plot.dizzy || plot.stage === 0) return;
        var now = Date.now();
        if (now - (plot.lastBlush || 0) < 4000) return;
        plot.lastBlush = now;
        var self = this;
        plot.element.classList.add('plant-blush');
        setTimeout(function() { plot.element.classList.remove('plant-blush'); }, 900);
        this.audio.playWhistle(900 + Math.random() * 500);
        if (Math.random() < 0.35) this._speakRandom(idx, 'blush');
    }

    /* ---- Tickle ---- */
    _setupTickle() {
        var self = this;
        document.addEventListener('pointerdown', function() { self._pointerDown = true; });
        document.addEventListener('pointerup', function() { self._pointerDown = false; });
        document.addEventListener('pointercancel', function() { self._pointerDown = false; });
        var container = document.getElementById('plots-container');
        container.addEventListener('pointerover', function(e) {
            if (!self._pointerDown) return;
            if (self.mode === MODES.CONDUCT) return;
            var plotEl = e.target.closest('.plot');
            if (!plotEl) return;
            var idx = parseInt(plotEl.dataset.index);
            var plot = self.plots[idx];
            if (!plot || !plot.planted || plot.dizzy) return;
            var now = Date.now();
            if (now - plot.lastTickle < TICKLE_COOLDOWN_MS) return;
            plot.lastTickle = now;
            plot.lastTouch = now;
            if (plot.sleeping) self._wakePlot(idx);
            self.audio.playGiggle();
            plot.element.classList.add('plant-tickle');
            if (Math.random() < 0.3) self._speakRandom(idx, 'tickle');
            setTimeout(function() {
                plot.element.classList.remove('plant-tickle');
            }, 550);
        });
    }

    /* ---- Conduct mode: drag across plants to sing in sequence ---- */
    _setupConduct() {
        var self = this;
        var stage = document.getElementById('garden-stage');

        stage.addEventListener('pointerdown', function(e) {
            if (self.mode !== MODES.CONDUCT) return;
            self._conducting = true;
            self._conductPath = [];
            self._lastConductIndex = -1;
            document.body.classList.add('conducting');
            self.audio.playSlideWhistle(true);
            self._handleConductMove(e);
        });

        stage.addEventListener('pointermove', function(e) {
            if (!self._conducting) return;
            self._handleConductMove(e);
        });

        var endConduct = function() {
            if (!self._conducting) return;
            self._conducting = false;
            self._conductPath = [];
            self._lastConductIndex = -1;
            document.body.classList.remove('conducting');
        };
        document.addEventListener('pointerup', endConduct);
        document.addEventListener('pointercancel', endConduct);
    }

    _handleConductMove(e) {
        var el = document.elementFromPoint(e.clientX, e.clientY);
        if (!el) return;
        var plotEl = el.closest('.plot');
        if (!plotEl) return;
        var idx = parseInt(plotEl.dataset.index);
        if (idx === this._lastConductIndex) return;
        var plot = this.plots[idx];
        if (!plot || !plot.planted) return;
        this._lastConductIndex = idx;
        this._conductPath.push(idx);
        plot.lastTouch = Date.now();
        if (plot.sleeping) this._wakePlot(idx);
        if (plot.dizzy || plot.stage === 0) return;
        var plant = getPlantById(plot.plantType);
        if (!plant) return;
        this._triggerSingVisual(idx, plant);
        var conductNote = plot.stage === 1 ? plant.audio.notes[0] : plant.audio.notes[Math.floor(Math.random() * plant.audio.notes.length)];
        var phrase = this.audio.singPhrase(plant.id, [conductNote], plot.waterLevel, { stepMs: 180 });
        var self = this;
        phrase.forEach(function(syll) {
            setTimeout(function() {
                self.effects.spawnNote(plot.element, plant.colors.primary, syll.text);
            }, syll.t);
        });
    }

    _triggerSingVisual(index, plant) {
        var plot = this.plots[index];
        var container = plot.element.querySelector('.plant-container');
        container.classList.remove('plant-singing');
        void container.offsetWidth;
        container.classList.add('plant-singing');
        setTimeout(function() {
            container.classList.remove('plant-singing');
        }, 500);
        plot.element.classList.add('plot-singing');
        setTimeout(function() {
            plot.element.classList.remove('plot-singing');
        }, 400);
        if (plot.waterLevel >= 2) {
            this.effects.spawnLightRays(plot.element);
        }
    }

    /* ---- Dizzy ---- */
    _makeDizzy(index) {
        var plot = this.plots[index];
        var self = this;
        plot.dizzy = true;
        plot.element.classList.add('plant-dizzy', 'plant-cough');
        this.audio.playBoing();
        this.audio.playRaspberry();
        this.effects.spawnDizzyStars(plot.element);
        this._speakRandom(index, 'dizzy');
        setTimeout(function() { self.audio.playCough(); }, 240);
        setTimeout(function() {
            plot.dizzy = false;
            plot.element.classList.remove('plant-dizzy', 'plant-cough');
        }, DIZZY_LAST_MS);
    }

    /* ---- Plant buttons ---- */
    createPlantButtons() {
        var container = document.getElementById('plant-buttons');
        var self = this;
        PLANT_TYPES.forEach(function(plant) {
            var btn = document.createElement('button');
            btn.className = 'plant-btn';
            btn.dataset.plantId = plant.id;
            btn.innerHTML =
                '<span class="plant-btn-emoji">' + plant.emoji + '</span>' +
                '<span class="plant-btn-name">' + plant.name + '</span>';
            (function(plantBtn, plantId) {
                plantBtn.addEventListener('click', function() {
                    self.selectPlantType(plantId);
                });
            })(btn, plant.id);
            container.appendChild(btn);
        });
    }

    /* ---- Controls ---- */
    setupControls() {
        var self = this;

        document.querySelectorAll('.mode-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                self.setMode(btn.dataset.mode);
            });
        });

        document.getElementById('play-btn').addEventListener('click', function() {
            self.playMelody();
        });
        document.getElementById('harmony-btn').addEventListener('click', function() {
            self.harmonyChoir();
        });
        document.getElementById('chaos-btn').addEventListener('click', function() {
            self.chaosChoir();
        });
        document.getElementById('clear-btn').addEventListener('click', function() {
            self.clearGarden();
        });
        document.getElementById('mute-btn').addEventListener('click', function() {
            self.toggleMute();
        });
        document.getElementById('time-btn').addEventListener('click', function() {
            self.toggleDayNight();
        });
        document.getElementById('help-btn').addEventListener('click', function() {
            self.showHelp();
        });
        document.getElementById('close-help-btn').addEventListener('click', function() {
            self.hideHelp();
        });
        document.getElementById('help-modal').addEventListener('click', function(e) {
            if (e.target === this) self.hideHelp();
        });
    }

    /* ---- Keyboard ---- */
    setupKeyboard() {
        var self = this;
        document.addEventListener('keydown', function(e) {
            var startVisible = !document.getElementById('start-screen').classList.contains('hidden');
            if (startVisible) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    document.getElementById('start-btn').click();
                }
                return;
            }
            var helpVisible = !document.getElementById('help-modal').classList.contains('hidden');
            if (helpVisible) {
                if (e.key === 'Escape' || e.key === 'h' || e.key === 'H' || e.key === 'Enter') {
                    self.hideHelp();
                }
                return;
            }
            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    self.playMelody();
                    break;
                case '1': self.setMode(MODES.PLANT); break;
                case '2': self.setMode(MODES.CONDUCT); break;
                case '3': self.setMode(MODES.WATER); break;
                case 'n': case 'N':
                    self.toggleDayNight();
                    break;
                case 'm': case 'M':
                    self.toggleMute();
                    break;
                case 'h': case 'H':
                    self.showHelp();
                    break;
                case 'c': case 'C':
                    self.clearGarden();
                    break;
                case 'x': case 'X':
                    self.chaosChoir();
                    break;
                default:
                    if (e.key >= '1' && e.key <= '9') {
                        var idx = parseInt(e.key) - 1;
                        if (idx < PLANT_TYPES.length) self.selectPlantType(PLANT_TYPES[idx].id);
                    }
                    break;
            }
        });
    }

    /* ---- Mode switching ---- */
    setMode(mode) {
        this.mode = mode;
        if (mode === MODES.PLANT) {
            /* keep selected plant */
        }
        this.updateUI();
    }

    selectPlantType(plantId) {
        this.selectedPlantType = plantId;
        this.mode = MODES.PLANT;
        this.updateUI();
    }

    /* ---- Plot click ---- */
    handlePlotClick(index) {
        if (index < 0 || index >= this.plots.length) return;
        var plot = this.plots[index];

        if (this.mode === MODES.WATER) {
            if (plot.planted) {
                this.waterPlant(index);
            } else {
                this.audio.playRaspberry();
                this.audio.playSplat();
                this.audio.playSigh();
                this.showToast("You watered... dirt. It is unimpressed.");
            }
        } else if (this.mode === MODES.CONDUCT) {
            /* handled by drag; single tap still sings */
            if (plot.planted) this.clickPlant(index, false);
        } else {
            /* PLANT mode */
            if (!plot.planted) {
                this.plantInPlot(index);
            } else {
                this.clickPlant(index, false);
            }
        }
    }

    /* ---- Plant with growth stages ---- */
    plantInPlot(index) {
        var plant = getPlantById(this.selectedPlantType);
        if (!plant) return;
        var plot = this.plots[index];
        /* cancel any stale growth timers (defensive against replant races) */
        if (plot.growTimers) plot.growTimers.forEach(clearTimeout);
        plot.growTimers = [];
        plot.planted = true;
        plot.plantType = plant.id;
        plot.waterLevel = 0;
        plot.stage = 0;
        plot.lastTouch = Date.now();

        var container = plot.element.querySelector('.plant-container');
        container.innerHTML = this._wrapPlantSVG(plant.renderSVG(0));
        container.className = 'plant-container plant-swaying ' + plant.animClass + ' plant-growing stage-seed';

        var self = this;
        var twinIdx = -1;
        for (var t = 0; t < this.plots.length; t++) {
            if (t !== index && this.plots[t].planted && this.plots[t].plantType === plant.id) {
                twinIdx = t; break;
            }
        }
        this.audio.playSparkle();
        this.effects.spawnSparkles(plot.element);
        if (twinIdx >= 0) {
            setTimeout(function() {
                self._speakRandom(index, 'twin');
                self.audio.playWhistle(980 + Math.random() * 400);
            }, 1500);
        } else {
            this._speakRandom(index, 'plant');
        }

        /* seed -> sprout */
        var t1 = setTimeout(function() {
            if (!plot.planted || plot.plantType !== plant.id) return;
            plot.stage = 1;
            container.className = 'plant-container plant-swaying ' + plant.animClass + ' stage-sprout';
            self.effects.spawnSparkles(plot.element);
        }, STAGE_SEED_MS);

        /* sprout -> bloom */
        var t2 = setTimeout(function() {
            if (!plot.planted || plot.plantType !== plant.id) return;
            plot.stage = 2;
            container.className = 'plant-container plant-swaying ' + plant.animClass + ' stage-bloom';
            self.audio.playVoice(plant.id, plant.audio.notes[0], 0, 0);
            self.effects.spawnSparkles(plot.element);
            self.effects.spawnPetals(plot.element, plant.colors.primary);
            self._speakRandom(index, 'bloom');
        }, STAGE_SEED_MS + STAGE_SPROUT_MS);
        plot.growTimers = [t1, t2];

        this.updateUI();
    }

    /* ---- Click plant to sing ---- */
    clickPlant(index, fromMelody) {
        var plot = this.plots[index];
        if (!plot.planted) return;
        var plant = getPlantById(plot.plantType);
        if (!plant) return;

        var self = this;
        plot.lastTouch = Date.now();
        if (plot.sleeping) this._wakePlot(index);
        if (plot.dizzy) return;

        if (!fromMelody) {
            var now = Date.now();
            plot.clickTimes.push(now);
            while (plot.clickTimes.length && plot.clickTimes[0] < now - DIZZY_WINDOW_MS) {
                plot.clickTimes.shift();
            }
            if (plot.clickTimes.length >= DIZZY_CLICKS) {
                plot.clickTimes.length = 0;
                this._makeDizzy(index);
                return;
            }
            if (Math.random() < 0.22) this._speakRandom(index, 'click');
        }

        /* Growth gating: seeds are too tiny to sing (soft sparkle peep),
           sprouts manage a single chirp, only bloom-stage plants sing
           their full phrase. */
        if (plot.stage === 0) {
            this.audio.playSparkle();
            this.effects.spawnSparkles(plot.element);
            return;
        }
        var notes = plot.stage === 1 ? [plant.audio.notes[0]] : plant.audio.notes;
        var phrase = this.audio.singPhrase(plant.id, notes, plot.waterLevel);
        this._triggerSingVisual(index, plant);

        phrase.forEach(function(syll) {
            setTimeout(function() {
                self.effects.spawnNote(plot.element, plant.colors.primary, syll.text);
            }, syll.t);
        });
        if (plot.stage === 2 && plot.waterLevel >= 2) {
            setTimeout(function() {
                self.effects.spawnHearts(plot.element);
                self.effects.spawnLightRays(plot.element);
            }, 200);
        }
    }

    /* ---- Water ---- */
    waterPlant(index) {
        var plot = this.plots[index];
        if (!plot.planted) return;
        var self = this;
        plot.waterLevel = (plot.waterLevel + 1) % 4;
        plot.lastTouch = Date.now();
        if (plot.sleeping) this._wakePlot(index);

        var plant = getPlantById(plot.plantType);
        if (!plant) return;

        var container = plot.element.querySelector('.plant-container');
        container.innerHTML = this._wrapPlantSVG(plant.renderSVG(plot.waterLevel));
        container.className = 'plant-container plant-swaying ' + plant.animClass +
            ' stage-' + (plot.stage === 0 ? 'seed' : plot.stage === 1 ? 'sprout' : 'bloom') +
            ' plant-singing';
        setTimeout(function() {
            container.classList.remove('plant-singing');
        }, 600);

        this.effects.spawnWaterDrops(plot.element);
        this.audio.playGulp();

        if (plot.waterLevel === 3) {
            this.audio.playHiccup();
            setTimeout(function() { self.audio.playBurp(); }, 160);
            this.effects.spawnBubbles(plot.element);
            this._speakRandom(index, 'overwater');
            /* Soaked plants sneeze — and it is contagious! */
            setTimeout(function() { self._sneeze(index, 0); }, 620);
        } else {
            this._speakRandom(index, 'water');
            if (plot.stage >= 1) {
                this.audio.playVoice(plant.id, plant.audio.notes[0], plot.waterLevel, 0);
                /* pure octave up: always consonant with every plant on
                   the shared C-major pentatonic scale */
                this.audio.playVoice(plant.id, plant.audio.notes[0] * 2, plot.waterLevel, 150);
            }
        }

        var labels = ['Dry', 'Watered', 'Well-watered', 'Lush!'];
        this.showToast(plant.name + ': ' + labels[plot.waterLevel]);
        this.updateUI();
    }

    /* ---- Melody (sequence) ---- */
    playMelody() {
        if (this.isPlayingMelody) {
            this.melodyStopped = true;
            return;
        }
        var plantedIndices = [];
        for (var i = 0; i < this.plots.length; i++) {
            if (this.plots[i].planted) plantedIndices.push(i);
        }
        if (plantedIndices.length === 0) {
            this.showToast('Plant some flowers first!');
            return;
        }
        this.isPlayingMelody = true;
        this.melodyStopped = false;
        this.updateUI();

        var self = this;
        var step = 0;
        function playNext() {
            if (self.melodyStopped || step >= plantedIndices.length) {
                self.isPlayingMelody = false;
                self.melodyStopped = false;
                self.updateUI();
                return;
            }
            self.clickPlant(plantedIndices[step], true);
            step++;
            setTimeout(playNext, 700);
        }
        playNext();
    }

    /* ---- Harmony: all sing together in tune ---- */
    harmonyChoir() {
        var planted = [];
        for (var i = 0; i < this.plots.length; i++) {
            if (this.plots[i].planted) planted.push(i);
        }
        if (planted.length === 0) {
            this.showToast('Plant some flowers first!');
            return;
        }
        var self = this;
        var singers = [];
        /* Only grown, non-dizzy plants join: seeds are too small,
           sprouts contribute a single note, blooms sing their phrase. */
        planted.forEach(function(idx) {
            var plot = self.plots[idx];
            if (plot.stage === 0 || plot.dizzy) return;
            if (plot.sleeping) self._wakePlot(idx);
            singers.push(idx);
        });
        if (singers.length === 0) {
            this.showToast('Wait for the little ones to grow!');
            return;
        }
        singers.forEach(function(idx) {
            var plot = self.plots[idx];
            var plant = getPlantById(plot.plantType);
            if (!plant) return;
            var wl = Math.max(plot.waterLevel, 1);
            var notes = plot.stage === 1 ? [plant.audio.notes[0]] : plant.audio.notes;
            var phrase = self.audio.singPhrase(plant.id, notes, wl, { stepMs: 300 });
            phrase.forEach(function(syll) {
                setTimeout(function() {
                    self.effects.spawnNote(plot.element, plant.colors.primary, syll.text);
                }, syll.t);
            });
            self._triggerSingVisual(idx, plant);
            plot.lastTouch = Date.now();
        });
        this.effects.spawnLightRays(this.plots[singers[0]].element);
        this.audio.playCheer();
        setTimeout(function() { self.audio.playWhistle(1200); }, 300 + Math.random() * 300);
        this.showToast('Garden in harmony! \u266C');
    }

    /* ---- Chaos ---- */
    chaosChoir() {
        var planted = [];
        for (var i = 0; i < this.plots.length; i++) {
            if (this.plots[i].planted) planted.push(i);
        }
        if (planted.length === 0) {
            this.showToast('Plant some flowers first!');
            return;
        }
        /* every transpose keeps notes inside the shared C-major pentatonic
           scale, so even chaos stays musical */
        var transposes = [-12, -5, 0, 12];
        var self = this;
        var singers = [];
        planted.forEach(function(idx) {
            var plot = self.plots[idx];
            if (plot.stage === 0 || plot.dizzy) return;
            if (plot.sleeping) self._wakePlot(idx);
            singers.push(idx);
        });
        if (singers.length === 0) {
            this.showToast('Wait for the little ones to grow!');
            return;
        }
        singers.forEach(function(idx, n) {
            var plot = self.plots[idx];
            var plant = getPlantById(plot.plantType);
            if (!plant) return;
            var tr = transposes[Math.floor(Math.random() * transposes.length)];
            var wl = Math.max(plot.waterLevel, 2);
            var notes = plot.stage === 1 ? [plant.audio.notes[0]] : plant.audio.notes;
            var phrase = self.audio.singPhrase(plant.id, notes, wl, { transpose: tr });
            phrase.forEach(function(syll) {
                setTimeout(function() {
                    self.effects.spawnNote(plot.element, plant.colors.primary, syll.text);
                    if (Math.random() < 0.35) self.effects.spawnSparkles(plot.element);
                }, syll.t + n * 120);
            });
            self._triggerSingVisual(idx, plant);
            plot.lastTouch = Date.now();
        });
        this.showToast('TOTAL GARDEN CHAOS!');
        setTimeout(function() { self.audio.playBurp(); }, 500 + Math.random() * 700);
        setTimeout(function() { self.audio.playRaspberry(); }, 900 + Math.random() * 900);
        setTimeout(function() { self.audio.playGiggle(380); }, 1300 + Math.random() * 600);
        /* Chaos always ends with a garden-wide hiccup and a stray sneeze. */
        setTimeout(function() {
            var all = [];
            for (var q = 0; q < self.plots.length; q++) {
                var pp = self.plots[q];
                if (pp.planted && !pp.dizzy && !pp.sleeping) all.push(q);
            }
            self.audio.playHiccup();
            if (all.length) self._sneeze(all[Math.floor(Math.random() * all.length)], 0);
        }, 1800 + Math.random() * 400);
    }

    /* ---- Clear ---- */
    clearGarden() {
        this.melodyStopped = true;
        this.isPlayingMelody = false;
        for (var i = 0; i < this.plots.length; i++) {
            var plot = this.plots[i];
            if (plot.growTimers) plot.growTimers.forEach(clearTimeout);
            plot.growTimers = [];
            plot.planted = false;
            plot.plantType = null;
            plot.waterLevel = 0;
            plot.stage = 0;
            plot.sleeping = false;
            plot.dizzy = false;
            plot.clickTimes.length = 0;
            plot.lastTouch = Date.now();
            plot.lastBlush = 0;
            var container = plot.element.querySelector('.plant-container');
            container.innerHTML = '';
            container.className = 'plant-container';
            plot.element.classList.remove('water-mode', 'can-plant', 'plot-singing',
                'plant-sleeping', 'plant-dizzy', 'plant-tickle', 'plant-blush',
                'plant-sneeze', 'plant-cough', 'stage-seed', 'stage-sprout', 'stage-bloom');
            plot.element.style.setProperty('--lean', '0deg');
            var bubble = plot.element.querySelector('.speech-bubble');
            if (bubble) bubble.remove();
        }
        this.mode = MODES.PLANT;
        this.effects.clear();
        this.updateUI();
        this.showToast('Garden cleared!');
    }

    /* ---- Mute ---- */
    toggleMute() {
        this.muted = !this.muted;
        this.audio.setMuted(this.muted);
        this.updateUI();
        this.showToast(this.muted ? 'Muted' : 'Sound on');
    }

    /* ---- Day / Night ---- */
    toggleDayNight() {
        this.isNight = !this.isNight;
        this.applyDayNight();
        if (this.isNight) {
            this.showToast('Night falls... the garden glows.');
        } else {
            this.showToast('Morning breaks!');
        }
        this._reactDayNight();
        this.updateUI();
    }

    applyDayNight() {
        if (this.isNight) {
            document.body.classList.remove('day');
        } else {
            document.body.classList.add('day');
        }
    }

    /* ---- Help ---- */
    showHelp() {
        document.getElementById('help-modal').classList.remove('hidden');
    }
    hideHelp() {
        document.getElementById('help-modal').classList.add('hidden');
    }

    /* ---- Wrap SVG ---- */
    _wrapPlantSVG(svgString) {
        return '<div class="plant-sway-wrapper"><div class="plant-sing-wrapper">' +
            svgString + '</div></div>';
    }

    /* ---- Update UI ---- */
    updateUI() {
        var buttons = document.querySelectorAll('.plant-btn');
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].dataset.plantId === this.selectedPlantType) {
                buttons[i].classList.add('selected');
            } else {
                buttons[i].classList.remove('selected');
            }
        }

        var modeBtns = document.querySelectorAll('.mode-btn');
        for (var m = 0; m < modeBtns.length; m++) {
            if (modeBtns[m].dataset.mode === this.mode) {
                modeBtns[m].classList.add('active');
            } else {
                modeBtns[m].classList.remove('active');
            }
        }

        var playBtn = document.getElementById('play-btn');
        var playLabel = playBtn.querySelector('.d-lbl');
        var playIcon = playBtn.querySelector('.d-ico');
        if (this.isPlayingMelody) {
            playBtn.classList.add('playing');
            playLabel.textContent = 'Stop';
            playIcon.textContent = '\u23F9';
        } else {
            playBtn.classList.remove('playing');
            playLabel.textContent = 'Play';
            playIcon.textContent = '\u25B6';
        }

        var muteBtn = document.getElementById('mute-btn');
        muteBtn.textContent = this.muted ? '\uD83D\uDD07' : '\uD83D\uDD0A';

        var timeBtn = document.getElementById('time-btn');
        timeBtn.textContent = this.isNight ? '\uD83C\uDF19' : '\u2600\uFE0F';

        for (var j = 0; j < this.plots.length; j++) {
            var plot = this.plots[j];
            var el = plot.element;

            el.classList.remove('water-mode', 'conduct-mode');
            if (this.mode === MODES.WATER && plot.planted) el.classList.add('water-mode');
            if (this.mode === MODES.CONDUCT && plot.planted) el.classList.add('conduct-mode');

            if (!plot.planted && this.mode === MODES.PLANT && this.selectedPlantType) {
                el.classList.add('can-plant');
            } else {
                el.classList.remove('can-plant');
            }

            var indicator = el.querySelector('.water-level-indicator');
            if (indicator) {
                if (plot.planted && plot.waterLevel > 0) {
                    var html = '';
                    for (var k = 0; k < plot.waterLevel; k++) {
                        html += '<span class="water-dot"></span>';
                    }
                    indicator.innerHTML = html;
                } else {
                    indicator.innerHTML = '';
                }
            }
        }
    }

    /* ---- Animation loop ---- */
    startAnimationLoop() {
        var self = this;
        function loop() {
            self.effects.update();
            requestAnimationFrame(loop);
        }
        loop();
    }
}

/* ---- Boot ---- */
document.addEventListener('DOMContentLoaded', function() {
    var game = new Game();
    game.init();
    window._game = game;
});
