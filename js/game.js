/* ============================================
   SINGING GARDEN - Game Controller
   Main game logic: planting, singing, watering, melody
   8 plots, 12 plant types with unique animations
   ============================================ */

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
                element: plot
            });
        }
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
                this.showToast('Nothing to water here!');
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
        this.audio.playVoice(plant.id, plant.audio.notes[0], 0, 150);
        this.effects.spawnSparkles(plot.element);
        this.effects.spawnPetals(plot.element, plant.colors.primary);
        this.updateUI();
    }

    /* ---- Click a planted plot (sing) ---- */
    clickPlant(index) {
        var plot = this.plots[index];
        if (!plot.planted) return;
        var plant = getPlantById(plot.plantType);
        if (!plant) return;

        var self = this;

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
        plot.waterLevel = (plot.waterLevel + 1) % 4;

        var plant = getPlantById(plot.plantType);
        if (!plant) return;

        var container = plot.element.querySelector('.plant-container');
        container.innerHTML = this._wrapPlantSVG(plant.renderSVG(plot.waterLevel));
        container.className = 'plant-container plant-swaying ' + plant.animClass + ' plant-singing';
        setTimeout(function() {
            container.classList.remove('plant-singing');
        }, 600);

        this.effects.spawnWaterDrops(plot.element);
        /* Happy rising "glug-ah!" */
        this.audio.playVoice(plant.id, plant.audio.notes[0], plot.waterLevel, 0);
        this.audio.playVoice(plant.id, plant.audio.notes[0] * 1.33, plot.waterLevel, 150);

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
            self.clickPlant(plantedIndices[step]);
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
            var container = plot.element.querySelector('.plant-container');
            container.innerHTML = '';
            container.className = 'plant-container';
            plot.element.classList.remove('water-mode', 'can-plant', 'plot-singing');
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
