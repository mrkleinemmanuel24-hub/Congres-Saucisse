/**
 * META-MOTEUR — Visite guidée premier lancement
 *
 * Usage : ajouter <script src="js/guided-tour.js"></script> avant </body>
 * Puis configurer : window.GUIDED_TOUR = { steps: [...], appName: '...', copyright: '...' }
 *
 * Exemple :
 * window.GUIDED_TOUR = {
 *   appName: 'SOS Toutou RC',
 *   promise: 'Orientez votre animal en 2 minutes',
 *   copyright: '© 2026 Emmanuel Klein — Tous droits réservés',
 *   steps: [
 *     { target: '#module-grid', title: 'Les modules', text: 'Choisissez le module qui correspond aux symptômes de votre animal.' },
 *     { target: '#urgence-btn', title: 'Urgence', text: 'En cas d\'urgence vitale, cliquez ici pour appeler le 3115.' },
 *     { target: '#nutrition', title: 'Nutrition', text: 'Découvrez la nutrition adaptée à votre animal.' }
 *   ]
 * };
 */
(function() {
  'use strict';

  var TOUR_KEY = 'guided_tour_done_';

  function init() {
    var config = window.GUIDED_TOUR;
    if (!config || !config.steps || config.steps.length === 0) return;

    var page = location.pathname.split('/').pop() || 'index.html';
    var key = TOUR_KEY + (config.appName || page).replace(/\s/g, '_');

    // Already done?
    if (localStorage.getItem(key)) return;

    // Inject styles
    var style = document.createElement('style');
    style.textContent = '\
.gt-overlay{position:fixed;inset:0;z-index:999990;background:rgba(0,0,0,.65);backdrop-filter:blur(3px);transition:opacity .3s}\
.gt-overlay.fade-out{opacity:0}\
.gt-welcome{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:999991;\
background:#1A1B22;border:1px solid rgba(201,168,76,.3);border-radius:20px;padding:36px 32px;\
max-width:440px;width:90%;text-align:center;color:#E8E4DC;font-family:-apple-system,sans-serif;\
box-shadow:0 20px 60px rgba(0,0,0,.5);animation:gtSlide .4s ease}\
@keyframes gtSlide{from{opacity:0;transform:translate(-50%,-50%) scale(.95)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}\
.gt-welcome h2{font-size:1.3rem;font-weight:800;color:#C9A84C;margin-bottom:8px}\
.gt-welcome .gt-promise{font-size:.95rem;color:rgba(232,228,220,.6);line-height:1.6;margin-bottom:20px}\
.gt-welcome .gt-start{display:inline-block;padding:12px 32px;background:#C9A84C;color:#111;font-weight:700;\
font-size:.95rem;border:none;border-radius:10px;cursor:pointer;transition:all .2s}\
.gt-welcome .gt-start:hover{background:#E0CC8A;transform:translateY(-1px)}\
.gt-welcome .gt-skip{display:block;margin-top:12px;color:rgba(232,228,220,.3);font-size:.8rem;cursor:pointer;background:none;border:none}\
.gt-welcome .gt-copyright{font-size:.65rem;color:rgba(232,228,220,.15);margin-top:16px;line-height:1.5}\
\
.gt-tooltip{position:fixed;z-index:999992;background:#1A1B22;border:1px solid rgba(201,168,76,.3);\
border-radius:14px;padding:20px;max-width:320px;width:90%;color:#E8E4DC;font-family:-apple-system,sans-serif;\
box-shadow:0 12px 40px rgba(0,0,0,.5);animation:gtPop .3s ease}\
@keyframes gtPop{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}\
.gt-tooltip h3{font-size:1rem;font-weight:700;color:#C9A84C;margin-bottom:6px}\
.gt-tooltip p{font-size:.85rem;color:rgba(232,228,220,.6);line-height:1.6;margin-bottom:14px}\
.gt-tooltip .gt-nav{display:flex;gap:8px;align-items:center}\
.gt-tooltip .gt-btn{padding:8px 18px;border-radius:8px;font-size:.8rem;font-weight:600;cursor:pointer;border:none;transition:all .2s}\
.gt-tooltip .gt-next{background:#C9A84C;color:#111}\
.gt-tooltip .gt-prev{background:rgba(232,228,220,.08);color:rgba(232,228,220,.5)}\
.gt-tooltip .gt-counter{margin-left:auto;font-size:.75rem;color:rgba(201,168,76,.4)}\
.gt-highlight{position:fixed;z-index:999989;border:2px solid #C9A84C;border-radius:8px;\
box-shadow:0 0 0 4000px rgba(0,0,0,.5),0 0 20px rgba(201,168,76,.3);transition:all .3s;pointer-events:none}\
';
    document.head.appendChild(style);

    // Show welcome
    showWelcome(config, key);
  }

  function showWelcome(config, key) {
    var overlay = document.createElement('div');
    overlay.className = 'gt-overlay';
    document.body.appendChild(overlay);

    var welcome = document.createElement('div');
    welcome.className = 'gt-welcome';
    welcome.innerHTML = '<h2>' + (config.appName || 'Bienvenue') + '</h2>' +
      '<p class="gt-promise">' + (config.promise || '') + '</p>' +
      '<button class="gt-start" onclick="window._gtStart()">Découvrir l\'application</button>' +
      '<button class="gt-skip" onclick="window._gtSkip()">Passer la visite</button>' +
      '<div class="gt-copyright">' + (config.copyright || '© 2026 Emmanuel Klein') + '</div>';
    document.body.appendChild(welcome);

    // Click outside to dismiss
    overlay.addEventListener('click', function() { window._gtSkip(); });

    window._gtStart = function() {
      welcome.remove();
      startTour(config, overlay, key);
    };

    window._gtSkip = function() {
      welcome.remove();
      overlay.remove();
      localStorage.setItem(key, Date.now());
    };
  }

  function startTour(config, overlay, key) {
    var currentStep = 0;
    var highlight = document.createElement('div');
    highlight.className = 'gt-highlight';
    document.body.appendChild(highlight);

    function showStep(idx) {
      // Remove old tooltip
      var old = document.querySelector('.gt-tooltip');
      if (old) old.remove();

      if (idx >= config.steps.length) {
        // Done
        highlight.remove();
        overlay.remove();
        localStorage.setItem(key, Date.now());
        return;
      }

      var step = config.steps[idx];
      var target = document.querySelector(step.target);

      if (target) {
        var rect = target.getBoundingClientRect();
        highlight.style.top = (rect.top - 6) + 'px';
        highlight.style.left = (rect.left - 6) + 'px';
        highlight.style.width = (rect.width + 12) + 'px';
        highlight.style.height = (rect.height + 12) + 'px';
        highlight.style.display = 'block';
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        highlight.style.display = 'none';
      }

      var tooltip = document.createElement('div');
      tooltip.className = 'gt-tooltip';
      tooltip.innerHTML = '<h3>' + step.title + '</h3>' +
        '<p>' + step.text + '</p>' +
        '<div class="gt-nav">' +
        (idx > 0 ? '<button class="gt-btn gt-prev" onclick="window._gtPrev()">← Précédent</button>' : '') +
        '<button class="gt-btn gt-next" onclick="window._gtNext()">' + (idx === config.steps.length - 1 ? 'Terminer ✓' : 'Suivant →') + '</button>' +
        '<span class="gt-counter">' + (idx + 1) + '/' + config.steps.length + '</span>' +
        '</div>';

      // Position tooltip
      if (target) {
        var rect = target.getBoundingClientRect();
        var top = rect.bottom + 16;
        if (top + 200 > window.innerHeight) top = rect.top - 200;
        tooltip.style.top = Math.max(16, top) + 'px';
        tooltip.style.left = Math.max(16, Math.min(rect.left, window.innerWidth - 340)) + 'px';
      } else {
        tooltip.style.top = '50%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translate(-50%,-50%)';
      }

      document.body.appendChild(tooltip);
      currentStep = idx;
    }

    window._gtNext = function() { showStep(currentStep + 1); };
    window._gtPrev = function() { showStep(currentStep - 1); };

    showStep(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 500);
  }
})();
