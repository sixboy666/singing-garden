/* ============================================================
   SINGING GARDEN v17 — PIXEL EFFECTS CANVAS
   Every particle is drawn as snapped integer rectangles: no
   gradients, no blur, no shadows. Ambient weather follows the
   active scene (meadow / sakura / desert / snow).
   ============================================================ */

var PX_COLORS = {
    green: "#5ec26a",
    greenD: "#3f9a4f",
    gold: "#f6c445",
    pink: "#ef7fa8",
    blue: "#58a8e0",
    orange: "#ff9f43",
    ink: "#2a2438",
    paper: "#fff7e3",
    white: "#ffffff"
};

var SCENE_AMBIENT = {
    meadow: { colors: ["#8fd36b", "#5ec26a", "#f6c445"], size: 2, vy: 0.7 },
    sakura: { colors: ["#f4a8c8", "#ffc9de", "#ef7fa8"], size: 3, vy: 0.9 },
    desert: { colors: ["#e8bd77", "#d6a55f", "#fff0c2"], size: 1, vy: 0.5 },
    snow: { colors: ["#ffffff", "#e6f1ff", "#cfe2f5"], size: 2, vy: 1.1 }
};

class EffectsCanvas {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.w = 0;
        this.h = 0;
        this._raf = 0;
        this.sceneId = "meadow";
        this._ambientCount = 0;
        this._tick = 0;
    }

    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.resize();
        var self = this;
        window.addEventListener("resize", function() { self.resize(); });
    }

    resize() {
        if (!this.canvas) return;
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.canvas.width = this.w;
        this.canvas.height = this.h;
    }

    clear() { this.particles = []; }

    setScene(id) {
        if (!id) return;
        this.sceneId = id;
    }

    _rect(el) {
        var r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
    }

    add(p) { this.particles.push(p); }

    update() {
        if (!this.ctx) return;
        var ctx = this.ctx;
        ctx.clearRect(0, 0, this.w, this.h);
        this._tick += 1;
        this._spawnAmbient();

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
            if (p.y > this.h + 24 || p.x < -30 || p.x > this.w + 30) continue;
            this.drawParticle(p);
            alive.push(p);
        }
        this.particles = alive;
    }

    /* ---------- Pixel primitives ---------- */
    _px(x, y, w, h, color) {
        var ctx = this.ctx;
        ctx.fillStyle = color;
        w = Math.max(1, Math.round(w));
        h = Math.max(1, Math.round(h));
        ctx.fillRect(Math.round(x), Math.round(y), w, h);
    }

    _note(x, y, color) {
        this._px(x - 3, y + 4, 5, 4, color);
        this._px(x + 1, y - 7, 2, 11, color);
        this._px(x + 3, y - 7, 3, 2, color);
        this._px(x + 5, y - 4, 2, 2, color);
    }

    _heart(x, y, color) {
        this._px(x - 4, y - 2, 3, 2, color);
        this._px(x + 1, y - 2, 3, 2, color);
        this._px(x - 5, y, 11, 2, color);
        this._px(x - 4, y + 2, 9, 2, color);
        this._px(x - 2, y + 4, 5, 2, color);
    }

    _cross(x, y, color, s) {
        this._px(x - s, y, s * 2 + 1, 1, color);
        this._px(x, y - s, 1, s * 2 + 1, color);
    }

    _hollowBox(x, y, size, color) {
        var s = Math.max(4, Math.round(size));
        this._px(x - s / 2, y - s / 2, s, 1, color);
        this._px(x - s / 2, y + s / 2 - 1, s, 1, color);
        this._px(x - s / 2, y - s / 2, 1, s, color);
        this._px(x + s / 2 - 1, y - s / 2, 1, s, color);
    }

    _zGlyph(x, y, color) {
        this._px(x - 3, y - 4, 7, 1, color);
        this._px(x + 1, y - 2, 4, 1, color);
        this._px(x - 1, y, 3, 1, color);
        this._px(x - 3, y + 1, 6, 1, color);
    }

    drawParticle(p) {
        var ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        var c = p.color || PX_COLORS.gold;

        if (p.type === "note") {
            this._note(p.x, p.y, c);
        } else if (p.type === "sparkle") {
            this._cross(p.x, p.y, c, 2);
            this._px(p.x, p.y, 1, 1, PX_COLORS.paper);
        } else if (p.type === "heart") {
            this._heart(p.x, p.y, c);
        } else if (p.type === "petal") {
            this._px(p.x - 2, p.y - 2, 4, 3, c);
            this._px(p.x - 1, p.y + 1, 2, 2, c);
        } else if (p.type === "water") {
            this._px(p.x - 1, p.y - 3, 2, 3, c);
            this._px(p.x - 2, p.y, 4, 3, c);
        } else if (p.type === "ray") {
            var dx = p.vx || 0;
            var dy = p.vy || 0;
            for (var k = 1; k <= 4; k++) {
                this._px(p.x + dx * k * 2, p.y + dy * k * 2, 2, 2, c);
            }
        } else if (p.type === "zzz") {
            this._zGlyph(p.x, p.y, c);
        } else if (p.type === "bubble") {
            this._hollowBox(p.x, p.y, p.size * 2, c);
        } else if (p.type === "dizzystar") {
            this._cross(p.x, p.y, c, 3);
        } else if (p.type === "puff") {
            ctx.globalAlpha = p.alpha * 0.7;
            this._px(p.x - 2, p.y - 2, 3, 3, c);
        } else if (p.type === "ring") {
            ctx.globalAlpha = p.alpha * 0.8;
            this._hollowBox(p.x, p.y, p.size, c);
        } else if (p.type === "ambient") {
            this._px(p.x, p.y, p.size, p.size, c);
        }
        ctx.restore();
    }

    /* ---------- Ambient weather ---------- */
    _spawnAmbient() {
        var cfg = SCENE_AMBIENT[this.sceneId] || SCENE_AMBIENT.meadow;
        if (this._tick % 6 !== 0) return;
        if (this._ambientCount > 26) {
            this._ambientCount = 0;
            return;
        }
        this._ambientCount += 1;
        this.add({
            type: "ambient",
            x: Math.random() * this.w,
            y: -8,
            vx: (Math.random() - 0.5) * 0.5,
            vy: cfg.vy + Math.random() * 0.6,
            life: 420, maxLife: 420,
            color: cfg.colors[Math.floor(Math.random() * cfg.colors.length)],
            size: cfg.size
        });
    }

    /* ---------- Spawners ---------- */
    spawnNote(el, color, text) {
        var r = this._rect(el);
        this.add({
            type: "note", x: r.x + (Math.random() - 0.5) * 30, y: r.y - 20,
            vx: (Math.random() - 0.5) * 0.8, vy: -1.4,
            life: 60, maxLife: 60, color: color, text: text, size: 15
        });
    }

    spawnSparkles(el) {
        var r = this._rect(el);
        var palette = [PX_COLORS.green, PX_COLORS.gold, PX_COLORS.blue, PX_COLORS.pink];
        for (var i = 0; i < 8; i++) {
            var a = Math.random() * Math.PI * 2;
            var sp = 1 + Math.random() * 2.5;
            this.add({
                type: "sparkle", x: r.x, y: r.y,
                vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                gravity: 0.05, life: 40, maxLife: 40,
                color: palette[i % 4],
                size: 2 + Math.random() * 2
            });
        }
    }

    spawnHearts(el) {
        var r = this._rect(el);
        for (var i = 0; i < 5; i++) {
            this.add({
                type: "heart", x: r.x + (Math.random() - 0.5) * 40, y: r.y,
                vx: (Math.random() - 0.5) * 1, vy: -1.5 - Math.random(),
                life: 55, maxLife: 55, color: PX_COLORS.pink, size: 6 + Math.random() * 4
            });
        }
    }

    spawnPetals(el, color) {
        var r = this._rect(el);
        for (var i = 0; i < 6; i++) {
            var a = Math.random() * Math.PI * 2;
            this.add({
                type: "petal", x: r.x, y: r.y - 10,
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
                type: "water", x: r.x + (Math.random() - 0.5) * 30, y: r.y - 30,
                vx: (Math.random() - 0.5) * 1.5, vy: -2 - Math.random() * 2,
                gravity: 0.25, life: 45, maxLife: 45, color: PX_COLORS.blue
            });
        }
    }

    spawnLightRays(el) {
        var r = this._rect(el);
        for (var i = 0; i < 6; i++) {
            var a = (Math.PI * 2 / 6) * i + Math.random() * 0.3;
            this.add({
                type: "ray", x: r.x, y: r.y,
                vx: Math.cos(a) * 3, vy: Math.sin(a) * 3,
                life: 25, maxLife: 25, color: PX_COLORS.gold
            });
        }
    }

    spawnZzz(el) {
        var r = this._rect(el);
        this.add({
            type: "zzz", x: r.x + 15, y: r.y - 25,
            vx: 0.4, vy: -0.6, life: 50, maxLife: 50,
            color: "#9a7bd0", size: 16
        });
    }

    spawnBubbles(el) {
        var r = this._rect(el);
        for (var i = 0; i < 7; i++) {
            this.add({
                type: "bubble", x: r.x + (Math.random() - 0.5) * 30, y: r.y,
                vx: (Math.random() - 0.5) * 0.8, vy: -1 - Math.random(),
                life: 60, maxLife: 60, color: PX_COLORS.blue, size: 3 + Math.random() * 3
            });
        }
    }

    spawnDizzyStars(el) {
        var r = this._rect(el);
        for (var i = 0; i < 5; i++) {
            var a = (Math.PI * 2 / 5) * i;
            this.add({
                type: "dizzystar", x: r.x + Math.cos(a) * 20, y: r.y - 30 + Math.sin(a) * 10,
                vx: 0, vy: 0, rot: 0, vrot: 0.3,
                life: 80, maxLife: 80, color: PX_COLORS.gold, size: 5
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
                type: "puff", x: r.x, y: r.y - 12,
                vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                gravity: 0.06, life: 38, maxLife: 38,
                color: PX_COLORS.paper, size: 3 + Math.random() * 5
            });
        }
    }

    /* Expanding square ring — a plant making a noise at you */
    spawnSoundWave(el, color) {
        var r = this._rect(el);
        this.add({
            type: "ring", x: r.x, y: r.y - 10,
            life: 30, maxLife: 30, color: color || PX_COLORS.green, size: 6, grow: 1.6
        });
    }
}

if (typeof window !== "undefined") window.EffectsCanvas = EffectsCanvas;
