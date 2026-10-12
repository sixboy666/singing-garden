/* ============================================
   SINGING GARDEN - Plant Definitions
   12 unique plant types with SVG art + audio config
   Each plant has a unique animation class
   ============================================ */

/* ---- SVG rendering helpers ---- */

function _makePetals(count, cx, cy, petalRx, petalRy, radius, color, opacity) {
    var petals = '';
    for (var i = 0; i < count; i++) {
        var angle = (i / count) * 360;
        var rad = (angle - 90) * Math.PI / 180;
        var x = cx + Math.cos(rad) * radius;
        var y = cy + Math.sin(rad) * radius;
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

function _sparkles(positions) {
    var s = '';
    for (var i = 0; i < positions.length; i++) {
        s += '<circle cx="' + positions[i][0] + '" cy="' + positions[i][1] +
            '" r="' + (positions[i][2] || 1.5) + '" fill="#fff" opacity="' + (positions[i][3] || 0.8) + '"/>';
    }
    return s;
}

/* ---- Plant SVG renderers ---- */

/* 1. Sunflare - Sunflower with swaying petals */
function renderSunflare(waterLevel) {
    var petalColor = waterLevel >= 2 ? '#FFEC8B' : '#FFD700';
    var petalColor2 = waterLevel >= 1 ? '#FFC633' : '#FFA500';
    var glow = waterLevel >= 1 ? '<circle cx="50" cy="48" r="28" fill="#FFD700" opacity="0.15"/>' : '';
    var sparkle = waterLevel >= 2 ?
        _sparkles([[25,35],[75,30],[30,60],[72,58]]) : '';

    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg">' +
        glow +
        '<path d="M50 120 Q48 90 50 65" stroke="#4a7c2e" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="34" cy="95" rx="11" ry="5" fill="#5a9c3e" transform="rotate(-25 34 95)"/>' +
        '<ellipse cx="66" cy="88" rx="11" ry="5" fill="#5a9c3e" transform="rotate(25 66 88)"/>' +
        _makePetals(12, 50, 48, 6, 14, 18, petalColor, 0.92) +
        _makePetals(12, 50, 48, 4, 10, 12, petalColor2, 0.7) +
        '<circle cx="50" cy="48" r="11" fill="#8B5E3C"/>' +
        '<circle cx="50" cy="48" r="8" fill="#6B4423"/>' +
        '<circle cx="50" cy="48" r="4" fill="#5A3618" opacity="0.5"/>' +
        _face(50, 46, 1.8, 8, 3) +
        sparkle +
        '</svg>';
}

/* 2. Toadstool - Red mushroom with bobby cap */
function renderToadstool(waterLevel) {
    var capColor = '#E84830';
    var capDark = '#C03820';
    var stemColor = '#F5E6C8';
    var glow = waterLevel >= 1 ? '<ellipse cx="50" cy="50" rx="35" ry="25" fill="#FF6B6B" opacity="0.1"/>' : '';
    var extraSpot = waterLevel >= 2 ? '<circle cx="48" cy="63" r="3" fill="#fff"/>' : '';

    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg">' +
        glow +
        '<path d="M40 120 Q40 95 42 78 L58 78 Q60 95 60 120 Z" fill="' + stemColor + '" stroke="#E0D0A8" stroke-width="1"/>' +
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

/* 3. Bluebelle - Bell flowers that swing */
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

/* 4. Prickle - Cactus with pulsing body */
function renderPrickle(waterLevel) {
    var bodyColor = '#4a8c3e';
    var bodyDark = '#3a7c2e';
    var flowerColor = waterLevel >= 1 ? '#FF6B9D' : '#FF8FB1';
    var glow = waterLevel >= 2 ? '<circle cx="50" cy="55" r="20" fill="#4a8c3e" opacity="0.1"/>' : '';

    var spikes = '';
    var spikePositions = [
        [38,72],[62,72],[40,82],[60,82],[38,92],[62,92],[42,100],[58,100],
        [30,78],[70,78],[28,85],[72,85]
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

/* 5. Fernella - Fern with wave unfurl */
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

/* 6. Lumipetal - Glowing flower with float + glow pulse */
function renderLumipetal(waterLevel) {
    var petalColor = '#9B59B6';
    var petalColor2 = '#B47AC9';
    var centerColor = '#FFD700';
    var glowR = 20 + waterLevel * 5;
    var sparkle = waterLevel >= 1 ?
        _sparkles([[28,38],[72,35],[75,55],[25,58]]) : '';

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

/* 7. Snapdragon - Dragon-head flower with jaw snap */
function renderSnapdragon(waterLevel) {
    var bodyColor = waterLevel >= 2 ? '#FF6B6B' : '#E84830';
    var lipColor = '#FFB6C1';
    var darkColor = '#C03820';
    var fangColor = '#FFF';
    var glow = waterLevel >= 1 ? '<circle cx="50" cy="55" r="22" fill="#FF6B6B" opacity="0.1"/>' : '';
    var extraTeeth = waterLevel >= 2 ? '<path d="M40 78 L42 82 M44 78 L46 82 M54 78 L56 82 M58 78 L60 82" stroke="' + fangColor + '" stroke-width="1" stroke-linecap="round"/>' : '';

    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg">' +
        glow +
        '<path d="M50 120 Q48 100 50 80" stroke="#4a7c2e" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="35" cy="105" rx="9" ry="4" fill="#5a9c3e" transform="rotate(-20 35 105)"/>' +
        '<ellipse cx="65" cy="100" rx="9" ry="4" fill="#5a9c3e" transform="rotate(20 65 100)"/>' +
        '<path d="M30 80 Q25 55 30 40 Q35 25 50 22 Q65 25 70 40 Q75 55 70 80 Q68 82 50 82 Q32 82 30 80 Z" fill="' + bodyColor + '" stroke="' + darkColor + '" stroke-width="1.5"/>' +
        '<path d="M35 75 Q32 60 38 48 Q42 40 50 38 Q58 40 62 48 Q68 60 65 75 Q63 78 50 78 Q37 78 35 75 Z" fill="' + lipColor + '" opacity="0.6"/>' +
        '<path d="M42 70 L42 76 L46 76 L46 70 L50 76 L54 70 L54 76 L58 76 L58 70" fill="none" stroke="' + darkColor + '" stroke-width="1" stroke-linecap="round"/>' +
        '<path d="M43 78 L45 82 L47 78 M53 78 L55 82 L57 78" stroke="' + fangColor + '" stroke-width="1.2" stroke-linecap="round" fill="none"/>' +
        extraTeeth +
        '<circle cx="38" cy="45" r="2.5" fill="#fff"/>' +
        '<circle cx="38" cy="45" r="1.2" fill="#1a1a1a"/>' +
        '<circle cx="62" cy="45" r="2.5" fill="#fff"/>' +
        '<circle cx="62" cy="45" r="1.2" fill="#1a1a1a"/>' +
        '<path d="M43 55 Q40 60 43 65" fill="none" stroke="#FF8888" stroke-width="1.5" stroke-linecap="round"/>' +
        '<path d="M57 55 Q60 60 57 65" fill="none" stroke="#FF8888" stroke-width="1.5" stroke-linecap="round"/>' +
        (waterLevel >= 2 ? _sparkles([[25,50],[75,50],[20,65]]) : '') +
        '</svg>';
}

/* 8. Bubblebloom - Plant with floating bubble orbs */
function renderBubblebloom(waterLevel) {
    var stemColor = '#4a8c2e';
    var bubbleColor = waterLevel >= 2 ? '#81D4FA' : '#4FC3F7';
    var bubbleDark = '#29B6F6';
    var glow = waterLevel >= 1 ? '<circle cx="50" cy="50" r="25" fill="#4FC3F7" opacity="0.08"/>' : '';
    var extraBubbles = waterLevel >= 2 ?
        '<circle cx="25" cy="35" r="5" fill="' + bubbleColor + '" opacity="0.7" stroke="' + bubbleDark + '" stroke-width="0.8"/>' +
        '<circle cx="75" cy="40" r="4" fill="' + bubbleColor + '" opacity="0.7" stroke="' + bubbleDark + '" stroke-width="0.8"/>' : '';

    var bubbles = '';
    var bubbleData = [[50,40,9],[38,55,6],[62,52,7],[50,62,5]];
    for (var i = 0; i < bubbleData.length; i++) {
        var bx = bubbleData[i][0], by = bubbleData[i][1], br = bubbleData[i][2];
        bubbles += '<circle cx="' + bx + '" cy="' + by + '" r="' + br + '" fill="' + bubbleColor + '" opacity="0.75" stroke="' + bubbleDark + '" stroke-width="1"/>' +
            '<circle cx="' + (bx - br * 0.3) + '" cy="' + (by - br * 0.3) + '" r="' + (br * 0.3) + '" fill="#fff" opacity="0.6"/>';
    }

    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg">' +
        glow +
        '<path d="M50 120 Q48 100 50 70" stroke="' + stemColor + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="35" cy="108" rx="8" ry="4" fill="#5a9c3e" transform="rotate(-20 35 108)"/>' +
        '<ellipse cx="65" cy="105" rx="8" ry="4" fill="#5a9c3e" transform="rotate(20 65 105)"/>' +
        '<path d="M50 70 Q40 65 35 55" stroke="' + stemColor + '" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '<path d="M50 70 Q60 65 65 55" stroke="' + stemColor + '" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        bubbles +
        extraBubbles +
        '<circle cx="50" cy="40" r="1.5" fill="#fff" opacity="0.8"/>' +
        '</svg>';
}

/* 9. Chimesprout - Wind chime with hanging bars */
function renderChimesprout(waterLevel) {
    var barColors = ['#FFD700', '#FF8C42', '#66BB6A', '#42A5F5'];
    var barDark = ['#D4A300', '#E67333', '#4CAF50', '#1E88E5'];
    var glow = waterLevel >= 1 ? '<circle cx="50" cy="55" r="22" fill="#FFD700" opacity="0.08"/>' : '';
    var extraBar = waterLevel >= 2 ?
        '<line x1="50" y1="45" x2="50" y2="68" stroke="#888" stroke-width="0.8"/>' +
        '<rect x="46" y="65" width="8" height="12" rx="2" fill="' + barColors[3] + '" stroke="' + barDark[3] + '" stroke-width="0.8"/>' : '';

    var bars = '';
    var barData = [[35,55,8,16,0],[50,50,8,18,1],[65,55,8,16,2]];
    for (var i = 0; i < barData.length; i++) {
        var bx = barData[i][0], by = barData[i][1], bw = barData[i][2], bh = barData[i][3], ci = barData[i][4];
        bars += '<line x1="50" y1="42" x2="' + bx + '" y2="' + by + '" stroke="#888" stroke-width="0.8"/>' +
            '<rect x="' + (bx - bw/2) + '" y="' + by + '" width="' + bw + '" height="' + bh + '" rx="2" fill="' + barColors[ci] + '" stroke="' + barDark[ci] + '" stroke-width="0.8"/>' +
            '<circle cx="' + bx + '" cy="' + (by + bh + 2) + '" r="1.5" fill="' + barDark[ci] + '"/>';
    }

    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg">' +
        glow +
        '<path d="M50 120 Q48 110 50 90" stroke="#4a7c2e" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="38" cy="112" rx="7" ry="3" fill="#5a9c3e" transform="rotate(-20 38 112)"/>' +
        '<ellipse cx="62" cy="110" rx="7" ry="3" fill="#5a9c3e" transform="rotate(20 62 110)"/>' +
        '<path d="M35 90 Q30 75 35 45 L65 45 Q70 75 65 90 Z" fill="#8D6E63" stroke="#6D4C41" stroke-width="1.2"/>' +
        '<circle cx="50" cy="42" r="6" fill="#A1887F" stroke="#6D4C41" stroke-width="1"/>' +
        '<circle cx="50" cy="42" r="3" fill="#6D4C41"/>' +
        bars +
        extraBar +
        '</svg>';
}

/* 10. Dancylily - Dancing lily with flowing petals */
function renderDancylily(waterLevel) {
    var petalColor = waterLevel >= 2 ? '#FF8FAB' : '#FF6B9D';
    var petalColor2 = '#FFC0CB';
    var centerColor = '#FFD700';
    var stemColor = '#4a8c2e';
    var glow = waterLevel >= 1 ? '<circle cx="50" cy="45" r="22" fill="#FF6B9D" opacity="0.1"/>' : '';

    var petals = '';
    var petalShapes = [
        'M50 30 Q35 20 30 35 Q28 50 40 48 Q48 46 50 35 Z',
        'M50 30 Q65 20 70 35 Q72 50 60 48 Q52 46 50 35 Z',
        'M50 30 Q40 15 45 10 Q55 10 55 25 Q53 32 50 30 Z',
        'M50 50 Q30 50 25 60 Q30 68 42 62 Q48 58 50 52 Z',
        'M50 50 Q70 50 75 60 Q70 68 58 62 Q52 58 50 52 Z'
    ];
    for (var i = 0; i < petalShapes.length; i++) {
        petals += '<path d="' + petalShapes[i] + '" fill="' + petalColor + '" stroke="' + petalColor2 + '" stroke-width="0.8" opacity="0.9"/>';
    }

    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg">' +
        glow +
        '<path d="M50 120 Q48 80 50 45" stroke="' + stemColor + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="35" cy="95" rx="10" ry="4" fill="#5a9c3e" transform="rotate(-20 35 95)"/>' +
        '<ellipse cx="65" cy="90" rx="10" ry="4" fill="#5a9c3e" transform="rotate(20 65 90)"/>' +
        '<path d="M50 80 Q35 75 30 85" stroke="' + stemColor + '" stroke-width="1.5" fill="none"/>' +
        '<path d="M50 80 Q65 75 70 85" stroke="' + stemColor + '" stroke-width="1.5" fill="none"/>' +
        petals +
        '<circle cx="50" cy="40" r="6" fill="' + centerColor + '"/>' +
        '<circle cx="50" cy="40" r="3" fill="#FFA500"/>' +
        '<circle cx="48" cy="38" r="1.2" fill="#fff" opacity="0.8"/>' +
        (waterLevel >= 2 ? _sparkles([[25,25],[75,25],[20,50]]) : '') +
        '</svg>';
}

/* 11. Drumroot - Drum-shaped plant with bouncing stick */
function renderDrumroot(waterLevel) {
    var drumColor = '#8D6E63';
    var drumDark = '#5D4037';
    var stickColor = '#D7B96B';
    var topColor = waterLevel >= 1 ? '#FF7043' : '#FF8A65';
    var glow = waterLevel >= 2 ? '<circle cx="50" cy="70" r="25" fill="#FF8A65" opacity="0.1"/>' : '';
    var extraStick = waterLevel >= 2 ?
        '<line x1="60" y1="50" x2="62" y2="35" stroke="' + stickColor + '" stroke-width="2.5" stroke-linecap="round"/>' +
        '<circle cx="62" cy="33" r="3" fill="' + topColor + '"/>' : '';

    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg">' +
        glow +
        '<path d="M50 120 Q48 115 50 110" stroke="#4a7c2e" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="35" cy="115" rx="8" ry="3" fill="#5a9c3e" transform="rotate(-20 35 115)"/>' +
        '<ellipse cx="65" cy="113" rx="8" ry="3" fill="#5a9c3e" transform="rotate(20 65 113)"/>' +
        '<ellipse cx="50" cy="95" rx="25" ry="8" fill="' + drumDark + '"/>' +
        '<path d="M25 95 L25 75 Q25 70 50 70 Q75 70 75 75 L75 95 Z" fill="' + drumColor + '" stroke="' + drumDark + '" stroke-width="1.5"/>' +
        '<ellipse cx="50" cy="75" rx="25" ry="7" fill="#A1887F" stroke="' + drumDark + '" stroke-width="1"/>' +
        '<ellipse cx="50" cy="74" rx="22" ry="5" fill="#D7CCC8" opacity="0.5"/>' +
        '<path d="M30 85 Q32 82 35 85 M42 85 Q44 82 47 85 M53 85 Q55 82 58 85 M65 85 Q67 82 70 85" stroke="' + drumDark + '" stroke-width="0.8" fill="none" opacity="0.6"/>' +
        '<line x1="40" y1="70" x2="38" y2="45" stroke="' + stickColor + '" stroke-width="2.5" stroke-linecap="round"/>' +
        '<circle cx="38" cy="43" r="3.5" fill="' + topColor + '"/>' +
        '<circle cx="38" cy="43" r="2" fill="#FF5722" opacity="0.6"/>' +
        extraStick +
        _face(50, 88, 1.8, 10, 3) +
        '</svg>';
}

/* 12. Crystalotus - Crystalline lotus with shimmer */
function renderCrystalotus(waterLevel) {
    var crystalColors = ['#81D4FA', '#4FC3F7', '#29B6F6', '#039BE5'];
    var glowR = 18 + waterLevel * 4;
    var sparkle = waterLevel >= 1 ?
        _sparkles([[25,40],[75,40],[30,60],[70,60],[50,25]]) : '';

    var petals = '';
    var petalData = [
        [50,50,0,8,20,0],[50,50,72,8,20,1],[50,50,144,8,20,2],[50,50,216,8,20,3],
        [50,50,36,6,15,0],[50,50,108,6,15,2],[50,50,180,6,15,1],[50,50,252,6,15,3]
    ];
    for (var i = 0; i < petalData.length; i++) {
        var cx = petalData[i][0], cy = petalData[i][1], angle = petalData[i][2];
        var rx = petalData[i][3], ry = petalData[i][4], ci = petalData[i][5];
        var rad = (angle - 90) * Math.PI / 180;
        var px = cx + Math.cos(rad) * 8;
        var py = cy + Math.sin(rad) * 8;
        petals += '<ellipse cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) +
            '" rx="' + rx + '" ry="' + ry + '" fill="' + crystalColors[ci] +
            '" opacity="0.7" transform="rotate(' + angle + ' ' + px.toFixed(1) + ' ' + py.toFixed(1) + ')"/>' +
            '<ellipse cx="' + px.toFixed(1) + '" cy="' + (py - ry * 0.3).toFixed(1) +
            '" rx="' + (rx * 0.3) + '" ry="' + (ry * 0.3) + '" fill="#fff" opacity="0.4"/>';
    }

    return '<svg viewBox="0 0 100 120" class="plant-svg" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><radialGradient id="crystalGlow' + waterLevel + '">' +
        '<stop offset="0%" stop-color="#4FC3F7" stop-opacity="0.5"/>' +
        '<stop offset="100%" stop-color="#4FC3F7" stop-opacity="0"/>' +
        '</radialGradient></defs>' +
        '<path d="M50 120 Q48 100 50 80" stroke="#2e5c3e" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="32" cy="108" rx="10" ry="4" fill="#3a7c5e" transform="rotate(-15 32 108)"/>' +
        '<ellipse cx="68" cy="108" rx="10" ry="4" fill="#3a7c5e" transform="rotate(15 68 108)"/>' +
        '<ellipse cx="50" cy="95" rx="18" ry="4" fill="#2e7d32" opacity="0.6"/>' +
        '<circle cx="50" cy="50" r="' + glowR + '" fill="url(#crystalGlow' + waterLevel + ')"/>' +
        petals +
        '<circle cx="50" cy="50" r="5" fill="#fff" opacity="0.9"/>' +
        '<circle cx="50" cy="50" r="2.5" fill="#4FC3F7"/>' +
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
        animClass: 'anim-sunflare',
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
        animClass: 'anim-toadstool',
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
        animClass: 'anim-bluebelle',
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
        animClass: 'anim-prickle',
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
        animClass: 'anim-fernella',
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
        animClass: 'anim-lumipetal',
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
    {
        id: 'snapdragon',
        name: 'Snapdragon',
        emoji: '\uD83D\uDC32',
        description: 'Fiery and fierce',
        animClass: 'anim-snapdragon',
        colors: { primary: '#E84830', secondary: '#FFB6C1', accent: '#C03820' },
        audio: {
            notes: [349.23, 440.00, 523.25],
            waveform: 'sawtooth',
            envelope: { attack: 0.01, decay: 0.08, sustain: 0.4, release: 0.2 },
            noteDuration: 0.25,
            filterFreq: 2200,
            filterQ: 2.5,
            reverb: 0.12,
            delay: 0.03,
            volume: 0.16,
        },
        waterEffects: [
            { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0 },
            { pitchMultiplier: 1.0595, vibrato: 1, reverbBoost: 0.08, harmonicBoost: 0.2 },
            { pitchMultiplier: 1.1225, vibrato: 3, reverbBoost: 0.12, harmonicBoost: 0.4 },
            { pitchMultiplier: 1.1895, vibrato: 5, reverbBoost: 0.18, harmonicBoost: 0.6 },
        ],
        renderSVG: renderSnapdragon,
    },
    {
        id: 'bubblebloom',
        name: 'Bubblebloom',
        emoji: '\uD83E\uDEA8',
        description: 'Bubbly and light',
        animClass: 'anim-bubblebloom',
        colors: { primary: '#4FC3F7', secondary: '#81D4FA', accent: '#29B6F6' },
        audio: {
            notes: [493.88, 587.33, 698.46],
            waveform: 'sine',
            envelope: { attack: 0.03, decay: 0.2, sustain: 0.5, release: 0.6 },
            noteDuration: 0.5,
            filterFreq: 4500,
            filterQ: 0.8,
            reverb: 0.25,
            delay: 0.08,
            volume: 0.17,
        },
        waterEffects: [
            { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0 },
            { pitchMultiplier: 1.0595, vibrato: 2, reverbBoost: 0.12, harmonicBoost: 0.2 },
            { pitchMultiplier: 1.1225, vibrato: 4, reverbBoost: 0.18, harmonicBoost: 0.4 },
            { pitchMultiplier: 1.1895, vibrato: 6, reverbBoost: 0.22, harmonicBoost: 0.6 },
        ],
        renderSVG: renderBubblebloom,
    },
    {
        id: 'chimesprout',
        name: 'Chimesprout',
        emoji: '\uD83C\uDFB6',
        description: 'Tinkling and bright',
        animClass: 'anim-chimesprout',
        colors: { primary: '#FFD700', secondary: '#42A5F5', accent: '#66BB6A' },
        audio: {
            notes: [659.25, 783.99, 987.77],
            waveform: 'triangle',
            envelope: { attack: 0.005, decay: 0.4, sustain: 0.1, release: 1.2 },
            noteDuration: 0.3,
            filterFreq: 7000,
            filterQ: 0.3,
            reverb: 0.4,
            delay: 0.12,
            volume: 0.14,
        },
        waterEffects: [
            { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0 },
            { pitchMultiplier: 1.0595, vibrato: 0, reverbBoost: 0.15, harmonicBoost: 0.1 },
            { pitchMultiplier: 1.1225, vibrato: 1, reverbBoost: 0.2, harmonicBoost: 0.3 },
            { pitchMultiplier: 1.1895, vibrato: 3, reverbBoost: 0.25, harmonicBoost: 0.5 },
        ],
        renderSVG: renderChimesprout,
    },
    {
        id: 'dancylily',
        name: 'Dancylily',
        emoji: '\uD83C\uDF3A',
        description: 'Graceful and flowing',
        animClass: 'anim-dancylily',
        colors: { primary: '#FF6B9D', secondary: '#FFC0CB', accent: '#FFD700' },
        audio: {
            notes: [440.00, 523.25, 659.25],
            waveform: 'sine',
            envelope: { attack: 0.04, decay: 0.15, sustain: 0.6, release: 0.4 },
            noteDuration: 0.4,
            filterFreq: 3500,
            filterQ: 1.2,
            reverb: 0.22,
            delay: 0.06,
            volume: 0.19,
        },
        waterEffects: [
            { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0 },
            { pitchMultiplier: 1.0595, vibrato: 2, reverbBoost: 0.12, harmonicBoost: 0.2 },
            { pitchMultiplier: 1.1225, vibrato: 4, reverbBoost: 0.16, harmonicBoost: 0.4 },
            { pitchMultiplier: 1.1895, vibrato: 6, reverbBoost: 0.2, harmonicBoost: 0.6 },
        ],
        renderSVG: renderDancylily,
    },
    {
        id: 'drumroot',
        name: 'Drumroot',
        emoji: '\uD83E\uDD41',
        description: 'Deep and rhythmic',
        animClass: 'anim-drumroot',
        colors: { primary: '#8D6E63', secondary: '#FF8A65', accent: '#5D4037' },
        audio: {
            notes: [130.81, 196.00, 261.63],
            waveform: 'square',
            envelope: { attack: 0.002, decay: 0.03, sustain: 0.2, release: 0.08 },
            noteDuration: 0.12,
            filterFreq: 1500,
            filterQ: 4,
            reverb: 0.08,
            delay: 0,
            volume: 0.2,
        },
        waterEffects: [
            { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0 },
            { pitchMultiplier: 1.0595, vibrato: 0, reverbBoost: 0.04, harmonicBoost: 0.1 },
            { pitchMultiplier: 1.1225, vibrato: 0, reverbBoost: 0.08, harmonicBoost: 0.2 },
            { pitchMultiplier: 1.1895, vibrato: 1, reverbBoost: 0.12, harmonicBoost: 0.4 },
        ],
        renderSVG: renderDrumroot,
    },
    {
        id: 'crystalotus',
        name: 'Crystalotus',
        emoji: '\uD83D\uDD2F',
        description: 'Mystical and pure',
        animClass: 'anim-crystalotus',
        colors: { primary: '#4FC3F7', secondary: '#81D4FA', accent: '#039BE5' },
        audio: {
            notes: [1174.66, 1396.91, 1760.00],
            waveform: 'sine',
            envelope: { attack: 0.08, decay: 0.3, sustain: 0.4, release: 1.5 },
            noteDuration: 0.7,
            filterFreq: 8000,
            filterQ: 0.3,
            reverb: 0.5,
            delay: 0.2,
            volume: 0.11,
        },
        waterEffects: [
            { pitchMultiplier: 1.0, vibrato: 0, reverbBoost: 0, harmonicBoost: 0 },
            { pitchMultiplier: 1.0595, vibrato: 1, reverbBoost: 0.15, harmonicBoost: 0.1 },
            { pitchMultiplier: 1.1225, vibrato: 3, reverbBoost: 0.2, harmonicBoost: 0.3 },
            { pitchMultiplier: 1.1895, vibrato: 5, reverbBoost: 0.25, harmonicBoost: 0.5 },
        ],
        renderSVG: renderCrystalotus,
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
