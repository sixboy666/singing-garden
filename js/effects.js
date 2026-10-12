/* ============================================
   SINGING GARDEN - Effects / Particle System
   Canvas-based particle effects for notes, water, sparkles
   ============================================ */

class EffectsCanvas {
    constructor() {
        this.canvas = null;
        this.ctx2d = null;
        this.particles = [];
        this.noteSymbols = ['\u266A', '\u266B', '\u2669', '\u266C'];
        this.dpr = 1;
    }

    /* Initialize the canvas */
    init(canvas) {
        this.canvas = canvas;
        this.ctx2d = canvas.getContext('2d');
        this.resize();
        var self = this;
        window.addEventListener('resize', function() { self.resize(); });
        window.addEventListener('orientationchange', function() { self.resize(); });
    }

    /* Resize canvas to match its display size */
    resize() {
        if (!this.canvas) return;
        this.dpr = window.devicePixelRatio || 1;
        var w = this.canvas.offsetWidth;
        var h = this.canvas.offsetHeight;
        this.canvas.width = Math.max(1, Math.floor(w * this.dpr));
        this.canvas.height = Math.max(1, Math.floor(h * this.dpr));
        this.ctx2d.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    /* Get canvas-relative coordinates from a DOM element's position */
    _toCanvasRect(element) {
        var canvasRect = this.canvas.getBoundingClientRect();
        var elRect = element.getBoundingClientRect();
        return {
            x: elRect.left - canvasRect.left + elRect.width / 2,
            y: elRect.top - canvasRect.top,
            w: elRect.width,
            h: elRect.height
        };
    }

    /* Spawn floating music note particles */
    spawnNote(element, color) {
        var r = this._toCanvasRect(element);
        var count = 3;
        for (var i = 0; i < count; i++) {
            this.particles.push({
                type: 'note',
                x: r.x + (Math.random() - 0.5) * r.w * 0.4,
                y: r.y + r.h * 0.3 + (Math.random() - 0.5) * 10,
                vx: (Math.random() - 0.5) * 0.8,
                vy: -0.8 - Math.random() * 0.6,
                life: 1.0,
                decay: 0.008,
                size: 18 + Math.random() * 10,
                color: color,
                symbol: this.noteSymbols[Math.floor(Math.random() * this.noteSymbols.length)],
                rotation: (Math.random() - 0.5) * 0.5,
                rotSpeed: (Math.random() - 0.5) * 0.03,
                wobble: Math.random() * Math.PI * 2,
            });
        }
    }

    /* Spawn water drop particles */
    spawnWaterDrops(element) {
        var r = this._toCanvasRect(element);
        var count = 10;
        for (var i = 0; i < count; i++) {
            this.particles.push({
                type: 'water',
                x: r.x + (Math.random() - 0.5) * r.w * 0.5,
                y: r.y - 10,
                vx: (Math.random() - 0.5) * 2.5,
                vy: 0.5 + Math.random() * 1.5,
                life: 1.0,
                decay: 0.02,
                size: 2.5 + Math.random() * 2.5,
                color: '#4FC3F7',
                gravity: 0.15,
            });
        }
    }

    /* Spawn sparkle particles (for planting) */
    spawnSparkles(element) {
        var r = this._toCanvasRect(element);
        var count = 14;
        for (var i = 0; i < count; i++) {
            var angle = Math.random() * Math.PI * 2;
            var speed = 1 + Math.random() * 2.5;
            this.particles.push({
                type: 'sparkle',
                x: r.x,
                y: r.y + r.h * 0.4,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 0.5,
                life: 1.0,
                decay: 0.015,
                size: 2 + Math.random() * 3,
                color: '#FFD700',
                gravity: 0.05,
            });
        }
    }

    /* Update and draw all particles; called every frame */
    update() {
        if (!this.ctx2d) return;
        var w = this.canvas.offsetWidth;
        var h = this.canvas.offsetHeight;
        this.ctx2d.clearRect(0, 0, w, h);

        var surviving = [];
        for (var i = 0; i < this.particles.length; i++) {
            var p = this.particles[i];

            // Physics
            p.x += p.vx;
            p.y += p.vy;

            if (p.type === 'note') {
                p.vy *= 0.99;
                p.vy = Math.max(p.vy, -1.5);
                p.vx *= 0.995;
                p.rotation += p.rotSpeed;
                p.wobble += 0.08;
                p.x += Math.sin(p.wobble) * 0.3;
            } else if (p.type === 'water') {
                p.vy += p.gravity;
            } else if (p.type === 'sparkle') {
                p.vy += p.gravity;
                p.vx *= 0.97;
            }

            p.life -= p.decay;

            if (p.life > 0 && p.y < h + 50 && p.y > -50) {
                this._draw(p);
                surviving.push(p);
            }
        }
        this.particles = surviving;
    }

    /* Draw a single particle */
    _draw(p) {
        var ctx = this.ctx2d;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));

        if (p.type === 'note') {
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.font = p.size + 'px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 6;
            ctx.fillText(p.symbol, 0, 0);
        } else if (p.type === 'water') {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.beginPath();
            ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.35, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.type === 'sparkle') {
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    /* Clear all particles */
    clear() {
        this.particles = [];
    }
}
