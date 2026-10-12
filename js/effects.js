/* ============================================
   SINGING GARDEN - Premium Particle System
   Canvas-based effects: notes, hearts, petals,
   sparkles, water drops, light rays
   ============================================ */

class EffectsCanvas {
    constructor() {
        this.canvas = null;
        this.ctx2d = null;
        this.particles = [];
        this.noteSymbols = ['\u266A', '\u266B', '\u2669', '\u266C'];
        this.dpr = 1;
    }

    init(canvas) {
        this.canvas = canvas;
        this.ctx2d = canvas.getContext('2d');
        this.resize();
        var self = this;
        window.addEventListener('resize', function() { self.resize(); });
        window.addEventListener('orientationchange', function() { self.resize(); });
    }

    resize() {
        if (!this.canvas) return;
        this.dpr = window.devicePixelRatio || 1;
        var w = this.canvas.offsetWidth;
        var h = this.canvas.offsetHeight;
        this.canvas.width = Math.max(1, Math.floor(w * this.dpr));
        this.canvas.height = Math.max(1, Math.floor(h * this.dpr));
        this.ctx2d.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

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

    /* Spawn floating music notes with glow */
    spawnNote(element, color) {
        var r = this._toCanvasRect(element);
        var count = 4;
        for (var i = 0; i < count; i++) {
            this.particles.push({
                type: 'note',
                x: r.x + (Math.random() - 0.5) * r.w * 0.5,
                y: r.y + r.h * 0.3 + (Math.random() - 0.5) * 12,
                vx: (Math.random() - 0.5) * 1.2,
                vy: -1.0 - Math.random() * 0.8,
                life: 1.0,
                decay: 0.006,
                size: 22 + Math.random() * 12,
                color: color,
                symbol: this.noteSymbols[Math.floor(Math.random() * this.noteSymbols.length)],
                rotation: (Math.random() - 0.5) * 0.6,
                rotSpeed: (Math.random() - 0.5) * 0.04,
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: 0.08 + Math.random() * 0.04
            });
        }
    }

    /* Spawn water drops with sparkle highlights */
    spawnWaterDrops(element) {
        var r = this._toCanvasRect(element);
        var count = 14;
        for (var i = 0; i < count; i++) {
            this.particles.push({
                type: 'water',
                x: r.x + (Math.random() - 0.5) * r.w * 0.6,
                y: r.y - 10,
                vx: (Math.random() - 0.5) * 3,
                vy: 0.5 + Math.random() * 2,
                life: 1.0,
                decay: 0.018,
                size: 3 + Math.random() * 3,
                color: '#4FC3F7',
                gravity: 0.18
            });
        }
    }

    /* Spawn sparkles with golden glow (planting) */
    spawnSparkles(element) {
        var r = this._toCanvasRect(element);
        var count = 18;
        for (var i = 0; i < count; i++) {
            var angle = Math.random() * Math.PI * 2;
            var speed = 1.2 + Math.random() * 3;
            this.particles.push({
                type: 'sparkle',
                x: r.x,
                y: r.y + r.h * 0.5,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 0.8,
                life: 1.0,
                decay: 0.012,
                size: 2.5 + Math.random() * 3.5,
                color: ['#FFD700', '#FF6BD8', '#4FD8E8', '#FFFFFF'][Math.floor(Math.random() * 4)],
                gravity: 0.06,
                twinkle: Math.random() * Math.PI * 2
            });
        }
    }

    /* Spawn floating hearts (for friendly interactions) */
    spawnHearts(element) {
        var r = this._toCanvasRect(element);
        var count = 4;
        for (var i = 0; i < count; i++) {
            this.particles.push({
                type: 'heart',
                x: r.x + (Math.random() - 0.5) * r.w * 0.4,
                y: r.y + r.h * 0.4,
                vx: (Math.random() - 0.5) * 0.8,
                vy: -0.7 - Math.random() * 0.5,
                life: 1.0,
                decay: 0.008,
                size: 14 + Math.random() * 8,
                color: ['#FF6B9D', '#FF8FB1', '#FFB6C1'][Math.floor(Math.random() * 3)],
                rotation: (Math.random() - 0.5) * 0.4,
                rotSpeed: (Math.random() - 0.5) * 0.02,
                wobble: Math.random() * Math.PI * 2
            });
        }
    }

    /* Spawn drifting flower petals */
    spawnPetals(element, color) {
        var r = this._toCanvasRect(element);
        var count = 6;
        for (var i = 0; i < count; i++) {
            this.particles.push({
                type: 'petal',
                x: r.x + (Math.random() - 0.5) * r.w * 0.5,
                y: r.y + r.h * 0.2,
                vx: (Math.random() - 0.5) * 1.5,
                vy: -0.4 - Math.random() * 0.6,
                life: 1.0,
                decay: 0.007,
                size: 6 + Math.random() * 5,
                color: color || '#FF6BD8',
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.08,
                wobble: Math.random() * Math.PI * 2,
                gravity: 0.04
            });
        }
    }

    /* Spawn radial light rays (for special moments) */
    spawnLightRays(element) {
        var r = this._toCanvasRect(element);
        var cx = r.x;
        var cy = r.y + r.h * 0.5;
        for (var i = 0; i < 8; i++) {
            var angle = (i / 8) * Math.PI * 2;
            this.particles.push({
                type: 'ray',
                x: cx,
                y: cy,
                startX: cx,
                startY: cy,
                angle: angle,
                length: 0,
                maxLength: 80 + Math.random() * 40,
                life: 1.0,
                decay: 0.02,
                color: '#FFD700',
                width: 2 + Math.random() * 2
            });
        }
    }

    update() {
        if (!this.ctx2d) return;
        var w = this.canvas.offsetWidth;
        var h = this.canvas.offsetHeight;
        this.ctx2d.clearRect(0, 0, w, h);

        var surviving = [];
        for (var i = 0; i < this.particles.length; i++) {
            var p = this.particles[i];

            p.x += p.vx;
            p.y += p.vy;

            if (p.type === 'note') {
                p.vy *= 0.99;
                p.vy = Math.max(p.vy, -1.6);
                p.vx *= 0.995;
                p.rotation += p.rotSpeed;
                p.wobble += p.wobbleSpeed;
                p.x += Math.sin(p.wobble) * 0.4;
            } else if (p.type === 'water') {
                p.vy += p.gravity;
            } else if (p.type === 'sparkle') {
                p.vy += p.gravity;
                p.vx *= 0.97;
                p.twinkle += 0.2;
            } else if (p.type === 'heart') {
                p.vy *= 0.99;
                p.vy = Math.max(p.vy, -1.2);
                p.vx *= 0.99;
                p.rotation += p.rotSpeed;
                p.wobble += 0.1;
                p.x += Math.sin(p.wobble) * 0.3;
            } else if (p.type === 'petal') {
                p.vy += p.gravity;
                p.vx *= 0.985;
                p.rotation += p.rotSpeed;
                p.wobble += 0.07;
                p.x += Math.sin(p.wobble) * 0.5;
            } else if (p.type === 'ray') {
                p.length += (p.maxLength - p.length) * 0.15;
            }

            p.life -= p.decay;

            if (p.life > 0 && p.y < h + 60 && p.y > -60) {
                this._draw(p);
                surviving.push(p);
            }
        }
        this.particles = surviving;
    }

    _draw(p) {
        var ctx = this.ctx2d;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));

        if (p.type === 'note') {
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.font = 'bold ' + p.size + 'px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 12;
            ctx.fillText(p.symbol, 0, 0);
            /* Add a soft white halo */
            ctx.shadowBlur = 4;
            ctx.shadowColor = '#fff';
            ctx.globalAlpha = Math.max(0, Math.min(1, p.life)) * 0.4;
            ctx.fillText(p.symbol, 0, 0);
        } else if (p.type === 'water') {
            /* Outer drop */
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, p.size, p.size * 1.3, 0, 0, Math.PI * 2);
            ctx.fill();
            /* Highlight */
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.beginPath();
            ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.4, p.size * 0.35, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.type === 'sparkle') {
            var s = Math.max(0.5, p.size * (0.7 + Math.sin(p.twinkle) * 0.3));
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 14;
            ctx.beginPath();
            ctx.arc(p.x, p.y, s, 0, Math.PI * 2);
            ctx.fill();
            /* 4-point star shape */
            ctx.shadowBlur = 4;
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x - s * 2, p.y);
            ctx.lineTo(p.x + s * 2, p.y);
            ctx.moveTo(p.x, p.y - s * 2);
            ctx.lineTo(p.x, p.y + s * 2);
            ctx.stroke();
        } else if (p.type === 'heart') {
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            var hs = p.size / 2;
            ctx.beginPath();
            ctx.moveTo(0, hs * 0.4);
            ctx.bezierCurveTo(-hs, -hs * 0.5, -hs * 1.4, hs * 0.2, 0, hs * 1.4);
            ctx.bezierCurveTo(hs * 1.4, hs * 0.2, hs, -hs * 0.5, 0, hs * 0.4);
            ctx.fill();
        } else if (p.type === 'petal') {
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, Math.PI * 2);
            ctx.fill();
            /* Highlight */
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.ellipse(-p.size * 0.2, -p.size * 0.1, p.size * 0.4, p.size * 0.18, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.type === 'ray') {
            ctx.translate(p.startX, p.startY);
            ctx.rotate(p.angle);
            var grad = ctx.createLinearGradient(0, 0, p.length, 0);
            grad.addColorStop(0, p.color);
            grad.addColorStop(1, 'rgba(255,215,0,0)');
            ctx.strokeStyle = grad;
            ctx.lineWidth = p.width;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(p.length, 0);
            ctx.stroke();
        }

        ctx.restore();
    }

    clear() {
        this.particles = [];
    }
}
