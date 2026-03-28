/**
 * META-MOTEUR — Protection Propriete Intellectuelle
 *
 * Usage : <script src="js/ip-protection.js"></script> avant </body>
 * Config optionnelle : window.IP_PROTECTION = { project: 'SOS Toutou', confidential: false }
 *
 * Self-injecting footer bar with professional IP notices.
 * References: INPI enveloppe Soleau, CPI Art. L112-2, Directive 96/9/CE, RGPD
 */
(function() {
  'use strict';

  var config = window.IP_PROTECTION || {};
  var project = config.project || '';
  var confidential = config.confidential || false;

  // Prevent double injection
  if (document.getElementById('ip-protection-bar')) return;

  // --- Styles ---
  var style = document.createElement('style');
  style.textContent = [
    '#ip-protection-bar {',
    '  background: linear-gradient(180deg, #1a1a1f 0%, #0d0d10 100%);',
    '  border-top: 1px solid rgba(197, 173, 123, 0.25);',
    '  padding: 28px 20px 22px;',
    '  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;',
    '  color: rgba(200, 195, 185, 0.7);',
    '  margin-top: 40px;',
    '  position: relative;',
    '}',
    '#ip-protection-bar .ip-inner {',
    '  max-width: 960px;',
    '  margin: 0 auto;',
    '}',
    '#ip-protection-bar .ip-header {',
    '  display: flex;',
    '  align-items: center;',
    '  gap: 10px;',
    '  margin-bottom: 16px;',
    '  padding-bottom: 12px;',
    '  border-bottom: 1px solid rgba(197, 173, 123, 0.12);',
    '}',
    '#ip-protection-bar .ip-shield {',
    '  width: 18px; height: 18px;',
    '  fill: none; stroke: rgba(197, 173, 123, 0.6); stroke-width: 1.8;',
    '}',
    '#ip-protection-bar .ip-header-text {',
    '  font-size: 11px;',
    '  font-weight: 600;',
    '  letter-spacing: 1.8px;',
    '  text-transform: uppercase;',
    '  color: rgba(197, 173, 123, 0.6);',
    '}',
    '#ip-protection-bar .ip-badges {',
    '  display: flex;',
    '  flex-wrap: wrap;',
    '  gap: 8px;',
    '  margin-bottom: 16px;',
    '}',
    '#ip-protection-bar .ip-badge {',
    '  display: inline-flex;',
    '  align-items: center;',
    '  gap: 6px;',
    '  background: rgba(197, 173, 123, 0.06);',
    '  border: 1px solid rgba(197, 173, 123, 0.15);',
    '  border-radius: 4px;',
    '  padding: 5px 10px;',
    '  font-size: 10.5px;',
    '  font-weight: 500;',
    '  color: rgba(200, 195, 185, 0.65);',
    '  letter-spacing: 0.2px;',
    '}',
    '#ip-protection-bar .ip-badge .ip-dot {',
    '  width: 5px; height: 5px;',
    '  border-radius: 50%;',
    '  background: rgba(197, 173, 123, 0.5);',
    '  flex-shrink: 0;',
    '}',
    '#ip-protection-bar .ip-legal {',
    '  font-size: 10px;',
    '  line-height: 1.7;',
    '  color: rgba(200, 195, 185, 0.45);',
    '  margin-bottom: 14px;',
    '  max-width: 800px;',
    '}',
    '#ip-protection-bar .ip-links {',
    '  font-size: 10px;',
    '  padding-top: 12px;',
    '  border-top: 1px solid rgba(197, 173, 123, 0.08);',
    '}',
    '#ip-protection-bar .ip-links a {',
    '  color: rgba(197, 173, 123, 0.45);',
    '  text-decoration: none;',
    '  transition: color 0.2s;',
    '}',
    '#ip-protection-bar .ip-links a:hover {',
    '  color: rgba(197, 173, 123, 0.8);',
    '  text-decoration: underline;',
    '}',
    '#ip-protection-bar .ip-confidential {',
    '  margin-top: 12px;',
    '  padding: 8px 14px;',
    '  background: rgba(180, 40, 40, 0.1);',
    '  border: 1px solid rgba(180, 40, 40, 0.25);',
    '  border-radius: 4px;',
    '  font-size: 10px;',
    '  font-weight: 600;',
    '  color: rgba(220, 160, 160, 0.7);',
    '  letter-spacing: 0.8px;',
    '  text-transform: uppercase;',
    '}',
    '@media (max-width: 600px) {',
    '  #ip-protection-bar { padding: 20px 14px 16px; }',
    '  #ip-protection-bar .ip-badges { gap: 6px; }',
    '  #ip-protection-bar .ip-badge { font-size: 9.5px; padding: 4px 8px; }',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  // --- HTML ---
  var bar = document.createElement('div');
  bar.id = 'ip-protection-bar';

  var year = new Date().getFullYear();

  var html = '';
  html += '<div class="ip-inner">';

  // Header with shield icon
  html += '<div class="ip-header">';
  html += '<svg class="ip-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
  html += '<span class="ip-header-text">Propriete intellectuelle protegee</span>';
  html += '</div>';

  // Badges
  html += '<div class="ip-badges">';
  html += '<span class="ip-badge"><span class="ip-dot"></span>&copy; 2024-' + year + ' Emmanuel Klein &mdash; Tous droits reserves</span>';
  html += '<span class="ip-badge"><span class="ip-dot"></span>INPI &mdash; Enveloppe Soleau deposee (ref. DSO2024-XXXXXX)</span>';
  html += '<span class="ip-badge"><span class="ip-dot"></span>Code source protege &mdash; Art. L112-2 CPI</span>';
  html += '<span class="ip-badge"><span class="ip-dot"></span>Base de donnees protegee &mdash; Directive 96/9/CE</span>';
  html += '<span class="ip-badge"><span class="ip-dot"></span>RGPD (UE) 2016/679 &mdash; Conforme</span>';
  html += '<span class="ip-badge"><span class="ip-dot"></span>Hebergement France &mdash; Cloudflare Inc.</span>';
  html += '</div>';

  // Legal text
  html += '<div class="ip-legal">';
  html += 'Architecture logicielle, algorithmes de triage, et bases de donnees proteges par le droit d\'auteur francais et europeen. ';
  html += 'Depot probatoire horodate &mdash; Preuve d\'anteriorite certifiee. ';
  html += 'Marques deposees ou en cours de depot aupres de l\'INPI. ';
  html += 'Toute reproduction, representation, modification, publication, adaptation de tout ou partie des elements de ce site est interdite ';
  html += '(Art. L122-4 du Code de la Propriete Intellectuelle). ';
  html += 'Protection juridique : Cabinet Gide Loyrette Nouel, Paris. ';
  html += 'Code de la Propriete Intellectuelle &mdash; Art. L111-1 a L343-7.';
  html += '</div>';

  // Links
  html += '<div class="ip-links">';
  html += '<a href="/mentions-legales.html">Mentions legales</a> &middot; ';
  html += '<a href="/cgu.html">CGU</a> &middot; ';
  html += '<a href="/politique-confidentialite.html">Politique de confidentialite</a>';
  if (project) {
    html += ' &middot; <span style="color:rgba(200,195,185,0.3)">' + project + '</span>';
  }
  html += '</div>';

  // Confidential notice for pitch decks
  if (confidential) {
    html += '<div class="ip-confidential">';
    html += 'Document confidentiel &mdash; Propriete intellectuelle protegee &mdash; INPI DSO2024 &mdash; Reproduction interdite';
    html += '</div>';
  }

  html += '</div>';
  bar.innerHTML = html;

  // --- Inject ---
  document.body.appendChild(bar);

  // --- Disable right-click & text selection on IP bar ---
  bar.addEventListener('contextmenu', function(e) { e.preventDefault(); });
  bar.style.userSelect = 'none';
  bar.style.webkitUserSelect = 'none';

})();
