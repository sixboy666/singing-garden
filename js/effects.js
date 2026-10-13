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
        this.ambient = [];
        this.noteSymbols = ['\u266A', '\u266B', '\u2669', '\u266C'];
        this.dpr = 1;
        this._ambientSpawnTimer = 0;
    }

    init(canvas) {
        this.canvas = canvas;
        this.ctx2d = canvas.getContext('2d');
        this.resize();
        this._seedAmbient();
        var self = this;
        window.addEventListener('resize', function() { self.resize(); self._seedAmbient(); });
        window.addEventListener('orientationchange', function() { self.resize(); self._seedAmbient(); });
    }

    _seedAmbient() {
        this.ambient = [];
        var w = this.canvas ? this.canvas.offsetWidth : window.innerWidth;
        var h = this.canvas ? this.canvas.offsetHeight : window.innerHeight;
        var count = Math.min(24, Math.floor(w * h / 30000));
        for (var i = 0; i < count; i++) {
            this.ambient.push(this._makeAmbient(w, h, true));
        }
    }

    _makeAmbient(w, h, randomY) {
        return {
            x: Math.random() * w,
            y: randomY ? Math.random() * h : h + 10,
            vx: (Math.random() - 0.5) * 0.3,
            vy: -0.15 - Math.random() * 0.25,
            size: 1.5 + Math.random() * 2.5,
            color: ['#d4af37', '#c97a8c', '#5a9ba8', '#f5ebd7', '#6b8e7f'][Math.floor(Math.random() * 5)],
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.02 + Math.random() * 0.02,
            opacity: 0.3 + Math.random() * 0.35
        };
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
    spawnNote(element, color, syllable) {
        var r = this._toCanvasRect(element);
        var count = syllable ? 2 : 4;
        for (var i = 0; i < count; i++) {
            this.particles.push({
                type: 'note',
                x: r.x + (Math.random() - 0.5) * r.w * 0.5,
                y: r.y + r.h * 0.3 + (Math.random() - 0.5) * 12,
                vx: (Math.random() - 0.5) * 1.2,
                vy: -1.0 - Math.random() * 0.8,
                life: 1.0,
                decay: syllable ? 0.0045 : 0.006,
                size: syllable ? (30 + Math.random() * 12) : (22 + Math.random() * 12),
                color: color,
                symbol: this.noteSymbols[Math.floor(Math.random() * this.noteSymbols.length)],
                syllable: syllable || null,
                rotation: (Math.random() - 0.5) * 0.4,
                rotSpeed: (Math.random() - 0.5) * 0.025,
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
                color: '#5a9ba8',
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
                color: ['#d4af37', '#c97a8c', '#5a9ba8', '#f5ebd7'][Math.floor(Math.random() * 4)],
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
                color: ['#c97a8c', '#e0a0b0', '#b88a9a'][Math.floor(Math.random() * 3)],
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
                color: color || '#c97a8c',
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
                color: '#d4af37',
                width: 2 + Math.random() * 2
            });
        }
    }

    /* Spawn sleepy "Z" letters drifting up (snoozing plant) */
    spawnZzz(element) {
        var r = this._toCanvasRect(element);
        this.particles.push({
            type: 'zzz',
            x: r.x + r.w * 0.28,
            y: r.y + r.h * 0.15,
            vx: 0.25 + Math.random() * 0.2,
            vy: -0.45 - Math.random() * 0.25,
            life: 1.0,
            decay: 0.007,
            size: 13 + Math.random() * 7,
            rotation: 0.15,
            wobble: Math.random() * Math.PI * 2
        });
    }

    /* Spawn hiccup bubbles (overwatered plant) */
    spawnBubbles(element) {
        var r = this._toCanvasRect(element);
        for (var i = 0; i < 6; i++) {
            this.particles.push({
                type: 'bubble',
                x: r.x + (Math.random() - 0.5) * r.w * 0.5,
                y: r.y + r.h * 0.3 + Math.random() * 10,
                vx: (Math.random() - 0.5) * 0.6,
                vy: -0.7 - Math.random() * 0.7,
                life: 1.0,
                decay: 0.011 + Math.random() * 0.008,
                size: 3.5 + Math.random() * 5,
                wobble: Math.random() * Math.PI * 2
            });
        }
    }

    /* Spawn dizzy stars orbiting the plant's head */
    spawnDizzyStars(element) {
        var r = this._toCanvasRect(element);
        var cx = r.x;
        var cy = r.y + r.h * 0.15;
        for (var i = 0; i < 5; i++) {
            this.particles.push({
                type: 'dizzystar',
                cx: cx, cy: cy,
                x: cx, y: cy,
                angle: (i / 5) * Math.PI * 2,
                orbitSpeed: 0.09 + Math.random() * 0.02,
                radius: r.w * 0.32,
                life: 1.0,
                decay: 0.009,
                size: 3 + Math.random() * 2,
                color: ['#d4af37', '#f5ebd7', '#e8c976'][Math.floor(Math.random() * 3)]
            });
        }
    }

    update() {
        if (!this.ctx2d) return;
        var w = this.canvas.offsetWidth;
        var h = this.canvas.offsetHeight;
        this.ctx2d.clearRect(0, 0, w, h);

        /* Update + draw ambient floating pollen/spores */
        if (this.ambient.length > 0) {
            for (var a = 0; a < this.ambient.length; a++) {
                var ap = this.ambient[a];
                ap.x += ap.vx + Math.sin(ap.wobble) * 0.3;
                ap.y += ap.vy;
                ap.wobble += ap.wobbleSpeed;
                /* Wrap around */
                if (ap.y < -10) {
                    ap.y = h + 10;
                    ap.x = Math.random() * w;
                }
                if (ap.x < -10) ap.x = w + 10;
                if (ap.x > w + 10) ap.x = -10;
                this._drawAmbient(ap);
            }
        }

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
            } else if (p.type === 'zzz') {
                p.wobble += 0.05;
                p.x += p.vx + Math.sin(p.wobble) * 0.35;
                p.rotation = Math.sin(p.wobble) * 0.22;
            } else if (p.type === 'bubble') {
                p.wobble += 0.09;
                p.x += p.vx + Math.sin(p.wobble) * 0.45;
                p.vy *= 0.995;
                p.size *= 1.004;
            } else if (p.type === 'dizzystar') {
                p.angle += p.orbitSpeed;
                p.x = p.cx + Math.cos(p.angle) * p.radius;
                p.y = p.cy + Math.sin(p.angle) * p.radius * 0.32;
            }

            p.life -= p.decay;

            if (p.life > 0 && p.y < h + 60 && p.y > -60) {
                this._draw(p);
                surviving.push(p);
            }
        }
        this.particles = surviving;
    }

    _drawAmbient(p) {
        var ctx = this.ctx2d;
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        /* Tiny sparkle cross */
        ctx.shadowBlur = 3;
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(p.x - p.size * 1.5, p.y);
        ctx.lineTo(p.x + p.size * 1.5, p.y);
        ctx.moveTo(p.x, p.y - p.size * 1.5);
        ctx.lineTo(p.x, p.y + p.size * 1.5);
        ctx.stroke();
        ctx.restore();
    }

    _draw(p) {
        var ctx = this.ctx2d;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));

        if (p.type === 'note') {
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            if (p.syllable) {
                /* Premium syllable critter: refined bubble with elegant warm-ink
               outline, half-lidded dreamy eyes, soft gentle smile. */
            ctx.font = '700 ' + Math.round(p.size * 0.72) + 'px Fredoka, Nunito, sans-serif';
            /* Measure syllable for bubble background */
            var tw = ctx.measureText(p.syllable).width;
            var bw = tw + p.size * 0.7;
            var bh = p.size * 0.95;
            /* Bubble background */
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 14;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            var br = bh * 0.5;
            ctx.moveTo(-bw / 2 + br, -bh / 2);
            ctx.lineTo(bw / 2 - br, -bh / 2);
            ctx.quadraticCurveTo(bw / 2, -bh / 2, bw / 2, -bh / 2 + br);
            ctx.lineTo(bw / 2, bh / 2 - br);
            ctx.quadraticCurveTo(bw / 2, bh / 2, bw / 2 - br, bh / 2);
            ctx.lineTo(-bw / 2 + br, bh / 2);
            ctx.quadraticCurveTo(-bw / 2, bh / 2, -bw / 2, bh / 2 - br);
            ctx.lineTo(-bw / 2, -bh / 2 + br);
            ctx.quadraticCurveTo(-bw / 2, -bh / 2, -bw / 2 + br, -bh / 2);
            ctx.closePath();
            ctx.fill();
            /* Bubble outline (refined warm ink) */
            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#1a1208';
            ctx.lineWidth = 2.2;
            ctx.stroke();
            /* Inner highlight (top-left) */
            ctx.fillStyle = 'rgba(245,235,215,0.22)';
            ctx.beginPath();
            ctx.ellipse(-bw * 0.18, -bh * 0.28, bw * 0.22, bh * 0.16, -0.4, 0, Math.PI * 2);
            ctx.fill();
            /* Syllable text - cream with warm-ink stroke */
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#1a1208';
            ctx.lineJoin = 'round';
            ctx.miterLimit = 2;
            ctx.strokeText(p.syllable, 0, p.size * 0.05);
            ctx.fillStyle = '#f5ebd7';
            ctx.fillText(p.syllable, 0, p.size * 0.05);
            /* Eyes above the bubble - half-lidded dreamy cream sclera + dark iris + catchlight */
            var er = p.size * 0.18;
            var eyY = -bh * 0.62;
            for (var e = -1; e <= 1; e += 2) {
                var ex = e * p.size * 0.28;
                /* Cream sclera with refined warm-ink outline (half-lidded almond shape) */
                ctx.fillStyle = '#f5ebd7';
                ctx.strokeStyle = '#1a1208';
                ctx.lineWidth = 1.4;
                ctx.beginPath();
                ctx.moveTo(ex - er, eyY);
                ctx.quadraticCurveTo(ex, eyY - er * 0.8, ex + er, eyY);
                ctx.quadraticCurveTo(ex, eyY + er * 0.6, ex - er, eyY);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                /* Dark iris */
                ctx.fillStyle = '#1a1208';
                ctx.beginPath();
                ctx.arc(ex + Math.sin(p.wobble + e) * er * 0.35, eyY + er * 0.25, er * 0.5, 0, Math.PI * 2);
                ctx.fill();
                /* Single catchlight */
                ctx.fillStyle = '#f5ebd7';
                ctx.beginPath();
                ctx.arc(ex + Math.sin(p.wobble + e) * er * 0.35 - er * 0.18, eyY + er * 0.1, er * 0.18, 0, Math.PI * 2);
                ctx.fill();
            }
            /* Soft arched brows — gentle, not manic */
            ctx.strokeStyle = '#1a1208';
            ctx.lineWidth = 1.6;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(-p.size * 0.4, eyY - er - 0.5);
            ctx.quadraticCurveTo(-p.size * 0.28, eyY - er - 2, -p.size * 0.16, eyY - er - 0.5);
            ctx.moveTo(p.size * 0.16, eyY - er - 0.5);
            ctx.quadraticCurveTo(p.size * 0.28, eyY - er - 2, p.size * 0.4, eyY - er - 0.5);
            ctx.stroke();
            /* Soft closed-lip smile under the bubble */
            var my = bh * 0.5 + p.size * 0.22;
            var mw = p.size * 0.32;
            ctx.fillStyle = '#8a4a5a';
            ctx.strokeStyle = '#1a1208';
            ctx.lineWidth = 1.6;
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(-mw, my - mw * 0.2);
            ctx.quadraticCurveTo(0, my + mw * 0.85, mw, my - mw * 0.2);
            ctx.quadraticCurveTo(0, my - mw * 0.1, -mw, my - mw * 0.2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            } else {
                ctx.fillStyle = p.color;
                ctx.font = 'bold ' + p.size + 'px serif';
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 12;
                ctx.fillText(p.symbol, 0, 0);
                /* Add a soft white halo */
                ctx.shadowBlur = 4;
                ctx.shadowColor = '#fff';
                ctx.globalAlpha = Math.max(0, Math.min(1, p.life)) * 0.4;
                ctx.fillText(p.symbol, 0, 0);
            }
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
        } else if (p.type === 'zzz') {
            /* Sleepy "Z" — dusty blue with warm-ink outline */
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.font = '700 ' + p.size + 'px Fredoka, Nunito, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.lineJoin = 'round';
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#1a1208';
            ctx.strokeText('Z', 0, 0);
            ctx.fillStyle = '#88c0d0';
            ctx.shadowColor = '#5a9ba8';
            ctx.shadowBlur = 6;
            ctx.fillText('Z', 0, 0);
        } else if (p.type === 'bubble') {
            /* Hiccup bubble — teal outline with shine */
            ctx.strokeStyle = 'rgba(136,192,208,0.9)';
            ctx.lineWidth = 1.6;
            ctx.fillStyle = 'rgba(90,155,168,0.14)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            /* Shine arc */
            ctx.strokeStyle = 'rgba(245,235,215,0.85)';
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.6, -2.4, -1.1);
            ctx.stroke();
        } else if (p.type === 'dizzystar') {
            /* 4-point dizzy star with glow */
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle * 2);
            var ds = p.size;
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(0, -ds * 1.8);
            ctx.lineTo(ds * 0.5, -ds * 0.5);
            ctx.lineTo(ds * 1.8, 0);
            ctx.lineTo(ds * 0.5, ds * 0.5);
            ctx.lineTo(0, ds * 1.8);
            ctx.lineTo(-ds * 0.5, ds * 0.5);
            ctx.lineTo(-ds * 1.8, 0);
            ctx.lineTo(-ds * 0.5, -ds * 0.5);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#1a1208';
            ctx.lineWidth = 0.8;
            ctx.stroke();
        }

        ctx.restore();
    }

    clear() {
        this.particles = [];
        /* Ambient particles persist - only re-seed on resize */
    }
}
