/**
 * APP Laurent — Filtre de contenu global
 * Anti-insultes, anti-violence, anti-spam, anti-harcèlement
 * Injecté sur toutes les pages avec des champs de saisie
 */
(function() {
  'use strict';

  // ═══ LISTE NOIRE — Insultes, violence, haine ═══
  var BLACKLIST = [
    // Insultes courantes
    'connard','connasse','enculé','enculer','putain','pute','salaud','salope',
    'merde','bordel','foutre','nique','niquer','ntm','fdp','tg','ta gueule',
    'ferme ta gueule','vas te faire','va te faire',
    // Homophobie
    'pd','pédé','pédale','tapette','gouine','travelo',
    // Racisme
    'negro','negre','nègre','bougnoule','arabe de merde','sale juif','youpin',
    'chinetoque','bridé','bamboula','bicot','crouille','melon','raton',
    // Violence
    'je vais te tuer','je vais te buter','crever','te buter','te défoncer',
    'te péter la gueule','casser la gueule','te fracasser','nique ta mère',
    'fils de pute','fils de chien','ta mère la pute',
    // Menaces
    'je sais ou tu habites','je vais venir','tu vas voir','tu vas payer',
    'je te retrouverai','attention à toi','gare à toi',
    // Harcèlement sexuel
    'salope','cochonne','suce','sucer','baiser','niquer','enculer',
    'je vais te violer','viol','violer',
    // Extrémisme
    'nazi','hitler','heil','sieg heil','white power','supremacist',
    'mort aux','exterminer','génocide','holocauste c\'est faux',
    // Discrimination
    'handicapé de merde','mongol','débile','attardé','gogol','trisomique',
    // Anglais courant
    'fuck','shit','asshole','bitch','motherfucker','dick','pussy','cunt',
    'nigger','faggot','retard'
  ];

  // ═══ PATTERNS SUSPECTS ═══
  var SUSPICIOUS_PATTERNS = [
    // Tout en majuscules (crier)
    { test: function(t) { return t.length > 15 && t === t.toUpperCase(); }, msg: 'Merci de ne pas écrire en majuscules.' },
    // Répétition de caractères (aaaaaaa, !!!!!!)
    { test: function(t) { return /(.)\1{5,}/.test(t); }, msg: 'Veuillez reformuler votre message.' },
    // Trop de points d'exclamation
    { test: function(t) { return (t.match(/!/g) || []).length > 5; }, msg: 'Merci de rester calme dans votre message.' },
    // Message trop long (spam)
    { test: function(t) { return t.length > 2000; }, msg: 'Message trop long. Merci de le raccourcir (2000 caractères max).' },
    // Liens suspects
    { test: function(t) { return /bit\.ly|tinyurl|goo\.gl|t\.co/i.test(t); }, msg: 'Les liens raccourcis ne sont pas autorisés.' },
    // Spam commercial
    { test: function(t) { var l = t.toLowerCase(); return l.includes('bitcoin') || l.includes('crypto') || l.includes('forex') || l.includes('casino') || l.includes('viagra'); }, msg: 'Contenu commercial non autorisé.' }
  ];

  // ═══ FONCTION DE FILTRAGE ═══
  window.ContentFilter = {
    /**
     * Vérifie un texte. Retourne { ok: true } ou { ok: false, reason: '...' }
     */
    check: function(text) {
      if (!text || typeof text !== 'string') return { ok: true };

      var lower = text.toLowerCase()
        .replace(/[àáâã]/g, 'a')
        .replace(/[éèêë]/g, 'e')
        .replace(/[ïî]/g, 'i')
        .replace(/[ôö]/g, 'o')
        .replace(/[ùûü]/g, 'u')
        .replace(/[ç]/g, 'c');

      // Vérifier la blacklist
      for (var i = 0; i < BLACKLIST.length; i++) {
        var word = BLACKLIST[i].toLowerCase()
          .replace(/[àáâã]/g, 'a')
          .replace(/[éèêë]/g, 'e')
          .replace(/[ïî]/g, 'i')
          .replace(/[ôö]/g, 'o')
          .replace(/[ùûü]/g, 'u')
          .replace(/[ç]/g, 'c');

        // Vérifier comme mot entier ou partie de phrase
        if (lower.includes(word)) {
          return { ok: false, reason: 'Votre message contient un terme inapproprié. Merci de reformuler de manière respectueuse.' };
        }
      }

      // Vérifier les patterns suspects
      for (var j = 0; j < SUSPICIOUS_PATTERNS.length; j++) {
        if (SUSPICIOUS_PATTERNS[j].test(text)) {
          return { ok: false, reason: SUSPICIOUS_PATTERNS[j].msg };
        }
      }

      return { ok: true };
    },

    /**
     * Nettoie un texte (remplace les insultes par des étoiles)
     */
    clean: function(text) {
      if (!text) return text;
      var result = text;
      for (var i = 0; i < BLACKLIST.length; i++) {
        var re = new RegExp(BLACKLIST[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        result = result.replace(re, '***');
      }
      return result;
    },

    /**
     * Attache le filtre à tous les formulaires de la page
     */
    protect: function() {
      // Intercepter les soumissions de formulaires
      document.addEventListener('submit', function(e) {
        var form = e.target;
        var textFields = form.querySelectorAll('textarea, input[type="text"]');
        for (var i = 0; i < textFields.length; i++) {
          var result = ContentFilter.check(textFields[i].value);
          if (!result.ok) {
            e.preventDefault();
            e.stopPropagation();
            ContentFilter.showWarning(result.reason, textFields[i]);
            return false;
          }
        }
      }, true);

      // Intercepter les envois via onclick/custom
      var origAlert = window.alert;
      window._contentFilterActive = true;
    },

    /**
     * Affiche un avertissement
     */
    showWarning: function(message, element) {
      // Supprimer l'ancien avertissement
      var old = document.querySelector('.cf-warning');
      if (old) old.remove();

      var div = document.createElement('div');
      div.className = 'cf-warning';
      div.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#DC2626;color:#fff;padding:14px 24px;border-radius:12px;font-size:14px;font-weight:600;z-index:999999;box-shadow:0 8px 24px rgba(220,38,38,.3);max-width:90%;text-align:center;animation:cfShake .4s ease';
      div.textContent = '⚠️ ' + message;
      document.body.appendChild(div);

      if (element) {
        element.style.borderColor = '#DC2626';
        element.focus();
        setTimeout(function() { element.style.borderColor = ''; }, 3000);
      }

      setTimeout(function() { div.remove(); }, 5000);
    }
  };

  // Style animation
  var style = document.createElement('style');
  style.textContent = '@keyframes cfShake{0%,100%{transform:translateX(-50%)}20%,60%{transform:translateX(calc(-50% - 8px))}40%,80%{transform:translateX(calc(-50% + 8px))}}';
  document.head.appendChild(style);

  // Auto-protect au chargement
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { ContentFilter.protect(); });
  } else {
    ContentFilter.protect();
  }
})();
