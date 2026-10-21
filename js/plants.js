/* ============================================================
   SINGING GARDEN v16 - PLANTS
   12 redesigned bioluminescent species. Every species now has
   its own silhouette plus moving parts: blinking eyes, a
   breathing aura, orbiting motes, rising spores, drifting frost,
   swinging bell clappers and waving leaves.
   ============================================================ */

var INK = '#1a1228';

/* ---------- shared art helpers ---------- */

/* Face: half-lidded almond eyes, shine, soft smile, blush.
   The eye group blinks on its own so every plant feels awake. */
function faceSVG(cx, cy, s, delay) {
    s = s || 1;
    var d = (delay === undefined ? 0 : delay);
    var ex = cx - 9 * s;
    var rx = cx + 9 * s;
    var ey = cy - 2 * s;
    var er = 2.3 * s;
    function eye(x) {
        return '<path d="M' + (x - er) + ',' + ey +
            ' Q' + x + ',' + (ey - er * 0.8) + ' ' + (x + er) + ',' + ey +
            ' Q' + x + ',' + (ey + er * 0.35) + ' ' + (x - er) + ',' + ey + ' Z" ' +
            'fill="' + INK + '"/>';
    }
    return '<g class="p-eyes" style="animation-delay:' + d + 's">' +
        eye(ex) + eye(rx) +
        '<circle cx="' + (ex - 0.5 * s) + '" cy="' + (ey - 0.5 * s) + '" r="' + (0.8 * s) + '" fill="#fff" opacity="0.9"/>' +
        '<circle cx="' + (rx - 0.5 * s) + '" cy="' + (ey - 0.5 * s) + '" r="' + (0.8 * s) + '" fill="#fff" opacity="0.9"/>' +
        '</g>' +
        '<path d="M' + (cx - 6 * s) + ',' + (cy + 6 * s) +
        ' Q' + cx + ',' + (cy + 11 * s) + ' ' + (cx + 6 * s) + ',' + (cy + 6 * s) + '" ' +
        'fill="none" stroke="' + INK + '" stroke-width="' + (1.7 * s) + '" stroke-linecap="round"/>' +
        '<circle cx="' + (cx - 13 * s) + '" cy="' + (cy + 4 * s) + '" r="' + (3.2 * s) + '" fill="#fb7185" opacity="0.32"/>' +
        '<circle cx="' + (cx + 13 * s) + '" cy="' + (cy + 4 * s) + '" r="' + (3.2 * s) + '" fill="#fb7185" opacity="0.32"/>';
}

function plantDefs(id, c) {
    return '<defs>' +
        '<radialGradient id="aura-' + id + '" cx="50%" cy="50%" r="50%">' +
        '<stop offset="0%" stop-color="' + c.glow + '" stop-opacity="0.5"/>' +
        '<stop offset="55%" stop-color="' + c.glow + '" stop-opacity="0.16"/>' +
        '<stop offset="100%" stop-color="' + c.glow + '" stop-opacity="0"/>' +
        '</radialGradient>' +
        '<linearGradient id="body-' + id + '" x1="0" y1="1" x2="0" y2="0">' +
        '<stop offset="0%" stop-color="' + c.secondary + '"/>' +
        '<stop offset="100%" stop-color="' + c.primary + '"/>' +
        '</linearGradient>' +
        '</defs>';
}

/* Water level adds animated ripple rings, so a thirsty plant
   visibly hums with a wider halo. */
function svgShell(id, c, wl, inner) {
    var rings = '';
    if (wl >= 1) {
        rings += '<circle class="p-ring" cx="50" cy="52" r="30" fill="none" stroke="' + c.glow +
            '" stroke-width="1.1" stroke-dasharray="3 8" opacity="0.6"/>';
    }
    if (wl >= 2) {
        rings += '<circle class="p-ring" style="animation-direction:reverse;animation-duration:32s" cx="50" cy="52" r="38" ' +
            'fill="none" stroke="' + c.primary + '" stroke-width="0.9" stroke-dasharray="2 10" opacity="0.4"/>';
    }
    return '<svg viewBox="0 0 100 120" width="80" height="96">' +
        plantDefs(id, c) +
        '<ellipse cx="50" cy="114" rx="20" ry="3.4" fill="#07061a" opacity="0.5"/>' +
        '<ellipse class="p-aura" cx="50" cy="56" rx="40" ry="36" fill="url(#aura-' + id + ')"/>' +
        rings + inner +
        '</svg>';
}

function stemTo(cx, baseY, topY, color, bend) {
    var my = (baseY + topY) / 2;
    return '<path d="M' + cx + ',' + baseY +
        ' Q' + (cx + bend) + ',' + Math.round(my) + ' ' + cx + ',' + topY + '" ' +
        'fill="none" stroke="' + color + '" stroke-width="3.4" stroke-linecap="round"/>';
}

function leafAt(x, y, dx, dy, fill, side) {
    var ex = x + dx;
    var ey = y + dy;
    var qx = x + dx * 0.5;
    var qy = y + dy * 0.5 - 7;
    return '<path class="' + (side > 0 ? 'p-leaf-r' : 'p-leaf-l') + '" d="M' + x + ',' + y +
        ' Q' + qx + ',' + qy + ' ' + ex + ',' + ey +
        ' Q' + (x + dx * 0.3) + ',' + (y + dy * 0.5 + 6) + ' ' + x + ',' + y + ' Z" ' +
        'fill="' + fill + '"/>';
}

var PLANT_TYPES = [

    /* 1. Luna Bloom — night lotus cradled by a crescent moon */
    {
        id: 'luna', name: 'Luna Bloom', emoji: '\uD83C\uDF19',
        colors: { primary: '#a5f3fc', secondary: '#67e8f9', glow: '#22d3ee' },
        animClass: 'anim-float',
        audio: { notes: [329.63, 392.00, 523.25], voice: 'airy', rhythm: [1.5, 1, 2] },
        renderSVG: function(wl) {
            var id = this.id, c = this.colors;
            var petals = '';
            for (var i = 0; i < 7; i++) {
                var rot = (i * 51.4).toFixed(1);
                petals += '<ellipse cx="0" cy="-13" rx="8" ry="15" fill="' +
                    (i % 2 ? '#a5f3fc' : '#e0f7fa') + '" opacity="' + (i % 2 ? 0.6 : 0.95) +
                    '" transform="rotate(' + rot + ')"/>';
            }
            var inner =
                stemTo(50, 112, 64, '#0f766e', -4) +
                leafAt(50, 98, -21, -12, '#0d9488', -1) +
                leafAt(50, 88, 19, -10, '#14b8a6', 1) +
                /* crescent moon, hanging behind the bloom */
                '<path d="M80,12 A16,16 0 1,0 80,44 A12,12 0 1,1 80,12 Z" fill="#e0f7fa" opacity="0.92"/>' +
                '<g transform="translate(50,52)">' + petals +
                '<circle cx="0" cy="0" r="11" fill="#fcd34d"/>' +
                '<circle cx="0" cy="0" r="6" fill="#fbbf24"/>' +
                '</g>' +
                /* two fireflies orbiting the flower */
                '<g class="p-orbit">' +
                '<circle cx="50" cy="13" r="2.1" fill="#a5f3fc"/>' +
                '<circle cx="87" cy="56" r="1.5" fill="#67e8f9" opacity="0.85"/>' +
                '</g>' +
                faceSVG(50, 50, 0.9, -1.4);
            return svgShell(id, c, wl, inner);
        }
    },

    /* 2. Ember Lily — a living torch with rising sparks */
    {
        id: 'ember', name: 'Ember Lily', emoji: '\uD83D\uDD25',
        colors: { primary: '#fdba74', secondary: '#fb923c', glow: '#f97316' },
        animClass: 'anim-flicker',
        audio: { notes: [261.63, 329.63, 392.00], voice: 'warm', rhythm: [0.7, 0.7, 1.9] },
        renderSVG: function(wl) {
            var id = this.id, c = this.colors;
            var embers =
                '<g class="p-rise"><circle cx="39" cy="40" r="2" fill="#fdba74"/></g>' +
                '<g class="p-rise" style="animation-delay:-1.2s"><circle cx="63" cy="34" r="1.6" fill="#fed7aa"/></g>' +
                '<g class="p-rise" style="animation-delay:-2.4s"><circle cx="52" cy="26" r="1.4" fill="#fef3c7"/></g>';
            var inner =
                stemTo(50, 112, 66, '#7c2d12', 5) +
                leafAt(50, 100, -18, -14, '#9a3412', -1) +
                leafAt(50, 88, 16, -12, '#c2410c', 1) +
                '<path class="p-flicker" d="M50,22 Q66,38 58,58 Q55,48 50,66 Q45,48 42,58 Q34,38 50,22 Z" ' +
                'fill="url(#body-' + id + ')"/>' +
                '<path class="p-flicker" style="animation-delay:-0.9s" d="M50,32 Q58,44 54,58 Q51,50 50,60 Q49,50 46,58 Q42,44 50,32 Z" ' +
                'fill="#fef3c7" opacity="0.85"/>' +
                '<path class="p-flicker" style="animation-delay:-0.4s" d="M31,52 Q26,41 21,50 Q19,59 28,61 Q31,56 31,52 Z" ' +
                'fill="#fb923c" opacity="0.8"/>' +
                '<path class="p-flicker" style="animation-delay:-1.6s" d="M69,52 Q74,41 79,50 Q81,59 72,61 Q69,56 69,52 Z" ' +
                'fill="#fdba74" opacity="0.75"/>' +
                embers +
                faceSVG(50, 56, 0.85, -3.2);
            return svgShell(id, c, wl, inner);
        }
    },

    /* 3. Aurora Tulip — petals wrapped in a drifting light ribbon */
    {
        id: 'aurora', name: 'Aurora Tulip', emoji: '\uD83C\uDF37',
        colors: { primary: '#5ef2d6', secondary: '#e879f9', glow: '#a78bfa' },
        animClass: 'anim-wave',
        audio: { notes: [392.00, 440.00, 523.25], voice: 'bright', rhythm: [1, 1.4, 1.3] },
        renderSVG: function(wl) {
            var id = this.id, c = this.colors;
            var inner =
                stemTo(50, 112, 64, '#155e75', -6) +
                leafAt(50, 96, 20, -12, '#0e7490', 1) +
                leafAt(50, 86, -18, -14, '#0891b2', -1) +
                '<path class="p-ribbon" d="M14,80 Q24,42 50,46 Q78,50 89,28" fill="none" ' +
                'stroke="#e879f9" stroke-width="2" opacity="0.72" stroke-linecap="round"/>' +
                '<path class="p-ribbon" style="animation-delay:-1.1s" d="M18,56 Q34,26 66,32" fill="none" ' +
                'stroke="#5ef2d6" stroke-width="1.6" opacity="0.6" stroke-linecap="round"/>' +
                '<g transform="translate(50,52)">' +
                '<path d="M-17,10 Q-20,-16 0,-24 Q20,-16 17,10 Q9,5 0,9 Q-9,5 -17,10 Z" fill="url(#body-' + id + ')"/>' +
                '<path d="M-9,8 Q-11,-12 0,-19 Q11,-12 9,8 Q5,4 0,7 Q-5,4 -9,8 Z" fill="#e879f9" opacity="0.85"/>' +
                '<path d="M-4,6 Q-5,-8 0,-14 Q5,-8 4,6 Q2,3 0,5 Q-2,3 -4,6 Z" fill="#f0abfc"/>' +
                '</g>' +
                '<g class="p-orbit-rev">' +
                '<circle cx="50" cy="16" r="1.6" fill="#5ef2d6"/>' +
                '<circle cx="83" cy="62" r="1.2" fill="#e879f9"/>' +
                '</g>' +
                faceSVG(50, 54, 0.85, -2.6);
            return svgShell(id, c, wl, inner);
        }
    },

    /* 4. Crystal Daisy — faceted crystal petals with a turning halo */
    {
        id: 'crystal', name: 'Crystal Daisy', emoji: '\u2744\uFE0F',
        colors: { primary: '#e0f2fe', secondary: '#7dd3fc', glow: '#38bdf8' },
        animClass: 'anim-spin-slow',
        audio: { notes: [440.00, 587.33, 659.25], voice: 'crystal', rhythm: [0.55, 0.55, 1.9] },
        renderSVG: function(wl) {
            var id = this.id, c = this.colors;
            var petals = '';
            for (var i = 0; i < 8; i++) {
                petals += '<g transform="rotate(' + (i * 45) + ')">' +
                    '<path d="M0,-27 L7.5,-15 L0,-6 L-7.5,-15 Z" fill="' + (i % 2 ? '#e0f2fe' : '#7dd3fc') + '"/>' +
                    '<path d="M0,-27 L7.5,-15 L0,-13 Z" fill="#ffffff" opacity="0.72"/>' +
                    '</g>';
            }
            var inner =
                stemTo(50, 112, 70, '#0c4a6e', 4) +
                leafAt(50, 98, -18, -12, '#075985', -1) +
                leafAt(50, 88, 16, -10, '#0e7490', 1) +
                '<circle class="p-halo" cx="50" cy="48" r="28" fill="none" stroke="#7dd3fc" ' +
                'stroke-width="1" stroke-dasharray="2 8" opacity="0.7" style="transform-origin:50px 48px"/>' +
                '<g transform="translate(50,48)">' + petals +
                '<circle cx="0" cy="0" r="9" fill="#fcd34d"/>' +
                '<circle cx="0" cy="0" r="4.5" fill="#fbbf24"/>' +
                '</g>' +
                '<g class="p-twinkle"><path d="M78,28 L79.5,32 L83.5,33.5 L79.5,35 L78,39 L76.5,35 L72.5,33.5 L76.5,32 Z" fill="#e0f2fe"/></g>' +
                '<g class="p-twinkle" style="animation-delay:-1.3s"><path d="M22,72 L23.2,75 L26.2,76.2 L23.2,77.4 L22,80.4 L20.8,77.4 L17.8,76.2 L20.8,75 Z" fill="#bae6fd"/></g>' +
                faceSVG(50, 46, 0.85, -5.1);
            return svgShell(id, c, wl, inner);
        }
    },

    /* 5. Neon Rose — spiral rose ringed by a floating thorn */
    {
        id: 'neonrose', name: 'Neon Rose', emoji: '\uD83C\uDF39',
        colors: { primary: '#f0abfc', secondary: '#e879f9', glow: '#d946ef' },
        animClass: 'anim-float',
        audio: { notes: [293.66, 329.63, 440.00], voice: 'smooth', rhythm: [1.2, 0.8, 1.6] },
        renderSVG: function(wl) {
            var id = this.id, c = this.colors;
            var inner =
                stemTo(50, 112, 70, '#831843', -5) +
                leafAt(50, 98, 20, -12, '#9d174d', 1) +
                leafAt(50, 88, -18, -12, '#be185d', -1) +
                '<g class="p-orbit" style="animation-duration:14s">' +
                '<path d="M78,36 L82.5,43 L75.5,43 Z" fill="#e879f9"/>' +
                '</g>' +
                '<g transform="translate(50,50)">' +
                '<path d="M0,-24 C17,-24 25,-12 25,0 C25,14 14,22 0,22 C-14,22 -25,14 -25,0 C-25,-12 -17,-24 0,-24 Z" fill="#9d174d"/>' +
                '<path d="M0,-19 C13,-19 19,-10 19,0 C19,11 10,17 0,17 C-10,17 -19,11 -19,0 C-19,-10 -13,-19 0,-19 Z" fill="#d946ef" opacity="0.92"/>' +
                '<path d="M0,-13 C9,-13 13,-7 13,0 C13,7 7,12 0,12 C-7,12 -13,7 -13,0 C-13,-7 -9,-13 0,-13 Z" fill="#f0abfc"/>' +
                '<path d="M0,-8 C5,-8 7,-4 7,0 C7,5 4,8 0,8 C-4,8 -7,5 -7,0 C-7,-4 -5,-8 0,-8 Z" fill="#fbcfe8"/>' +
                '</g>' +
                faceSVG(50, 50, 0.85, -0.8);
            return svgShell(id, c, wl, inner);
        }
    },

    /* 6. Solar Sun — a slowly turning crown of uneven rays */
    {
        id: 'solar', name: 'Solar Sun', emoji: '\uD83C\uDF3B',
        colors: { primary: '#fde68a', secondary: '#fcd34d', glow: '#f59e0b' },
        animClass: 'anim-bob',
        audio: { notes: [392.00, 523.25, 659.25], voice: 'bright', rhythm: [0.9, 0.9, 2.3] },
        renderSVG: function(wl) {
            var id = this.id, c = this.colors;
            var rays = '';
            for (var i = 0; i < 16; i++) {
                var long = i % 2 === 0;
                var len = long ? 15 : 8;
                var half = long ? 3.6 : 2.8;
                rays += '<path d="M0,-19 L-' + half + ',-' + (19 + len) + ' L' + half + ',-' + (19 + len) + ' Z" ' +
                    'fill="' + (long ? '#fbbf24' : '#fde68a') + '" transform="rotate(' + (i * 22.5) + ' 50 50)"/>';
            }
            var inner =
                stemTo(50, 112, 72, '#365314', 4) +
                leafAt(50, 98, -18, -12, '#4d7c0f', -1) +
                leafAt(50, 88, 16, -10, '#65a30d', 1) +
                '<g class="p-spin" style="transform-origin:50px 50px">' + rays + '</g>' +
                '<circle cx="50" cy="50" r="17" fill="#fde68a"/>' +
                '<circle cx="50" cy="50" r="13" fill="#fbbf24"/>' +
                '<g class="p-orbit" style="animation-duration:12s"><circle cx="82" cy="38" r="2.8" fill="#fef3c7"/></g>' +
                '<g class="p-orbit-rev"><circle cx="19" cy="60" r="2" fill="#fde68a"/></g>' +
                faceSVG(50, 50, 0.8, -4.3);
            return svgShell(id, c, wl, inner);
        }
    },

    /* 7. Frost Fern — arching fronds shedding slow frost */
    {
        id: 'frost', name: 'Frost Fern', emoji: '\u2744\uFE0F',
        colors: { primary: '#bae6fd', secondary: '#7dd3fc', glow: '#38bdf8' },
        animClass: 'anim-wave',
        audio: { notes: [440.00, 523.25, 659.25], voice: 'airy', rhythm: [1.1, 1.1, 1.6] },
        renderSVG: function(wl) {
            var id = this.id, c = this.colors;
            var fronds = '';
            for (var i = -2; i <= 2; i++) {
                var tipX = 50 + i * 18;
                var tipY = 32 + Math.abs(i) * 9;
                var ctrlX = 50 + i * 6;
                var ctrlY = 80 - Math.abs(i) * 4;
                fronds += '<path d="M50,104 Q' + ctrlX + ',' + ctrlY + ' ' + tipX + ',' + tipY + '" ' +
                    'fill="none" stroke="' + (i === 0 ? '#7dd3fc' : '#38bdf8') + '" stroke-width="2.6" ' +
                    'stroke-linecap="round" opacity="' + (i === 0 ? 1 : 0.85) + '"/>';
                for (var j = 1; j <= 5; j++) {
                    var t = j / 5.6;
                    var bx = 50 + (tipX - 50) * t;
                    var by = 104 + (tipY - 104) * t;
                    fronds += '<ellipse cx="' + (bx + (i >= 0 ? 4.5 : -4.5)) + '" cy="' + by +
                        '" rx="4.6" ry="1.8" fill="#bae6fd" transform="rotate(' + (i * 16) + ' ' + bx + ' ' + by + ')"/>';
                }
            }
            var frost =
                '<g class="p-fall"><path d="M22,54 l1.4,2.4 -1.4,2.4 -1.4,-2.4 Z" fill="#e0f2fe"/></g>' +
                '<g class="p-fall" style="animation-delay:-1.7s"><path d="M76,44 l1.2,2 -1.2,2 -1.2,-2 Z" fill="#bae6fd"/></g>' +
                '<g class="p-fall" style="animation-delay:-3.1s"><path d="M64,30 l1,1.8 -1,1.8 -1,-1.8 Z" fill="#e0f2fe"/></g>';
            var inner =
                '<g class="p-breathe">' + fronds + '</g>' +
                '<circle cx="50" cy="88" r="13" fill="#0e7490" opacity="0.85"/>' +
                '<circle cx="50" cy="88" r="9" fill="url(#body-' + id + ')"/>' +
                frost +
                faceSVG(50, 88, 0.8, -2.1);
            return svgShell(id, c, wl, inner);
        }
    },

    /* 8. Violet Bell — a bell that swings its own clapper */
    {
        id: 'violet', name: 'Violet Bell', emoji: '\uD83D\uDD14',
        colors: { primary: '#c4b5fd', secondary: '#a78bfa', glow: '#8b5cf6' },
        animClass: 'anim-swing',
        audio: { notes: [220.00, 293.66, 329.63], voice: 'mellow', rhythm: [1.7, 0.9, 1.5] },
        renderSVG: function(wl) {
            var id = this.id, c = this.colors;
            var inner =
                stemTo(50, 112, 44, '#4c1d95', -7) +
                leafAt(50, 96, 19, -12, '#5b21b6', 1) +
                leafAt(50, 86, -17, -12, '#6d28d9', -1) +
                '<circle cx="50" cy="42" r="3" fill="#ede9fe"/>' +
                '<path d="M33,44 Q33,72 50,77 Q67,72 67,44 Q50,36 33,44 Z" fill="url(#body-' + id + ')"/>' +
                '<path d="M37,46 Q37,68 50,72 Q63,68 63,46 Q50,40 37,46 Z" fill="#c4b5fd" opacity="0.8"/>' +
                '<ellipse cx="50" cy="45" rx="15" ry="3" fill="#ede9fe" opacity="0.55"/>' +
                '<circle class="p-clapper" cx="50" cy="79" r="4.5" fill="#8b5cf6"/>' +
                '<circle class="p-clapper" cx="50" cy="79" r="2" fill="#ddd6fe" style="animation-delay:-0.3s"/>' +
                '<g class="p-orbit" style="animation-duration:11s">' +
                '<path d="M74,34 L74,25 L81,23 L81,32" fill="none" stroke="#c4b5fd" stroke-width="1.6"/>' +
                '<circle cx="72" cy="34" r="2.3" fill="#c4b5fd"/>' +
                '<circle cx="79" cy="32" r="2.3" fill="#c4b5fd"/>' +
                '</g>' +
                faceSVG(50, 58, 0.8, -3.7);
            return svgShell(id, c, wl, inner);
        }
    },

    /* 9. Glow Moss — a breathing moss mound puffing spores */
    {
        id: 'moss', name: 'Glow Moss', emoji: '\uD83C\uDF3F',
        colors: { primary: '#86efac', secondary: '#4ade80', glow: '#22c55e' },
        animClass: 'anim-bob',
        audio: { notes: [196.00, 261.63, 329.63], voice: 'deep', rhythm: [2.2, 1, 1.3] },
        renderSVG: function(wl) {
            var id = this.id, c = this.colors;
            var mound =
                '<ellipse cx="32" cy="94" rx="17" ry="12" fill="#166534"/>' +
                '<ellipse cx="68" cy="96" rx="16" ry="11" fill="#14532d"/>' +
                '<ellipse cx="50" cy="92" rx="21" ry="15" fill="#15803d"/>' +
                '<ellipse cx="41" cy="86" rx="13" ry="12" fill="#4ade80"/>' +
                '<ellipse cx="61" cy="84" rx="12" ry="13" fill="#86efac"/>' +
                '<ellipse cx="50" cy="81" rx="12" ry="11" fill="#bbf7d0"/>';
            var sprouts =
                '<path d="M33,76 Q30,68 34,63" fill="none" stroke="#bbf7d0" stroke-width="2" stroke-linecap="round"/>' +
                '<circle cx="34" cy="62" r="3.4" fill="#4ade80"/>' +
                '<path d="M67,78 Q71,70 67,65" fill="none" stroke="#bbf7d0" stroke-width="2" stroke-linecap="round"/>' +
                '<circle cx="67" cy="64" r="3" fill="#86efac"/>';
            var spores =
                '<g class="p-spore"><circle cx="34" cy="56" r="1.8" fill="#bbf7d0"/></g>' +
                '<g class="p-spore" style="animation-delay:-1.4s"><circle cx="58" cy="50" r="1.4" fill="#86efac"/></g>' +
                '<g class="p-spore" style="animation-delay:-2.9s"><circle cx="70" cy="58" r="1.2" fill="#d9f99d"/></g>';
            var inner =
                '<g class="p-breathe">' + mound + sprouts + '</g>' +
                spores +
                faceSVG(50, 82, 0.78, -1.9);
            return svgShell(id, c, wl, inner);
        }
    },

    /* 10. Star Orchid — five-point orchid inside a turning constellation */
    {
        id: 'star', name: 'Star Orchid', emoji: '\u2B50',
        colors: { primary: '#93c5fd', secondary: '#60a5fa', glow: '#3b82f6' },
        animClass: 'anim-spin-slow',
        audio: { notes: [523.25, 587.33, 783.99], voice: 'crystal', rhythm: [0.5, 0.5, 2.1] },
        renderSVG: function(wl) {
            var id = this.id, c = this.colors;
            var petals = '';
            for (var i = 0; i < 5; i++) {
                petals += '<g transform="rotate(' + (i * 72 - 90) + ')">' +
                    '<path d="M0,-6 Q9,-20 0,-32 Q-9,-20 0,-6 Z" fill="' + (i % 2 ? '#60a5fa' : '#93c5fd') + '" opacity="0.94"/>' +
                    '</g>';
            }
            var inner =
                stemTo(50, 112, 72, '#1e3a8a', 5) +
                leafAt(50, 98, -19, -12, '#1e40af', -1) +
                leafAt(50, 90, 17, -10, '#2563eb', 1) +
                '<circle class="p-halo" cx="50" cy="50" r="31" fill="none" stroke="#93c5fd" ' +
                'stroke-width="0.9" stroke-dasharray="1 6" opacity="0.6" style="transform-origin:50px 50px"/>' +
                '<g transform="translate(50,50)">' + petals +
                '<circle cx="0" cy="0" r="12" fill="#bfdbfe"/>' +
                '</g>' +
                '<g class="p-orbit" style="animation-duration:15s">' +
                '<path d="M76,26 l1.8,3.6 3.9,0.6 -2.8,2.8 0.7,4 -3.6,-1.9 -3.6,1.9 0.7,-4 -2.8,-2.8 3.9,-0.6 Z" fill="#fcd34d"/>' +
                '</g>' +
                '<circle class="p-twinkle" cx="21" cy="38" r="1.7" fill="#dbeafe"/>' +
                '<circle class="p-twinkle" style="animation-delay:-1.2s" cx="80" cy="72" r="1.3" fill="#eff6ff"/>' +
                faceSVG(50, 50, 0.8, -5.6);
            return svgShell(id, c, wl, inner);
        }
    },

    /* 11. Plasma Peony — ruffled bloom crackling with energy arcs */
    {
        id: 'plasma', name: 'Plasma Peony', emoji: '\uD83E\uDE78',
        colors: { primary: '#f9a8d4', secondary: '#f472b6', glow: '#ec4899' },
        animClass: 'anim-float',
        audio: { notes: [329.63, 440.00, 523.25], voice: 'smooth', rhythm: [1, 1.2, 1.5] },
        renderSVG: function(wl) {
            var id = this.id, c = this.colors;
            var cols = ['#9d174d', '#db2777', '#f472b6'];
            var layers = '';
            for (var l = 0; l < 3; l++) {
                var n = 7 - l;
                var r = 24 - l * 6;
                for (var p = 0; p < n; p++) {
                    var a = p * (360 / n) + l * 22;
                    layers += '<ellipse cx="50" cy="' + (50 - r * 0.62).toFixed(1) + '" rx="' + (r * 0.5).toFixed(1) +
                        '" ry="' + r + '" fill="' + cols[l] + '" opacity="' + (0.62 + l * 0.13).toFixed(2) +
                        '" transform="rotate(' + a.toFixed(1) + ' 50 50)"/>';
                }
            }
            var inner =
                stemTo(50, 112, 70, '#831843', -4) +
                leafAt(50, 98, 20, -12, '#9d174d', 1) +
                leafAt(50, 88, -18, -12, '#be185d', -1) +
                layers +
                '<circle cx="50" cy="50" r="9" fill="#fbcfe8"/>' +
                '<path class="p-arc" d="M25,30 L31,40 L27,44 L35,55" fill="none" stroke="#f9a8d4" stroke-width="1.5" stroke-linecap="round"/>' +
                '<path class="p-arc" style="animation-delay:-0.9s" d="M75,34 L69,44 L73,48 L65,59" fill="none" stroke="#fbcfe8" stroke-width="1.3" stroke-linecap="round"/>' +
                '<g class="p-orbit-rev" style="animation-duration:10s"><circle cx="50" cy="17" r="2.2" fill="#fbcfe8"/></g>' +
                faceSVG(50, 50, 0.8, -0.4);
            return svgShell(id, c, wl, inner);
        }
    },

    /* 12. Comet Vine — a comet head dragging a sparkling tail */
    {
        id: 'comet', name: 'Comet Vine', emoji: '\u2604\uFE0F',
        colors: { primary: '#67e8f9', secondary: '#22d3ee', glow: '#06b6d4' },
        animClass: 'anim-wave',
        audio: { notes: [440.00, 523.25, 587.33], voice: 'airy', rhythm: [0.8, 0.8, 2.2] },
        renderSVG: function(wl) {
            var id = this.id, c = this.colors;
            var inner =
                '<path d="M64,106 Q80,92 75,72 Q71,57 85,48" fill="none" stroke="#0e7490" ' +
                'stroke-width="2.6" stroke-linecap="round"/>' +
                '<path class="p-ribbon" d="M44,58 Q30,78 18,98" fill="none" stroke="#22d3ee" ' +
                'stroke-width="5" opacity="0.45" stroke-linecap="round"/>' +
                '<path class="p-ribbon" style="animation-delay:-0.7s" d="M51,60 Q42,82 32,102" fill="none" ' +
                'stroke="#67e8f9" stroke-width="3" opacity="0.6" stroke-linecap="round"/>' +
                '<path class="p-ribbon" style="animation-delay:-1.5s" d="M35,60 Q24,74 14,86" fill="none" ' +
                'stroke="#a5f3fc" stroke-width="1.8" opacity="0.5" stroke-linecap="round"/>' +
                '<circle cx="52" cy="44" r="15" fill="#0e7490"/>' +
                '<circle cx="52" cy="44" r="12" fill="url(#body-' + id + ')"/>' +
                '<ellipse cx="47" cy="38" rx="5" ry="3.4" fill="#ffffff" opacity="0.5" transform="rotate(-30 47 38)"/>' +
                '<g class="p-twinkle"><circle cx="24" cy="80" r="1.8" fill="#a5f3fc"/></g>' +
                '<g class="p-twinkle" style="animation-delay:-1.1s"><circle cx="34" cy="94" r="1.5" fill="#67e8f9"/></g>' +
                '<g class="p-twinkle" style="animation-delay:-2.2s"><circle cx="16" cy="92" r="1.2" fill="#e0f2fe"/></g>' +
                '<g class="p-orbit" style="animation-duration:12s"><circle cx="50" cy="12" r="1.6" fill="#a5f3fc"/></g>' +
                faceSVG(52, 46, 0.8, -4.8);
            return svgShell(id, c, wl, inner);
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
