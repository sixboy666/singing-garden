/* ============================================================
   SINGING GARDEN v9 — PLANTS
   12 bioluminescent plant species with glow filters
   Each plant: id, name, emoji, colors, animClass, audio, renderSVG
   ============================================================ */

/* Shared glow filter definitions — appended once to the document */
var GLOW_DEFS =
    '<defs>' +
    '<filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">' +
    '<feGaussianBlur stdDeviation="3" result="b"/>' +
    '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>' +
    '</filter>' +
    '<filter id="glow-soft" x="-50%" y="-50%" width="200%" height="200%">' +
    '<feGaussianBlur stdDeviation="2" result="b"/>' +
    '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>' +
    '</filter>' +
    '</defs>';

/* Helper: build a face (eyes + smile) — half-lidded, serene */
function faceSVG(cx, cy, scale) {
    var s = scale || 1;
    var ex = cx - 9 * s, ey = cy - 2 * s;
    var eyeR = 2.2 * s;
    return (
        /* left eye (half-lidded almond) */
        '<path d="M' + (ex - eyeR) + ',' + ey +
        ' Q' + ex + ',' + (ey - eyeR * 0.6) + ' ' + (ex + eyeR) + ',' + ey +
        ' Q' + ex + ',' + (ey + eyeR * 0.3) + ' ' + (ex - eyeR) + ',' + ey + ' Z" ' +
        'fill="#1a1228"/>' +
        /* right eye */
        '<path d="M' + (cx + 9 * s - eyeR) + ',' + ey +
        ' Q' + (cx + 9 * s) + ',' + (ey - eyeR * 0.6) + ' ' + (cx + 9 * s + eyeR) + ',' + ey +
        ' Q' + (cx + 9 * s) + ',' + (ey + eyeR * 0.3) + ' ' + (cx + 9 * s - eyeR) + ',' + ey + ' Z" ' +
        'fill="#1a1228"/>' +
        /* eye shine */
        '<circle cx="' + (ex - 0.6 * s) + '" cy="' + (ey - 0.4 * s) + '" r="' + (0.7 * s) + '" fill="#fff" opacity="0.8"/>' +
        '<circle cx="' + (cx + 9 * s - 0.6 * s) + '" cy="' + (ey - 0.4 * s) + '" r="' + (0.7 * s) + '" fill="#fff" opacity="0.8"/>' +
        /* soft smile */
        '<path d="M' + (cx - 6 * s) + ',' + (cy + 7 * s) +
        ' Q' + cx + ',' + (cy + 12 * s) + ' ' + (cx + 6 * s) + ',' + (cy + 7 * s) + '" ' +
        'fill="none" stroke="#1a1228" stroke-width="' + (1.6 * s) + '" stroke-linecap="round"/>' +
        /* blush */
        '<circle cx="' + (cx - 13 * s) + '" cy="' + (cy + 4 * s) + '" r="' + (3 * s) + '" fill="#fb7185" opacity="0.35"/>' +
        '<circle cx="' + (cx + 13 * s) + '" cy="' + (cy + 4 * s) + '" r="' + (3 * s) + '" fill="#fb7185" opacity="0.35"/>'
    );
}

/* Stem + leaves helper */
function stemSVG(cx, baseY, height, color) {
    return (
        '<path d="M' + cx + ',' + baseY +
        ' Q' + (cx + 4) + ',' + (baseY - height / 2) + ' ' + cx + ',' + (baseY - height) + '" ' +
        'fill="none" stroke="' + color + '" stroke-width="3.5" stroke-linecap="round"/>' +
        '<path d="M' + cx + ',' + (baseY - height * 0.6) +
        ' Q' + (cx - 16) + ',' + (baseY - height * 0.5) + ' ' + (cx - 20) + ',' + (baseY - height * 0.7) +
        ' Q' + (cx - 8) + ',' + (baseY - height * 0.65) + ' ' + cx + ',' + (baseY - height * 0.6) + ' Z" ' +
        'fill="' + color + '" opacity="0.8"/>' +
        '<path d="M' + cx + ',' + (baseY - height * 0.4) +
        ' Q' + (cx + 16) + ',' + (baseY - height * 0.3) + ' ' + (cx + 20) + ',' + (baseY - height * 0.5) +
        ' Q' + (cx + 8) + ',' + (baseY - height * 0.45) + ' ' + cx + ',' + (baseY - height * 0.4) + ' Z" ' +
        'fill="' + color + '" opacity="0.8"/>'
    );
}

var PLANT_TYPES = [

    /* 1. Luna Bloom — moonflower, silver-cyan */
    {
        id: 'luna', name: 'Luna Bloom', emoji: '\uD83C\uDF19',
        colors: { primary: '#a5f3fc', secondary: '#67e8f9', glow: '#22d3ee' },
        animClass: 'anim-float',
        audio: { notes: [329.63, 392.00, 523.25], voice: 'airy' },
        renderSVG: function(wl) {
            var g = wl >= 2 ? 'filter="url(#glow-cyan)"' : '';
            return '<svg viewBox="0 0 100 120" width="80" height="96">' + GLOW_DEFS +
                stemSVG(50, 115, 55, '#0f766e') +
                '<g ' + g + ' transform="translate(50,45)">' +
                /* petals */
                '<ellipse cx="0" cy="-18" rx="10" ry="20" fill="#e0f7fa" opacity="0.95"/>' +
                '<ellipse cx="0" cy="-18" rx="10" ry="20" fill="#a5f3fc" opacity="0.6" transform="rotate(45)"/>' +
                '<ellipse cx="0" cy="-18" rx="10" ry="20" fill="#e0f7fa" opacity="0.95" transform="rotate(90)"/>' +
                '<ellipse cx="0" cy="-18" rx="10" ry="20" fill="#a5f3fc" opacity="0.6" transform="rotate(135)"/>' +
                /* center */
                '<circle cx="0" cy="-18" r="7" fill="#fcd34d"/>' +
                '<circle cx="0" cy="-18" r="4" fill="#fbbf24"/>' +
                '</g>' +
                faceSVG(50, 42, 1) +
                '</svg>';
        }
    },

    /* 2. Ember Lily — warm orange-red */
    {
        id: 'ember', name: 'Ember Lily', emoji: '\uD83D\uDD25',
        colors: { primary: '#fdba74', secondary: '#fb923c', glow: '#f97316' },
        animClass: 'anim-flicker',
        audio: { notes: [261.63, 329.63, 392.00], voice: 'warm' },
        renderSVG: function(wl) {
            var g = wl >= 2 ? 'filter="url(#glow-soft)"' : '';
            return '<svg viewBox="0 0 100 120" width="80" height="96">' + GLOW_DEFS +
                stemSVG(50, 115, 58, '#7c2d12') +
                '<g ' + g + ' transform="translate(50,42)">' +
                '<path d="M0,-26 Q-22,-10 -16,8 Q0,2 16,8 Q22,-10 0,-26 Z" fill="#fb923c"/>' +
                '<path d="M0,-26 Q-14,-8 -10,6 Q0,2 10,6 Q14,-8 0,-26 Z" fill="#fdba74"/>' +
                '<path d="M0,-20 Q-7,-6 -5,4 Q0,1 5,4 Q7,-6 0,-20 Z" fill="#fef3c7"/>' +
                '</g>' +
                faceSVG(50, 40, 1) +
                '</svg>';
        }
    },

    /* 3. Aurora Tulip — cyan-magenta */
    {
        id: 'aurora', name: 'Aurora Tulip', emoji: '\uD83C\uDF37',
        colors: { primary: '#5ef2d6', secondary: '#e879f9', glow: '#a78bfa' },
        animClass: 'anim-wave',
        audio: { notes: [349.23, 440.00, 523.25], voice: 'bright' },
        renderSVG: function(wl) {
            var g = wl >= 2 ? 'filter="url(#glow-cyan)"' : '';
            return '<svg viewBox="0 0 100 120" width="80" height="96">' + GLOW_DEFS +
                stemSVG(50, 115, 52, '#155e75') +
                '<g ' + g + ' transform="translate(50,40)">' +
                '<path d="M-14,8 Q-18,-20 0,-28 Q18,-20 14,8 Q8,4 0,8 Q-8,4 -14,8 Z" fill="#5ef2d6"/>' +
                '<path d="M-8,6 Q-10,-16 0,-24 Q10,-16 8,6 Q4,3 0,6 Q-4,3 -8,6 Z" fill="#e879f9"/>' +
                '<path d="M-4,4 Q-5,-12 0,-18 Q5,-12 4,4 Q2,2 0,4 Q-2,2 -4,4 Z" fill="#f0abfc"/>' +
                '</g>' +
                faceSVG(50, 38, 0.9) +
                '</svg>';
        }
    },

    /* 4. Crystal Daisy — white-cyan */
    {
        id: 'crystal', name: 'Crystal Daisy', emoji: '\u2744\uFE0F',
        colors: { primary: '#e0f2fe', secondary: '#7dd3fc', glow: '#38bdf8' },
        animClass: 'anim-spin-slow',
        audio: { notes: [392.00, 493.88, 587.33], voice: 'crystal' },
        renderSVG: function(wl) {
            var g = wl >= 2 ? 'filter="url(#glow-cyan)"' : '';
            var petals = '';
            for (var i = 0; i < 8; i++) {
                var a = (i * 45) * Math.PI / 180;
                var px = Math.cos(a) * 16, py = Math.sin(a) * 16 - 16;
                petals += '<ellipse cx="' + px + '" cy="' + py + '" rx="6" ry="12" ' +
                    'fill="#e0f2fe" opacity="0.9" transform="rotate(' + (i * 45) + ' ' + px + ' ' + py + ')"/>';
            }
            return '<svg viewBox="0 0 100 120" width="80" height="96">' + GLOW_DEFS +
                stemSVG(50, 115, 50, '#0c4a6e') +
                '<g ' + g + ' transform="translate(50,42)">' +
                petals +
                '<circle cx="0" cy="-16" r="8" fill="#fcd34d"/>' +
                '<circle cx="0" cy="-16" r="4" fill="#fbbf24"/>' +
                '</g>' +
                faceSVG(50, 40, 0.9) +
                '</svg>';
        }
    },

    /* 5. Neon Rose — magenta-pink */
    {
        id: 'neonrose', name: 'Neon Rose', emoji: '\uD83C\uDF39',
        colors: { primary: '#f0abfc', secondary: '#e879f9', glow: '#d946ef' },
        animClass: 'anim-float',
        audio: { notes: [293.66, 369.99, 440.00], voice: 'smooth' },
        renderSVG: function(wl) {
            var g = wl >= 2 ? 'filter="url(#glow-soft)"' : '';
            return '<svg viewBox="0 0 100 120" width="80" height="96">' + GLOW_DEFS +
                stemSVG(50, 115, 54, '#831843') +
                '<g ' + g + ' transform="translate(50,42)">' +
                '<circle cx="0" cy="-16" r="18" fill="#9d174d"/>' +
                '<path d="M-14,-16 Q-14,-30 0,-30 Q14,-30 14,-16 Q14,-4 0,-4 Q-14,-4 -14,-16 Z" fill="#e879f9"/>' +
                '<path d="M-10,-16 Q-10,-26 0,-26 Q10,-26 10,-16 Q10,-8 0,-8 Q-10,-8 -10,-16 Z" fill="#f0abfc"/>' +
                '<circle cx="0" cy="-16" r="4" fill="#fbcfe8"/>' +
                '</g>' +
                faceSVG(50, 40, 0.9) +
                '</svg>';
        }
    },

    /* 6. Solar Sunflower — gold */
    {
        id: 'solar', name: 'Solar Sun', emoji: '\uD83C\uDF3B',
        colors: { primary: '#fde68a', secondary: '#fcd34d', glow: '#f59e0b' },
        animClass: 'anim-bob',
        audio: { notes: [329.63, 415.30, 523.25], voice: 'bright' },
        renderSVG: function(wl) {
            var g = wl >= 2 ? 'filter="url(#glow-soft)"' : '';
            var rays = '';
            for (var i = 0; i < 12; i++) {
                var a = (i * 30) * Math.PI / 180;
                var x1 = Math.cos(a) * 16, y1 = Math.sin(a) * 16 - 18;
                var x2 = Math.cos(a) * 26, y2 = Math.sin(a) * 26 - 18;
                rays += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" ' +
                    'stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>';
            }
            return '<svg viewBox="0 0 100 120" width="80" height="96">' + GLOW_DEFS +
                stemSVG(50, 115, 52, '#365314') +
                '<g ' + g + ' transform="translate(50,44)">' +
                rays +
                '<circle cx="0" cy="-18" r="14" fill="#fcd34d"/>' +
                '<circle cx="0" cy="-18" r="9" fill="#92400e"/>' +
                '<circle cx="-3" cy="-20" r="1.5" fill="#fef3c7"/>' +
                '<circle cx="3" cy="-20" r="1.5" fill="#fef3c7"/>' +
                '<circle cx="0" cy="-15" r="1.5" fill="#fef3c7"/>' +
                '</g>' +
                faceSVG(50, 42, 0.85) +
                '</svg>';
        }
    },

    /* 7. Frost Fern — ice blue */
    {
        id: 'frost', name: 'Frost Fern', emoji: '\u2744\uFE0F',
        colors: { primary: '#bae6fd', secondary: '#7dd3fc', glow: '#38bdf8' },
        animClass: 'anim-wave',
        audio: { notes: [440.00, 523.25, 659.25], voice: 'airy' },
        renderSVG: function(wl) {
            var g = wl >= 2 ? 'filter="url(#glow-cyan)"' : '';
            var fronds = '';
            for (var i = -2; i <= 2; i++) {
                fronds += '<path d="M50,110 Q' + (50 + i * 12) + ',' + (70 - Math.abs(i) * 6) +
                    ' ' + (50 + i * 18) + ',' + (40 - Math.abs(i) * 4) + '" ' +
                    'fill="none" stroke="#7dd3fc" stroke-width="3" stroke-linecap="round"/>';
                for (var j = 1; j <= 4; j++) {
                    var t = j / 5;
                    var bx = 50 + i * 12 * t * (1 - t) * 4;
                    var by = 110 - (110 - (40 - Math.abs(i) * 4)) * t;
                    fronds += '<ellipse cx="' + (bx + i * 6) + '" cy="' + by + '" rx="5" ry="2.5" ' +
                        'fill="#bae6fd" transform="rotate(' + (i * 20) + ' ' + bx + ' ' + by + ')"/>';
                }
            }
            return '<svg viewBox="0 0 100 120" width="80" height="96">' + GLOW_DEFS +
                '<g ' + g + '>' + fronds + '</g>' +
                faceSVG(50, 72, 0.8) +
                '</svg>';
        }
    },

    /* 8. Violet Bell — purple */
    {
        id: 'violet', name: 'Violet Bell', emoji: '\uD83D\uDD14',
        colors: { primary: '#c4b5fd', secondary: '#a78bfa', glow: '#8b5cf6' },
        animClass: 'anim-swing',
        audio: { notes: [261.63, 311.13, 392.00], voice: 'mellow' },
        renderSVG: function(wl) {
            var g = wl >= 2 ? 'filter="url(#glow-soft)"' : '';
            return '<svg viewBox="0 0 100 120" width="80" height="96">' + GLOW_DEFS +
                stemSVG(50, 115, 48, '#4c1d95') +
                '<g ' + g + ' transform="translate(50,48)">' +
                '<path d="M-16,-24 Q-18,-2 -8,6 Q0,10 8,6 Q18,-2 16,-24 Q0,-30 -16,-24 Z" fill="#a78bfa"/>' +
                '<path d="M-12,-22 Q-14,-4 -6,4 Q0,7 6,4 Q14,-4 12,-22 Q0,-27 -12,-22 Z" fill="#c4b5fd"/>' +
                '<circle cx="0" cy="-2" r="3" fill="#ede9fe"/>' +
                '</g>' +
                faceSVG(50, 46, 0.85) +
                '</svg>';
        }
    },

    /* 9. Glow Moss — green */
    {
        id: 'moss', name: 'Glow Moss', emoji: '\uD83C\uDF3F',
        colors: { primary: '#86efac', secondary: '#4ade80', glow: '#22c55e' },
        animClass: 'anim-bob',
        audio: { notes: [196.00, 246.94, 329.63], voice: 'deep' },
        renderSVG: function(wl) {
            var g = wl >= 2 ? 'filter="url(#glow-soft)"' : '';
            return '<svg viewBox="0 0 100 120" width="80" height="96">' + GLOW_DEFS +
                '<g ' + g + ' transform="translate(50,60)">' +
                '<ellipse cx="-18" cy="10" rx="14" ry="10" fill="#166534"/>' +
                '<ellipse cx="18" cy="12" rx="12" ry="9" fill="#166534"/>' +
                '<ellipse cx="0" cy="14" rx="16" ry="11" fill="#15803d"/>' +
                '<ellipse cx="-12" cy="6" rx="9" ry="12" fill="#4ade80"/>' +
                '<ellipse cx="10" cy="4" rx="10" ry="14" fill="#86efac"/>' +
                '<ellipse cx="-2" cy="-2" rx="8" ry="10" fill="#bbf7d0"/>' +
                '</g>' +
                faceSVG(50, 58, 0.8) +
                '</svg>';
        }
    },

    /* 10. Star Orchid — deep blue with stars */
    {
        id: 'star', name: 'Star Orchid', emoji: '\u2B50',
        colors: { primary: '#93c5fd', secondary: '#60a5fa', glow: '#3b82f6' },
        animClass: 'anim-spin-slow',
        audio: { notes: [349.23, 466.16, 587.33], voice: 'crystal' },
        renderSVG: function(wl) {
            var g = wl >= 2 ? 'filter="url(#glow-cyan)"' : '';
            var star = '<path d="M0,-12 L3,-4 L12,-4 L5,2 L7,10 L0,6 L-7,10 L-5,2 L-12,-4 L-3,-4 Z" fill="#fcd34d"/>';
            return '<svg viewBox="0 0 100 120" width="80" height="96">' + GLOW_DEFS +
                stemSVG(50, 115, 50, '#1e3a8a') +
                '<g ' + g + ' transform="translate(50,44)">' +
                '<ellipse cx="0" cy="-16" rx="20" ry="16" fill="#1e40af" opacity="0.8"/>' +
                '<ellipse cx="0" cy="-16" rx="14" ry="11" fill="#3b82f6"/>' +
                '<g transform="scale(0.7) translate(0,-22)">' + star + '</g>' +
                '<g transform="translate(-10,-20) scale(0.4)">' + star + '</g>' +
                '<g transform="translate(10,-22) scale(0.45)">' + star + '</g>' +
                '</g>' +
                faceSVG(50, 42, 0.85) +
                '</svg>';
        }
    },

    /* 11. Plasma Peony — pink-purple */
    {
        id: 'plasma', name: 'Plasma Peony', emoji: '\uD83E\uDE78',
        colors: { primary: '#f9a8d4', secondary: '#f472b6', glow: '#ec4899' },
        animClass: 'anim-float',
        audio: { notes: [311.13, 392.00, 466.16], voice: 'smooth' },
        renderSVG: function(wl) {
            var g = wl >= 2 ? 'filter="url(#glow-soft)"' : '';
            var layers = '';
            var cols = ['#9d174d', '#db2777', '#f472b6', '#f9a8d4'];
            for (var l = 0; l < 4; l++) {
                var r = 20 - l * 4;
                var petals = '';
                for (var p = 0; p < (6 - l); p++) {
                    var a = (p * (360 / (6 - l)) + l * 15) * Math.PI / 180;
                    var px = Math.cos(a) * r * 0.6;
                    var py = Math.sin(a) * r * 0.6 - 18;
                    petals += '<ellipse cx="' + px + '" cy="' + py + '" rx="' + (r * 0.45) + '" ry="' + r + '" ' +
                        'fill="' + cols[l] + '" opacity="' + (0.7 + l * 0.08) + '" ' +
                        'transform="rotate(' + (p * (360 / (6 - l)) + l * 15) + ' ' + px + ' ' + py + ')"/>';
                }
                layers += petals;
            }
            return '<svg viewBox="0 0 100 120" width="80" height="96">' + GLOW_DEFS +
                stemSVG(50, 115, 52, '#831843') +
                '<g ' + g + ' transform="translate(50,42)">' + layers +
                '<circle cx="0" cy="-18" r="5" fill="#fbcfe8"/>' +
                '</g>' +
                faceSVG(50, 40, 0.9) +
                '</svg>';
        }
    },

    /* 12. Comet Vine — trailing cyan */
    {
        id: 'comet', name: 'Comet Vine', emoji: '\u2604\uFE0F',
        colors: { primary: '#67e8f9', secondary: '#22d3ee', glow: '#06b6d4' },
        animClass: 'anim-wave',
        audio: { notes: [369.99, 440.00, 554.37], voice: 'airy' },
        renderSVG: function(wl) {
            var g = wl >= 2 ? 'filter="url(#glow-cyan)"' : '';
            return '<svg viewBox="0 0 100 120" width="80" height="96">' + GLOW_DEFS +
                '<g ' + g + ' transform="translate(50,58)">' +
                /* trailing vine */
                '<path d="M-22,30 Q-10,10 0,-10 Q10,10 22,30" fill="none" stroke="#0891b2" stroke-width="3" stroke-linecap="round"/>' +
                '<path d="M-22,30 Q-18,20 -12,18" fill="none" stroke="#22d3ee" stroke-width="2" stroke-linecap="round"/>' +
                '<path d="M22,30 Q18,20 12,18" fill="none" stroke="#22d3ee" stroke-width="2" stroke-linecap="round"/>' +
                /* comet head */
                '<circle cx="0" cy="-10" r="12" fill="#0e7490"/>' +
                '<circle cx="0" cy="-10" r="9" fill="#22d3ee"/>' +
                '<circle cx="0" cy="-10" r="5" fill="#a5f3fc"/>' +
                /* tail sparkles */
                '<circle cx="-10" cy="20" r="2" fill="#a5f3fc"/>' +
                '<circle cx="-16" cy="26" r="1.5" fill="#67e8f9"/>' +
                '<circle cx="10" cy="20" r="2" fill="#a5f3fc"/>' +
                '<circle cx="16" cy="26" r="1.5" fill="#67e8f9"/>' +
                '</g>' +
                faceSVG(50, 50, 0.8) +
                '</svg>';
        }
    }

];

function getPlantById(id) {
    for (var i = 0; i < PLANT_TYPES.length; i++) {
        if (PLANT_TYPES[i].id === id) return PLANT_TYPES[i];
    }
    return null;
}

/* Inject shared defs once into the DOM for SVG filters that need it.
   Since each SVG is inline with its own <defs>, this is a no-op safety. */
if (typeof window !== 'undefined') {
    window.PLANT_TYPES = PLANT_TYPES;
    window.getPlantById = getPlantById;
}
