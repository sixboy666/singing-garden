/* ============================================================
   SINGING GARDEN v17 - PLANTS (PIXEL EDITION)
   12 species drawn on a 24 x 30 integer grid. Every rect is
   snapped to whole pixels and every svg uses crispEdges, so the
   art stays razor sharp at any scale. Flat 3-5 tone palettes,
   no gradients, no blur, no glow filters.
   ============================================================ */

var INK = '#2a2438';
var PAPER = '#fffdf5';
var CHEEK = '#f08fa5';

/* ---------- pixel primitives ---------- */

function px(x, y, w, h, c) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + c + '"/>';
}

function pxo(x, y, w, h, c, o) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + c + '" opacity="' + o + '"/>';
}

/* horizontally centred rect (w should be even so edges stay on the grid) */
function mid(cx, y, w, h, c) {
    return px(cx - w / 2, y, w, h, c);
}

/* mirrored left/right rect pair at a fixed gap from the centre */
function pairPx(cx, y, w, h, gap, c) {
    return px(cx - gap - w, y, w, h, c) + px(cx + gap, y, w, h, c);
}

/* 5 x 4 stepped leaf */
function leafPx(x, y, cl, cd) {
    return px(x + 1, y, 3, 1, cl) +
        px(x, y + 1, 5, 1, cl) +
        px(x, y + 2, 5, 1, cd) +
        px(x + 1, y + 3, 3, 1, cd);
}

/* 2 px wide stem with a shaded right column */
function stemPx(x, yTop, yBot, c, cd) {
    return px(x, yTop, 2, yBot - yTop, c) + px(x + 1, yTop, 1, yBot - yTop, cd);
}

/* Bresenham straight line of square pixels, used for fern fronds and
   the comet tail so those shapes stay perfectly on the grid. */
function pxLine(x0, y0, x1, y1, c, size) {
    size = size || 1;
    var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    var sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    var err = dx - dy, guard = 0;
    var x = x0, y = y0, out = '';
    while (guard++ < 240) {
        out += px(x, y, size, size, c);
        if (x === x1 && y === y1) break;
        var e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x += sx; }
        if (e2 < dx) { err += dx; y += sy; }
    }
    return out;
}

/* ---------- face: open eyes, blink frame, mouth, blush ---------- */
/* Two stacked groups: one open, one shut. CSS toggles them with a
   steps() animation so the blink is a hard 2 frame cut, not a fade. */
function faceGroup(cx, cy, cheek, delay, spread, mouthDy) {
    spread = spread || 5;
    mouthDy = mouthDy === undefined ? 4 : mouthDy;
    var d = delay === undefined ? 0 : delay;
    var lx = cx - spread;
    var rx = cx + spread - 2;
    var open = px(lx, cy, 2, 2, INK) + px(rx, cy, 2, 2, INK) +
        px(lx, cy, 1, 1, PAPER) + px(rx, cy, 1, 1, PAPER);
    var shut = px(lx, cy + 1, 2, 1, INK) + px(rx, cy + 1, 2, 1, INK);
    var mouth = px(cx - 1, cy + mouthDy, 3, 1, INK);
    var blush = cheek ?
        (px(cx - spread - 3, cy + mouthDy - 1, 2, 1, cheek) +
            px(cx + spread + 1, cy + mouthDy - 1, 2, 1, cheek)) : '';
    return '<g class="px-eyes" style="animation-delay:' + d + 's">' + open + '</g>' +
        '<g class="px-eyes-shut" style="animation-delay:' + d + 's">' + shut + '</g>' +
        mouth + blush;
}

/* animated 3 x 3 plus shaped sparkle */
function sparkPx(x, y, c, delay, cls) {
    return '<g class="' + (cls || 'px-spark') + '" style="animation-delay:' + (delay || 0) + 's">' +
        px(x + 1, y, 1, 1, c) + px(x, y + 1, 3, 1, c) + px(x + 1, y + 2, 1, 1, c) + '</g>';
}

function baseShadow() {
    return pxo(2, 28, 20, 2, INK, 0.1);
}

/* Water level leaves visible pixel puddles and damp specks at the roots */
function waterMarks(wl, c) {
    if (wl < 1) return '';
    var w = c.water || '#5aa8e0';
    var out = pxo(3, 28, 18, 2, w, 0.26);
    if (wl >= 2) {
        out += pxo(2, 27, 3, 1, w, 0.6) + pxo(19, 27, 3, 1, w, 0.6);
    }
    if (wl >= 3) {
        out += pxo(5, 24, 2, 2, w, 0.55) + pxo(17, 23, 2, 2, w, 0.45) +
            pxo(10, 21, 2, 2, w, 0.35);
    }
    return out;
}

function svgShell(inner, wl, c) {
    return '<svg class="px-plant" viewBox="0 0 24 30" width="96" height="120" ' +
        'shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">' +
        baseShadow() + inner + waterMarks(wl, c) + '</svg>';
}

var PLANT_TYPES = [

    /* 1. Luna Bloom - pixel lotus under a crescent moon */
    {
        id: 'luna', name: 'Luna Bloom', emoji: '\uD83C\uDF19',
        colors: {
            primary: '#7fdcd2', secondary: '#4fb3ad', light: '#c9f2ec',
            accent: '#f6c445', stem: '#2f7f78', leaf: '#3f9c8f', leafD: '#2d7a6e',
            water: '#5aa8e0', cheek: CHEEK
        },
        animClass: 'anim-float',
        audio: { notes: [329.63, 392.00, 523.25], voice: 'airy', rhythm: [1.5, 1, 2] },
        renderSVG: function(wl) {
            var c = this.colors;
            var s = stemPx(11, 15, 28, c.stem, c.leafD) +
                leafPx(3, 20, c.leaf, c.leafD) +
                leafPx(16, 23, c.leaf, c.leafD) +
                mid(12, 6, 4, 2, c.light) +
                mid(12, 8, 10, 2, c.light) +
                mid(12, 10, 18, 2, c.primary) +
                mid(12, 12, 18, 2, c.secondary) +
                mid(12, 14, 14, 2, c.primary) +
                mid(12, 16, 8, 2, c.secondary) +
                mid(12, 9, 8, 4, c.accent) +
                faceGroup(12, 10, c.cheek, -1.4, 5, 4) +
                /* crescent moon, top right */
                px(20, 2, 2, 1, c.light) + px(19, 3, 2, 1, c.light) +
                px(18, 4, 2, 3, c.light) + px(19, 7, 2, 1, c.light) +
                px(20, 8, 2, 1, c.light) +
                sparkPx(3, 5, PAPER, -0.6) + sparkPx(19, 15, c.light, -1.1);
            return svgShell(s, wl, c);
        }
    },

    /* 2. Ember Lily - a blocky little torch */
    {
        id: 'ember', name: 'Ember Lily', emoji: '\uD83D\uDD25',
        colors: {
            primary: '#ff9a3c', secondary: '#e0642a', light: '#ffd07a',
            accent: '#fff0b8', stem: '#6b3a24', leaf: '#8a5530', leafD: '#5e3a22',
            water: '#5aa8e0', cheek: '#c9552a'
        },
        animClass: 'anim-flicker',
        audio: { notes: [261.63, 329.63, 392.00], voice: 'warm', rhythm: [0.7, 0.7, 1.9] },
        renderSVG: function(wl) {
            var c = this.colors;
            var s = stemPx(11, 16, 28, c.stem, c.leafD) +
                leafPx(2, 22, c.leaf, c.leafD) +
                leafPx(17, 25, c.leaf, c.leafD) +
                mid(12, 20, 14, 2, c.secondary) +
                mid(12, 18, 16, 2, c.primary) +
                mid(12, 16, 16, 2, c.secondary) +
                mid(12, 14, 12, 2, c.primary) +
                px(7, 12, 10, 2, c.primary) +
                px(4, 11, 3, 5, c.secondary) +
                px(17, 11, 3, 5, c.secondary) +
                px(8, 10, 8, 2, c.light) +
                px(9, 8, 6, 2, c.primary) +
                px(10, 6, 4, 2, c.light) +
                px(11, 4, 2, 2, c.accent) +
                faceGroup(12, 15, c.cheek, -3.2, 4, 3) +
                '<g class="px-rise">' + px(6, 8, 2, 2, c.light) + '</g>' +
                '<g class="px-rise" style="animation-delay:-1.1s">' + px(17, 5, 2, 2, c.accent) + '</g>' +
                '<g class="px-rise" style="animation-delay:-2.1s">' + px(13, 2, 1, 1, c.light) + '</g>';
            return svgShell(s, wl, c);
        }
    },

    /* 3. Aurora Tulip - three peaked cup with two colour stripes */
    {
        id: 'aurora', name: 'Aurora Tulip', emoji: '\uD83C\uDF37',
        colors: {
            primary: '#7ee0d3', secondary: '#4ab8c9', light: '#d5f7f2',
            accent: '#ef86d8', stem: '#2c6f7d', leaf: '#3d8e9a', leafD: '#2a6b74',
            water: '#5aa8e0', cheek: CHEEK
        },
        animClass: 'anim-wave',
        audio: { notes: [392.00, 440.00, 523.25], voice: 'bright', rhythm: [1, 1.4, 1.3] },
        renderSVG: function(wl) {
            var c = this.colors;
            var s = stemPx(11, 16, 28, c.stem, c.leafD) +
                leafPx(17, 21, c.leaf, c.leafD) +
                leafPx(2, 24, c.leaf, c.leafD) +
                mid(12, 16, 10, 2, c.secondary) +
                mid(12, 14, 14, 2, c.primary) +
                mid(12, 12, 14, 2, c.primary) +
                mid(12, 10, 12, 2, c.light) +
                px(6, 5, 3, 5, c.secondary) +
                px(11, 4, 3, 6, c.light) +
                px(16, 5, 3, 5, c.secondary) +
                px(8, 13, 2, 3, c.accent) + px(14, 13, 2, 3, c.accent) +
                faceGroup(12, 11, c.cheek, -2.6, 4, 4) +
                sparkPx(3, 8, PAPER, -0.9) + sparkPx(19, 4, c.light, -1.7);
            return svgShell(s, wl, c);
        }
    },

    /* 4. Crystal Daisy - eight chunky facets around a gold core */
    {
        id: 'crystal', name: 'Crystal Daisy', emoji: '\u2744\uFE0F',
        colors: {
            primary: '#cfe9fb', secondary: '#8fc4e8', light: '#ffffff',
            accent: '#f6c445', stem: '#4a7f9e', leaf: '#5f9ab5', leafD: '#3f7590',
            water: '#5aa8e0', cheek: CHEEK
        },
        animClass: 'anim-spin-slow',
        audio: { notes: [440.00, 587.33, 659.25], voice: 'crystal', rhythm: [0.55, 0.55, 1.9] },
        renderSVG: function(wl) {
            var c = this.colors;
            var s = stemPx(11, 16, 28, c.stem, c.leafD) +
                leafPx(3, 21, c.leaf, c.leafD) +
                leafPx(16, 24, c.leaf, c.leafD) +
                px(11, 3, 2, 6, c.primary) +
                px(11, 15, 2, 6, c.secondary) +
                px(3, 11, 6, 2, c.primary) +
                px(15, 11, 6, 2, c.primary) +
                px(5, 5, 4, 4, c.secondary) + px(15, 5, 4, 4, c.secondary) +
                px(5, 15, 4, 4, c.secondary) + px(15, 15, 4, 4, c.secondary) +
                px(6, 6, 2, 2, c.light) + px(16, 6, 2, 2, c.light) +
                px(6, 16, 2, 2, c.light) + px(16, 16, 2, 2, c.light) +
                px(7, 7, 10, 10, c.accent) +
                px(8, 8, 8, 8, c.light) +
                faceGroup(12, 10, c.cheek, -5.1, 4, 4) +
                sparkPx(2, 3, c.light, -0.4, 'px-twinkle') +
                sparkPx(20, 17, c.light, -1.3, 'px-twinkle');
            return svgShell(s, wl, c);
        }
    },

    /* 5. Neon Rose - spiral bloom built from stacked bands */
    {
        id: 'neonrose', name: 'Neon Rose', emoji: '\uD83C\uDF39',
        colors: {
            primary: '#f3a6dd', secondary: '#d464ad', light: '#ffd6ef',
            accent: '#a8328f', stem: '#7a3566', leaf: '#98507f', leafD: '#6d3a5c',
            water: '#5aa8e0', cheek: '#e274a2'
        },
        animClass: 'anim-float',
        audio: { notes: [293.66, 329.63, 440.00], voice: 'smooth', rhythm: [1.2, 0.8, 1.6] },
        renderSVG: function(wl) {
            var c = this.colors;
            var s = stemPx(11, 18, 28, c.stem, c.leafD) +
                leafPx(3, 22, c.leaf, c.leafD) +
                leafPx(16, 25, c.leaf, c.leafD) +
                mid(12, 6, 6, 2, c.light) +
                mid(12, 8, 12, 2, c.primary) +
                mid(12, 10, 16, 2, c.primary) +
                mid(12, 12, 18, 2, c.secondary) +
                mid(12, 14, 16, 2, c.primary) +
                mid(12, 16, 12, 2, c.secondary) +
                mid(12, 18, 8, 2, c.primary) +
                px(6, 9, 2, 2, c.light) + px(16, 10, 2, 2, c.light) +
                px(9, 16, 2, 2, c.accent) + px(14, 15, 2, 2, c.light) +
                faceGroup(12, 11, c.cheek, -0.8, 5, 4);
            return svgShell(s, wl, c);
        }
    },

    /* 6. Solar Sun - eight petals around a big seed head */
    {
        id: 'solar', name: 'Solar Sun', emoji: '\uD83C\uDF3B',
        colors: {
            primary: '#f8c93f', secondary: '#e0a028', light: '#ffe9a0',
            accent: '#8a5a1f', stem: '#4f7f2f', leaf: '#63a03c', leafD: '#47762b',
            water: '#5aa8e0', cheek: '#d98a2a'
        },
        animClass: 'anim-bob',
        audio: { notes: [392.00, 523.25, 659.25], voice: 'bright', rhythm: [0.9, 0.9, 2.3] },
        renderSVG: function(wl) {
            var c = this.colors;
            var s = stemPx(11, 16, 28, c.stem, c.leafD) +
                leafPx(3, 21, c.leaf, c.leafD) +
                leafPx(16, 24, c.leaf, c.leafD) +
                px(11, 2, 2, 5, c.light) +
                px(11, 17, 2, 5, c.light) +
                px(2, 11, 5, 2, c.light) +
                px(17, 11, 5, 2, c.light) +
                px(5, 4, 3, 3, c.primary) + px(16, 4, 3, 3, c.primary) +
                px(5, 17, 3, 3, c.primary) + px(16, 17, 3, 3, c.primary) +
                px(7, 7, 10, 10, c.secondary) +
                px(8, 8, 8, 8, c.primary) +
                faceGroup(12, 9, c.cheek, -4.3, 4, 3) +
                sparkPx(2, 2, c.light, -1.5, 'px-twinkle');
            return svgShell(s, wl, c);
        }
    },

    /* 7. Frost Fern - five stepped fronds over a small bulb */
    {
        id: 'frost', name: 'Frost Fern', emoji: '\u2744\uFE0F',
        colors: {
            primary: '#bfe3f7', secondary: '#7bb6da', light: '#eaf7ff',
            accent: '#5a90b5', stem: '#4a7f9e', leaf: '#6fa8c8', leafD: '#4a7f9e',
            water: '#5aa8e0', cheek: '#9ac6e4'
        },
        animClass: 'anim-wave',
        audio: { notes: [440.00, 523.25, 659.25], voice: 'airy', rhythm: [1.1, 1.1, 1.6] },
        renderSVG: function(wl) {
            var c = this.colors;
            var s = pxLine(12, 25, 12, 8, c.primary, 2) +
                pxLine(12, 25, 5, 13, c.secondary, 2) +
                pxLine(12, 25, 19, 13, c.secondary, 2) +
                pxLine(12, 25, 2, 20, c.leaf, 2) +
                pxLine(12, 25, 22, 20, c.leaf, 2) +
                px(11, 6, 2, 2, c.light) + px(3, 11, 2, 2, c.light) +
                px(20, 11, 2, 2, c.light) + px(1, 18, 2, 2, c.light) +
                px(21, 18, 2, 2, c.light) +
                px(8, 22, 8, 6, c.secondary) +
                px(9, 23, 6, 4, c.primary) +
                faceGroup(12, 23, c.cheek, -2.1, 3, 2) +
                '<g class="px-fall">' + px(4, 8, 1, 1, c.light) + px(3, 9, 3, 1, c.light) + px(4, 10, 1, 1, c.light) + '</g>' +
                '<g class="px-fall" style="animation-delay:-1.6s">' + px(19, 6, 1, 1, c.light) + px(18, 7, 3, 1, c.light) + px(19, 8, 1, 1, c.light) + '</g>' +
                '<g class="px-fall" style="animation-delay:-2.9s">' + px(15, 3, 2, 2, c.light) + '</g>';
            return svgShell(s, wl, c);
        }
    },

    /* 8. Violet Bell - a bell that swings its own pixel clapper */
    {
        id: 'violet', name: 'Violet Bell', emoji: '\uD83D\uDD14',
        colors: {
            primary: '#a99ae8', secondary: '#7d6cc4', light: '#d9d0ff',
            accent: '#f6c445', stem: '#4f3a7a', leaf: '#65509a', leafD: '#4a3a73',
            water: '#5aa8e0', cheek: '#c9a6e2'
        },
        animClass: 'anim-swing',
        audio: { notes: [220.00, 293.66, 329.63], voice: 'mellow', rhythm: [1.7, 0.9, 1.5] },
        renderSVG: function(wl) {
            var c = this.colors;
            var s = stemPx(11, 17, 28, c.stem, c.leafD) +
                leafPx(16, 22, c.leaf, c.leafD) +
                leafPx(3, 25, c.leaf, c.leafD) +
                mid(12, 8, 8, 2, c.light) +
                mid(12, 10, 12, 2, c.primary) +
                mid(12, 12, 14, 2, c.primary) +
                mid(12, 14, 16, 2, c.secondary) +
                mid(12, 16, 18, 2, c.primary) +
                mid(12, 18, 16, 2, c.secondary) +
                px(2, 19, 3, 2, c.light) + px(19, 19, 3, 2, c.light) +
                '<g class="px-clapper">' + px(11, 21, 2, 3, c.accent) + px(10, 22, 4, 1, c.accent) + '</g>' +
                faceGroup(12, 11, c.cheek, -3.7, 5, 4);
            return svgShell(s, wl, c);
        }
    },

    /* 9. Glow Moss - a low mound with two sprouts and rising spores */
    {
        id: 'moss', name: 'Glow Moss', emoji: '\uD83C\uDF3F',
        colors: {
            primary: '#7fd07a', secondary: '#4f9e5a', light: '#b8ebb0',
            accent: '#e8f7c0', stem: '#3f7a4a', leaf: '#5aa864', leafD: '#3f7a4a',
            water: '#5aa8e0', cheek: '#6fb06a'
        },
        animClass: 'anim-bob',
        audio: { notes: [196.00, 261.63, 329.63], voice: 'deep', rhythm: [2.2, 1, 1.3] },
        renderSVG: function(wl) {
            var c = this.colors;
            var s = px(4, 16, 2, 6, c.light) + px(3, 14, 4, 2, c.primary) +
                px(18, 18, 2, 5, c.light) + px(17, 16, 4, 2, c.primary) +
                mid(12, 25, 20, 3, c.leafD) +
                mid(12, 22, 18, 3, c.secondary) +
                mid(12, 19, 14, 3, c.primary) +
                mid(12, 17, 8, 2, c.light) +
                faceGroup(12, 21, c.cheek, -1.9, 4, 2) +
                '<g class="px-rise">' + px(5, 12, 2, 2, c.accent) + '</g>' +
                '<g class="px-rise" style="animation-delay:-1.4s">' + px(18, 13, 2, 2, c.light) + '</g>' +
                '<g class="px-rise" style="animation-delay:-2.7s">' + px(13, 10, 1, 1, c.accent) + '</g>';
            return svgShell(s, wl, c);
        }
    },

    /* 10. Star Orchid - eight pointed pixel star */
    {
        id: 'star', name: 'Star Orchid', emoji: '\u2B50',
        colors: {
            primary: '#93b8f0', secondary: '#5d8fd6', light: '#d7e6ff',
            accent: '#f6c445', stem: '#3c5f9e', leaf: '#4f7ab8', leafD: '#3a5c92',
            water: '#5aa8e0', cheek: '#8fb0e0'
        },
        animClass: 'anim-spin-slow',
        audio: { notes: [523.25, 587.33, 783.99], voice: 'crystal', rhythm: [0.5, 0.5, 2.1] },
        renderSVG: function(wl) {
            var c = this.colors;
            var s = stemPx(11, 16, 28, c.stem, c.leafD) +
                leafPx(3, 21, c.leaf, c.leafD) +
                leafPx(16, 24, c.leaf, c.leafD) +
                px(11, 3, 2, 7, c.primary) + px(10, 2, 4, 2, c.light) +
                px(3, 11, 6, 2, c.primary) + px(2, 10, 2, 4, c.light) +
                px(15, 11, 6, 2, c.primary) + px(20, 10, 2, 4, c.light) +
                px(11, 15, 2, 6, c.secondary) + px(10, 19, 4, 2, c.secondary) +
                px(5, 5, 3, 3, c.secondary) + px(16, 5, 3, 3, c.secondary) +
                px(5, 16, 3, 3, c.secondary) + px(16, 16, 3, 3, c.secondary) +
                px(8, 8, 8, 8, c.secondary) +
                px(9, 9, 6, 6, c.light) +
                faceGroup(12, 10, c.cheek, -5.6, 3, 4) +
                sparkPx(19, 3, c.accent, -0.5, 'px-twinkle') +
                sparkPx(3, 19, c.light, -1.4, 'px-twinkle');
            return svgShell(s, wl, c);
        }
    },

    /* 11. Plasma Peony - ruffled pink layers with crackling sparks */
    {
        id: 'plasma', name: 'Plasma Peony', emoji: '\uD83E\uDE78',
        colors: {
            primary: '#f7a8cf', secondary: '#d96fa8', light: '#ffd9ea',
            accent: '#a83f76', stem: '#7a3a5e', leaf: '#96506f', leafD: '#6b3a52',
            water: '#5aa8e0', cheek: '#e88aa8'
        },
        animClass: 'anim-float',
        audio: { notes: [329.63, 440.00, 523.25], voice: 'smooth', rhythm: [1, 1.2, 1.5] },
        renderSVG: function(wl) {
            var c = this.colors;
            var s = stemPx(11, 19, 28, c.stem, c.leafD) +
                leafPx(3, 23, c.leaf, c.leafD) +
                leafPx(16, 25, c.leaf, c.leafD) +
                mid(12, 5, 6, 2, c.light) +
                mid(12, 7, 10, 2, c.primary) +
                mid(12, 9, 14, 2, c.primary) +
                mid(12, 11, 18, 2, c.secondary) +
                mid(12, 13, 20, 2, c.secondary) +
                mid(12, 15, 18, 2, c.primary) +
                mid(12, 17, 14, 2, c.secondary) +
                mid(12, 19, 8, 2, c.accent) +
                px(8, 10, 2, 2, c.light) + px(15, 13, 2, 2, c.light) +
                px(10, 16, 3, 2, c.light) +
                faceGroup(12, 10, c.cheek, -0.4, 5, 4) +
                sparkPx(2, 5, c.light, -0.8) + sparkPx(20, 7, c.light, -1.6);
            return svgShell(s, wl, c);
        }
    },

    /* 12. Comet Vine - a pixel comet head dragging a stepped tail */
    {
        id: 'comet', name: 'Comet Vine', emoji: '\u2604\uFE0F',
        colors: {
            primary: '#7fe2ec', secondary: '#3fb8cc', light: '#d6fbff',
            accent: '#f6c445', stem: '#2f6f80', leaf: '#3f95a8', leafD: '#2c6b7a',
            water: '#5aa8e0', cheek: '#3fb8cc'
        },
        animClass: 'anim-wave',
        audio: { notes: [440.00, 523.25, 587.33], voice: 'airy', rhythm: [0.8, 0.8, 2.2] },
        renderSVG: function(wl) {
            var c = this.colors;
            var s = pxLine(7, 28, 13, 14, c.stem, 2) +
                leafPx(2, 22, c.leaf, c.leafD) +
                pxLine(13, 13, 4, 27, c.secondary, 2) +
                pxLine(7, 22, 3, 27, c.primary, 1) +
                px(12, 4, 9, 9, c.secondary) +
                px(13, 5, 7, 7, c.primary) +
                px(14, 6, 4, 3, c.light) +
                faceGroup(16, 6, c.cheek, -4.8, 3, 3) +
                sparkPx(8, 17, c.light, -0.7, 'px-twinkle') +
                sparkPx(5, 22, c.light, -1.5, 'px-twinkle') +
                '<g class="px-rise" style="animation-delay:-1.1s">' + px(20, 2, 1, 1, c.accent) + '</g>';
            return svgShell(s, wl, c);
        }
    }

];

function getPlantById(id) {
    for (var i = 0; i < PLANT_TYPES.length; i++) {
        if (PLANT_TYPES[i].id === id) return PLANT_TYPES[i];
    }
    return null;
}

if (typeof window !== 'undefined') {
    window.PLANT_TYPES = PLANT_TYPES;
    window.getPlantById = getPlantById;
}
