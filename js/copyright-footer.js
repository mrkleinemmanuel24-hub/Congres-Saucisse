/**
 * META-MOTEUR — Footer juridique + copyright
 *
 * Usage : <script src="js/copyright-footer.js"></script> avant </body>
 * Config optionnelle : window.COPYRIGHT = { owner: '...', year: 2026, extra: '...' }
 */
(function() {
  'use strict';
  var config = window.COPYRIGHT || {};
  var owner = config.owner || 'Emmanuel Klein';
  var year = config.year || new Date().getFullYear();
  var extra = config.extra || '';

  var footer = document.createElement('div');
  footer.style.cssText = 'text-align:center;padding:16px 20px;font-size:.7rem;color:rgba(150,150,150,.5);line-height:1.6;border-top:1px solid rgba(150,150,150,.08);margin-top:20px';
  footer.innerHTML = '© ' + year + ' ' + owner + ' — Tous droits réservés.<br>' +
    'Application protégée. Reproduction interdite.' +
    (extra ? '<br>' + extra : '') +
    '<br><span style="font-size:.6rem;color:rgba(150,150,150,.25)">Données hébergées en France (Cloudflare). Conforme RGPD.</span>';

  document.body.appendChild(footer);
})();
