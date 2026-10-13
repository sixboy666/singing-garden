/* ============================================
   SINGING GARDEN - Game Controller
   Main game logic: planting, singing, watering, melody
   8 plots, 12 plant types with unique animations
   v7: anthropomorphic reactions (sleep, dizzy, tickle,
   overwater hiccups, silly speech bubbles, cursor lean)
   ============================================ */

/* Absurd one-liners for speech bubbles (context-keyed) */
var SILLY_LINES = {
    click: [
        'Again! Again!', 'Do I know you?', 'That tickles!',
        'I was BORN ready.', 'Encore? Obviously.',
        'I practice 8 hours a day.', "You're poking a masterpiece.",
        'Ahem. AHEM. Thanks.'
    ],
    water: [
        'Hydration station!', 'Mmm, vintage rain.',
        'Right in the roots!', 'Spa day! Spa day!',
        'Just what the doctor ordered.'
    ],
    overwater: [
        '*BUUURP* ...pardon.', "I'm full! I'm FULL!",
        'Blub blub. Help. Blub.', 'Water... everywhere...',
        'I said SIP, not OCEAN.'
    ],
    wake: [
        'Five more minutes...', "I wasn't sleeping! I swear!",
        'Wha— who's there?!', 'Morning already?',
        '*yawn* ...I was dreaming of applause.'
    ],
    dizzy: [
        'Whoa whoa WHOA...', 'The garden is SPINNING!',
        'Too! Many! Pokes!', 'I see stars... pretty stars...'
    ],
    tickle: [
        'Hee hee hee!', 'Not the LEAVES!', 'Stooop! ...okay continue.',
        'Eeheeheehee!', 'Ha! HA! Mercy!'
    ]
};

var SLEEP_AFTER_MS = 25000;   /* ignored plant dozes off */
var DIZZY_CLICKS = 4;         /* rapid clicks to make dizzy */
var DIZZY_WINDOW_MS = 1800;
var DIZZY_LAST_MS = 2000;
var TICKLE_COOLDOWN_MS = 1400;

class Game {
    constructor() {
        this.audio = new AudioEngine();
        this.effects = new EffectsCanvas();
        this.plots = [];
        this.selectedPlantType = null;
        this.waterMode = false;
        this.muted = false;
        this.isPlayingMelody = false;
        this.melodyStopped = false;
        this._toastTimer = null;
        this._idleTimer = null;
        this._leanRaf = 0;
        this._cursorX = -9999;
        this._cursorY = -9999;
        this._pointerDown = false;
    }

    /* ---- Initialization ---- */
    init() {
        this.createToast();
        this.createPlots();
        this.createPlantButtons();
        this.setupStartScreen();
        this.setupControls();
        this.setupKeyboard();
        this.effects.init(document.getElementById('effects-canvas'));
        this.selectedPlantType = PLANT_TYPES[0].id;
        this.updateUI();
        this.startAnimationLoop();
        this._startIdleLoop();
        this._setupLean();
        this._setupTickle();
    }

    /* ---- Toast notification ---- */
    createToast() {
        var toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.cssText =
            'position:absolute;top:55%;left:50%;transform:translate(-50%,-50%);' +
            'background:rgba(0,0,0,0.75);color:#fff;padding:12px 28px;border-radius:12px;' +
            'font-size:0.9rem;z-index:200;pointer-events:none;opacity:0;' +
            'transition:opacity 0.3s ease;font-family:Nunito,sans-serif;font-weight:700;' +
            'white-space:nowrap;box-shadow:0 4px 15px rgba(0,0,0,0.3);';
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
            self.playWelcomeSound();
        });
    }

    showGardenScreen() {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('garden-screen').classList.remove('hidden');
        var self = this;
        setTimeout(function() { self.effects.resize(); }, 150);
    }

    /* A friendly little "Mm-hmm-mmm~" hum to open the garden */
    playWelcomeSound() {
        this.audio.singPhrase('hum', [261.63, 329.63, 392.00, 523.25], 1, { stepMs: 190 });
    }

    /* ---- Plot creation (8 plots in 4x2 grid) ---- */
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
                lastTickle: 0
            });
        }
    }

    /* ---- Silly speech bubble above a plot ---- */
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

    /* ---- Wake a sleeping plant (yawn + protest) ---- */
    _wakePlot(index) {
        var plot = this.plots[index];
        plot.sleeping = false;
        plot.element.classList.remove('plant-sleeping');
        this.audio.playYawn();
        this._speakRandom(index, 'wake');
    }

    /* ---- Idle loop: unloved plants doze off and snore ---- */
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
                    if (Math.random() < 0.55) {
                        self.effects.spawnZzz(plot.element);
                    }
                    if (Math.random() < 0.12) {
                        self.audio.playSnore();
                    }
                }
            }
        }, 1400);
    }

    /* ---- Plants lean toward the cursor (they're nosy) ---- */
    _setupLean() {
        var self = this;
        var garden = document.getElementById('garden-area');
        garden.addEventListener('pointermove', function(e) {
            self._cursorX = e.clientX;
            self._cursorY = e.clientY;
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
            /* Lean only when cursor is near-ish; stronger when closer */
            var maxLean = 7;
            var strength = Math.max(0, 1 - dist / 480);
            var deg = Math.max(-maxLean, Math.min(maxLean, (dx / 60) * strength * maxLean));
            plot.element.style.setProperty('--lean', deg.toFixed(2) + 'deg');
        }
    }

    /* ---- Tickle: drag across a plant with pointer held ---- */
    _setupTickle() {
        var self = this;
        document.addEventListener('pointerdown', function() { self._pointerDown = true; });
        document.addEventListener('pointerup', function() { self._pointerDown = false; });
        document.addEventListener('pointercancel', function() { self._pointerDown = false; });
        var container = document.getElementById('plots-container');
        container.addEventListener('pointerover', function(e) {
            if (!self._pointerDown) return;
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

    /* ---- Dizzy: poked too many times too fast ---- */
    _makeDizzy(index) {
        var plot = this.plots[index];
        var self = this;
        plot.dizzy = true;
        plot.element.classList.add('plant-dizzy');
        this.audio.playBoing();
        this.audio.playRaspberry();
        this.effects.spawnDizzyStars(plot.element);
        this._speakRandom(index, 'dizzy');
        setTimeout(function() {
            plot.dizzy = false;
            plot.element.classList.remove('plant-dizzy');
        }, DIZZY_LAST_MS);
    }

    /* ---- Plant selection buttons ---- */
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

    /* ---- Controls setup ---- */
    setupControls() {
        var self = this;

        document.getElementById('water-btn').addEventListener('click', function() {
            self.toggleWaterMode();
        });

        document.getElementById('play-btn').addEventListener('click', function() {
            self.playMelody();
        });

        document.getElementById('clear-btn').addEventListener('click', function() {
            self.clearGarden();
        });

        document.getElementById('chaos-btn').addEventListener('click', function() {
            self.chaosChoir();
        });

        document.getElementById('mute-btn').addEventListener('click', function() {
            self.toggleMute();
        });

        document.getElementById('help-btn').addEventListener('click', function() {
            self.showHelp();
        });

        document.getElementById('close-help-btn').addEventListener('click', function() {
            self.hideHelp();
        });

        document.getElementById('help-modal').addEventListener('click', function(e) {
            if (e.target === this) {
                self.hideHelp();
            }
        });
    }

    /* ---- Keyboard shortcuts ---- */
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
                case 'w': case 'W':
                    self.toggleWaterMode();
                    break;
                case 'c': case 'C':
                    self.clearGarden();
                    break;
                case 'm': case 'M':
                    self.toggleMute();
                    break;
                case 'x': case 'X':
                    self.chaosChoir();
                    break;
                case 'h': case 'H':
                    self.showHelp();
                    break;
                default:
                    /* Number keys 1-9 select plants 1-9 */
                    if (e.key >= '1' && e.key <= '9') {
                        var idx = parseInt(e.key) - 1;
                        if (idx < PLANT_TYPES.length) {
                            self.selectPlantType(PLANT_TYPES[idx].id);
                        }
                    }
                    break;
            }
        });
    }

    /* ---- Plant selection ---- */
    selectPlantType(plantId) {
        this.selectedPlantType = plantId;
        this.waterMode = false;
        this.updateUI();
    }

    /* ---- Plot click handler ---- */
    handlePlotClick(index) {
        if (index < 0 || index >= this.plots.length) return;
        var plot = this.plots[index];

        if (this.waterMode) {
            if (plot.planted) {
                this.waterPlant(index);
            } else {
                /* Watering dirt deserves ridicule */
                this.audio.playRaspberry();
                this.audio.playSplat();
                this.showToast('You watered... dirt. It is unimpressed.');
            }
        } else {
            if (!plot.planted) {
                this.plantInPlot(index);
            } else {
                this.clickPlant(index);
            }
        }
    }

    /* ---- Plant in a plot ---- */
    plantInPlot(index) {
        var plant = getPlantById(this.selectedPlantType);
        if (!plant) return;
        var plot = this.plots[index];
        plot.planted = true;
        plot.plantType = plant.id;
        plot.waterLevel = 0;

        var container = plot.element.querySelector('.plant-container');
        container.innerHTML = this._wrapPlantSVG(plant.renderSVG(0));
        container.className = 'plant-container plant-swaying ' + plant.animClass + ' plant-growing';
        setTimeout(function() {
            container.classList.remove('plant-growing');
        }, 600);

        /* Curious little "hm?" when planted */
        plot.lastTouch = Date.now();
        this.audio.playVoice(plant.id, plant.audio.notes[0], 0, 150);
        this.effects.spawnSparkles(plot.element);
        this.effects.spawnPetals(plot.element, plant.colors.primary);
        this.updateUI();
    }

    /* ---- Click a planted plot (sing) ---- */
    clickPlant(index, fromMelody) {
        var plot = this.plots[index];
        if (!plot.planted) return;
        var plant = getPlantById(plot.plantType);
        if (!plant) return;

        var self = this;

        /* v7: wake if sleeping, count rapid pokes for dizzy */
        plot.lastTouch = Date.now();
        if (plot.sleeping) this._wakePlot(index);
        if (plot.dizzy) return; /* too dizzy to sing right now */

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

        /* Humanoid voice: sing a silly syllable phrase */
        var phrase = this.audio.singPhrase(plant.id, plant.audio.notes, plot.waterLevel);

        /* Restart singing animation with plant's unique animClass */
        var container = plot.element.querySelector('.plant-container');
        container.classList.remove('plant-singing');
        void container.offsetWidth;
        container.classList.add('plant-singing');
        setTimeout(function() {
            container.classList.remove('plant-singing');
        }, 800);

        plot.element.classList.add('plot-singing');
        setTimeout(function() {
            plot.element.classList.remove('plot-singing');
        }, 600);

        /* Spawn singing word critters synced to the voice */
        phrase.forEach(function(syll) {
            setTimeout(function() {
                self.effects.spawnNote(plot.element, plant.colors.primary, syll.text);
            }, syll.t);
        });
        if (plot.waterLevel >= 2) {
            setTimeout(function() {
                self.effects.spawnNote(plot.element, plant.colors.secondary, phrase.length ? phrase[0].text : 'La');
            }, 60);
            if (Math.random() < 0.5) {
                setTimeout(function() {
                    self.effects.spawnHearts(plot.element);
                    self.effects.spawnLightRays(plot.element);
                }, 320);
            }
        }
    }

    /* ---- Water a plant ---- */
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
        container.className = 'plant-container plant-swaying ' + plant.animClass + ' plant-singing';
        setTimeout(function() {
            container.classList.remove('plant-singing');
        }, 600);

        this.effects.spawnWaterDrops(plot.element);

        /* v7: overwater = hiccup + burp + bubbles + silly line */
        if (plot.waterLevel === 3) {
            this.audio.playHiccup();
            setTimeout(function() { self.audio.playBurp(); }, 160);
            this.effects.spawnBubbles(plot.element);
            this._speakRandom(index, 'overwater');
        } else {
            this._speakRandom(index, 'water');
            /* Happy rising "glug-ah!" */
            this.audio.playVoice(plant.id, plant.audio.notes[0], plot.waterLevel, 0);
            this.audio.playVoice(plant.id, plant.audio.notes[0] * 1.33, plot.waterLevel, 150);
        }

        var labels = ['Dry', 'Watered', 'Well-watered', 'Lush!'];
        this.showToast(plant.name + ': ' + labels[plot.waterLevel]);

        this.updateUI();
    }

    /* ---- Toggle water mode ---- */
    toggleWaterMode() {
        this.waterMode = !this.waterMode;
        if (this.waterMode) {
            this.showToast('Water mode on! Click a plant to water it.');
        }
        this.updateUI();
    }

    /* ---- Play melody (all plants in sequence) ---- */
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
            setTimeout(playNext, 750);
        }
        playNext();
    }

    /* ---- CHAOS CHOIR: every plant sings at once, absurdly ---- */
    chaosChoir() {
        var planted = [];
        for (var i = 0; i < this.plots.length; i++) {
            if (this.plots[i].planted) planted.push(i);
        }
        if (planted.length === 0) {
            this.showToast('Plant some flowers first!');
            return;
        }
        var transposes = [-12, -5, 0, 7, 12];
        var self = this;
        planted.forEach(function(idx, n) {
            var plot = self.plots[idx];
            var plant = getPlantById(plot.plantType);
            if (!plant) return;
            var tr = transposes[Math.floor(Math.random() * transposes.length)];
            var wl = Math.max(plot.waterLevel, 2);
            var phrase = self.audio.singPhrase(plant.id, plant.audio.notes, wl, { transpose: tr });
            phrase.forEach(function(syll) {
                setTimeout(function() {
                    self.effects.spawnNote(plot.element, plant.colors.primary, syll.text);
                    if (Math.random() < 0.35) self.effects.spawnSparkles(plot.element);
                }, syll.t + n * 120);
            });
        });
        this.showToast('TOTAL GARDEN CHAOS!');

        /* v7: someone in the choir burps, someone blows a raspberry */
        setTimeout(function() { self.audio.playBurp(); }, 500 + Math.random() * 700);
        setTimeout(function() { self.audio.playRaspberry(); }, 900 + Math.random() * 900);
        setTimeout(function() { self.audio.playGiggle(380); }, 1300 + Math.random() * 600);
        for (var j = 0; j < planted.length; j++) {
            this.plots[planted[j]].lastTouch = Date.now();
        }
    }

    /* ---- Clear all plants ---- */
    clearGarden() {
        this.melodyStopped = true;
        this.isPlayingMelody = false;

        for (var i = 0; i < this.plots.length; i++) {
            var plot = this.plots[i];
            plot.planted = false;
            plot.plantType = null;
            plot.waterLevel = 0;
            plot.sleeping = false;
            plot.dizzy = false;
            plot.clickTimes.length = 0;
            plot.lastTouch = Date.now();
            var container = plot.element.querySelector('.plant-container');
            container.innerHTML = '';
            container.className = 'plant-container';
            plot.element.classList.remove('water-mode', 'can-plant', 'plot-singing',
                'plant-sleeping', 'plant-dizzy', 'plant-tickle');
            plot.element.style.setProperty('--lean', '0deg');
            var bubble = plot.element.querySelector('.speech-bubble');
            if (bubble) bubble.remove();
        }

        this.waterMode = false;
        this.effects.clear();
        this.updateUI();
        this.showToast('Garden cleared!');
    }

    /* ---- Toggle mute ---- */
    toggleMute() {
        this.muted = !this.muted;
        this.audio.setMuted(this.muted);
        this.updateUI();
        this.showToast(this.muted ? 'Muted' : 'Sound on');
    }

    /* ---- Help modal ---- */
    showHelp() {
        document.getElementById('help-modal').classList.remove('hidden');
    }

    hideHelp() {
        document.getElementById('help-modal').classList.add('hidden');
    }

    /* ---- Wrap SVG with sway/sing wrapper divs ---- */
    _wrapPlantSVG(svgString) {
        return '<div class="plant-sway-wrapper"><div class="plant-sing-wrapper">' +
            svgString + '</div></div>';
    }

    /* ---- Update UI state ---- */
    updateUI() {
        var buttons = document.querySelectorAll('.plant-btn');
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].dataset.plantId === this.selectedPlantType) {
                buttons[i].classList.add('selected');
            } else {
                buttons[i].classList.remove('selected');
            }
        }

        var waterBtn = document.getElementById('water-btn');
        if (this.waterMode) {
            waterBtn.classList.add('active');
        } else {
            waterBtn.classList.remove('active');
        }

        var playBtn = document.getElementById('play-btn');
        var playLabel = playBtn.querySelector('.btn-label');
        var playIcon = playBtn.querySelector('.btn-icon');
        if (this.isPlayingMelody) {
            playBtn.classList.add('playing');
            playLabel.textContent = 'Stop';
            playIcon.textContent = '\u23F9';
        } else {
            playBtn.classList.remove('playing');
            playLabel.textContent = 'Play Melody';
            playIcon.textContent = '\u25B6';
        }

        var muteBtn = document.getElementById('mute-btn');
        muteBtn.textContent = this.muted ? '\uD83D\uDD07' : '\uD83D\uDD0A';

        for (var j = 0; j < this.plots.length; j++) {
            var plot = this.plots[j];
            var el = plot.element;

            if (this.waterMode && plot.planted) {
                el.classList.add('water-mode');
            } else {
                el.classList.remove('water-mode');
            }

            if (!plot.planted && !this.waterMode && this.selectedPlantType) {
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
