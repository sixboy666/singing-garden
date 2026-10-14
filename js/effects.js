/* ============================================================
   SINGING GARDEN v9 — EFFECTS CANVAS
   Aurora particles: notes, sparkles, hearts, petals, water drops,
   light rays, zzz, bubbles, dizzy stars, glow trails
   ============================================================ */

class EffectsCanvas {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.w = 0;
        this.h = 0;
        this._raf = 0;
    }

    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();
        var self = this;
        window.addEventListener('resize', function() { self.resize(); });
    }

    resize() {
        if (!this.canvas) return;
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.canvas.width = this.w;
        this.canvas.height = this.h;
    }

    clear() { this.particles = []; }

    _rect(el) {
        var r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
    }

    add(p) { this.particles.push(p); }

    update() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.w, this.h);
        var alive = [];
        for (var i = 0; i < this.particles.length; i++) {
            var p = this.particles[i];
            p.life -= 1;
            if (p.life <= 0) continue;
            p.x += p.vx || 0;
            p.y += p.vy || 0;
            if (p.vy !== undefined) p.vy += p.gravity || 0;
            if (p.rot !== undefined) p.rot += p.vrot || 0;
            if (p.grow) p.size = (p.size || 0) + p.grow;
            p.alpha = Math.max(0, p.life / p.maxLife);
            this.drawParticle(p);
            alive.push(p);
        }
        this.particles = alive;
    }

    drawParticle(p) {
        var ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        if (p.type === 'note') {
            ctx.font = 'bold ' + (p.size || 16) + 'px Quicksand, sans-serif';
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.textAlign = 'center';
            ctx.fillText(p.text || 'La', p.x, p.y);
        } else if (p.type === 'sparkle') {
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size || 3, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.type === 'heart') {
            ctx.fillStyle = p.color || '#fb7185';
            ctx.shadowColor = p.color || '#fb7185';
            ctx.shadowBlur = 8;
            var s = p.size || 8;
            ctx.translate(p.x, p.y);
            ctx.beginPath();
            ctx.moveTo(0, s * 0.3);
            ctx.bezierCurveTo(s, -s * 0.5, s * 0.5, -s, 0, -s * 0.3);
            ctx.bezierCurveTo(-s * 0.5, -s, -s, -s * 0.5, 0, s * 0.3);
            ctx.fill();
        } else if (p.type === 'petal') {
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot || 0);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size || 5, (p.size || 5) * 1.8, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.type === 'water') {
            ctx.fillStyle = p.color || '#5ef2d6';
            ctx.shadowColor = p.color || '#5ef2d6';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, 3, 5, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.type === 'ray') {
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + (p.vx || 0) * 8, p.y + (p.vy || 0) * 8);
            ctx.stroke();
        } else if (p.type === 'zzz') {
            ctx.font = 'bold ' + (p.size || 18) + 'px Caveat, cursive';
            ctx.fillStyle = p.color || '#a78bfa';
            ctx.shadowColor = p.color || '#a78bfa';
            ctx.shadowBlur = 8;
            ctx.fillText('z', p.x, p.y);
        } else if (p.type === 'bubble') {
            ctx.strokeStyle = p.color || '#5ef2d6';
            ctx.lineWidth = 1.5;
            ctx.shadowColor = p.color || '#5ef2d6';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size || 5, 0, Math.PI * 2);
            ctx.stroke();
        } else if (p.type === 'dizzystar') {
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot || 0);
            ctx.fillStyle = p.color || '#fcd34d';
            ctx.shadowColor = p.color || '#fcd34d';
            ctx.shadowBlur = 6;
            var s = p.size || 4;
            ctx.beginPath();
            for (var k = 0; k < 5; k++) {
                var a = (k * 4 * Math.PI) / 5 - Math.PI / 2;
                var x = Math.cos(a) * s;
                var y = Math.sin(a) * s;
                if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
        } else if (p.type === 'puff') {
            ctx.globalAlpha = p.alpha * 0.55;
            ctx.fillStyle = p.color || '#d7fbff';
            ctx.shadowColor = p.color || '#d7fbff';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size || 4, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.type === 'ring') {
            ctx.globalAlpha = p.alpha * 0.7;
            ctx.strokeStyle = p.color || '#5ef2d6';
            ctx.lineWidth = 2;
            ctx.shadowColor = p.color || '#5ef2d6';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size || 6, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
    }

    /* ---------- Spawners ---------- */
    spawnNote(el, color, text) {
        var r = this._rect(el);
        for (var i = 0; i < 1; i++) {
            this.add({
                type: 'note', x: r.x + (Math.random() - 0.5) * 30, y: r.y - 20,
                vx: (Math.random() - 0.5) * 0.8, vy: -1.4,
                life: 60, maxLife: 60, color: color, text: text, size: 15
            });
        }
    }

    spawnSparkles(el) {
        var r = this._rect(el);
        for (var i = 0; i < 8; i++) {
            var a = Math.random() * Math.PI * 2;
            var sp = 1 + Math.random() * 2.5;
            this.add({
                type: 'sparkle', x: r.x, y: r.y,
                vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                gravity: 0.05, life: 40, maxLife: 40,
                color: ['#5ef2d6', '#e879f9', '#fcd34d', '#a78bfa'][i % 4],
                size: 2 + Math.random() * 2
            });
        }
    }

    spawnHearts(el) {
        var r = this._rect(el);
        for (var i = 0; i < 5; i++) {
            this.add({
                type: 'heart', x: r.x + (Math.random() - 0.5) * 40, y: r.y,
                vx: (Math.random() - 0.5) * 1, vy: -1.5 - Math.random(),
                life: 55, maxLife: 55, color: '#fb7185', size: 6 + Math.random() * 4
            });
        }
    }

    spawnPetals(el, color) {
        var r = this._rect(el);
        for (var i = 0; i < 6; i++) {
            var a = Math.random() * Math.PI * 2;
            this.add({
                type: 'petal', x: r.x, y: r.y - 10,
                vx: Math.cos(a) * 1.5, vy: Math.sin(a) * 1.5 - 1,
                gravity: 0.04, rot: Math.random() * Math.PI, vrot: (Math.random() - 0.5) * 0.2,
                life: 50, maxLife: 50, color: color, size: 4 + Math.random() * 3
            });
        }
    }

    spawnWaterDrops(el) {
        var r = this._rect(el);
        for (var i = 0; i < 10; i++) {
            this.add({
                type: 'water', x: r.x + (Math.random() - 0.5) * 30, y: r.y - 30,
                vx: (Math.random() - 0.5) * 1.5, vy: -2 - Math.random() * 2,
                gravity: 0.25, life: 45, maxLife: 45, color: '#5ef2d6'
            });
        }
    }

    spawnLightRays(el) {
        var r = this._rect(el);
        for (var i = 0; i < 6; i++) {
            var a = (Math.PI * 2 / 6) * i + Math.random() * 0.3;
            this.add({
                type: 'ray', x: r.x, y: r.y,
                vx: Math.cos(a) * 3, vy: Math.sin(a) * 3,
                life: 25, maxLife: 25, color: '#fcd34d'
            });
        }
    }

    spawnZzz(el) {
        var r = this._rect(el);
        this.add({
            type: 'zzz', x: r.x + 15, y: r.y - 25,
            vx: 0.4, vy: -0.6, life: 50, maxLife: 50,
            color: '#a78bfa', size: 16
        });
    }

    spawnBubbles(el) {
        var r = this._rect(el);
        for (var i = 0; i < 7; i++) {
            this.add({
                type: 'bubble', x: r.x + (Math.random() - 0.5) * 30, y: r.y,
                vx: (Math.random() - 0.5) * 0.8, vy: -1 - Math.random(),
                life: 60, maxLife: 60, color: '#5ef2d6', size: 3 + Math.random() * 4
            });
        }
    }

    spawnDizzyStars(el) {
        var r = this._rect(el);
        for (var i = 0; i < 5; i++) {
            var a = (Math.PI * 2 / 5) * i;
            this.add({
                type: 'dizzystar', x: r.x + Math.cos(a) * 20, y: r.y - 30 + Math.sin(a) * 10,
                vx: 0, vy: 0, rot: 0, vrot: 0.3,
                life: 80, maxLife: 80, color: '#fcd34d', size: 5
            });
        }
    }

    /* A puff of spray from a plant sneeze */
    spawnSneeze(el) {
        var r = this._rect(el);
        for (var i = 0; i < 12; i++) {
            var a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
            var sp = 1.5 + Math.random() * 3;
            this.add({
                type: 'puff', x: r.x, y: r.y - 12,
                vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                gravity: 0.06, life: 38, maxLife: 38,
                color: '#d7fbff', size: 3 + Math.random() * 5
            });
        }
    }

    /* Expanding ring — a plant making a noise at you */
    spawnSoundWave(el, color) {
        var r = this._rect(el);
        this.add({
            type: 'ring', x: r.x, y: r.y - 10,
            life: 30, maxLife: 30, color: color || '#5ef2d6', size: 6, grow: 1.6
        });
    }
}

if (typeof window !== 'undefined') window.EffectsCanvas = EffectsCanvas;
