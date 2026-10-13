/* ============================================
   SINGING GARDEN v6 - Premium Plant Definitions
   16 unique plants with layered gradients,
   elegant warm-ink outlines, refined faces,
   soft inner glow, harmonious jewel palette
   ============================================ */

/* Warm dark ink — more elegant than pure black */
var INK = '#1a1208';
var INK_SOFT = '#3a2a18';

/* ---- SVG helpers ---- */

function _gradient(id, stops, x1, y1, x2, y2) {
    var s = '<linearGradient id="' + id + '" x1="' + (x1 || 0) + '%" y1="' + (y1 || 0) +
        '%" x2="' + (x2 || 100) + '%" y2="' + (y2 || 100) + '%">';
    for (var i = 0; i < stops.length; i++) {
        s += '<stop offset="' + stops[i][0] + '%" stop-color="' + stops[i][1] + '"' +
            (stops[i][2] !== undefined ? ' stop-opacity="' + stops[i][2] + '"' : '') + '/>';
    }
    return s + '</linearGradient>';
}

function _radial(id, cx, cy, r, stops) {
    var s = '<radialGradient id="' + id + '" cx="' + cx + '%" cy="' + cy + '%" r="' + r + '%">';
    for (var i = 0; i < stops.length; i++) {
        s += '<stop offset="' + stops[i][0] + '%" stop-color="' + stops[i][1] + '"' +
            (stops[i][2] !== undefined ? ' stop-opacity="' + stops[i][2] + '"' : '') + '/>';
    }
    return s + '</radialGradient>';
}

function _filterGlow(id, blur, intensity) {
    return '<filter id="' + id + '" x="-50%" y="-50%" width="200%" height="200%">' +
        '<feGaussianBlur stdDeviation="' + blur + '" result="b"/>' +
        '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>' +
        '</filter>';
}

/* Soft inner highlight overlay — adds depth to petals */
function _highlight(cx, cy, rx, ry, opacity) {
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry +
        '" fill="#f5ebd7" opacity="' + (opacity || 0.35) + '"/>';
}

function _petals(count, cx, cy, rx, ry, radius, fill, opacity, rotation) {
    var out = '';
    for (var i = 0; i < count; i++) {
        var a = (i / count) * 360 + (rotation || 0);
        var rad = (a - 90) * Math.PI / 180;
        var x = cx + Math.cos(rad) * radius;
        var y = cy + Math.sin(rad) * radius;
        out += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) +
            '" rx="' + rx + '" ry="' + ry + '" fill="' + fill +
            '" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"' +
            '" transform="rotate(' + a.toFixed(1) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) +
            ')" opacity="' + (opacity || 0.95) + '"/>';
    }
    return out;
}

/* Refined botanical-illustration face: small half-lidded eyes with
   single catchlight, soft gentle smile (no teeth), subtle blush.
   More elegant than wide-teeth grin. */
function _face(cx, cy, eyeR, smileW, smileH, eyeColor) {
    var ec = eyeColor || INK;
    var ex = smileW / 2;
    var pupR = (eyeR * 0.55).toFixed(1);
    var catchR = (eyeR * 0.22).toFixed(1);
    var mouthY = cy + smileH * 1.4;
    var mouthW = smileW * 0.55;

    /* Soft blush cheeks — muted dusty rose */
    var cheeks = '<ellipse cx="' + (cx - ex - eyeR * 0.6).toFixed(1) + '" cy="' + (cy + eyeR * 1.2).toFixed(1) +
        '" rx="' + (eyeR * 0.85).toFixed(1) + '" ry="' + (eyeR * 0.55).toFixed(1) +
        '" fill="#c97a8c" opacity="0.35"/>' +
        '<ellipse cx="' + (cx + ex + eyeR * 0.6).toFixed(1) + '" cy="' + (cy + eyeR * 1.2).toFixed(1) +
        '" rx="' + (eyeR * 0.85).toFixed(1) + '" ry="' + (eyeR * 0.55).toFixed(1) +
        '" fill="#c97a8c" opacity="0.35"/>';

    /* Soft gentle brows — slight arch, not angled manic */
    var brow = '<path d="M' + (cx - ex - eyeR * 0.8) + ' ' + (cy - eyeR - 0.8) +
        ' Q' + (cx - ex) + ' ' + (cy - eyeR - 1.8) + ' ' + (cx - ex + eyeR * 0.8) + ' ' + (cy - eyeR - 0.8) +
        '" stroke="' + ec + '" stroke-width="1.4" stroke-linecap="round" fill="none"/>' +
        '<path d="M' + (cx + ex - eyeR * 0.8) + ' ' + (cy - eyeR - 0.8) +
        ' Q' + (cx + ex) + ' ' + (cy - eyeR - 1.8) + ' ' + (cx + ex + eyeR * 0.8) + ' ' + (cy - eyeR - 0.8) +
        '" stroke="' + ec + '" stroke-width="1.4" stroke-linecap="round" fill="none"/>';

    /* Half-lidded serene eyes — cream sclera + dark iris + catchlight + upper lid line */
    var eyes = '<path d="M' + (cx - ex - eyeR) + ' ' + cy +
        ' Q' + (cx - ex) + ' ' + (cy - eyeR * 0.8) + ' ' + (cx - ex + eyeR) + ' ' + cy +
        ' Q' + (cx - ex) + ' ' + (cy + eyeR * 0.6) + ' ' + (cx - ex - eyeR) + ' ' + cy + ' Z" ' +
        'fill="#f5ebd7" stroke="' + ec + '" stroke-width="1.4" stroke-linejoin="round"/>' +
        '<path d="M' + (cx + ex - eyeR) + ' ' + cy +
        ' Q' + (cx + ex) + ' ' + (cy - eyeR * 0.8) + ' ' + (cx + ex + eyeR) + ' ' + cy +
        ' Q' + (cx + ex) + ' ' + (cy + eyeR * 0.6) + ' ' + (cx + ex - eyeR) + ' ' + cy + ' Z" ' +
        'fill="#f5ebd7" stroke="' + ec + '" stroke-width="1.4" stroke-linejoin="round"/>' +
        /* Iris (smaller, softer) */
        '<circle cx="' + (cx - ex) + '" cy="' + (cy + 0.3) + '" r="' + pupR + '" fill="' + ec + '"/>' +
        '<circle cx="' + (cx + ex) + '" cy="' + (cy + 0.3) + '" r="' + pupR + '" fill="' + ec + '"/>' +
        /* Single catchlight */
        '<circle cx="' + (cx - ex - 0.3) + '" cy="' + (cy - 0.2) + '" r="' + catchR + '" fill="#f5ebd7"/>' +
        '<circle cx="' + (cx + ex - 0.3) + '" cy="' + (cy - 0.2) + '" r="' + catchR + '" fill="#f5ebd7"/>' +
        /* Upper lid line — gives half-lidded dreamy look */
        '<path d="M' + (cx - ex - eyeR) + ' ' + cy +
        ' Q' + (cx - ex) + ' ' + (cy - eyeR * 0.8) + ' ' + (cx - ex + eyeR) + ' ' + cy +
        '" stroke="' + ec + '" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +
        '<path d="M' + (cx + ex - eyeR) + ' ' + cy +
        ' Q' + (cx + ex) + ' ' + (cy - eyeR * 0.8) + ' ' + (cx + ex + eyeR) + ' ' + cy +
        '" stroke="' + ec + '" stroke-width="1.2" fill="none" stroke-linecap="round"/>';

    /* Soft closed-lip smile — gentle curve, no teeth, slight lip shape */
    var mouth = '<g class="plant-mouth">' +
        /* Upper lip + lower lip as soft curves with warm rose color */
        '<path d="M' + (cx - mouthW) + ' ' + mouthY +
        ' Q' + cx + ' ' + (mouthY + smileH * 0.9) + ' ' + (cx + mouthW) + ' ' + mouthY +
        ' Q' + cx + ' ' + (mouthY + smileH * 0.4) + ' ' + (cx - mouthW) + ' ' + mouthY + ' Z" ' +
        'fill="#8a4a5a" stroke="' + ec + '" stroke-width="1.4" stroke-linejoin="round"/>' +
        /* Subtle tongue (hidden by default, shown when singing) */
        '<ellipse class="plant-tongue" cx="' + cx + '" cy="' + (mouthY + smileH * 0.6).toFixed(1) +
        '" rx="' + (mouthW * 0.32).toFixed(1) + '" ry="' + (smileH * 0.32).toFixed(1) +
        '" fill="#c97a8c" stroke="' + ec + '" stroke-width="0.6" opacity="0.85"/>';
    mouth += '</g>';

    return cheeks + brow + eyes + mouth;
}

function _sparkles(positions) {
    var s = '';
    for (var i = 0; i < positions.length; i++) {
        var r = positions[i][2] || 1.5;
        /* Refined 4-point sparkle — soft champagne color */
        s += '<path d="M' + positions[i][0] + ' ' + (positions[i][1] - r) +
            ' L' + (positions[i][0] + r * 0.3) + ' ' + (positions[i][1] - r * 0.3) +
            ' L' + (positions[i][0] + r) + ' ' + positions[i][1] +
            ' L' + (positions[i][0] + r * 0.3) + ' ' + (positions[i][1] + r * 0.3) +
            ' L' + positions[i][0] + ' ' + (positions[i][1] + r) +
            ' L' + (positions[i][0] - r * 0.3) + ' ' + (positions[i][1] + r * 0.3) +
            ' L' + (positions[i][0] - r) + ' ' + positions[i][1] +
            ' L' + (positions[i][0] - r * 0.3) + ' ' + (positions[i][1] - r * 0.3) +
            ' Z" fill="#f5ebd7" stroke="' + INK + '" stroke-width="0.4" opacity="' + (positions[i][3] || 0.85) + '"/>';
    }
    return s;
}

/* Elegant warm-ink outline helper */
function _stroke(w) { return ' stroke="' + INK + '" stroke-width="' + (w || 1.8) + '" stroke-linejoin="round" stroke-linecap="round"'; }

/* ---- Plant SVG renderers (16 unique plants) ----
   Palette: muted jewel tones (champagne gold, dusty rose, sage,
   amethyst, dusty teal, copper) with layered 3-stop gradients. */

/* 1. Sunflare - Sunflower with rotating petals and champagne glow */
function renderSunflare(wl) {
    var defs = _gradient('sun-petal', [[0,'#f5e7a8'],[50,'#e8c976'],[100,'#b87333']]) +
        _gradient('sun-petal-2', [[0,'#f5ebd7'],[100,'#d4af37']]) +
        _radial('sun-center', 50, 48, 60, [[0,'#5a3a1a'],[60,'#3a1f0a'],[100,'#1a0a04']]) +
        _radial('sun-glow', 50, 48, 50, [[0,'#e8c976',0.32],[100,'#e8c976',0]]) +
        _filterGlow('sun-glow-fx', 3, 1);
    var glowRing = wl >= 1 ? '<circle cx="50" cy="48" r="32" fill="url(#sun-glow)" filter="url(#sun-glow-fx)"/>' : '';
    var spark = wl >= 2 ? _sparkles([[22,30,2],[78,28,2],[28,68,1.5],[72,66,1.5],[50,18,2.5]]) : '';
    var leaf = '<path d="M50 115 Q30 108 22 92 Q26 88 36 96 Z" fill="#6b8e7f" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="M50 118 Q70 110 78 96 Q74 90 64 100 Z" fill="#90b8a8" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/>';
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glowRing + spark +
        '<path d="M50 120 Q49 95 50 70" stroke="' + INK + '" stroke-width="2.8" fill="none" stroke-linecap="round"/>' +
        leaf +
        '<g class="petal-spin">' +
        _petals(14, 50, 48, 6.5, 15, 19, 'url(#sun-petal)', 0.95) +
        _petals(14, 50, 48, 4, 11, 13, 'url(#sun-petal-2)', 0.65) +
        '</g>' +
        '<circle cx="50" cy="48" r="13" fill="url(#sun-center)" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<circle cx="46" cy="44" r="2" fill="#8a6a3a" opacity="0.5"/>' +
        '<circle cx="55" cy="49" r="1.5" fill="#8a6a3a" opacity="0.4"/>' +
        _face(50, 47, 3.5, 14, 5) +
        '</svg>';
}

/* 2. Toadstool - Burgundy mushroom with cream cap dots */
function renderToadstool(wl) {
    var defs = _radial('cap-r', 40, 30, 80, [[0,'#a8503a'],[60,'#7a2820'],[100,'#4a1810']]) +
        _radial('stem-r', 50, 30, 70, [[0,'#f5ebd7'],[100,'#b8a378']]) +
        _filterGlow('cap-glow', 4, 1);
    var glow = wl >= 1 ? '<ellipse cx="50" cy="55" rx="38" ry="28" fill="#a8503a" opacity="0.14" filter="url(#cap-glow)"/>' : '';
    var extraSpot = wl >= 2 ? '<circle cx="46" cy="62" r="3.5" fill="#f5ebd7" stroke="' + INK + '" stroke-width="1.2"/><circle cx="55" cy="68" r="2.5" fill="#f5ebd7" stroke="' + INK + '" stroke-width="1.2"/>' : '';
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow +
        '<path d="M40 120 Q40 92 43 76 L57 76 Q60 92 60 120 Z" fill="url(#stem-r)" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="M16 72 Q14 38 50 30 Q86 38 84 72 Q84 80 50 80 Q16 80 16 72 Z" fill="url(#cap-r)" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>' +
        /* Cap highlight */
        '<ellipse cx="38" cy="42" rx="14" ry="6" fill="#c97a8c" opacity="0.3"/>' +
        '<circle cx="32" cy="52" r="5.5" fill="#f5ebd7" stroke="' + INK + '" stroke-width="1.4"/><circle cx="58" cy="46" r="6.5" fill="#f5ebd7" stroke="' + INK + '" stroke-width="1.4"/>' +
        '<circle cx="68" cy="60" r="4" fill="#f5ebd7" stroke="' + INK + '" stroke-width="1.2"/><circle cx="42" cy="66" r="3.5" fill="#f5ebd7" stroke="' + INK + '" stroke-width="1.2"/>' +
        extraSpot +
        _face(50, 99, 3.5, 16, 5) +
        '<circle cx="36" cy="103" r="3" fill="#c97a8c" opacity="0.5"/>' +
        '<circle cx="64" cy="103" r="3" fill="#c97a8c" opacity="0.5"/>' +
        '</svg>';
}

/* 3. Bluebelle - Bell flowers in dusty teal on arched stems */
function renderBluebelle(wl) {
    var defs = _gradient('bell-g', [[0,'#88c0d0'],[60,'#5a9ba8'],[100,'#2a5a68']]) +
        _radial('bell-glow', 50, 50, 50, [[0,'#5a9ba8',0.22],[100,'#5a9ba8',0]]);
    var glow = wl >= 1 ? '<circle cx="50" cy="50" r="28" fill="url(#bell-glow)"/>' : '';
    function bell(tx, ty, s) {
        return '<g transform="translate(' + tx + ' ' + ty + ') scale(' + s + ')">' +
            '<path d="M-9 3 Q-12 -5 -10 -11 Q-6 -17 0 -17 Q6 -17 10 -11 Q12 -5 9 3 Q6 7 0 7 Q-6 7 -9 3 Z" fill="url(#bell-g)" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/>' +
            '<line x1="-5" y1="3" x2="5" y2="3" stroke="' + INK + '" stroke-width="1.2" opacity="0.6"/>' +
            '<ellipse cx="-3" cy="-7" rx="2" ry="3" fill="#c8e0e0" opacity="0.65"/>' +
            '</g>';
    }
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow +
        '<path d="M50 120 Q48 95 50 60" stroke="' + INK + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="32" cy="95" rx="12" ry="5" fill="#6b8e7f" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round" transform="rotate(-25 32 95)"/>' +
        '<ellipse cx="68" cy="88" rx="12" ry="5" fill="#90b8a8" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round" transform="rotate(25 68 88)"/>' +
        '<line x1="50" y1="60" x2="50" y2="42" stroke="' + INK + '" stroke-width="1.6"/>' +
        '<line x1="50" y1="60" x2="34" y2="52" stroke="' + INK + '" stroke-width="1.6"/>' +
        '<line x1="50" y1="60" x2="66" y2="52" stroke="' + INK + '" stroke-width="1.6"/>' +
        '<g class="bell-swing-1">' + bell(50, 42, 1) + '</g>' +
        '<g class="bell-swing-2">' + bell(34, 52, 0.75) + '</g>' +
        '<g class="bell-swing-3">' + bell(66, 52, 0.75) + '</g>' +
        (wl >= 2 ? '<g class="bell-swing-4">' + bell(50, 28, 0.55) + '</g>' : '') +
        '</svg>';
}

/* 4. Prickle - Sage cactus with dusty rose bloom */
function renderPrickle(wl) {
    var defs = _gradient('cac-body', [[0,'#90b8a8'],[60,'#6b8e7f'],[100,'#3a5a4a']]) +
        _radial('cac-flower', 50, 50, 60, [[0,'#e0a0b0'],[60,'#c97a8c'],[100,'#8a4a5a']]);
    var flowerColor = wl >= 1 ? 'url(#cac-flower)' : '#c97a8c';
    var glow = wl >= 2 ? '<circle cx="50" cy="55" r="22" fill="#6b8e7f" opacity="0.16"/>' : '';
    var spikes = '';
    var sp = [[38,72],[62,72],[40,82],[60,82],[38,92],[62,92],[42,100],[58,100],[30,78],[70,78],[28,86],[72,86]];
    for (var i = 0; i < sp.length; i++) {
        var sx = sp[i][0], sy = sp[i][1], dir = sx < 50 ? -1 : 1;
        spikes += '<line x1="' + sx + '" y1="' + sy + '" x2="' + (sx + dir * 5) + '" y2="' + sy +
            '" stroke="' + INK + '" stroke-width="1.4" stroke-linecap="round" opacity="0.9"/>';
    }
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow +
        '<path d="M35 112 L37 120 L63 120 L65 112 Z" fill="#6b4a2a" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="M40 112 Q37 85 42 62 Q45 55 50 55 Q55 55 58 62 Q63 85 60 112 Z" fill="url(#cac-body)" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="M40 88 Q30 82 27 72 Q26 66 30 63 Q36 61 39 69 Q41 78 43 84 Z" fill="url(#cac-body)" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="M60 92 Q70 87 73 77 Q74 71 70 68 Q64 66 61 74 Q59 82 57 88 Z" fill="url(#cac-body)" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/>' +
        /* Highlight stripe on main body */
        '<path d="M47 65 Q46 80 47 100" stroke="#90b8a8" stroke-width="1.5" fill="none" opacity="0.5"/>' +
        spikes +
        '<g class="prickle-bloom">' +
        _petals(6, 50, 53, 3, 5, 5, flowerColor, 0.95) +
        '<circle cx="50" cy="53" r="3" fill="#d4af37" stroke="' + INK + '" stroke-width="0.8"/>' +
        '</g>' +
        (wl >= 2 ? '<g class="prickle-bloom2">' + _petals(5, 44, 50, 2, 3, 3, flowerColor, 0.9) + '<circle cx="44" cy="50" r="1.8" fill="#d4af37" stroke="' + INK + '" stroke-width="0.6"/></g>' +
        '<g class="prickle-bloom3">' + _petals(5, 56, 50, 2, 3, 3, flowerColor, 0.9) + '<circle cx="56" cy="50" r="1.8" fill="#d4af37" stroke="' + INK + '" stroke-width="0.6"/></g>' : '') +
        _face(50, 86, 3.2, 14, 5) +
        '</svg>';
}

/* 5. Fernella - Fern with sage fronds */
function renderFernella(wl) {
    var defs = _gradient('fern-g', [[0,'#90b8a8'],[50,'#6b8e7f'],[100,'#3a5a4a']]) +
        _radial('fern-glow', 50, 70, 50, [[0,'#6b8e7f',0.16],[100,'#6b8e7f',0]]);
    var glow = wl >= 1 ? '<circle cx="50" cy="75" r="28" fill="url(#fern-glow)"/>' : '';
    var fronds = '';
    var fc = 5;
    for (var i = 0; i < fc; i++) {
        var angle = -55 + i * 27;
        var rad = (angle - 90) * Math.PI / 180;
        var length = 50 - Math.abs(i - 2) * 6;
        var endX = 50 + Math.cos(rad) * length;
        var endY = 110 + Math.sin(rad) * length;
        var midX = 50 + Math.cos(rad) * length * 0.5 + 4;
        var midY = 110 + Math.sin(rad) * length * 0.5;
        fronds += '<g class="fern-frond-' + i + '"><path d="M50 110 Q' + midX.toFixed(1) + ' ' + midY.toFixed(1) + ' ' + endX.toFixed(1) + ' ' + endY.toFixed(1) +
            '" stroke="url(#fern-g)" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
        var lc = wl >= 2 ? 7 : 5;
        for (var j = 0; j < lc; j++) {
            var t = (j + 1) / (lc + 1);
            var lx = 50 + (endX - 50) * t;
            var ly = 110 + (endY - 110) * t;
            var perp = rad + Math.PI / 2;
            var ls = 6 * (1 - t * 0.4);
            var ox = Math.cos(perp) * 4;
            var oy = Math.sin(perp) * 4;
            fronds += '<ellipse cx="' + (lx + ox).toFixed(1) + '" cy="' + (ly + oy).toFixed(1) + '" rx="' + ls + '" ry="' + (ls * 0.4).toFixed(1) + '" fill="url(#fern-g)" stroke="' + INK + '" stroke-width="1" stroke-linejoin="round" transform="rotate(' + (angle + 90) + ' ' + (lx + ox).toFixed(1) + ' ' + (ly + oy).toFixed(1) + ')"/>' +
                '<ellipse cx="' + (lx - ox).toFixed(1) + '" cy="' + (ly - oy).toFixed(1) + '" rx="' + ls + '" ry="' + (ls * 0.4).toFixed(1) + '" fill="url(#fern-g)" stroke="' + INK + '" stroke-width="1" stroke-linejoin="round" transform="rotate(' + (angle + 90) + ' ' + (lx - ox).toFixed(1) + ' ' + (ly - oy).toFixed(1) + ')"/>';
        }
        fronds += '</g>';
    }
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow + '<path d="M48 120 L52 120 L52 110 L48 110 Z" fill="#3a1a08" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/>' + fronds +
        _face(50, 104, 2.8, 12, 4) +
        '</svg>';
}

/* 6. Lumi - Glowing mushroom with bioluminescent dusty teal cap */
function renderLumi(wl) {
    var defs = _radial('lumi-cap', 50, 35, 80, [[0,'#a8d0d8'],[60,'#5a9ba8'],[100,'#2a4a55']]) +
        _radial('lumi-glow', 50, 50, 50, [[0,'#88c0d0',0.5],[100,'#88c0d0',0]]) +
        _filterGlow('lumi-glow-fx', 6, 1);
    var glow = wl >= 1 ? '<circle cx="50" cy="50" r="34" fill="url(#lumi-glow)" filter="url(#lumi-glow-fx)"/>' : '';
    var spots = wl >= 2 ?
        '<circle cx="38" cy="55" r="2.5" fill="#c8e8e8"/><circle cx="62" cy="52" r="3" fill="#c8e8e8"/><circle cx="50" cy="65" r="2" fill="#c8e8e8"/>' : '';
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow +
        '<path d="M42 120 Q42 95 45 80 L55 80 Q58 95 58 120 Z" fill="#e0d8c8" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="M18 76 Q16 40 50 32 Q84 40 82 76 Q82 82 50 82 Q18 82 18 76 Z" fill="url(#lumi-cap)" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>' +
        spots +
        /* Cap highlight */
        '<ellipse cx="36" cy="42" rx="14" ry="5" fill="#c8e8e8" opacity="0.4"/>' +
        '<ellipse cx="42" cy="76" rx="6" ry="2.5" fill="#a8d0d8" opacity="0.6"/>' +
        '<ellipse cx="58" cy="76" rx="6" ry="2.5" fill="#a8d0d8" opacity="0.6"/>' +
        _face(50, 100, 3.2, 14, 5) +
        '</svg>';
}

/* 7. Crysto - Crystal plant with faceted amethyst shards */
function renderCrysto(wl) {
    var defs = _gradient('crys-shard', [[0,'#c8a8e0'],[60,'#7e5bad'],[100,'#3a2055']]) +
        _radial('crys-glow', 50, 50, 60, [[0,'#a880d0',0.42],[100,'#a880d0',0]]) +
        _filterGlow('crys-fx', 5, 1);
    var glow = wl >= 1 ? '<circle cx="50" cy="60" r="30" fill="url(#crys-glow)" filter="url(#crys-fx)"/>' : '';
    var extraShard = wl >= 2 ? '<polygon points="50,30 46,40 50,52 54,40" fill="url(#crys-shard)" stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round"/>' : '';
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow +
        '<path d="M44 120 L40 105 L36 88 L40 75 L50 70 L60 75 L64 88 L60 105 L56 120 Z" fill="#4a3a6e" opacity="0.3"/>' +
        '<g class="crys-cluster">' +
        '<polygon points="50,35 40,60 50,90 60,60" fill="url(#crys-shard)" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<polygon points="50,40 44,60 50,80 56,60" fill="#e0c8f0" opacity="0.5"/>' +
        '<polygon points="35,55 30,75 38,90 42,75" fill="url(#crys-shard)" stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round" opacity="0.85"/>' +
        '<polygon points="65,55 70,75 62,90 58,75" fill="url(#crys-shard)" stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round" opacity="0.85"/>' +
        '</g>' +
        extraShard +
        _sparkles([[45,50,1.5],[55,68,1.5],[50,75,1.2]]) +
        _face(50, 62, 2.8, 12, 4) +
        '</svg>';
}

/* 8. Pip - Pod plant with bouncing sage peapods */
function renderPip(wl) {
    var defs = _gradient('pip-pod', [[0,'#a8c8a0'],[60,'#6b8e7f'],[100,'#3a5a4a']]) +
        _radial('pip-glow', 50, 50, 50, [[0,'#90b8a8',0.18],[100,'#90b8a8',0]]);
    var glow = wl >= 1 ? '<circle cx="50" cy="60" r="28" fill="url(#pip-glow)"/>' : '';
    function pod(tx, ty, s, rot) {
        return '<g transform="translate(' + tx + ' ' + ty + ') rotate(' + rot + ') scale(' + s + ')">' +
            '<path d="M0 0 Q-8 -5 -10 -18 Q-8 -30 0 -32 Q8 -30 10 -18 Q8 -5 0 0 Z" fill="url(#pip-pod)" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/>' +
            '<circle cx="-3" cy="-12" r="3.5" fill="#6b8e7f" stroke="' + INK + '" stroke-width="0.7"/><circle cx="3" cy="-12" r="3.5" fill="#6b8e7f" stroke="' + INK + '" stroke-width="0.7"/>' +
            '<circle cx="-2" cy="-22" r="3" fill="#6b8e7f" stroke="' + INK + '" stroke-width="0.7"/><circle cx="2" cy="-22" r="3" fill="#6b8e7f" stroke="' + INK + '" stroke-width="0.7"/>' +
            '</g>';
    }
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow +
        '<path d="M50 120 Q49 100 50 80" stroke="' + INK + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="32" cy="100" rx="11" ry="5" fill="#90b8a8" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round" transform="rotate(-25 32 100)"/>' +
        '<ellipse cx="68" cy="100" rx="11" ry="5" fill="#90b8a8" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round" transform="rotate(25 68 100)"/>' +
        '<g class="pip-bounce-1">' + pod(35, 80, 1.1, -20) + '</g>' +
        '<g class="pip-bounce-2">' + pod(65, 80, 1.1, 20) + '</g>' +
        '<g class="pip-bounce-3">' + pod(50, 65, 1.3, 0) + '</g>' +
        (wl >= 2 ? '<g class="pip-bounce-4">' + pod(45, 50, 0.9, -15) + '</g>' +
        '<g class="pip-bounce-5">' + pod(55, 50, 0.9, 15) + '</g>' : '') +
        _face(50, 47, 3, 12, 4) +
        '</svg>';
}

/* 9. Bublo - Bubble plant with floating dusty rose bubbles */
function renderBublo(wl) {
    var defs = _radial('bub-r', 35, 35, 65, [[0,'#f5ebd7',0.9],[60,'#e0a0b0',0.5],[100,'#c97a8c',0.2]]) +
        _filterGlow('bub-fx', 2, 1);
    var glow = wl >= 1 ? '<circle cx="50" cy="60" r="28" fill="#c97a8c" opacity="0.16"/>' : '';
    function bubble(cx, cy, r) {
        return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="url(#bub-r)" stroke="' + INK + '" stroke-width="1.4" opacity="0.9" filter="url(#bub-fx)"/>' +
            '<circle cx="' + (cx - r * 0.3) + '" cy="' + (cy - r * 0.3) + '" r="' + (r * 0.25).toFixed(1) + '" fill="#f5ebd7" opacity="0.9"/>';
    }
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow +
        '<path d="M40 120 Q40 100 43 85 L57 85 Q60 100 60 120 Z" fill="#90b8a8" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<ellipse cx="32" cy="100" rx="9" ry="4" fill="#6b8e7f" stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round" transform="rotate(-25 32 100)"/>' +
        '<ellipse cx="68" cy="100" rx="9" ry="4" fill="#6b8e7f" stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round" transform="rotate(25 68 100)"/>' +
        '<g class="bub-float-1">' + bubble(50, 70, 9) + '</g>' +
        '<g class="bub-float-2">' + bubble(35, 80, 6) + '</g>' +
        '<g class="bub-float-3">' + bubble(65, 80, 6) + '</g>' +
        (wl >= 2 ? '<g class="bub-float-4">' + bubble(50, 50, 7) + '</g>' +
        '<g class="bub-float-5">' + bubble(40, 60, 4) + '</g>' +
        '<g class="bub-float-6">' + bubble(60, 60, 4) + '</g>' : '') +
        _face(50, 104, 3.2, 14, 5) +
        '</svg>';
}

/* 10. Drago - Dragon mouth flower with snap-jaw, copper tones */
function renderDrago(wl) {
    var defs = _gradient('drago-jaw', [[0,'#d4af37'],[50,'#b87333'],[100,'#5a2a10']]) +
        _radial('drago-glow', 50, 50, 50, [[0,'#b87333',0.26],[100,'#b87333',0]]) +
        _filterGlow('drago-fx', 4, 1);
    var glow = wl >= 1 ? '<circle cx="50" cy="55" r="28" fill="url(#drago-glow)" filter="url(#drago-fx)"/>' : '';
    var tongue = wl >= 2 ? '<path d="M50 65 Q48 70 50 75 Q52 70 50 65 Z" fill="#c97a8c" stroke="' + INK + '" stroke-width="0.6"/>' : '';
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow +
        '<path d="M50 120 Q49 95 50 75" stroke="' + INK + '" stroke-width="2.8" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="32" cy="98" rx="11" ry="5" fill="#6b8e7f" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round" transform="rotate(-25 32 98)"/>' +
        '<ellipse cx="68" cy="98" rx="11" ry="5" fill="#90b8a8" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round" transform="rotate(25 68 98)"/>' +
        '<g class="drago-mouth">' +
        '<path d="M22 60 Q22 50 50 48 Q78 50 78 60 Q78 68 50 68 Q22 68 22 60 Z" fill="url(#drago-jaw)" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M22 60 Q22 70 50 72 Q78 70 78 60" fill="url(#drago-jaw)" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/>' +
        /* Soft teeth (rounded, not bold white) */
        '<polygon points="30,52 33,60 36,52" fill="#f5ebd7" stroke="' + INK + '" stroke-width="0.8"/><polygon points="40,52 43,60 46,52" fill="#f5ebd7" stroke="' + INK + '" stroke-width="0.8"/><polygon points="54,52 57,60 60,52" fill="#f5ebd7" stroke="' + INK + '" stroke-width="0.8"/><polygon points="64,52 67,60 70,52" fill="#f5ebd7" stroke="' + INK + '" stroke-width="0.8"/>' +
        '<polygon points="30,68 33,60 36,68" fill="#f5ebd7" stroke="' + INK + '" stroke-width="0.8"/><polygon points="64,68 67,60 70,68" fill="#f5ebd7" stroke="' + INK + '" stroke-width="0.8"/>' +
        tongue +
        '</g>' +
        _sparkles([[28,55,1],[72,55,1],[50,42,1.5]]) +
        _face(50, 39, 3, 12, 4) +
        '</svg>';
}

/* 11. Flama - Torch lily with copper/gold flame petals */
function renderFlama(wl) {
    var defs = _gradient('flama-petal', [[0,'#f5e7a8'],[40,'#d4af37'],[70,'#b87333'],[100,'#7a3a10']]) +
        _radial('flama-glow', 50, 50, 60, [[0,'#b87333',0.32],[100,'#b87333',0]]) +
        _filterGlow('flama-fx', 5, 1);
    var glow = wl >= 1 ? '<circle cx="50" cy="50" r="32" fill="url(#flama-glow)" filter="url(#flama-fx)"/>' : '';
    function flame(cx, cy, h, w) {
        return '<path d="M' + cx + ' ' + (cy - h) + ' Q' + (cx - w) + ' ' + (cy - h * 0.5) + ' ' + cx + ' ' + cy +
            ' Q' + (cx + w) + ' ' + (cy - h * 0.5) + ' ' + cx + ' ' + (cy - h) + ' Z" fill="url(#flama-petal)" stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round"/>';
    }
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow +
        '<path d="M50 120 Q49 95 50 70" stroke="' + INK + '" stroke-width="2.8" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="32" cy="98" rx="11" ry="5" fill="#6b8e7f" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round" transform="rotate(-25 32 98)"/>' +
        '<ellipse cx="68" cy="98" rx="11" ry="5" fill="#90b8a8" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round" transform="rotate(25 68 98)"/>' +
        '<g class="flama-flicker">' +
        flame(50, 75, 35, 10) +
        flame(40, 75, 28, 8) +
        flame(60, 75, 28, 8) +
        flame(35, 75, 20, 6) +
        flame(65, 75, 20, 6) +
        (wl >= 2 ? flame(50, 75, 45, 12) : '') +
        '</g>' +
        _sparkles([[48,40,1.5],[52,40,1.5],[50,30,2]]) +
        _face(50, 66, 3, 12, 4) +
        '</svg>';
}

/* 12. Shimmer - Champagne pearl flower with rotating sparkles */
function renderShimmer(wl) {
    var defs = _radial('shim-ball', 35, 30, 80, [[0,'#f5ebd7'],[50,'#d4c0a0'],[100,'#7a6a4a']]) +
        _radial('shim-glow', 50, 50, 60, [[0,'#d4af37',0.4],[100,'#d4af37',0]]) +
        _filterGlow('shim-fx', 6, 1);
    var glow = wl >= 1 ? '<circle cx="50" cy="55" r="32" fill="url(#shim-glow)" filter="url(#shim-fx)"/>' : '';
    var tilePattern = '';
    for (var r = 0; r < 5; r++) {
        for (var c = 0; c < 6; c++) {
            var cx = 32 + c * 7;
            var cy = 38 + r * 7;
            if (cx > 68 || cy > 75) continue;
            tilePattern += '<rect x="' + (cx - 2) + '" y="' + (cy - 2) + '" width="4" height="4" fill="' + ((r+c)%2 ? '#f5ebd7' : '#d4c0a0') + '" opacity="0.45"/>';
        }
    }
    var rays = wl >= 2 ?
        '<g class="shim-rays"><line x1="50" y1="55" x2="20" y2="20" stroke="#d4af37" stroke-width="1.8" opacity="0.65"/>' +
        '<line x1="50" y1="55" x2="80" y2="20" stroke="#d4af37" stroke-width="1.8" opacity="0.65"/>' +
        '<line x1="50" y1="55" x2="15" y2="55" stroke="#d4af37" stroke-width="1.8" opacity="0.65"/>' +
        '<line x1="50" y1="55" x2="85" y2="55" stroke="#d4af37" stroke-width="1.8" opacity="0.65"/>' +
        '<line x1="50" y1="55" x2="20" y2="90" stroke="#d4af37" stroke-width="1.8" opacity="0.65"/>' +
        '<line x1="50" y1="55" x2="80" y2="90" stroke="#d4af37" stroke-width="1.8" opacity="0.65"/></g>' : '';
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow + rays +
        '<path d="M50 120 Q49 100 50 85" stroke="' + INK + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="32" cy="100" rx="9" ry="4" fill="#6b8e7f" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round" transform="rotate(-25 32 100)"/>' +
        '<ellipse cx="68" cy="100" rx="9" ry="4" fill="#90b8a8" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round" transform="rotate(25 68 100)"/>' +
        '<g class="shim-spin">' +
        '<circle cx="50" cy="55" r="22" fill="url(#shim-ball)" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/>' +
        tilePattern +
        '</g>' +
        _sparkles([[28,40,1.5],[72,42,1.5],[28,68,1.2],[72,66,1.2]]) +
        _face(50, 57, 3.2, 12, 4) +
        '</svg>';
}

/* 13. Puffer - Ivory puffball that pulses and emits spores */
function renderPuffer(wl) {
    var defs = _radial('puff-r', 40, 35, 80, [[0,'#f5ebd7'],[60,'#d4c0a0'],[100,'#8a7a5a']]) +
        _radial('puff-glow', 50, 50, 60, [[0,'#f5ebd7',0.34],[100,'#f5ebd7',0]]) +
        _filterGlow('puff-fx', 4, 1);
    var glow = wl >= 1 ? '<circle cx="50" cy="55" r="30" fill="url(#puff-glow)" filter="url(#puff-fx)"/>' : '';
    var spores = wl >= 2 ?
        '<g class="puffer-spores">' +
        '<circle cx="22" cy="40" r="2" fill="#f5ebd7" opacity="0.8"/>' +
        '<circle cx="78" cy="42" r="2" fill="#f5ebd7" opacity="0.8"/>' +
        '<circle cx="25" cy="68" r="1.8" fill="#f5ebd7" opacity="0.8"/>' +
        '<circle cx="75" cy="70" r="1.8" fill="#f5ebd7" opacity="0.8"/>' +
        '<circle cx="50" cy="22" r="2.2" fill="#f5ebd7" opacity="0.8"/>' +
        '</g>' : '';
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow + spores +
        '<path d="M45 120 L43 105 L57 105 L55 120 Z" fill="#3a1a08" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<g class="puffer-pulse">' +
        '<circle cx="50" cy="55" r="26" fill="url(#puff-r)" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<circle cx="42" cy="48" r="4" fill="#8a7a5a" opacity="0.35"/>' +
        '<circle cx="58" cy="52" r="3" fill="#8a7a5a" opacity="0.35"/>' +
        '<circle cx="50" cy="62" r="3.5" fill="#8a7a5a" opacity="0.35"/>' +
        _face(50, 56, 3.2, 14, 5) +
        '</g>' +
        '</svg>';
}

/* 14. Vinio - Grape vine with amethyst clusters */
function renderVinio(wl) {
    var defs = _radial('vinio-grape', 35, 30, 70, [[0,'#a880d0'],[60,'#7e5bad'],[100,'#3a2055']]) +
        _radial('vinio-glow', 50, 50, 50, [[0,'#7e5bad',0.18],[100,'#7e5bad',0]]) +
        _gradient('vinio-leaf', [[0,'#90b8a8'],[100,'#4a6b5c']]);
    var glow = wl >= 1 ? '<circle cx="50" cy="60" r="28" fill="url(#vinio-glow)"/>' : '';
    function cluster(cx, cy, count) {
        var s = '<g transform="translate(' + cx + ' ' + cy + ')">';
        for (var i = 0; i < count; i++) {
            var px = (Math.random() - 0.5) * 12;
            var py = i * 5;
            s += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="4" fill="url(#vinio-grape)" stroke="' + INK + '" stroke-width="1.2"/>' +
                '<circle cx="' + (px - 1).toFixed(1) + '" cy="' + (py - 1).toFixed(1) + '" r="1.5" fill="#c8a8e0" opacity="0.65"/>';
        }
        return s + '</g>';
    }
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow +
        '<path d="M50 120 Q48 100 50 80" stroke="' + INK + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
        '<path d="M50 80 Q35 70 30 50" stroke="' + INK + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
        '<path d="M50 80 Q65 70 70 50" stroke="' + INK + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
        '<path d="M50 80 Q50 60 50 40" stroke="' + INK + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="30" cy="48" rx="9" ry="5" fill="url(#vinio-leaf)" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round" transform="rotate(-30 30 48)"/>' +
        '<ellipse cx="70" cy="48" rx="9" ry="5" fill="url(#vinio-leaf)" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round" transform="rotate(30 70 48)"/>' +
        '<ellipse cx="50" cy="40" rx="10" ry="5" fill="url(#vinio-leaf)" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<g class="vinio-drop-1">' + cluster(30, 55, 5) + '</g>' +
        '<g class="vinio-drop-2">' + cluster(70, 55, 5) + '</g>' +
        (wl >= 2 ? '<g class="vinio-drop-3">' + cluster(50, 50, 6) + '</g>' : '') +
        _face(50, 100, 3.2, 14, 5) +
        '</svg>';
}

/* 15. Echo - Resonating bloom in dusty rose + amethyst */
function renderEcho(wl) {
    var defs = _gradient('echo-petal', [[0,'#e0a0b0'],[50,'#a880d0'],[100,'#3a2055']]) +
        _radial('echo-glow', 50, 50, 60, [[0,'#c8a8c0',0.34],[100,'#c8a8c0',0]]) +
        _filterGlow('echo-fx', 5, 1);
    var glow = wl >= 1 ? '<circle cx="50" cy="55" r="30" fill="url(#echo-glow)" filter="url(#echo-fx)"/>' : '';
    var waves = wl >= 2 ?
        '<g class="echo-waves">' +
        '<circle cx="50" cy="55" r="32" fill="none" stroke="#c97a8c" stroke-width="1.6" opacity="0.45"/>' +
        '<circle cx="50" cy="55" r="38" fill="none" stroke="#7e5bad" stroke-width="1.4" opacity="0.35"/>' +
        '</g>' : '';
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow + waves +
        '<path d="M50 120 Q49 95 50 75" stroke="' + INK + '" stroke-width="2.8" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="32" cy="98" rx="11" ry="5" fill="#6b8e7f" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round" transform="rotate(-25 32 98)"/>' +
        '<ellipse cx="68" cy="98" rx="11" ry="5" fill="#90b8a8" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round" transform="rotate(25 68 98)"/>' +
        '<g class="echo-bloom">' +
        _petals(8, 50, 55, 5, 12, 16, 'url(#echo-petal)', 0.92) +
        _petals(8, 50, 55, 3.5, 9, 11, '#a880d0', 0.65) +
        '<circle cx="50" cy="55" r="9" fill="#d4af37" stroke="' + INK + '" stroke-width="1.2"/>' +
        '<circle cx="50" cy="55" r="6" fill="#b87333"/>' +
        '<circle cx="50" cy="55" r="3" fill="#7a3a10"/>' +
        '</g>' +
        _sparkles([[28,40,1.5],[72,40,1.5],[50,30,2]]) +
        _face(50, 56, 2.8, 12, 4) +
        '</svg>';
}

/* 16. Twinkle - Star flower with champagne gold stars */
function renderTwinkle(wl) {
    var defs = _gradient('twink-star', [[0,'#f5e7a8'],[60,'#d4af37'],[100,'#b87333']]) +
        _radial('twink-glow', 50, 50, 60, [[0,'#d4af37',0.4],[100,'#d4af37',0]]) +
        _filterGlow('twink-fx', 6, 1);
    var glow = wl >= 1 ? '<circle cx="50" cy="55" r="32" fill="url(#twink-glow)" filter="url(#twink-fx)"/>' : '';
    function star(cx, cy, r, rot) {
        var pts = '';
        for (var i = 0; i < 10; i++) {
            var a = (i * 36 - 90 + (rot || 0)) * Math.PI / 180;
            var rr = i % 2 === 0 ? r : r * 0.4;
            pts += (cx + Math.cos(a) * rr).toFixed(1) + ',' + (cy + Math.sin(a) * rr).toFixed(1) + ' ';
        }
        return '<polygon points="' + pts + '" fill="url(#twink-star)" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/>';
    }
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow +
        '<path d="M50 120 Q49 95 50 75" stroke="' + INK + '" stroke-width="2.8" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="32" cy="98" rx="11" ry="5" fill="#6b8e7f" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round" transform="rotate(-25 32 98)"/>' +
        '<ellipse cx="68" cy="98" rx="11" ry="5" fill="#90b8a8" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round" transform="rotate(25 68 98)"/>' +
        '<g class="twink-spin-1">' + star(50, 55, 20, 0) + '</g>' +
        '<g class="twink-spin-2">' + star(50, 55, 13, 18) + '</g>' +
        '<circle cx="50" cy="55" r="6" fill="#b87333" stroke="' + INK + '" stroke-width="1"/>' +
        '<circle cx="50" cy="55" r="3" fill="#f5ebd7"/>' +
        (wl >= 2 ?
        '<g class="twink-orbit">' +
        star(30, 35, 5, 0) + star(70, 35, 5, 30) + star(70, 75, 5, 60) + star(30, 75, 5, 90) +
        '</g>' : '') +
        _sparkles([[28,40,1.2],[72,40,1.2],[28,70,1.2],[72,70,1.2]]) +
        _face(50, 57, 2.5, 10, 3.5) +
        '</svg>';
}

/* ---- Plant type registry ---- */

var PLANT_TYPES = [
    {
        id: 'sunflare', name: 'Sunflare', emoji: '\u2600\uFE0F', animClass: 'anim-sunflare',
        colors: { primary: '#d4af37', secondary: '#b87333' },
        renderSVG: renderSunflare,
        audio: {
            name: 'Bright brass',
            notes: [523.25, 659.25, 783.99, 1046.50],
            waveform: 'triangle',
            envelope: { attack: 0.02, decay: 0.15, sustain: 0.6, release: 0.4 },
            noteDuration: 0.25, filterFreq: 4500, filterQ: 2,
            reverb: 0.3, delay: 0.2, volume: 0.22, harmonics: [1, 0.5, 0.25],
            waterEffects: [
                { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0, delayBoost: 0 },
                { pitchMultiplier: 1.122, vibrato: 1, reverbBoost: 0.15, harmonicBoost: 1, delayBoost: 0.1 },
                { pitchMultiplier: 1.26, vibrato: 3, reverbBoost: 0.3, harmonicBoost: 2, delayBoost: 0.2 },
                { pitchMultiplier: 1.5, vibrato: 5, reverbBoost: 0.45, harmonicBoost: 3, delayBoost: 0.3 }
            ]
        }
    },
    {
        id: 'toadstool', name: 'Toadstool', emoji: '\uD83C\uDF4A', animClass: 'anim-toadstool',
        colors: { primary: '#7a2820', secondary: '#d4c0a0' },
        renderSVG: renderToadstool,
        audio: {
            name: 'Deep bass thump',
            notes: [130.81, 164.81, 196.00, 261.63],
            waveform: 'sine',
            envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.5 },
            noteDuration: 0.4, filterFreq: 1800, filterQ: 4,
            reverb: 0.5, delay: 0.15, volume: 0.3, harmonics: [1, 0.4, 0.2],
            waterEffects: [
                { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0, delayBoost: 0 },
                { pitchMultiplier: 1.122, vibrato: 1, reverbBoost: 0.1, harmonicBoost: 1, delayBoost: 0 },
                { pitchMultiplier: 1.26, vibrato: 2, reverbBoost: 0.2, harmonicBoost: 2, delayBoost: 0.1 },
                { pitchMultiplier: 1.5, vibrato: 4, reverbBoost: 0.35, harmonicBoost: 3, delayBoost: 0.2 }
            ]
        }
    },
    {
        id: 'bluebelle', name: 'Bluebelle', emoji: '\uD83D\uDD14', animClass: 'anim-bluebelle',
        colors: { primary: '#5a9ba8', secondary: '#2a5a68' },
        renderSVG: renderBluebelle,
        audio: {
            name: 'Crystal bell',
            notes: [880.00, 1046.50, 1318.51, 1567.98],
            waveform: 'sine',
            envelope: { attack: 0.005, decay: 0.3, sustain: 0.2, release: 1.2 },
            noteDuration: 0.6, filterFreq: 6000, filterQ: 5,
            reverb: 0.6, delay: 0.25, volume: 0.18, harmonics: [1, 0.6, 0.3, 0.15],
            waterEffects: [
                { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0, delayBoost: 0 },
                { pitchMultiplier: 1.122, vibrato: 2, reverbBoost: 0.1, harmonicBoost: 1, delayBoost: 0.1 },
                { pitchMultiplier: 1.26, vibrato: 4, reverbBoost: 0.2, harmonicBoost: 2, delayBoost: 0.15 },
                { pitchMultiplier: 1.5, vibrato: 6, reverbBoost: 0.3, harmonicBoost: 3, delayBoost: 0.25 }
            ]
        }
    },
    {
        id: 'prickle', name: 'Prickle', emoji: '\uD83C\uDF35', animClass: 'anim-prickle',
        colors: { primary: '#6b8e7f', secondary: '#c97a8c' },
        renderSVG: renderPrickle,
        audio: {
            name: 'Plucky twang',
            notes: [196.00, 246.94, 293.66, 392.00],
            waveform: 'square',
            envelope: { attack: 0.005, decay: 0.18, sustain: 0.15, release: 0.5 },
            noteDuration: 0.18, filterFreq: 2500, filterQ: 6,
            reverb: 0.2, delay: 0.1, volume: 0.18, harmonics: [1, 0.3, 0.1],
            waterEffects: [
                { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0, delayBoost: 0 },
                { pitchMultiplier: 1.06, vibrato: 1, reverbBoost: 0.1, harmonicBoost: 1, delayBoost: 0 },
                { pitchMultiplier: 1.122, vibrato: 3, reverbBoost: 0.2, harmonicBoost: 2, delayBoost: 0.1 },
                { pitchMultiplier: 1.26, vibrato: 5, reverbBoost: 0.35, harmonicBoost: 3, delayBoost: 0.15 }
            ]
        }
    },
    {
        id: 'fernella', name: 'Fernella', emoji: '\uD83C\uDF3F', animClass: 'anim-fernella',
        colors: { primary: '#6b8e7f', secondary: '#90b8a8' },
        renderSVG: renderFernella,
        audio: {
            name: 'Wind chime',
            notes: [587.33, 698.46, 880.00, 1046.50],
            waveform: 'triangle',
            envelope: { attack: 0.02, decay: 0.4, sustain: 0.3, release: 1.0 },
            noteDuration: 0.4, filterFreq: 4000, filterQ: 3,
            reverb: 0.45, delay: 0.2, volume: 0.2, harmonics: [1, 0.5, 0.25, 0.1],
            waterEffects: [
                { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0, delayBoost: 0 },
                { pitchMultiplier: 1.06, vibrato: 2, reverbBoost: 0.1, harmonicBoost: 1, delayBoost: 0.1 },
                { pitchMultiplier: 1.122, vibrato: 4, reverbBoost: 0.2, harmonicBoost: 2, delayBoost: 0.15 },
                { pitchMultiplier: 1.26, vibrato: 6, reverbBoost: 0.35, harmonicBoost: 3, delayBoost: 0.25 }
            ]
        }
    },
    {
        id: 'lumi', name: 'Lumi', emoji: '\uD83D\uDC7D', animClass: 'anim-lumi',
        colors: { primary: '#5a9ba8', secondary: '#a8d0d8' },
        renderSVG: renderLumi,
        audio: {
            name: 'Ambient pad',
            notes: [261.63, 329.63, 392.00, 523.25],
            waveform: 'sine',
            envelope: { attack: 0.3, decay: 0.4, sustain: 0.7, release: 1.8 },
            noteDuration: 1.2, filterFreq: 2200, filterQ: 1.5,
            reverb: 0.7, delay: 0.3, volume: 0.18, harmonics: [1, 0.6, 0.4, 0.2],
            waterEffects: [
                { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0, delayBoost: 0 },
                { pitchMultiplier: 1.06, vibrato: 1, reverbBoost: 0.1, harmonicBoost: 1, delayBoost: 0.1 },
                { pitchMultiplier: 1.122, vibrato: 2, reverbBoost: 0.2, harmonicBoost: 2, delayBoost: 0.15 },
                { pitchMultiplier: 1.26, vibrato: 3, reverbBoost: 0.35, harmonicBoost: 3, delayBoost: 0.25 }
            ]
        }
    },
    {
        id: 'crysto', name: 'Crysto', emoji: '\uD83D\uDC8E', animClass: 'anim-crysto',
        colors: { primary: '#7e5bad', secondary: '#a880d0' },
        renderSVG: renderCrysto,
        audio: {
            name: 'Glass marimba',
            notes: [1046.50, 1318.51, 1567.98, 2093.00],
            waveform: 'sine',
            envelope: { attack: 0.001, decay: 0.5, sustain: 0.05, release: 1.5 },
            noteDuration: 0.3, filterFreq: 8000, filterQ: 8,
            reverb: 0.65, delay: 0.35, volume: 0.16, harmonics: [1, 0.7, 0.4, 0.2],
            waterEffects: [
                { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0, delayBoost: 0 },
                { pitchMultiplier: 1.06, vibrato: 1, reverbBoost: 0.1, harmonicBoost: 1, delayBoost: 0.05 },
                { pitchMultiplier: 1.122, vibrato: 2, reverbBoost: 0.2, harmonicBoost: 2, delayBoost: 0.1 },
                { pitchMultiplier: 1.26, vibrato: 4, reverbBoost: 0.3, harmonicBoost: 3, delayBoost: 0.2 }
            ]
        }
    },
    {
        id: 'pip', name: 'Pip', emoji: '\uD83C\uDF4F', animClass: 'anim-pip',
        colors: { primary: '#6b8e7f', secondary: '#90b8a8' },
        renderSVG: renderPip,
        audio: {
            name: 'Bouncy pluck',
            notes: [440.00, 554.37, 659.25, 880.00],
            waveform: 'triangle',
            envelope: { attack: 0.005, decay: 0.12, sustain: 0.1, release: 0.4 },
            noteDuration: 0.15, filterFreq: 3500, filterQ: 4,
            reverb: 0.2, delay: 0.15, volume: 0.22, harmonics: [1, 0.4, 0.15],
            waterEffects: [
                { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0, delayBoost: 0 },
                { pitchMultiplier: 1.06, vibrato: 1, reverbBoost: 0.05, harmonicBoost: 1, delayBoost: 0 },
                { pitchMultiplier: 1.122, vibrato: 2, reverbBoost: 0.15, harmonicBoost: 2, delayBoost: 0.05 },
                { pitchMultiplier: 1.26, vibrato: 4, reverbBoost: 0.3, harmonicBoost: 3, delayBoost: 0.15 }
            ]
        }
    },
    {
        id: 'bublo', name: 'Bublo', emoji: '\uD83D\uDCBF', animClass: 'anim-bublo',
        colors: { primary: '#c97a8c', secondary: '#e0a0b0' },
        renderSVG: renderBublo,
        audio: {
            name: 'Pop synth',
            notes: [329.63, 415.30, 493.88, 659.25],
            waveform: 'square',
            envelope: { attack: 0.001, decay: 0.08, sustain: 0.05, release: 0.3 },
            noteDuration: 0.1, filterFreq: 2000, filterQ: 5,
            reverb: 0.25, delay: 0.2, volume: 0.2, harmonics: [1, 0.2],
            waterEffects: [
                { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0, delayBoost: 0 },
                { pitchMultiplier: 1.06, vibrato: 1, reverbBoost: 0.05, harmonicBoost: 1, delayBoost: 0 },
                { pitchMultiplier: 1.122, vibrato: 2, reverbBoost: 0.15, harmonicBoost: 2, delayBoost: 0.05 },
                { pitchMultiplier: 1.26, vibrato: 4, reverbBoost: 0.3, harmonicBoost: 3, delayBoost: 0.15 }
            ]
        }
    },
    {
        id: 'drago', name: 'Drago', emoji: '\uD83D\uDC32', animClass: 'anim-drago',
        colors: { primary: '#b87333', secondary: '#5a2a10' },
        renderSVG: renderDrago,
        audio: {
            name: 'Snap percussion',
            notes: [82.41, 110.00, 146.83, 196.00],
            waveform: 'sawtooth',
            envelope: { attack: 0.001, decay: 0.05, sustain: 0.1, release: 0.2 },
            noteDuration: 0.1, filterFreq: 1500, filterQ: 6,
            reverb: 0.15, delay: 0.05, volume: 0.25, harmonics: [1, 0.5, 0.2],
            waterEffects: [
                { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0, delayBoost: 0 },
                { pitchMultiplier: 1.06, vibrato: 1, reverbBoost: 0.05, harmonicBoost: 1, delayBoost: 0 },
                { pitchMultiplier: 1.122, vibrato: 2, reverbBoost: 0.15, harmonicBoost: 2, delayBoost: 0.05 },
                { pitchMultiplier: 1.26, vibrato: 4, reverbBoost: 0.3, harmonicBoost: 3, delayBoost: 0.1 }
            ]
        }
    },
    {
        id: 'flama', name: 'Flama', emoji: '\uD83D\uDD25', animClass: 'anim-flama',
        colors: { primary: '#b87333', secondary: '#7a3a10' },
        renderSVG: renderFlama,
        audio: {
            name: 'Warm brass',
            notes: [220.00, 277.18, 329.63, 440.00],
            waveform: 'sawtooth',
            envelope: { attack: 0.05, decay: 0.2, sustain: 0.5, release: 0.6 },
            noteDuration: 0.3, filterFreq: 3500, filterQ: 3,
            reverb: 0.35, delay: 0.18, volume: 0.2, harmonics: [1, 0.4, 0.2],
            waterEffects: [
                { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0, delayBoost: 0 },
                { pitchMultiplier: 1.06, vibrato: 1, reverbBoost: 0.1, harmonicBoost: 1, delayBoost: 0.05 },
                { pitchMultiplier: 1.122, vibrato: 3, reverbBoost: 0.2, harmonicBoost: 2, delayBoost: 0.1 },
                { pitchMultiplier: 1.26, vibrato: 5, reverbBoost: 0.35, harmonicBoost: 3, delayBoost: 0.2 }
            ]
        }
    },
    {
        id: 'shimmer', name: 'Shimmer', emoji: '\uD83C\uDF90', animClass: 'anim-shimmer',
        colors: { primary: '#d4af37', secondary: '#f5ebd7' },
        renderSVG: renderShimmer,
        audio: {
            name: 'Disco sparkle',
            notes: [1318.51, 1567.98, 1760.00, 2093.00],
            waveform: 'triangle',
            envelope: { attack: 0.001, decay: 0.15, sustain: 0.1, release: 0.5 },
            noteDuration: 0.18, filterFreq: 6000, filterQ: 4,
            reverb: 0.5, delay: 0.4, volume: 0.18, harmonics: [1, 0.5, 0.25],
            waterEffects: [
                { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0, delayBoost: 0 },
                { pitchMultiplier: 1.06, vibrato: 1, reverbBoost: 0.1, harmonicBoost: 1, delayBoost: 0.05 },
                { pitchMultiplier: 1.122, vibrato: 2, reverbBoost: 0.2, harmonicBoost: 2, delayBoost: 0.1 },
                { pitchMultiplier: 1.26, vibrato: 4, reverbBoost: 0.35, harmonicBoost: 3, delayBoost: 0.2 }
            ]
        }
    },
    {
        id: 'puffer', name: 'Puffer', emoji: '\uD83C\uDF44', animClass: 'anim-puffer',
        colors: { primary: '#d4c0a0', secondary: '#8a7a5a' },
        renderSVG: renderPuffer,
        audio: {
            name: 'Soft whoosh',
            notes: [174.61, 220.00, 261.63, 349.23],
            waveform: 'sine',
            envelope: { attack: 0.1, decay: 0.3, sustain: 0.4, release: 0.8 },
            noteDuration: 0.5, filterFreq: 1200, filterQ: 2,
            reverb: 0.55, delay: 0.2, volume: 0.22, harmonics: [1, 0.3],
            waterEffects: [
                { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0, delayBoost: 0 },
                { pitchMultiplier: 1.06, vibrato: 1, reverbBoost: 0.1, harmonicBoost: 1, delayBoost: 0 },
                { pitchMultiplier: 1.122, vibrato: 2, reverbBoost: 0.2, harmonicBoost: 2, delayBoost: 0.05 },
                { pitchMultiplier: 1.26, vibrato: 4, reverbBoost: 0.35, harmonicBoost: 3, delayBoost: 0.15 }
            ]
        }
    },
    {
        id: 'vinio', name: 'Vinio', emoji: '\uD83C\uDF47', animClass: 'anim-vinio',
        colors: { primary: '#7e5bad', secondary: '#3a2055' },
        renderSVG: renderVinio,
        audio: {
            name: 'Jazzy Rhodes',
            notes: [261.63, 311.13, 392.00, 466.16],
            waveform: 'triangle',
            envelope: { attack: 0.02, decay: 0.25, sustain: 0.5, release: 0.8 },
            noteDuration: 0.35, filterFreq: 2800, filterQ: 2,
            reverb: 0.4, delay: 0.22, volume: 0.22, harmonics: [1, 0.5, 0.3],
            waterEffects: [
                { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0, delayBoost: 0 },
                { pitchMultiplier: 1.06, vibrato: 1, reverbBoost: 0.1, harmonicBoost: 1, delayBoost: 0.05 },
                { pitchMultiplier: 1.122, vibrato: 2, reverbBoost: 0.2, harmonicBoost: 2, delayBoost: 0.1 },
                { pitchMultiplier: 1.26, vibrato: 4, reverbBoost: 0.35, harmonicBoost: 3, delayBoost: 0.15 }
            ]
        }
    },
    {
        id: 'echo', name: 'Echo', emoji: '\uD83C\uDF3C', animClass: 'anim-echo',
        colors: { primary: '#7e5bad', secondary: '#c97a8c' },
        renderSVG: renderEcho,
        audio: {
            name: 'Resonant pad',
            notes: [196.00, 246.94, 329.63, 415.30],
            waveform: 'sine',
            envelope: { attack: 0.15, decay: 0.3, sustain: 0.7, release: 1.5 },
            noteDuration: 0.8, filterFreq: 1800, filterQ: 2,
            reverb: 0.7, delay: 0.4, volume: 0.2, harmonics: [1, 0.6, 0.4, 0.2],
            waterEffects: [
                { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0, delayBoost: 0 },
                { pitchMultiplier: 1.06, vibrato: 1, reverbBoost: 0.1, harmonicBoost: 1, delayBoost: 0.05 },
                { pitchMultiplier: 1.122, vibrato: 3, reverbBoost: 0.2, harmonicBoost: 2, delayBoost: 0.1 },
                { pitchMultiplier: 1.26, vibrato: 5, reverbBoost: 0.35, harmonicBoost: 3, delayBoost: 0.2 }
            ]
        }
    },
    {
        id: 'twinkle', name: 'Twinkle', emoji: '\u2B50', animClass: 'anim-twinkle',
        colors: { primary: '#d4af37', secondary: '#b87333' },
        renderSVG: renderTwinkle,
        audio: {
            name: 'Magic chime',
            notes: [1046.50, 1318.51, 1567.98, 2093.00],
            waveform: 'sine',
            envelope: { attack: 0.005, decay: 0.2, sustain: 0.3, release: 1.0 },
            noteDuration: 0.3, filterFreq: 7000, filterQ: 4,
            reverb: 0.6, delay: 0.3, volume: 0.18, harmonics: [1, 0.7, 0.5, 0.3],
            waterEffects: [
                { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0, delayBoost: 0 },
                { pitchMultiplier: 1.06, vibrato: 1, reverbBoost: 0.1, harmonicBoost: 1, delayBoost: 0.05 },
                { pitchMultiplier: 1.122, vibrato: 2, reverbBoost: 0.2, harmonicBoost: 2, delayBoost: 0.1 },
                { pitchMultiplier: 1.26, vibrato: 4, reverbBoost: 0.35, harmonicBoost: 3, delayBoost: 0.2 }
            ]
        }
    }
];

function getPlantById(id) {
    for (var i = 0; i < PLANT_TYPES.length; i++) {
        if (PLANT_TYPES[i].id === id) return PLANT_TYPES[i];
    }
    return null;
}
