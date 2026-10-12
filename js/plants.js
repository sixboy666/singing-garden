/* ============================================
   SINGING GARDEN - Premium Plant Definitions
   16 unique plants with detailed SVG art,
   gradients, glow filters and unique animClass
   ============================================ */

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

function _petals(count, cx, cy, rx, ry, radius, fill, opacity, rotation) {
    var out = '';
    for (var i = 0; i < count; i++) {
        var a = (i / count) * 360 + (rotation || 0);
        var rad = (a - 90) * Math.PI / 180;
        var x = cx + Math.cos(rad) * radius;
        var y = cy + Math.sin(rad) * radius;
        out += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) +
            '" rx="' + rx + '" ry="' + ry + '" fill="' + fill +
            '" transform="rotate(' + a.toFixed(1) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) +
            ')" opacity="' + (opacity || 0.9) + '"/>';
    }
    return out;
}

function _face(cx, cy, eyeR, smileW, smileH, eyeColor) {
    var ec = eyeColor || '#1a1a2e';
    return '<circle cx="' + (cx - smileW / 2) + '" cy="' + cy + '" r="' + eyeR + '" fill="' + ec + '"/>' +
        '<circle cx="' + (cx + smileW / 2) + '" cy="' + cy + '" r="' + eyeR + '" fill="' + ec + '"/>' +
        '<circle cx="' + (cx - smileW / 2 + 0.6) + '" cy="' + (cy - 0.6) + '" r="' + (eyeR * 0.4).toFixed(1) + '" fill="#fff" opacity="0.8"/>' +
        '<circle cx="' + (cx + smileW / 2 + 0.6) + '" cy="' + (cy - 0.6) + '" r="' + (eyeR * 0.4).toFixed(1) + '" fill="#fff" opacity="0.8"/>' +
        '<path d="M' + (cx - smileW / 2) + ' ' + (cy + smileH) +
        ' Q' + cx + ' ' + (cy + smileH * 2.2) + ' ' + (cx + smileW / 2) + ' ' + (cy + smileH) +
        '" stroke="' + ec + '" stroke-width="1.4" fill="none" stroke-linecap="round"/>';
}

function _sparkles(positions) {
    var s = '';
    for (var i = 0; i < positions.length; i++) {
        s += '<circle cx="' + positions[i][0] + '" cy="' + positions[i][1] +
            '" r="' + (positions[i][2] || 1.5) + '" fill="#fff" opacity="' + (positions[i][3] || 0.85) + '"/>';
    }
    return s;
}

/* ---- Plant SVG renderers (16 unique plants) ---- */

/* 1. Sunflare - Sunflower with rotating petals and golden glow */
function renderSunflare(wl) {
    var defs = _gradient('sun-petal', [[0,'#FFE066'],[100,'#FF9A1F']]) +
        _radial('sun-center', 50, 48, 60, [[0,'#7A3E1A'],[100,'#3A1F0A']]) +
        _radial('sun-glow', 50, 48, 50, [[0,'#FFD700',0.4],[100,'#FFD700',0]]) +
        _filterGlow('sun-glow-fx', 3, 1);
    var glowRing = wl >= 1 ? '<circle cx="50" cy="48" r="32" fill="url(#sun-glow)" filter="url(#sun-glow-fx)"/>' : '';
    var spark = wl >= 2 ? _sparkles([[22,30,2],[78,28,2],[28,68,1.5],[72,66,1.5],[50,18,2.5]]) : '';
    var leaf = '<path d="M50 115 Q30 108 22 92 Q26 88 36 96 Z" fill="#4a8c3e" stroke="#2e6b2e" stroke-width="0.5"/>' +
        '<path d="M50 118 Q70 110 78 96 Q74 90 64 100 Z" fill="#5a9c4e" stroke="#2e6b2e" stroke-width="0.5"/>';
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glowRing + spark +
        '<path d="M50 120 Q49 95 50 70" stroke="#3a7c2e" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        leaf +
        '<g class="petal-spin">' +
        _petals(14, 50, 48, 6.5, 15, 19, 'url(#sun-petal)', 0.95) +
        _petals(14, 50, 48, 4, 11, 13, '#FFC633', 0.7) +
        '</g>' +
        '<circle cx="50" cy="48" r="13" fill="url(#sun-center)"/>' +
        '<circle cx="46" cy="44" r="2" fill="#A8551A" opacity="0.5"/>' +
        '<circle cx="55" cy="49" r="1.5" fill="#A8551A" opacity="0.4"/>' +
        _face(50, 47, 1.8, 8, 3) +
        '</svg>';
}

/* 2. Toadstool - Red mushroom with bobby cap and white spots */
function renderToadstool(wl) {
    var defs = _radial('cap-r', 40, 30, 80, [[0,'#FF6B4A'],[70,'#E84830'],[100,'#A82010']]) +
        _radial('stem-r', 50, 30, 70, [[0,'#FFF5E0'],[100,'#D9C298']]) +
        _filterGlow('cap-glow', 4, 1);
    var glow = wl >= 1 ? '<ellipse cx="50" cy="55" rx="38" ry="28" fill="#FF6B4A" opacity="0.18" filter="url(#cap-glow)"/>' : '';
    var extraSpot = wl >= 2 ? '<circle cx="46" cy="62" r="3.5" fill="#fff"/><circle cx="55" cy="68" r="2.5" fill="#fff"/>' : '';
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow +
        '<path d="M40 120 Q40 92 43 76 L57 76 Q60 92 60 120 Z" fill="url(#stem-r)" stroke="#C9A878" stroke-width="0.8"/>' +
        '<path d="M16 72 Q14 38 50 30 Q86 38 84 72 Q84 80 50 80 Q16 80 16 72 Z" fill="url(#cap-r)" stroke="#A82010" stroke-width="1.5"/>' +
        '<path d="M22 68 Q20 50 35 40" fill="none" stroke="#FFB0A0" stroke-width="1.2" opacity="0.4"/>' +
        '<circle cx="32" cy="52" r="5.5" fill="#fff"/><circle cx="58" cy="46" r="6.5" fill="#fff"/>' +
        '<circle cx="68" cy="60" r="4" fill="#fff"/><circle cx="42" cy="66" r="3.5" fill="#fff"/>' +
        extraSpot +
        _face(50, 99, 2, 14, 4) +
        '<circle cx="36" cy="103" r="3" fill="#FFB6C1" opacity="0.6"/>' +
        '<circle cx="64" cy="103" r="3" fill="#FFB6C1" opacity="0.6"/>' +
        '</svg>';
}

/* 3. Bluebelle - Bell flowers that swing on stems */
function renderBluebelle(wl) {
    var defs = _gradient('bell-g', [[0,'#7AB5E8'],[100,'#3A7BC8']]) +
        _radial('bell-glow', 50, 50, 50, [[0,'#5B9BD5',0.25],[100,'#5B9BD5',0]]);
    var glow = wl >= 1 ? '<circle cx="50" cy="50" r="28" fill="url(#bell-glow)"/>' : '';
    function bell(tx, ty, s) {
        return '<g transform="translate(' + tx + ' ' + ty + ') scale(' + s + ')">' +
            '<path d="M-9 3 Q-12 -5 -10 -11 Q-6 -17 0 -17 Q6 -17 10 -11 Q12 -5 9 3 Q6 7 0 7 Q-6 7 -9 3 Z" fill="url(#bell-g)" stroke="#2A5BA8" stroke-width="1"/>' +
            '<line x1="-5" y1="3" x2="5" y2="3" stroke="#2A5BA8" stroke-width="0.8" opacity="0.5"/>' +
            '<ellipse cx="-3" cy="-7" rx="2" ry="3" fill="#A8D4F0" opacity="0.6"/>' +
            '</g>';
    }
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow +
        '<path d="M50 120 Q48 95 50 60" stroke="#3a7c2e" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="32" cy="95" rx="12" ry="5" fill="#5a9c4e" transform="rotate(-25 32 95)"/>' +
        '<ellipse cx="68" cy="88" rx="12" ry="5" fill="#5a9c4e" transform="rotate(25 68 88)"/>' +
        '<line x1="50" y1="60" x2="50" y2="42" stroke="#3a7c2e" stroke-width="1.5"/>' +
        '<line x1="50" y1="60" x2="34" y2="52" stroke="#3a7c2e" stroke-width="1.5"/>' +
        '<line x1="50" y1="60" x2="66" y2="52" stroke="#3a7c2e" stroke-width="1.5"/>' +
        '<g class="bell-swing-1">' + bell(50, 42, 1) + '</g>' +
        '<g class="bell-swing-2">' + bell(34, 52, 0.75) + '</g>' +
        '<g class="bell-swing-3">' + bell(66, 52, 0.75) + '</g>' +
        (wl >= 2 ? '<g class="bell-swing-4">' + bell(50, 28, 0.55) + '</g>' : '') +
        '</svg>';
}

/* 4. Prickle - Cactus with pulsing body and pink flower */
function renderPrickle(wl) {
    var defs = _gradient('cac-body', [[0,'#5BAE4E'],[100,'#3A7C2E']]) +
        _radial('cac-flower', 50, 50, 60, [[0,'#FFD1E8'],[100,'#FF6B9D']]);
    var flowerColor = wl >= 1 ? 'url(#cac-flower)' : '#FF8FB1';
    var glow = wl >= 2 ? '<circle cx="50" cy="55" r="22" fill="#4a8c3e" opacity="0.15"/>' : '';
    var spikes = '';
    var sp = [[38,72],[62,72],[40,82],[60,82],[38,92],[62,92],[42,100],[58,100],[30,78],[70,78],[28,86],[72,86]];
    for (var i = 0; i < sp.length; i++) {
        var sx = sp[i][0], sy = sp[i][1], dir = sx < 50 ? -1 : 1;
        spikes += '<line x1="' + sx + '" y1="' + sy + '" x2="' + (sx + dir * 4) + '" y2="' + sy +
            '" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity="0.85"/>';
    }
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow +
        '<path d="M35 112 L37 120 L63 120 L65 112 Z" fill="#8B6914" stroke="#6B4914" stroke-width="1"/>' +
        '<path d="M40 112 Q37 85 42 62 Q45 55 50 55 Q55 55 58 62 Q63 85 60 112 Z" fill="url(#cac-body)" stroke="#2e6b2e" stroke-width="1"/>' +
        '<path d="M40 88 Q30 82 27 72 Q26 66 30 63 Q36 61 39 69 Q41 78 43 84 Z" fill="url(#cac-body)" stroke="#2e6b2e" stroke-width="1"/>' +
        '<path d="M60 92 Q70 87 73 77 Q74 71 70 68 Q64 66 61 74 Q59 82 57 88 Z" fill="url(#cac-body)" stroke="#2e6b2e" stroke-width="1"/>' +
        spikes +
        '<g class="prickle-bloom">' +
        _petals(6, 50, 53, 3, 5, 5, flowerColor, 0.95) +
        '<circle cx="50" cy="53" r="3" fill="#FFD700"/>' +
        '</g>' +
        (wl >= 2 ? '<g class="prickle-bloom2">' + _petals(5, 44, 50, 2, 3, 3, flowerColor, 0.9) + '<circle cx="44" cy="50" r="1.8" fill="#FFD700"/></g>' +
        '<g class="prickle-bloom3">' + _petals(5, 56, 50, 2, 3, 3, flowerColor, 0.9) + '<circle cx="56" cy="50" r="1.8" fill="#FFD700"/></g>' : '') +
        _face(50, 86, 1.8, 10, 3) +
        '</svg>';
}

/* 5. Fernella - Fern with waving fronds */
function renderFernella(wl) {
    var defs = _gradient('fern-g', [[0,'#5CC18A'],[100,'#2e8b57']]) +
        _radial('fern-glow', 50, 70, 50, [[0,'#3a9c6e',0.18],[100,'#3a9c6e',0]]);
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
            '" stroke="url(#fern-g)" stroke-width="2.8" fill="none" stroke-linecap="round"/>';
        var lc = wl >= 2 ? 7 : 5;
        for (var j = 0; j < lc; j++) {
            var t = (j + 1) / (lc + 1);
            var lx = 50 + (endX - 50) * t;
            var ly = 110 + (endY - 110) * t;
            var perp = rad + Math.PI / 2;
            var ls = 6 * (1 - t * 0.4);
            var ox = Math.cos(perp) * 4;
            var oy = Math.sin(perp) * 4;
            fronds += '<ellipse cx="' + (lx + ox).toFixed(1) + '" cy="' + (ly + oy).toFixed(1) + '" rx="' + ls + '" ry="' + (ls * 0.4).toFixed(1) + '" fill="url(#fern-g)" transform="rotate(' + (angle + 90) + ' ' + (lx + ox).toFixed(1) + ' ' + (ly + oy).toFixed(1) + ')"/>' +
                '<ellipse cx="' + (lx - ox).toFixed(1) + '" cy="' + (ly - oy).toFixed(1) + '" rx="' + ls + '" ry="' + (ls * 0.4).toFixed(1) + '" fill="url(#fern-g)" transform="rotate(' + (angle + 90) + ' ' + (lx - ox).toFixed(1) + ' ' + (ly - oy).toFixed(1) + ')"/>';
        }
        fronds += '</g>';
    }
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow + '<path d="M48 120 L52 120 L52 110 L48 110 Z" fill="#6B4423"/>' + fronds + '</svg>';
}

/* 6. Lumi - Glowing mushroom with bioluminescent cap */
function renderLumi(wl) {
    var defs = _radial('lumi-cap', 50, 35, 80, [[0,'#A8F0FF'],[60,'#4FD8E8'],[100,'#1A8AA8']]) +
        _radial('lumi-glow', 50, 50, 50, [[0,'#7FE8F8',0.6],[100,'#7FE8F8',0]]) +
        _filterGlow('lumi-glow-fx', 6, 1);
    var glow = wl >= 1 ? '<circle cx="50" cy="50" r="34" fill="url(#lumi-glow)" filter="url(#lumi-glow-fx)"/>' : '';
    var spots = wl >= 2 ?
        '<circle cx="38" cy="55" r="2.5" fill="#E0FFFF"/><circle cx="62" cy="52" r="3" fill="#E0FFFF"/><circle cx="50" cy="65" r="2" fill="#E0FFFF"/>' : '';
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow +
        '<path d="M42 120 Q42 95 45 80 L55 80 Q58 95 58 120 Z" fill="#F0F8FF" stroke="#C0D8E8" stroke-width="0.8"/>' +
        '<path d="M18 76 Q16 40 50 32 Q84 40 82 76 Q82 82 50 82 Q18 82 18 76 Z" fill="url(#lumi-cap)" stroke="#0A6A88" stroke-width="1.2"/>' +
        '<path d="M22 70 Q20 50 35 42" fill="none" stroke="#B0E8F8" stroke-width="1.2" opacity="0.6"/>' +
        spots +
        '<ellipse cx="42" cy="76" rx="6" ry="2.5" fill="#A8F0FF" opacity="0.7"/>' +
        '<ellipse cx="58" cy="76" rx="6" ry="2.5" fill="#A8F0FF" opacity="0.7"/>' +
        _face(50, 100, 1.8, 12, 4) +
        '</svg>';
}

/* 7. Crysto - Crystal plant with faceted shards */
function renderCrysto(wl) {
    var defs = _gradient('crys-shard', [[0,'#E0B0FF'],[100,'#9060D8']]) +
        _radial('crys-glow', 50, 50, 60, [[0,'#C080FF',0.5],[100,'#C080FF',0]]) +
        _filterGlow('crys-fx', 5, 1);
    var glow = wl >= 1 ? '<circle cx="50" cy="60" r="30" fill="url(#crys-glow)" filter="url(#crys-fx)"/>' : '';
    var extraShard = wl >= 2 ? '<polygon points="50,30 46,40 50,52 54,40" fill="url(#crys-shard)" stroke="#7A40C8" stroke-width="0.6"/>' : '';
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow +
        '<path d="M44 120 L40 105 L36 88 L40 75 L50 70 L60 75 L64 88 L60 105 L56 120 Z" fill="#5A3A8E" opacity="0.3"/>' +
        '<g class="crys-cluster">' +
        '<polygon points="50,35 40,60 50,90 60,60" fill="url(#crys-shard)" stroke="#7A40C8" stroke-width="0.8"/>' +
        '<polygon points="50,40 44,60 50,80 56,60" fill="#F0D0FF" opacity="0.5"/>' +
        '<polygon points="35,55 30,75 38,90 42,75" fill="url(#crys-shard)" stroke="#7A40C8" stroke-width="0.8" opacity="0.85"/>' +
        '<polygon points="65,55 70,75 62,90 58,75" fill="url(#crys-shard)" stroke="#7A40C8" stroke-width="0.8" opacity="0.85"/>' +
        '</g>' +
        extraShard +
        _sparkles([[45,50,1.5],[55,68,1.5],[50,75,1.2]]) +
        '</svg>';
}

/* 8. Pip - Pod plant with bouncing peapods */
function renderPip(wl) {
    var defs = _gradient('pip-pod', [[0,'#A8E060'],[100,'#5A8C2E']]) +
        _radial('pip-glow', 50, 50, 50, [[0,'#A8E060',0.2],[100,'#A8E060',0]]);
    var glow = wl >= 1 ? '<circle cx="50" cy="60" r="28" fill="url(#pip-glow)"/>' : '';
    function pod(tx, ty, s, rot) {
        return '<g transform="translate(' + tx + ' ' + ty + ') rotate(' + rot + ') scale(' + s + ')">' +
            '<path d="M0 0 Q-8 -5 -10 -18 Q-8 -30 0 -32 Q8 -30 10 -18 Q8 -5 0 0 Z" fill="url(#pip-pod)" stroke="#3A6B1E" stroke-width="0.8"/>' +
            '<circle cx="-3" cy="-12" r="3.5" fill="#5A8C2E"/><circle cx="3" cy="-12" r="3.5" fill="#5A8C2E"/>' +
            '<circle cx="-2" cy="-22" r="3" fill="#5A8C2E"/><circle cx="2" cy="-22" r="3" fill="#5A8C2E"/>' +
            '</g>';
    }
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow +
        '<path d="M50 120 Q49 100 50 80" stroke="#5A8C2E" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="32" cy="100" rx="11" ry="5" fill="#6A9C3E" transform="rotate(-25 32 100)"/>' +
        '<ellipse cx="68" cy="100" rx="11" ry="5" fill="#6A9C3E" transform="rotate(25 68 100)"/>' +
        '<g class="pip-bounce-1">' + pod(35, 80, 1.1, -20) + '</g>' +
        '<g class="pip-bounce-2">' + pod(65, 80, 1.1, 20) + '</g>' +
        '<g class="pip-bounce-3">' + pod(50, 65, 1.3, 0) + '</g>' +
        (wl >= 2 ? '<g class="pip-bounce-4">' + pod(45, 50, 0.9, -15) + '</g>' +
        '<g class="pip-bounce-5">' + pod(55, 50, 0.9, 15) + '</g>' : '') +
        '</svg>';
}

/* 9. Bublo - Bubble plant with floating bubbles */
function renderBublo(wl) {
    var defs = _radial('bub-r', 35, 35, 65, [[0,'#FFFFFF',0.9],[60,'#FFB3E8',0.5],[100,'#FF6BD8',0.2]]) +
        _filterGlow('bub-fx', 2, 1);
    var glow = wl >= 1 ? '<circle cx="50" cy="60" r="28" fill="#FFB3E8" opacity="0.18"/>' : '';
    function bubble(cx, cy, r) {
        return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="url(#bub-r)" stroke="#FF80D8" stroke-width="0.6" opacity="0.85" filter="url(#bub-fx)"/>' +
            '<circle cx="' + (cx - r * 0.3) + '" cy="' + (cy - r * 0.3) + '" r="' + (r * 0.25).toFixed(1) + '" fill="#fff" opacity="0.85"/>';
    }
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow +
        '<path d="M40 120 Q40 100 43 85 L57 85 Q60 100 60 120 Z" fill="#A8E060" stroke="#5A8C2E" stroke-width="0.8"/>' +
        '<ellipse cx="32" cy="100" rx="9" ry="4" fill="#6A9C3E" transform="rotate(-25 32 100)"/>' +
        '<ellipse cx="68" cy="100" rx="9" ry="4" fill="#6A9C3E" transform="rotate(25 68 100)"/>' +
        '<g class="bub-float-1">' + bubble(50, 70, 9) + '</g>' +
        '<g class="bub-float-2">' + bubble(35, 80, 6) + '</g>' +
        '<g class="bub-float-3">' + bubble(65, 80, 6) + '</g>' +
        (wl >= 2 ? '<g class="bub-float-4">' + bubble(50, 50, 7) + '</g>' +
        '<g class="bub-float-5">' + bubble(40, 60, 4) + '</g>' +
        '<g class="bub-float-6">' + bubble(60, 60, 4) + '</g>' : '') +
        '</svg>';
}

/* 10. Drago - Dragon mouth flower with snap-jaw */
function renderDrago(wl) {
    var defs = _gradient('drago-jaw', [[0,'#FF8E4A'],[100,'#D04020']]) +
        _radial('drago-glow', 50, 50, 50, [[0,'#FF8E4A',0.3],[100,'#FF8E4A',0]]) +
        _filterGlow('drago-fx', 4, 1);
    var glow = wl >= 1 ? '<circle cx="50" cy="55" r="28" fill="url(#drago-glow)" filter="url(#drago-fx)"/>' : '';
    var tongue = wl >= 2 ? '<path d="M50 65 Q48 70 50 75 Q52 70 50 65 Z" fill="#FFD0E0"/>' : '';
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow +
        '<path d="M50 120 Q49 95 50 75" stroke="#3a7c2e" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="32" cy="98" rx="11" ry="5" fill="#5a9c4e" transform="rotate(-25 32 98)"/>' +
        '<ellipse cx="68" cy="98" rx="11" ry="5" fill="#5a9c4e" transform="rotate(25 68 98)"/>' +
        '<g class="drago-mouth">' +
        '<path d="M22 60 Q22 50 50 48 Q78 50 78 60 Q78 68 50 68 Q22 68 22 60 Z" fill="url(#drago-jaw)" stroke="#A03010" stroke-width="1.2"/>' +
        '<path d="M22 60 Q22 70 50 72 Q78 70 78 60" fill="url(#drago-jaw)" stroke="#A03010" stroke-width="1.2"/>' +
        '<polygon points="30,52 33,60 36,52" fill="#fff"/><polygon points="40,52 43,60 46,52" fill="#fff"/><polygon points="54,52 57,60 60,52" fill="#fff"/><polygon points="64,52 67,60 70,52" fill="#fff"/>' +
        '<polygon points="30,68 33,60 36,68" fill="#fff"/><polygon points="64,68 67,60 70,68" fill="#fff"/>' +
        tongue +
        '</g>' +
        _sparkles([[28,55,1],[72,55,1],[50,42,1.5]]) +
        '</svg>';
}

/* 11. Flama - Torch lily with flame-like petals */
function renderFlama(wl) {
    var defs = _gradient('flama-petal', [[0,'#FFE066'],[60,'#FF8E20'],[100,'#FF2010']]) +
        _radial('flama-glow', 50, 50, 60, [[0,'#FF8E20',0.4],[100,'#FF8E20',0]]) +
        _filterGlow('flama-fx', 5, 1);
    var glow = wl >= 1 ? '<circle cx="50" cy="50" r="32" fill="url(#flama-glow)" filter="url(#flama-fx)"/>' : '';
    function flame(cx, cy, h, w) {
        return '<path d="M' + cx + ' ' + (cy - h) + ' Q' + (cx - w) + ' ' + (cy - h * 0.5) + ' ' + cx + ' ' + cy +
            ' Q' + (cx + w) + ' ' + (cy - h * 0.5) + ' ' + cx + ' ' + (cy - h) + ' Z" fill="url(#flama-petal)" stroke="#C04010" stroke-width="0.5"/>';
    }
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow +
        '<path d="M50 120 Q49 95 50 70" stroke="#3a7c2e" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="32" cy="98" rx="11" ry="5" fill="#5a9c4e" transform="rotate(-25 32 98)"/>' +
        '<ellipse cx="68" cy="98" rx="11" ry="5" fill="#5a9c4e" transform="rotate(25 68 98)"/>' +
        '<g class="flama-flicker">' +
        flame(50, 75, 35, 10) +
        flame(40, 75, 28, 8) +
        flame(60, 75, 28, 8) +
        flame(35, 75, 20, 6) +
        flame(65, 75, 20, 6) +
        (wl >= 2 ? flame(50, 75, 45, 12) : '') +
        '</g>' +
        _sparkles([[48,40,1.5],[52,40,1.5],[50,30,2]]) +
        '</svg>';
}

/* 12. Shimmer - Disco ball flower with rotating sparkles */
function renderShimmer(wl) {
    var defs = _radial('shim-ball', 35, 30, 80, [[0,'#FFFFFF'],[50,'#C0C8FF'],[100,'#5060A0']]) +
        _radial('shim-glow', 50, 50, 60, [[0,'#A0B0FF',0.5],[100,'#A0B0FF',0]]) +
        _filterGlow('shim-fx', 6, 1);
    var glow = wl >= 1 ? '<circle cx="50" cy="55" r="32" fill="url(#shim-glow)" filter="url(#shim-fx)"/>' : '';
    var tilePattern = '';
    for (var r = 0; r < 5; r++) {
        for (var c = 0; c < 6; c++) {
            var cx = 32 + c * 7;
            var cy = 38 + r * 7;
            if (cx > 68 || cy > 75) continue;
            tilePattern += '<rect x="' + (cx - 2) + '" y="' + (cy - 2) + '" width="4" height="4" fill="' + ((r+c)%2 ? '#FFFFFF' : '#A0B0FF') + '" opacity="0.5"/>';
        }
    }
    var rays = wl >= 2 ?
        '<g class="shim-rays"><line x1="50" y1="55" x2="20" y2="20" stroke="#FFD700" stroke-width="1.5" opacity="0.6"/>' +
        '<line x1="50" y1="55" x2="80" y2="20" stroke="#FFD700" stroke-width="1.5" opacity="0.6"/>' +
        '<line x1="50" y1="55" x2="15" y2="55" stroke="#FFD700" stroke-width="1.5" opacity="0.6"/>' +
        '<line x1="50" y1="55" x2="85" y2="55" stroke="#FFD700" stroke-width="1.5" opacity="0.6"/>' +
        '<line x1="50" y1="55" x2="20" y2="90" stroke="#FFD700" stroke-width="1.5" opacity="0.6"/>' +
        '<line x1="50" y1="55" x2="80" y2="90" stroke="#FFD700" stroke-width="1.5" opacity="0.6"/></g>' : '';
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow + rays +
        '<path d="M50 120 Q49 100 50 85" stroke="#3a7c2e" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="32" cy="100" rx="9" ry="4" fill="#5a9c4e" transform="rotate(-25 32 100)"/>' +
        '<ellipse cx="68" cy="100" rx="9" ry="4" fill="#5a9c4e" transform="rotate(25 68 100)"/>' +
        '<g class="shim-spin">' +
        '<circle cx="50" cy="55" r="22" fill="url(#shim-ball)" stroke="#5060A0" stroke-width="0.8"/>' +
        tilePattern +
        '</g>' +
        _sparkles([[28,40,1.5],[72,42,1.5],[28,68,1.2],[72,66,1.2]]) +
        '</svg>';
}

/* 13. Puffer - Puffball that pulses and emits spores */
function renderPuffer(wl) {
    var defs = _radial('puff-r', 40, 35, 80, [[0,'#FFFFFF'],[60,'#F0E8D0'],[100,'#B09870']]) +
        _radial('puff-glow', 50, 50, 60, [[0,'#FFFFFF',0.4],[100,'#FFFFFF',0]]) +
        _filterGlow('puff-fx', 4, 1);
    var glow = wl >= 1 ? '<circle cx="50" cy="55" r="30" fill="url(#puff-glow)" filter="url(#puff-fx)"/>' : '';
    var spores = wl >= 2 ?
        '<g class="puffer-spores">' +
        '<circle cx="22" cy="40" r="2" fill="#fff" opacity="0.8"/>' +
        '<circle cx="78" cy="42" r="2" fill="#fff" opacity="0.8"/>' +
        '<circle cx="25" cy="68" r="1.8" fill="#fff" opacity="0.8"/>' +
        '<circle cx="75" cy="70" r="1.8" fill="#fff" opacity="0.8"/>' +
        '<circle cx="50" cy="22" r="2.2" fill="#fff" opacity="0.8"/>' +
        '</g>' : '';
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow + spores +
        '<path d="M45 120 L43 105 L57 105 L55 120 Z" fill="#6B4423"/>' +
        '<g class="puffer-pulse">' +
        '<circle cx="50" cy="55" r="26" fill="url(#puff-r)" stroke="#8A7050" stroke-width="0.8"/>' +
        '<circle cx="42" cy="48" r="4" fill="#B09870" opacity="0.4"/>' +
        '<circle cx="58" cy="52" r="3" fill="#B09870" opacity="0.4"/>' +
        '<circle cx="50" cy="62" r="3.5" fill="#B09870" opacity="0.4"/>' +
        _face(50, 56, 2, 10, 3) +
        '</g>' +
        '</svg>';
}

/* 14. Vinio - Grape vine with dropping clusters */
function renderVinio(wl) {
    var defs = _radial('vinio-grape', 35, 30, 70, [[0,'#A06BD8'],[100,'#5028A0']]) +
        _radial('vinio-glow', 50, 50, 50, [[0,'#8050C8',0.2],[100,'#8050C8',0]]) +
        _gradient('vinio-leaf', [[0,'#7AC04E'],[100,'#3A7C2E']]);
    var glow = wl >= 1 ? '<circle cx="50" cy="60" r="28" fill="url(#vinio-glow)"/>' : '';
    function cluster(cx, cy, count) {
        var s = '<g transform="translate(' + cx + ' ' + cy + ')">';
        for (var i = 0; i < count; i++) {
            var px = (Math.random() - 0.5) * 12;
            var py = i * 5;
            s += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="4" fill="url(#vinio-grape)" stroke="#402080" stroke-width="0.5"/>' +
                '<circle cx="' + (px - 1).toFixed(1) + '" cy="' + (py - 1).toFixed(1) + '" r="1.5" fill="#D0B0FF" opacity="0.6"/>';
        }
        return s + '</g>';
    }
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow +
        '<path d="M50 120 Q48 100 50 80" stroke="#5A8C2E" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<path d="M50 80 Q35 70 30 50" stroke="#5A8C2E" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '<path d="M50 80 Q65 70 70 50" stroke="#5A8C2E" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '<path d="M50 80 Q50 60 50 40" stroke="#5A8C2E" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="30" cy="48" rx="9" ry="5" fill="url(#vinio-leaf)" transform="rotate(-30 30 48)"/>' +
        '<ellipse cx="70" cy="48" rx="9" ry="5" fill="url(#vinio-leaf)" transform="rotate(30 70 48)"/>' +
        '<ellipse cx="50" cy="40" rx="10" ry="5" fill="url(#vinio-leaf)"/>' +
        '<g class="vinio-drop-1">' + cluster(30, 55, 5) + '</g>' +
        '<g class="vinio-drop-2">' + cluster(70, 55, 5) + '</g>' +
        (wl >= 2 ? '<g class="vinio-drop-3">' + cluster(50, 50, 6) + '</g>' : '') +
        '</svg>';
}

/* 15. Echo - Resonating crystal bloom with sound waves */
function renderEcho(wl) {
    var defs = _gradient('echo-petal', [[0,'#FFB0E8'],[100,'#8030A0']]) +
        _radial('echo-glow', 50, 50, 60, [[0,'#E060C0',0.4],[100,'#E060C0',0]]) +
        _filterGlow('echo-fx', 5, 1);
    var glow = wl >= 1 ? '<circle cx="50" cy="55" r="30" fill="url(#echo-glow)" filter="url(#echo-fx)"/>' : '';
    var waves = wl >= 2 ?
        '<g class="echo-waves">' +
        '<circle cx="50" cy="55" r="32" fill="none" stroke="#E060C0" stroke-width="1" opacity="0.4"/>' +
        '<circle cx="50" cy="55" r="38" fill="none" stroke="#E060C0" stroke-width="0.8" opacity="0.3"/>' +
        '</g>' : '';
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow + waves +
        '<path d="M50 120 Q49 95 50 75" stroke="#3a7c2e" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="32" cy="98" rx="11" ry="5" fill="#5a9c4e" transform="rotate(-25 32 98)"/>' +
        '<ellipse cx="68" cy="98" rx="11" ry="5" fill="#5a9c4e" transform="rotate(25 68 98)"/>' +
        '<g class="echo-bloom">' +
        _petals(8, 50, 55, 5, 12, 16, 'url(#echo-petal)', 0.92) +
        _petals(8, 50, 55, 3.5, 9, 11, '#C040A0', 0.7) +
        '<circle cx="50" cy="55" r="9" fill="#FFD700"/>' +
        '<circle cx="50" cy="55" r="6" fill="#FFA000"/>' +
        '<circle cx="50" cy="55" r="3" fill="#FF6000"/>' +
        '</g>' +
        _sparkles([[28,40,1.5],[72,40,1.5],[50,30,2]]) +
        '</svg>';
}

/* 16. Twinkle - Star flower with twinkling petals */
function renderTwinkle(wl) {
    var defs = _gradient('twink-star', [[0,'#FFE890'],[100,'#FFC000']]) +
        _radial('twink-glow', 50, 50, 60, [[0,'#FFD700',0.5],[100,'#FFD700',0]]) +
        _filterGlow('twink-fx', 6, 1);
    var glow = wl >= 1 ? '<circle cx="50" cy="55" r="32" fill="url(#twink-glow)" filter="url(#twink-fx)"/>' : '';
    function star(cx, cy, r, rot) {
        var pts = '';
        for (var i = 0; i < 10; i++) {
            var a = (i * 36 - 90 + (rot || 0)) * Math.PI / 180;
            var rr = i % 2 === 0 ? r : r * 0.4;
            pts += (cx + Math.cos(a) * rr).toFixed(1) + ',' + (cy + Math.sin(a) * rr).toFixed(1) + ' ';
        }
        return '<polygon points="' + pts + '" fill="url(#twink-star)" stroke="#C08000" stroke-width="0.8"/>';
    }
    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>' +
        glow +
        '<path d="M50 120 Q49 95 50 75" stroke="#3a7c2e" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="32" cy="98" rx="11" ry="5" fill="#5a9c4e" transform="rotate(-25 32 98)"/>' +
        '<ellipse cx="68" cy="98" rx="11" ry="5" fill="#5a9c4e" transform="rotate(25 68 98)"/>' +
        '<g class="twink-spin-1">' + star(50, 55, 20, 0) + '</g>' +
        '<g class="twink-spin-2">' + star(50, 55, 13, 18) + '</g>' +
        '<circle cx="50" cy="55" r="6" fill="#FF6000"/>' +
        '<circle cx="50" cy="55" r="3" fill="#FFFFFF"/>' +
        (wl >= 2 ?
        '<g class="twink-orbit">' +
        star(30, 35, 5, 0) + star(70, 35, 5, 30) + star(70, 75, 5, 60) + star(30, 75, 5, 90) +
        '</g>' : '') +
        _sparkles([[28,40,1.2],[72,40,1.2],[28,70,1.2],[72,70,1.2]]) +
        '</svg>';
}

/* ---- Plant type registry ---- */

var PLANT_TYPES = [
    {
        id: 'sunflare', name: 'Sunflare', emoji: '\u2600\uFE0F', animClass: 'anim-sunflare',
        colors: { primary: '#FFD700', secondary: '#FFA500' },
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
        colors: { primary: '#E84830', secondary: '#F5E6C8' },
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
        colors: { primary: '#5B9BD5', secondary: '#3A7BC8' },
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
        colors: { primary: '#4a8c3e', secondary: '#FF6B9D' },
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
        colors: { primary: '#2e8b57', secondary: '#5CC18A' },
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
        colors: { primary: '#4FD8E8', secondary: '#A8F0FF' },
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
        colors: { primary: '#9060D8', secondary: '#E0B0FF' },
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
        colors: { primary: '#5A8C2E', secondary: '#A8E060' },
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
        colors: { primary: '#FF6BD8', secondary: '#FFB3E8' },
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
        colors: { primary: '#FF8E4A', secondary: '#D04020' },
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
        colors: { primary: '#FF8E20', secondary: '#FF2010' },
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
        colors: { primary: '#C0C8FF', secondary: '#FFD700' },
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
        colors: { primary: '#F0E8D0', secondary: '#B09870' },
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
        colors: { primary: '#8050C8', secondary: '#5028A0' },
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
        colors: { primary: '#8030A0', secondary: '#FFB0E8' },
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
        colors: { primary: '#FFD700', secondary: '#FFC000' },
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
