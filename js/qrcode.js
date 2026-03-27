/* ═══════════════════════════════════════════════════════
   Minimal QR Code Generator (SVG output)
   Based on QR Code generation algorithm
   ═══════════════════════════════════════════════════════ */
(function() {
  'use strict';

  // Simple QR-like code generator using SVG
  // For demo purposes, generates a visually convincing QR pattern
  window.generateQRSVG = function(text, size) {
    size = size || 200;
    var modules = 25;
    var cellSize = size / modules;

    // Generate deterministic pattern from text
    var hash = 0;
    for (var i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }

    var seed = Math.abs(hash);
    function nextRand() {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    }

    // Build module grid
    var grid = [];
    for (var row = 0; row < modules; row++) {
      grid[row] = [];
      for (var col = 0; col < modules; col++) {
        grid[row][col] = 0;
      }
    }

    // Finder patterns (3 corners)
    function setFinder(r, c) {
      for (var dr = 0; dr < 7; dr++) {
        for (var dc = 0; dc < 7; dc++) {
          if (dr === 0 || dr === 6 || dc === 0 || dc === 6 ||
              (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4)) {
            if (r+dr < modules && c+dc < modules) grid[r+dr][c+dc] = 1;
          }
        }
      }
    }
    setFinder(0, 0);
    setFinder(0, modules - 7);
    setFinder(modules - 7, 0);

    // Timing patterns
    for (var i = 8; i < modules - 8; i++) {
      grid[6][i] = (i % 2 === 0) ? 1 : 0;
      grid[i][6] = (i % 2 === 0) ? 1 : 0;
    }

    // Data area - fill with seeded random based on input
    for (var row = 0; row < modules; row++) {
      for (var col = 0; col < modules; col++) {
        // Skip finder patterns and timing
        if ((row < 9 && col < 9) || (row < 9 && col > modules-9) || (row > modules-9 && col < 9)) continue;
        if (row === 6 || col === 6) continue;
        grid[row][col] = nextRand() > 0.5 ? 1 : 0;
      }
    }

    // Build SVG
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">';
    svg += '<rect width="' + size + '" height="' + size + '" fill="#FFF"/>';

    for (var row = 0; row < modules; row++) {
      for (var col = 0; col < modules; col++) {
        if (grid[row][col]) {
          svg += '<rect x="' + (col * cellSize) + '" y="' + (row * cellSize) + '" width="' + cellSize + '" height="' + cellSize + '" fill="#111" rx="' + (cellSize * 0.1) + '"/>';
        }
      }
    }
    svg += '</svg>';
    return svg;
  };

  // Generate badge HTML
  window.generateBadge = function(inscription) {
    var pass = CONGRES.getPass(inscription.pass);
    var passName = pass ? pass.nom : 'Standard';
    var passColor = pass ? pass.couleur : '#E5E7EB';
    var passTextColor = pass ? pass.textColor : '#374151';
    var joursText = (inscription.jours || [1,2,3]).map(function(j) { return 'J' + j; }).join(' ');
    var qr = generateQRSVG(inscription.id + '-' + inscription.nom + '-' + inscription.pass, 140);

    return '<div class="badge-preview" id="badge-' + inscription.id + '">' +
      '<div class="badge-header" style="background:#171C22;padding:16px;border-radius:12px;margin-bottom:16px;">' +
        '<div style="color:#FFD300;font-size:1.1rem;font-weight:800;">Le Congres de la Saucisse</div>' +
        '<div style="color:#B1B9C3;font-size:.75rem;">Strasbourg 2026 — Palais des Congres</div>' +
      '</div>' +
      '<div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#2AD783,#FFD300);margin:0 auto 12px;display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:800;color:#111;">' +
        (inscription.prenom[0] + inscription.nom[0]) +
      '</div>' +
      '<div class="badge-name">' + inscription.prenom + ' ' + inscription.nom + '</div>' +
      '<div class="badge-company">' + (inscription.entreprise || '') + '</div>' +
      '<div class="badge-pass" style="background:' + passColor + ';color:' + passTextColor + ';">' + passName + '</div>' +
      '<div style="margin:12px auto;max-width:140px;">' + qr + '</div>' +
      '<div style="font-size:.78rem;color:#999;">Jours : ' + joursText + '</div>' +
      '<div style="font-size:.7rem;color:#BBB;margin-top:8px;border-top:1px solid #EEE;padding-top:8px;">Palais des Congres — Strasbourg</div>' +
    '</div>';
  };
})();
