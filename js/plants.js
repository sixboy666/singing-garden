/* ============================================
   SINGING GARDEN - Plant Definitions
   6 unique plant types with SVG art + audio config
   ============================================ */

/* ---- SVG rendering helpers ---- */

function _makePetals(count, cx, cy, petalRx, petalRy, radius, color, opacity) {
    let petals = '';
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * 360;
        const rad = (angle - 90) * Math.PI / 180;
        const x = cx + Math.cos(rad) * radius;
        const y = cy + Math.sin(rad) * radius;
        petals += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) +
            '" rx="' + petalRx + '" ry="' + petalRy + '" fill="' + color +
            '" transform="rotate(' + angle.toFixed(1) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) +
            ')" opacity="' + (opacity || 0.9) + '"/>';
    }
    return petals;
}

function _face(cx, cy, eyeR, smileW, smileH) {
    return '<circle cx="' + (cx - smileW / 2) + '" cy="' + cy + '" r="' + eyeR + '" fill="#1a1a1a"/>' +
        '<circle cx="' + (cx + smileW / 2) + '" cy="' + cy + '" r="' + eyeR + '" fill="#1a1a1a"/>' +
        '<path d="M' + (cx - smileW / 2) + ' ' + (cy + smileH) +
        ' Q' + cx + ' ' + (cy + smileH * 2.2) + ' ' + (cx + smileW / 2) + ' ' + (cy + smileH) +
        '" stroke="#1a1a1a" stroke-width="1.2" fill="none" stroke-linecap="round"/>';
}

/* ---- Plant SVG renderers ---- */

function renderSunflare(waterLevel) {
    var petalColor = waterLevel >= 2 ? '#FFEC8B' : '#FFD700';
    var petalColor2 = waterLevel >= 1 ? '#FFC633' : '#FFA500';
    var centerColor = '#8B5E3C';
    var stemColor = '#4a7c2e';
    var glow = waterLevel >= 1 ? '<circle cx="50" cy="48" r="28" fill="#FFD700" opacity="0.15"/>' : '';
    var sparkle = waterLevel >= 2 ?
        '<circle cx="25" cy="35" r="1.5" fill="#fff" opacity="0.8"/><circle cx="75" cy="30" r="1.5" fill="#fff" opacity="0.8"/>' : '';

    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg">' +
        glow +
        '<path d="M50 120 Q48 90 50 65" stroke="' + stemColor + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="34" cy="95" rx="11" ry="5" fill="#5a9c3e" transform="rotate(-25 34 95)"/>' +
        '<ellipse cx="66" cy="88" rx="11" ry="5" fill="#5a9c3e" transform="rotate(25 66 88)"/>' +
        _makePetals(12, 50, 48, 6, 14, 18, petalColor, 0.92) +
        _makePetals(12, 50, 48, 4, 10, 12, petalColor2, 0.7) +
        '<circle cx="50" cy="48" r="11" fill="' + centerColor + '"/>' +
        '<circle cx="50" cy="48" r="8" fill="#6B4423"/>' +
        '<circle cx="50" cy="48" r="4" fill="#5A3618" opacity="0.5"/>' +
        _face(50, 46, 1.8, 8, 3) +
        sparkle +
        '</svg>';
}

function renderToadstool(waterLevel) {
    var capColor = '#E84830';
    var capDark = '#C03820';
    var stemColor = '#F5E6C8';
    var stemDark = '#E0D0A8';
    var glow = waterLevel >= 1 ? '<ellipse cx="50" cy="50" rx="35" ry="25" fill="#FF6B6B" opacity="0.1"/>' : '';
    var extraSpot = waterLevel >= 2 ? '<circle cx="48" cy="63" r="3" fill="#fff"/>' : '';

    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg">' +
        glow +
        '<path d="M40 120 Q40 95 42 78 L58 78 Q60 95 60 120 Z" fill="' + stemColor + '" stroke="' + stemDark + '" stroke-width="1"/>' +
        '<path d="M20 72 Q18 40 50 33 Q82 40 80 72 Q80 78 50 78 Q20 78 20 72 Z" fill="' + capColor + '" stroke="' + capDark + '" stroke-width="1.5"/>' +
        '<path d="M22 70 Q20 50 35 42" fill="none" stroke="' + capDark + '" stroke-width="1" opacity="0.4"/>' +
        '<circle cx="33" cy="55" r="5" fill="#fff"/>' +
        '<circle cx="57" cy="48" r="6" fill="#fff"/>' +
        '<circle cx="67" cy="60" r="4" fill="#fff"/>' +
        '<circle cx="42" cy="65" r="3" fill="#fff"/>' +
        extraSpot +
        _face(50, 98, 2, 14, 5) +
        '<circle cx="38" cy="102" r="3" fill="#FFB6C1" opacity="0.5"/>' +
        '<circle cx="62" cy="102" r="3" fill="#FFB6C1" opacity="0.5"/>' +
        '</svg>';
}

function renderBluebelle(waterLevel) {
    var flowerColor = waterLevel >= 2 ? '#4A90D9' : '#5B9BD5';
    var flowerDark = '#3A7BC8';
    var glow = waterLevel >= 1 ? '<circle cx="50" cy="50" r="25" fill="#5B9BD5" opacity="0.12"/>' : '';

    function bellShape(tx, ty, scale, color) {
        var s = scale;
        return '<g transform="translate(' + tx + ' ' + ty + ') scale(' + s + ')">' +
            '<path d="M-8 2 Q-11 -4 -9 -10 Q-5 -16 0 -16 Q5 -16 9 -10 Q11 -4 8 2 Q5 6 0 6 Q-5 6 -8 2 Z" fill="' + color + '"/>' +
            '<path d="M-8 2 Q-11 -4 -9 -10 Q-5 -16 0 -16 Q5 -16 9 -10 Q11 -4 8 2 Q5 6 0 6 Q-5 6 -8 2 Z" fill="none" stroke="' + flowerDark + '" stroke-width="1"/>' +
            '<line x1="-5" y1="2" x2="5" y2="2" stroke="' + flowerDark + '" stroke-width="0.8" opacity="0.5"/>' +
            '</g>';
    }

    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg">' +
        glow +
        '<path d="M50 120 Q48 90 50 55" stroke="#4a7c2e" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="34" cy="92" rx="12" ry="5" fill="#5a9c3e" transform="rotate(-20 34 92)"/>' +
        '<ellipse cx="66" cy="85" rx="12" ry="5" fill="#5a9c3e" transform="rotate(20 66 85)"/>' +
        '<line x1="50" y1="55" x2="50" y2="40" stroke="#4a7c2e" stroke-width="1.5"/>' +
        '<line x1="50" y1="55" x2="36" y2="50" stroke="#4a7c2e" stroke-width="1.5"/>' +
        '<line x1="50" y1="55" x2="64" y2="50" stroke="#4a7c2e" stroke-width="1.5"/>' +
        bellShape(50, 40, 1, flowerColor) +
        bellShape(36, 50, 0.7, flowerColor) +
        bellShape(64, 50, 0.7, flowerColor) +
        (waterLevel >= 2 ? bellShape(50, 28, 0.5, flowerColor) : '') +
        '</svg>';
}

function renderPrickle(waterLevel) {
    var bodyColor = '#4a8c3e';
    var bodyDark = '#3a7c2e';
    var flowerColor = waterLevel >= 1 ? '#FF6B9D' : '#FF8FB1';
    var glow = waterLevel >= 2 ? '<circle cx="50" cy="55" r="20" fill="#4a8c3e" opacity="0.1"/>' : '';

    var spikes = '';
    var spikePositions = [
        [38, 72], [62, 72], [40, 82], [60, 82], [38, 92], [62, 92], [42, 100], [58, 100],
        [30, 78], [70, 78], [28, 85], [72, 85]
    ];
    for (var i = 0; i < spikePositions.length; i++) {
        var sx = spikePositions[i][0], sy = spikePositions[i][1];
        var dir = sx < 50 ? -1 : 1;
        spikes += '<line x1="' + sx + '" y1="' + sy + '" x2="' + (sx + dir * 4) + '" y2="' + sy +
            '" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>';
    }

    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg">' +
        glow +
        '<path d="M35 112 L37 120 L63 120 L65 112 Z" fill="#8B6914" stroke="#6B4914" stroke-width="1"/>' +
        '<path d="M40 112 Q37 85 42 62 Q45 55 50 55 Q55 55 58 62 Q63 85 60 112 Z" fill="' + bodyColor + '" stroke="' + bodyDark + '" stroke-width="1"/>' +
        '<path d="M40 88 Q30 82 27 72 Q26 66 30 63 Q36 61 39 69 Q41 78 43 84 Z" fill="' + bodyColor + '" stroke="' + bodyDark + '" stroke-width="1"/>' +
        '<path d="M60 92 Q70 87 73 77 Q74 71 70 68 Q64 66 61 74 Q59 82 57 88 Z" fill="' + bodyColor + '" stroke="' + bodyDark + '" stroke-width="1"/>' +
        spikes +
        '<circle cx="50" cy="53" r="6" fill="' + flowerColor + '"/>' +
        '<circle cx="50" cy="53" r="3" fill="#FFD700"/>' +
        (waterLevel >= 2 ? '<circle cx="44" cy="50" r="2" fill="' + flowerColor + '"/><circle cx="56" cy="50" r="2" fill="' + flowerColor + '"/>' : '') +
        _face(50, 85, 1.8, 10, 3) +
        '</svg>';
}

function renderFernella(waterLevel) {
    var frondColor = waterLevel >= 2 ? '#3a9c6e' : '#2e8b57';
    var frondDark = '#1e6b3e';
    var glow = waterLevel >= 1 ? '<circle cx="50" cy="70" r="25" fill="#2e8b57" opacity="0.08"/>' : '';

    var fronds = '';
    var frondCount = 5;
    for (var i = 0; i < frondCount; i++) {
        var angle = -50 + i * 25;
        var rad = (angle - 90) * Math.PI / 180;
        var length = 45 - Math.abs(i - 2) * 4;
        var endX = 50 + Math.cos(rad) * length;
        var endY = 110 + Math.sin(rad) * length;
        var midX = 50 + Math.cos(rad) * length * 0.5 + 3;
        var midY = 110 + Math.sin(rad) * length * 0.5;

        fronds += '<path d="M50 110 Q' + midX.toFixed(1) + ' ' + midY.toFixed(1) + ' ' + endX.toFixed(1) + ' ' + endY.toFixed(1) +
            '" stroke="' + frondColor + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>';

        var leafletCount = waterLevel >= 2 ? 6 : 4;
        for (var j = 0; j < leafletCount; j++) {
            var t = (j + 1) / (leafletCount + 1);
            var lx = 50 + (endX - 50) * t;
            var ly = 110 + (endY - 110) * t;
            var perpRad = rad + Math.PI / 2;
            var leafSize = 5 * (1 - t * 0.4);
            var ox = Math.cos(perpRad) * 3.5;
            var oy = Math.sin(perpRad) * 3.5;
            fronds += '<ellipse cx="' + (lx + ox).toFixed(1) + '" cy="' + (ly + oy).toFixed(1) +
                '" rx="' + leafSize.toFixed(1) + '" ry="2.5" fill="' + frondColor + '" opacity="0.85" transform="rotate(' + (angle + 90) + ' ' + (lx + ox).toFixed(1) + ' ' + (ly + oy).toFixed(1) + ')"/>';
            fronds += '<ellipse cx="' + (lx - ox).toFixed(1) + '" cy="' + (ly - oy).toFixed(1) +
                '" rx="' + leafSize.toFixed(1) + '" ry="2.5" fill="' + frondColor + '" opacity="0.85" transform="rotate(' + (angle - 90) + ' ' + (lx - ox).toFixed(1) + ' ' + (ly - oy).toFixed(1) + ')"/>';
        }
    }

    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg">' +
        glow + fronds + '</svg>';
}

function renderLumipetal(waterLevel) {
    var petalColor = '#9B59B6';
    var petalColor2 = '#B47AC9';
    var centerColor = '#FFD700';
    var glowR = 20 + waterLevel * 5;
    var sparkle = waterLevel >= 1 ?
        '<circle cx="28" cy="38" r="1.5" fill="#fff" opacity="0.8"/><circle cx="72" cy="35" r="1.5" fill="#fff" opacity="0.8"/><circle cx="75" cy="55" r="1" fill="#fff" opacity="0.6"/><circle cx="25" cy="58" r="1" fill="#fff" opacity="0.6"/>' : '';

    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><radialGradient id="lumipetalGlow' + waterLevel + '">' +
        '<stop offset="0%" stop-color="#FFD700" stop-opacity="0.6"/>' +
        '<stop offset="50%" stop-color="#E8DAFF" stop-opacity="0.3"/>' +
        '<stop offset="100%" stop-color="#E8DAFF" stop-opacity="0"/>' +
        '</radialGradient></defs>' +
        '<path d="M50 120 Q48 90 50 65" stroke="#2e5c2e" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="38" cy="95" rx="8" ry="4" fill="#3e6c3e" transform="rotate(-20 38 95)"/>' +
        '<ellipse cx="62" cy="88" rx="8" ry="4" fill="#3e6c3e" transform="rotate(20 62 88)"/>' +
        '<circle cx="50" cy="48" r="' + glowR + '" fill="url(#lumipetalGlow' + waterLevel + ')"/>' +
        _makePetals(8, 50, 48, 5, 11, 12, petalColor, 0.85) +
        _makePetals(8, 50, 48, 3, 7, 8, petalColor2, 0.6) +
        '<circle cx="50" cy="48" r="7" fill="' + centerColor + '"/>' +
        '<circle cx="50" cy="48" r="4" fill="#FFA500"/>' +
        '<circle cx="50" cy="47" r="1.5" fill="#fff" opacity="0.8"/>' +
        sparkle +
        '</svg>';
}

/* ---- Plant Type Definitions ---- */

var PLANT_TYPES = [
    {
        id: 'sunflare',
        name: 'Sunflare',
        emoji: '\uD83C\uDF3B',
        description: 'Bright and cheerful',
        colors: { primary: '#FFD700', secondary: '#FFA500', accent: '#8B5E3C' },
        audio: {
            notes: [523.25, 659.25, 783.99],
            waveform: 'sine',
            envelope: { attack: 0.02, decay: 0.1, sustain: 0.6, release: 0.3 },
            noteDuration: 0.4,
            filterFreq: 4000,
            filterQ: 1,
            reverb: 0.2,
            delay: 0,
            volume: 0.22,
        },
        waterEffects: [
            { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0 },
            { pitchMultiplier: 1.0595, vibrato: 2, reverbBoost: 0.1, harmonicBoost: 0.3 },
            { pitchMultiplier: 1.1225, vibrato: 4, reverbBoost: 0.15, harmonicBoost: 0.5 },
            { pitchMultiplier: 1.1895, vibrato: 6, reverbBoost: 0.2, harmonicBoost: 0.7 },
        ],
        renderSVG: renderSunflare,
    },
    {
        id: 'toadstool',
        name: 'Toadstool',
        emoji: '\uD83C\uDF84',
        description: 'Deep and groovy',
        colors: { primary: '#E84830', secondary: '#F5E6C8', accent: '#C03820' },
        audio: {
            notes: [220.00, 261.63, 329.63],
            waveform: 'triangle',
            envelope: { attack: 0.05, decay: 0.15, sustain: 0.5, release: 0.4 },
            noteDuration: 0.5,
            filterFreq: 2000,
            filterQ: 2,
            reverb: 0.15,
            delay: 0,
            volume: 0.28,
        },
        waterEffects: [
            { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0 },
            { pitchMultiplier: 0.9438, vibrato: 2, reverbBoost: 0.1, harmonicBoost: 0.3 },
            { pitchMultiplier: 0.8909, vibrato: 4, reverbBoost: 0.15, harmonicBoost: 0.5 },
            { pitchMultiplier: 0.8409, vibrato: 6, reverbBoost: 0.2, harmonicBoost: 0.7 },
        ],
        renderSVG: renderToadstool,
    },
    {
        id: 'bluebelle',
        name: 'Bluebelle',
        emoji: '\uD83D\uDD14',
        description: 'Crystal clear tones',
        colors: { primary: '#5B9BD5', secondary: '#4A90D9', accent: '#3A7BC8' },
        audio: {
            notes: [587.33, 698.46, 880.00],
            waveform: 'sine',
            envelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.8 },
            noteDuration: 0.6,
            filterFreq: 5000,
            filterQ: 0.5,
            reverb: 0.35,
            delay: 0.1,
            volume: 0.18,
        },
        waterEffects: [
            { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0 },
            { pitchMultiplier: 1.0595, vibrato: 1, reverbBoost: 0.15, harmonicBoost: 0.2 },
            { pitchMultiplier: 1.1225, vibrato: 3, reverbBoost: 0.2, harmonicBoost: 0.4 },
            { pitchMultiplier: 1.1895, vibrato: 5, reverbBoost: 0.25, harmonicBoost: 0.6 },
        ],
        renderSVG: renderBluebelle,
    },
    {
        id: 'prickle',
        name: 'Prickle',
        emoji: '\uD83C\uDF35',
        description: 'Sharp and percussive',
        colors: { primary: '#4a8c3e', secondary: '#FF6B9D', accent: '#3a7c2e' },
        audio: {
            notes: [392.00, 493.88, 587.33],
            waveform: 'square',
            envelope: { attack: 0.005, decay: 0.05, sustain: 0.3, release: 0.1 },
            noteDuration: 0.15,
            filterFreq: 3000,
            filterQ: 3,
            reverb: 0.1,
            delay: 0,
            volume: 0.12,
        },
        waterEffects: [
            { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0 },
            { pitchMultiplier: 1.0595, vibrato: 0, reverbBoost: 0.05, harmonicBoost: 0.2 },
            { pitchMultiplier: 1.1225, vibrato: 1, reverbBoost: 0.1, harmonicBoost: 0.4 },
            { pitchMultiplier: 1.1895, vibrato: 2, reverbBoost: 0.15, harmonicBoost: 0.6 },
        ],
        renderSVG: renderPrickle,
    },
    {
        id: 'fernella',
        name: 'Fernella',
        emoji: '\uD83C\uDF3F',
        description: 'Airy and melodic',
        colors: { primary: '#2e8b57', secondary: '#3a9c6e', accent: '#1e6b3e' },
        audio: {
            notes: [329.63, 392.00, 493.88],
            waveform: 'sawtooth',
            envelope: { attack: 0.05, decay: 0.1, sustain: 0.7, release: 0.5 },
            noteDuration: 0.45,
            filterFreq: 2500,
            filterQ: 1.5,
            reverb: 0.2,
            delay: 0.05,
            volume: 0.16,
        },
        waterEffects: [
            { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0 },
            { pitchMultiplier: 1.0595, vibrato: 3, reverbBoost: 0.1, harmonicBoost: 0.3 },
            { pitchMultiplier: 1.1225, vibrato: 5, reverbBoost: 0.15, harmonicBoost: 0.5 },
            { pitchMultiplier: 1.1895, vibrato: 7, reverbBoost: 0.2, harmonicBoost: 0.7 },
        ],
        renderSVG: renderFernella,
    },
    {
        id: 'lumipetal',
        name: 'Lumipetal',
        emoji: '\u2728',
        description: 'Ethereal and dreamy',
        colors: { primary: '#9B59B6', secondary: '#E8DAFF', accent: '#FFD700' },
        audio: {
            notes: [1046.50, 1318.51, 1567.98],
            waveform: 'sine',
            envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 1.0 },
            noteDuration: 0.8,
            filterFreq: 6000,
            filterQ: 0.5,
            reverb: 0.45,
            delay: 0.15,
            volume: 0.13,
        },
        waterEffects: [
            { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0 },
            { pitchMultiplier: 1.0595, vibrato: 2, reverbBoost: 0.1, harmonicBoost: 0.2 },
            { pitchMultiplier: 1.1225, vibrato: 4, reverbBoost: 0.15, harmonicBoost: 0.4 },
            { pitchMultiplier: 1.1895, vibrato: 6, reverbBoost: 0.2, harmonicBoost: 0.6 },
        ],
        renderSVG: renderLumipetal,
    },
];

/* Merge waterEffects into audio config for each plant (playNote expects it there) */
for (var _i = 0; _i < PLANT_TYPES.length; _i++) {
    PLANT_TYPES[_i].audio.waterEffects = PLANT_TYPES[_i].waterEffects;
}

/* Helper: find plant type by id */
function getPlantById(id) {
    for (var i = 0; i < PLANT_TYPES.length; i++) {
        if (PLANT_TYPES[i].id === id) return PLANT_TYPES[i];
    }
    return null;
}
