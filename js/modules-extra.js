/* ═══════════════════════════════════════════════════════
   CONGRES DE LA SAUCISSE — Modules Extra
   Reservations, Badges & QR, Conferenciers,
   Benevoles, Logistique, Portail Prestataire
   + Dashboard widgets
   All data in localStorage key: congres_extra_data
   ═══════════════════════════════════════════════════════ */
(function() {
'use strict';

var LS_KEY = 'congres_extra_data';

// ─── DEMO DATA ───
var DEMO = {
  events: [
    { id:'E001', name:'Masterclass Fumage Traditionnel', date:'2026-06-12', time:'10:00', lieu:'Salle Curie', max:80, reservations:[] },
    { id:'E002', name:'Degustation Biere & Saucisse', date:'2026-06-12', time:'14:00', lieu:'Salle Gutenberg', max:60, reservations:[] },
    { id:'E003', name:'Table Ronde Saucisse Artisanale', date:'2026-06-13', time:'16:30', lieu:'Salle Erasme', max:400, reservations:[] },
    { id:'E004', name:'Atelier Chorizo Iberique', date:'2026-06-13', time:'11:00', lieu:'Salle Curie', max:50, reservations:[] },
    { id:'E005', name:'Grand Prix de la Saucisse 2026', date:'2026-06-14', time:'14:00', lieu:'Salle Erasme', max:450, reservations:[] }
  ],
  reservations: [
    { id:'R001', name:'Pierre Martin', email:'pierre.martin@email.fr', phone:'06 12 34 56 78', eventId:'E001', scanned:false, scanTime:null },
    { id:'R002', name:'Sophie Laurent', email:'sophie.laurent@email.fr', phone:'06 23 45 67 89', eventId:'E001', scanned:false, scanTime:null },
    { id:'R003', name:'Jean Dupont', email:'jean.dupont@email.fr', phone:'06 34 56 78 90', eventId:'E002', scanned:false, scanTime:null },
    { id:'R004', name:'Marie Leroy', email:'marie.leroy@email.fr', phone:'06 45 67 89 01', eventId:'E003', scanned:false, scanTime:null },
    { id:'R005', name:'Luc Bernard', email:'luc.bernard@email.fr', phone:'06 56 78 90 12', eventId:'E003', scanned:false, scanTime:null },
    { id:'R006', name:'Claire Moreau', email:'claire.moreau@email.fr', phone:'06 67 89 01 23', eventId:'E004', scanned:false, scanTime:null },
    { id:'R007', name:'Thomas Petit', email:'thomas.petit@email.fr', phone:'06 78 90 12 34', eventId:'E005', scanned:false, scanTime:null },
    { id:'R008', name:'Isabelle Roux', email:'isabelle.roux@email.fr', phone:'06 89 01 23 45', eventId:'E005', scanned:false, scanTime:null },
    { id:'R009', name:'Nicolas Fournier', email:'nicolas.fournier@email.fr', phone:'06 90 12 34 56', eventId:'E002', scanned:false, scanTime:null },
    { id:'R010', name:'Anne Girard', email:'anne.girard@email.fr', phone:'06 01 23 45 67', eventId:'E005', scanned:true, scanTime:'2026-06-14T14:05:00' }
  ],
  speakers: [
    { id:'S001', name:'Jean-Marc Schaller', title:'Maitre charcutier, MOF 2018', org:'Maison Schaller, Strasbourg', bio:'Maitre charcutier depuis 35 ans, MOF 2018. Specialiste des saucisses fumees.', theme:'Gastronomie', events:['E001','E003'], photo:'' },
    { id:'S002', name:'Klaus Mueller', title:'Directeur Bratwurst Akademie', org:'Bratwurst Akademie, Nuremberg', bio:'Expert en saucisses germaniques traditionnelles. Auteur de 3 ouvrages de reference.', theme:'International', events:['E003'], photo:'' },
    { id:'S003', name:'Isabella Rossi', title:'Experte saucisses italiennes', org:'Universita di Bologna', bio:'Professeure a Bologne, specialiste mondiale de la mortadelle et des salumi italiens.', theme:'International', events:['E004'], photo:'' },
    { id:'S004', name:'Roberto Gonzalez', title:'Expert chorizo & embutidos', org:'Real Academia de Gastronomia, Madrid', bio:'Academicien de la gastronomie espagnole. Expert mondial du chorizo iberique.', theme:'International', events:['E004'], photo:'' },
    { id:'S005', name:'Pierre Andrieu', title:'Chef etoile', org:'Restaurant Le Knack, Colmar', bio:'Chef etoile Michelin, pionnier de la haute gastronomie charcutiere.', theme:'Gastronomie', events:['E005'], photo:'' }
  ],
  volunteers: [
    { id:'V001', name:'Emma Schultz', email:'emma.schultz@email.fr', phone:'06 11 22 33 44', availability:['2026-06-12','2026-06-13','2026-06-14'], skills:'Accueil, langues (FR/DE/EN)', preferences:'Accueil visiteurs', status:'confirme', assignments:[] },
    { id:'V002', name:'Lucas Braun', email:'lucas.braun@email.fr', phone:'06 22 33 44 55', availability:['2026-06-12','2026-06-13'], skills:'Technique audio/video', preferences:'Regie technique', status:'confirme', assignments:[] },
    { id:'V003', name:'Camille Dupuis', email:'camille.dupuis@email.fr', phone:'06 33 44 55 66', availability:['2026-06-13','2026-06-14'], skills:'Communication, reseaux sociaux', preferences:'Relations presse', status:'confirme', assignments:[] },
    { id:'V004', name:'Hugo Werner', email:'hugo.werner@email.fr', phone:'06 44 55 66 77', availability:['2026-06-12'], skills:'Logistique, permis B', preferences:'Transport et logistique', status:'affecte', assignments:[{day:'2026-06-12',slot:'08:00-12:00',lieu:'Hall Europe'}] },
    { id:'V005', name:'Lea Fischer', email:'lea.fischer@email.fr', phone:'06 55 66 77 88', availability:['2026-06-12','2026-06-13','2026-06-14'], skills:'Service, restauration', preferences:'Traiteur et restauration', status:'affecte', assignments:[{day:'2026-06-12',slot:'12:00-14:00',lieu:'Hall Europe'},{day:'2026-06-13',slot:'12:00-14:00',lieu:'Hall Europe'}] },
    { id:'V006', name:'Paul Keller', email:'paul.keller@email.fr', phone:'06 66 77 88 99', availability:['2026-06-14'], skills:'Securite, premiers secours (PSC1)', preferences:'Securite', status:'candidat', assignments:[] },
    { id:'V007', name:'Julie Hartmann', email:'julie.hartmann@email.fr', phone:'06 77 88 99 00', availability:['2026-06-12','2026-06-13'], skills:'Accueil, traduction DE/EN', preferences:'Accueil VIP', status:'candidat', assignments:[] },
    { id:'V008', name:'Antoine Becker', email:'antoine.becker@email.fr', phone:'06 88 99 00 11', availability:['2026-06-12','2026-06-13','2026-06-14'], skills:'Photographie, video', preferences:'Captation photo/video', status:'confirme', assignments:[{day:'2026-06-12',slot:'09:00-18:00',lieu:'Toutes salles'}] }
  ],
  logistics: [
    { id:'L001', speakerName:'Klaus Mueller', departure:'Nuremberg', arrival:'Strasbourg', dates:'11-14 juin', hotelNights:3, trainCost:180, hotelCost:450, perDiem:150, trainStatus:'reserve', hotelStatus:'confirme', trainDoc:null, hotelDoc:null },
    { id:'L002', speakerName:'Isabella Rossi', departure:'Bologne', arrival:'Strasbourg', dates:'12-14 juin', hotelNights:2, trainCost:280, hotelCost:300, perDiem:100, trainStatus:'confirme', hotelStatus:'confirme', trainDoc:null, hotelDoc:null },
    { id:'L003', speakerName:'Roberto Gonzalez', departure:'Madrid', arrival:'Strasbourg', dates:'12-14 juin', hotelNights:2, trainCost:350, hotelCost:300, perDiem:100, trainStatus:'a_reserver', hotelStatus:'a_reserver', trainDoc:null, hotelDoc:null }
  ],
  invoices: [
    { id:'F001', company:'Traiteur Schaller SARL', siret:'44312345600012', amount:12500, description:'Traiteur buffet jour 1 + jour 2', status:'validee', notes:'Facture conforme, 3 devis', date:'2026-05-15', history:[{date:'2026-05-15',status:'recue'},{date:'2026-05-16',status:'en_verification'},{date:'2026-05-18',status:'validee'}] },
    { id:'F002', company:'SonoPro Alsace', siret:'50198765400028', amount:4800, description:'Location sono + eclairage 3 jours', status:'en_paiement', notes:'', date:'2026-05-20', history:[{date:'2026-05-20',status:'recue'},{date:'2026-05-21',status:'en_verification'},{date:'2026-05-22',status:'validee'},{date:'2026-05-25',status:'en_paiement'}] },
    { id:'F003', company:'Imprimerie Gutenberg', siret:'33456789000015', amount:2200, description:'Impression badges, programmes, signalétique', status:'recue', notes:'A verifier les quantites', date:'2026-06-01', history:[{date:'2026-06-01',status:'recue'}] }
  ],
  scanHistory: []
};

// ─── DATA MANAGER ───
function loadData() {
  try {
    var d = JSON.parse(localStorage.getItem(LS_KEY));
    if (d && d.events) return d;
  } catch(e) {}
  // First load: save demo data
  saveData(DEMO);
  return JSON.parse(JSON.stringify(DEMO));
}
function saveData(d) { localStorage.setItem(LS_KEY, JSON.stringify(d)); }
function uid(prefix) { return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }
function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmtDate(d) { if(!d) return '-'; var p=d.split('-'); return p[2]+'/'+p[1]+'/'+p[0]; }

// ─── Shared HTML helpers ───
function adminCard(title, html) {
  return '<div class="erp-section-card"><h3>' + title + '</h3>' + html + '</div>';
}
function badgeHtml(text, cls) { return '<span class="erp-badge badge-' + cls + '">' + esc(text) + '</span>'; }

// Global module namespace
window.EXTRA_MOD = window.EXTRA_MOD || {};

// ══════════════════════════════════════════════════════════
// 1. RESERVATIONS
// ══════════════════════════════════════════════════════════
SPA_INIT['reservations'] = function() {
  var el = document.getElementById('section-reservations');
  var data = loadData();

  function getEvent(id) { return data.events.find(function(e){return e.id===id;}); }
  function getReservationsForEvent(eid) { return data.reservations.filter(function(r){return r.eventId===eid;}); }

  function render() {
    data = loadData();
    var html = '<div class="erp-content">';
    html += '<h2 class="panel-title">Reservations evenements</h2>';

    // KPIs
    var totalRes = data.reservations.length;
    var totalPlaces = data.events.reduce(function(s,e){return s+e.max;},0);
    var fullEvents = data.events.filter(function(e){return getReservationsForEvent(e.id).length>=e.max;}).length;
    html += '<div class="kpi-grid">';
    html += '<div class="kpi-card"><div class="kpi-icon">🎫</div><div class="kpi-value">' + totalRes + '</div><div class="kpi-label">Reservations totales</div></div>';
    html += '<div class="kpi-card"><div class="kpi-icon">🏟️</div><div class="kpi-value">' + totalPlaces + '</div><div class="kpi-label">Places totales</div></div>';
    html += '<div class="kpi-card"><div class="kpi-icon">📊</div><div class="kpi-value">' + data.events.length + '</div><div class="kpi-label">Evenements</div></div>';
    html += '<div class="kpi-card' + (fullEvents>0?' danger':'') + '"><div class="kpi-icon">🔒</div><div class="kpi-value">' + fullEvents + '</div><div class="kpi-label">Complets</div></div>';
    html += '</div>';

    // Toolbar
    html += '<div class="erp-toolbar">';
    html += '<button class="erp-btn erp-btn-gold" onclick="EXTRA_MOD.resAddEvent()">+ Ajouter un evenement</button>';
    html += '<button class="erp-btn erp-btn-green" onclick="EXTRA_MOD.resAddReservation()">+ Nouvelle reservation</button>';
    html += '</div>';

    // Events table
    html += '<div class="erp-table-wrap"><table class="erp-table"><thead><tr><th>Evenement</th><th>Date</th><th>Heure</th><th>Lieu</th><th>Jauge</th><th>Inscrits</th><th>Restant</th><th>Statut</th><th>Actions</th></tr></thead><tbody>';
    data.events.forEach(function(ev) {
      var count = getReservationsForEvent(ev.id).length;
      var remaining = ev.max - count;
      var full = remaining <= 0;
      html += '<tr>';
      html += '<td style="color:#E8E4DC;font-weight:600;">' + esc(ev.name) + '</td>';
      html += '<td>' + fmtDate(ev.date) + '</td>';
      html += '<td>' + esc(ev.time) + '</td>';
      html += '<td>' + esc(ev.lieu) + '</td>';
      html += '<td>' + ev.max + '</td>';
      html += '<td style="font-weight:700;color:#C9A84C;">' + count + '</td>';
      html += '<td style="font-weight:700;color:' + (full?'#DC2626':'#22C55E') + ';">' + (full?'0':remaining) + '</td>';
      html += '<td>' + (full?badgeHtml('Complet — liste d\'attente','overdue'):badgeHtml('Ouvert','paid')) + '</td>';
      html += '<td><button class="erp-btn erp-btn-outline erp-btn-sm" onclick="EXTRA_MOD.resViewEvent(\'' + ev.id + '\')">Voir inscrits</button> ';
      html += '<button class="erp-btn erp-btn-blue erp-btn-sm" onclick="EXTRA_MOD.resExportCSV(\'' + ev.id + '\')">CSV</button></td>';
      html += '</tr>';
    });
    html += '</tbody></table></div>';

    html += '</div>';
    el.innerHTML = html;
  }

  EXTRA_MOD.resAddEvent = function() {
    var modal = buildModal('Ajouter un evenement', [
      {id:'ev-name',label:'Nom de l\'evenement',type:'text',placeholder:'Ex: Masterclass fumage'},
      {id:'ev-date',label:'Date',type:'date',value:'2026-06-12'},
      {id:'ev-time',label:'Heure',type:'time',value:'10:00'},
      {id:'ev-lieu',label:'Lieu',type:'text',placeholder:'Ex: Salle Curie'},
      {id:'ev-max',label:'Jauge max',type:'number',value:'100'}
    ], function() {
      var ev = {
        id: uid('E'),
        name: document.getElementById('ev-name').value.trim(),
        date: document.getElementById('ev-date').value,
        time: document.getElementById('ev-time').value,
        lieu: document.getElementById('ev-lieu').value.trim(),
        max: parseInt(document.getElementById('ev-max').value)||100,
        reservations: []
      };
      if (!ev.name) { alert('Nom requis'); return; }
      data.events.push(ev);
      saveData(data);
      closeExtraModal();
      render();
    });
    showExtraModal(modal);
  };

  EXTRA_MOD.resAddReservation = function() {
    var opts = data.events.map(function(e) {
      var count = getReservationsForEvent(e.id).length;
      return {value:e.id, label:e.name + ' (' + count + '/' + e.max + ')'};
    });
    var modal = buildModal('Nouvelle reservation', [
      {id:'res-name',label:'Nom complet',type:'text',placeholder:'Prenom Nom'},
      {id:'res-email',label:'Email',type:'email',placeholder:'email@example.com'},
      {id:'res-phone',label:'Telephone',type:'tel',placeholder:'06 12 34 56 78'},
      {id:'res-event',label:'Evenement',type:'select',options:opts}
    ], function() {
      var r = {
        id: uid('R'),
        name: document.getElementById('res-name').value.trim(),
        email: document.getElementById('res-email').value.trim(),
        phone: document.getElementById('res-phone').value.trim(),
        eventId: document.getElementById('res-event').value,
        scanned: false,
        scanTime: null
      };
      if (!r.name || !r.email) { alert('Nom et email requis'); return; }
      var ev = getEvent(r.eventId);
      var count = getReservationsForEvent(r.eventId).length;
      if (ev && count >= ev.max) {
        if (!confirm('Evenement complet ! Ajouter en liste d\'attente ?')) return;
      }
      data.reservations.push(r);
      saveData(data);
      closeExtraModal();
      render();
      // Auto-confirmation mailto
      var subject = encodeURIComponent('Confirmation reservation — ' + (ev?ev.name:''));
      var body = encodeURIComponent('Bonjour ' + r.name + ',\n\nVotre reservation pour "' + (ev?ev.name:'') + '" le ' + (ev?fmtDate(ev.date):'') + ' a ' + (ev?ev.time:'') + ' est confirmee.\n\nLieu : ' + (ev?ev.lieu:'') + '\n\nA bientot !\nCongres de la Saucisse 2026');
      window.open('mailto:' + r.email + '?subject=' + subject + '&body=' + body, '_blank');
    });
    showExtraModal(modal);
  };

  EXTRA_MOD.resViewEvent = function(eid) {
    data = loadData();
    var ev = getEvent(eid);
    if (!ev) return;
    var resa = getReservationsForEvent(eid);
    var html = '<h2 style="color:#C9A84C;margin-bottom:16px;">' + esc(ev.name) + '</h2>';
    html += '<p style="color:#9B978F;margin-bottom:16px;">' + fmtDate(ev.date) + ' a ' + ev.time + ' — ' + esc(ev.lieu) + ' — ' + resa.length + '/' + ev.max + ' inscrits</p>';
    if (resa.length === 0) {
      html += '<p style="color:#5F5C55;">Aucune reservation.</p>';
    } else {
      html += '<table class="erp-table"><thead><tr><th>#</th><th>Nom</th><th>Email</th><th>Telephone</th><th>Scanne</th></tr></thead><tbody>';
      resa.forEach(function(r, i) {
        html += '<tr><td>' + (i+1) + '</td><td style="color:#E8E4DC;">' + esc(r.name) + '</td><td>' + esc(r.email) + '</td><td>' + esc(r.phone) + '</td><td>' + (r.scanned?'✅':'—') + '</td></tr>';
      });
      html += '</tbody></table>';
    }
    showExtraModal(html);
  };

  EXTRA_MOD.resExportCSV = function(eid) {
    data = loadData();
    var ev = getEvent(eid);
    var resa = getReservationsForEvent(eid);
    var csv = 'Nom,Email,Telephone,Scanne\n';
    resa.forEach(function(r) {
      csv += '"' + r.name + '","' + r.email + '","' + r.phone + '",' + (r.scanned?'Oui':'Non') + '\n';
    });
    downloadCSV(csv, 'reservations_' + (ev?ev.id:'') + '.csv');
  };

  render();
};

// ══════════════════════════════════════════════════════════
// 2. BADGES & QR
// ══════════════════════════════════════════════════════════
SPA_INIT['badges'] = function() {
  var el = document.getElementById('section-badges');
  var data = loadData();
  var scannerInstance = null;

  function getEvent(id) { return data.events.find(function(e){return e.id===id;}); }

  function render() {
    data = loadData();
    var html = '<div class="erp-content">';
    html += '<h2 class="panel-title">Badges & QR Codes</h2>';

    // KPIs
    var totalRes = data.reservations.length;
    var scanned = data.reservations.filter(function(r){return r.scanned;}).length;
    html += '<div class="kpi-grid">';
    html += '<div class="kpi-card"><div class="kpi-icon">🎟️</div><div class="kpi-value">' + totalRes + '</div><div class="kpi-label">Badges a generer</div></div>';
    html += '<div class="kpi-card success"><div class="kpi-icon">✅</div><div class="kpi-value">' + scanned + '</div><div class="kpi-label">Scannes</div></div>';
    html += '<div class="kpi-card"><div class="kpi-icon">⏳</div><div class="kpi-value">' + (totalRes-scanned) + '</div><div class="kpi-label">Non scannes</div></div>';
    html += '</div>';

    // --- Badge Generation Section ---
    html += adminCard('Generer des badges', '<div class="erp-toolbar">' +
      '<select id="badge-event-select"><option value="">-- Tous les evenements --</option>' +
      data.events.map(function(e){return '<option value="'+e.id+'">'+esc(e.name)+'</option>';}).join('') +
      '</select>' +
      '<button class="erp-btn erp-btn-gold" onclick="EXTRA_MOD.badgeGenerate()">Generer les badges</button>' +
      '<button class="erp-btn erp-btn-outline" onclick="EXTRA_MOD.badgePrintAll()">Imprimer (A6)</button>' +
      '</div><div id="badges-preview" style="display:flex;flex-wrap:wrap;gap:16px;margin-top:16px;"></div>');

    // --- QR Scanner Section ---
    html += adminCard('Scanner un badge (entree)', '<div style="max-width:400px;margin:0 auto;">' +
      '<div id="qr-reader" style="width:100%;border-radius:12px;overflow:hidden;margin-bottom:16px;"></div>' +
      '<div style="text-align:center;">' +
      '<button class="erp-btn erp-btn-green" onclick="EXTRA_MOD.scannerStart()" id="btn-scan-start">Demarrer le scanner</button>' +
      '<button class="erp-btn erp-btn-red" onclick="EXTRA_MOD.scannerStop()" id="btn-scan-stop" style="display:none;">Arreter</button>' +
      '</div>' +
      '<div id="scan-result" style="margin-top:16px;padding:20px;border-radius:12px;text-align:center;display:none;"></div>' +
      '</div>');

    // Manual scan input
    html += adminCard('Saisie manuelle du code', '<div class="erp-toolbar">' +
      '<input type="text" id="manual-scan-input" placeholder="Ex: R001 ou collez le QR code">' +
      '<button class="erp-btn erp-btn-gold" onclick="EXTRA_MOD.manualScan()">Valider</button></div>');

    // --- Scan History ---
    html += adminCard('Historique des scans', '<div id="scan-history-list"></div>' +
      '<button class="erp-btn erp-btn-outline" onclick="EXTRA_MOD.exportScanHistory()" style="margin-top:12px;">Exporter scannes/non-scannes</button>');

    html += '</div>';
    el.innerHTML = html;

    renderScanHistory();
  }

  function renderScanHistory() {
    data = loadData();
    var hist = data.scanHistory || [];
    var container = document.getElementById('scan-history-list');
    if (!container) return;
    if (hist.length === 0) { container.innerHTML = '<p style="color:#5F5C55;">Aucun scan enregistre.</p>'; return; }
    var h = '<table class="erp-table"><thead><tr><th>Heure</th><th>Participant</th><th>Evenement</th><th>Resultat</th></tr></thead><tbody>';
    hist.slice().reverse().forEach(function(s) {
      var cls = s.valid ? 'color:#22C55E' : 'color:#DC2626';
      h += '<tr><td>' + new Date(s.time).toLocaleString('fr-FR') + '</td><td>' + esc(s.name||'-') + '</td><td>' + esc(s.event||'-') + '</td><td style="font-weight:700;' + cls + ';">' + (s.valid?'✅ Valide':'❌ '+esc(s.reason||'Invalide')) + '</td></tr>';
    });
    h += '</tbody></table>';
    container.innerHTML = h;
  }

  function processScan(code) {
    data = loadData();
    var resultEl = document.getElementById('scan-result');
    if (!resultEl) return;
    resultEl.style.display = 'block';
    // Find reservation
    var resa = data.reservations.find(function(r){return r.id === code;});
    var entry = { time: new Date().toISOString(), code: code };
    if (!resa) {
      entry.valid = false; entry.reason = 'Code inconnu'; entry.name = '?'; entry.event = '?';
      resultEl.style.background = 'rgba(220,38,38,.15)';
      resultEl.innerHTML = '<div style="font-size:2rem;margin-bottom:8px;">❌</div><div style="color:#DC2626;font-weight:700;font-size:1.1rem;">Badge invalide</div><div style="color:#9B978F;margin-top:4px;">Code : ' + esc(code) + '</div>';
    } else if (resa.scanned) {
      var ev = getEvent(resa.eventId);
      entry.valid = false; entry.reason = 'Deja scanne'; entry.name = resa.name; entry.event = ev?ev.name:'?';
      resultEl.style.background = 'rgba(245,158,11,.15)';
      resultEl.innerHTML = '<div style="font-size:2rem;margin-bottom:8px;">⚠️</div><div style="color:#F59E0B;font-weight:700;font-size:1.1rem;">Deja scanne</div><div style="color:#E8E4DC;margin-top:4px;">' + esc(resa.name) + '</div><div style="color:#9B978F;">Scanne a ' + new Date(resa.scanTime).toLocaleString('fr-FR') + '</div>';
    } else {
      resa.scanned = true;
      resa.scanTime = new Date().toISOString();
      var ev = getEvent(resa.eventId);
      entry.valid = true; entry.name = resa.name; entry.event = ev?ev.name:'?';
      resultEl.style.background = 'rgba(34,197,94,.15)';
      resultEl.innerHTML = '<div style="font-size:2rem;margin-bottom:8px;">✅</div><div style="color:#22C55E;font-weight:700;font-size:1.1rem;">Entree validee</div><div style="color:#E8E4DC;margin-top:8px;font-size:1.05rem;">' + esc(resa.name) + '</div><div style="color:#9B978F;">' + (ev?esc(ev.name):'') + '</div>';
    }
    if (!data.scanHistory) data.scanHistory = [];
    data.scanHistory.push(entry);
    saveData(data);
    renderScanHistory();
  }

  EXTRA_MOD.badgeGenerate = function() {
    data = loadData();
    var eventFilter = document.getElementById('badge-event-select').value;
    var container = document.getElementById('badges-preview');
    if (!container) return;
    var resa = data.reservations;
    if (eventFilter) resa = resa.filter(function(r){return r.eventId===eventFilter;});
    if (resa.length === 0) { container.innerHTML = '<p style="color:#5F5C55;">Aucune reservation.</p>'; return; }

    container.innerHTML = '';
    resa.forEach(function(r) {
      var ev = getEvent(r.eventId);
      var card = document.createElement('div');
      card.className = 'badge-card-print';
      card.style.cssText = 'width:280px;background:#FFF;border-radius:12px;padding:20px;color:#111;text-align:center;font-family:Georgia,serif;';

      var qrDiv = document.createElement('div');
      qrDiv.style.cssText = 'margin:12px auto;width:120px;height:120px;';

      // Use qrcode-generator if available, else fallback to our SVG generator
      if (typeof qrcode !== 'undefined') {
        var qr = qrcode(0, 'M');
        qr.addData(r.id);
        qr.make();
        qrDiv.innerHTML = qr.createSvgTag(3, 0);
      } else if (typeof generateQRSVG === 'function') {
        qrDiv.innerHTML = generateQRSVG(r.id, 120);
      } else {
        qrDiv.innerHTML = '<div style="width:120px;height:120px;background:#EEE;display:flex;align-items:center;justify-content:center;font-size:.7rem;color:#999;">QR ' + r.id + '</div>';
      }

      card.innerHTML = '<div style="font-size:.65rem;color:#999;margin-bottom:4px;">CONGRES DE LA SAUCISSE 2026</div>' +
        '<div style="font-size:1.1rem;font-weight:700;margin-bottom:4px;">' + esc(r.name) + '</div>' +
        '<div style="font-size:.75rem;color:#666;margin-bottom:8px;">' + (ev?esc(ev.name):'') + '</div>' +
        '<div style="font-size:.72rem;color:#999;">' + (ev?fmtDate(ev.date)+' — '+ev.time:'') + '</div>' +
        '<div style="font-size:.72rem;color:#999;margin-bottom:8px;">' + (ev?esc(ev.lieu):'') + '</div>';
      card.appendChild(qrDiv);
      card.innerHTML += '<div style="font-size:.6rem;color:#BBB;margin-top:8px;">ID: ' + r.id + '</div>';
      container.appendChild(card);
    });
  };

  EXTRA_MOD.badgePrintAll = function() {
    var container = document.getElementById('badges-preview');
    if (!container || !container.innerHTML.trim()) {
      alert('Generez d\'abord les badges.'); return;
    }
    var w = window.open('','','width=800,height=600');
    w.document.write('<html><head><title>Badges — Congres de la Saucisse</title><style>');
    w.document.write('@page { size: A6; margin: 8mm; } body { font-family: Georgia, serif; } .badge-card-print { width: 90mm; height: 120mm; page-break-inside: avoid; page-break-after: always; border: 1px solid #DDD; border-radius: 8px; padding: 12px; text-align: center; display: inline-block; margin: 4px; box-sizing: border-box; }');
    w.document.write('</style></head><body>');
    w.document.write(container.innerHTML);
    w.document.write('</body></html>');
    w.document.close();
    w.print();
  };

  EXTRA_MOD.scannerStart = function() {
    var readerEl = document.getElementById('qr-reader');
    if (!readerEl) return;
    if (typeof Html5QrcodeScanner === 'undefined' && typeof Html5Qrcode === 'undefined') {
      // Load dynamically
      var s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js';
      s.onload = function() { startScanner(); };
      document.head.appendChild(s);
    } else {
      startScanner();
    }
    function startScanner() {
      document.getElementById('btn-scan-start').style.display = 'none';
      document.getElementById('btn-scan-stop').style.display = 'inline-flex';
      try {
        scannerInstance = new Html5Qrcode('qr-reader');
        scannerInstance.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          function(decodedText) { processScan(decodedText); }
        ).catch(function(err) {
          readerEl.innerHTML = '<p style="color:#DC2626;padding:20px;">Camera non disponible : ' + err + '</p>';
        });
      } catch(e) {
        readerEl.innerHTML = '<p style="color:#DC2626;padding:20px;">Erreur scanner : ' + e.message + '</p>';
      }
    }
  };

  EXTRA_MOD.scannerStop = function() {
    document.getElementById('btn-scan-start').style.display = 'inline-flex';
    document.getElementById('btn-scan-stop').style.display = 'none';
    if (scannerInstance) {
      try { scannerInstance.stop(); } catch(e) {}
      scannerInstance = null;
    }
    var readerEl = document.getElementById('qr-reader');
    if (readerEl) readerEl.innerHTML = '';
  };

  EXTRA_MOD.manualScan = function() {
    var code = (document.getElementById('manual-scan-input').value||'').trim();
    if (!code) return;
    processScan(code);
    document.getElementById('manual-scan-input').value = '';
  };

  EXTRA_MOD.exportScanHistory = function() {
    data = loadData();
    var csv = 'Nom,Email,Evenement,Scanne,Heure scan\n';
    data.reservations.forEach(function(r) {
      var ev = getEvent(r.eventId);
      csv += '"' + r.name + '","' + r.email + '","' + (ev?ev.name:'') + '",' + (r.scanned?'Oui':'Non') + ',"' + (r.scanTime?new Date(r.scanTime).toLocaleString('fr-FR'):'') + '"\n';
    });
    downloadCSV(csv, 'scan_status_' + new Date().toISOString().slice(0,10) + '.csv');
  };

  render();
};

// ══════════════════════════════════════════════════════════
// 3. CONFERENCIERS
// ══════════════════════════════════════════════════════════
SPA_INIT['conferenciers'] = function() {
  var el = document.getElementById('section-conferenciers');
  var data = loadData();

  function getEvent(id) { return data.events.find(function(e){return e.id===id;}); }

  function render(filterTheme, filterName) {
    data = loadData();
    filterTheme = filterTheme || '';
    filterName = (filterName || '').toLowerCase();
    var speakers = data.speakers;
    if (filterTheme) speakers = speakers.filter(function(s){return s.theme===filterTheme;});
    if (filterName) speakers = speakers.filter(function(s){return s.name.toLowerCase().indexOf(filterName)!==-1;});

    var themes = [];
    data.speakers.forEach(function(s) { if (themes.indexOf(s.theme)===-1) themes.push(s.theme); });

    var html = '<div class="erp-content">';
    html += '<h2 class="panel-title">Conferenciers</h2>';
    html += '<div class="kpi-grid">';
    html += '<div class="kpi-card"><div class="kpi-icon">🎤</div><div class="kpi-value">' + data.speakers.length + '</div><div class="kpi-label">Conferenciers</div></div>';
    html += '<div class="kpi-card"><div class="kpi-icon">📚</div><div class="kpi-value">' + themes.length + '</div><div class="kpi-label">Themes</div></div>';
    html += '</div>';

    // Toolbar
    html += '<div class="erp-toolbar">';
    html += '<input type="search" id="conf-search" placeholder="Rechercher par nom..." value="' + esc(filterName) + '" oninput="EXTRA_MOD.confFilter()">';
    html += '<select id="conf-theme-filter" onchange="EXTRA_MOD.confFilter()"><option value="">Tous les themes</option>';
    themes.forEach(function(t) { html += '<option value="' + esc(t) + '"' + (filterTheme===t?' selected':'') + '>' + esc(t) + '</option>'; });
    html += '</select>';
    html += '<button class="erp-btn erp-btn-gold" onclick="EXTRA_MOD.confAdd()">+ Ajouter conferencier</button>';
    html += '</div>';

    // Cards grid
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;">';
    speakers.forEach(function(sp) {
      var evNames = (sp.events||[]).map(function(eid){var e=getEvent(eid);return e?e.name:'?';}).join(', ');
      html += '<div class="erp-section-card" style="cursor:pointer;" onclick="EXTRA_MOD.confView(\'' + sp.id + '\')">';
      html += '<div style="display:flex;gap:16px;align-items:center;">';
      html += '<div style="width:56px;height:56px;border-radius:50%;background:rgba(201,168,76,.15);display:flex;align-items:center;justify-content:center;font-size:1.3rem;font-weight:800;color:#C9A84C;flex-shrink:0;">' + esc(sp.name.split(' ').map(function(w){return w[0];}).join('').substring(0,2)) + '</div>';
      html += '<div><div style="font-weight:700;color:#E8E4DC;">' + esc(sp.name) + '</div>';
      html += '<div style="font-size:.78rem;color:#C9A84C;">' + esc(sp.title) + '</div>';
      html += '<div style="font-size:.75rem;color:#9B978F;">' + esc(sp.org) + '</div>';
      html += '</div></div>';
      html += '<div style="margin-top:12px;font-size:.78rem;color:#9B978F;line-height:1.6;">' + esc(sp.bio).substring(0,120) + '...</div>';
      if (evNames) html += '<div style="margin-top:8px;font-size:.72rem;color:#5F5C55;">Sessions : ' + esc(evNames) + '</div>';
      html += '<div style="margin-top:8px;">' + badgeHtml(sp.theme||'','prospect') + '</div>';
      html += '<div style="margin-top:12px;display:flex;gap:6px;">';
      html += '<button class="erp-btn erp-btn-outline erp-btn-sm" onclick="event.stopPropagation();EXTRA_MOD.confEdit(\'' + sp.id + '\')">Modifier</button>';
      html += '<button class="erp-btn erp-btn-blue erp-btn-sm" onclick="event.stopPropagation();EXTRA_MOD.confPrint(\'' + sp.id + '\')">Imprimer fiche</button>';
      html += '</div></div>';
    });
    html += '</div>';
    html += '</div>';
    el.innerHTML = html;
  }

  EXTRA_MOD.confFilter = function() {
    var name = (document.getElementById('conf-search')||{}).value || '';
    var theme = (document.getElementById('conf-theme-filter')||{}).value || '';
    render(theme, name);
  };

  EXTRA_MOD.confAdd = function() {
    var evOpts = data.events.map(function(e){return {value:e.id,label:e.name};});
    var modal = buildModal('Ajouter conferencier', [
      {id:'conf-name',label:'Nom complet',type:'text'},
      {id:'conf-title',label:'Titre / Fonction',type:'text'},
      {id:'conf-org',label:'Organisation',type:'text'},
      {id:'conf-bio',label:'Biographie',type:'textarea'},
      {id:'conf-theme',label:'Theme',type:'text',placeholder:'Ex: Gastronomie'},
      {id:'conf-events',label:'Sessions (maintenir Ctrl pour multi)',type:'select-multi',options:evOpts}
    ], function() {
      var sp = {
        id: uid('S'),
        name: document.getElementById('conf-name').value.trim(),
        title: document.getElementById('conf-title').value.trim(),
        org: document.getElementById('conf-org').value.trim(),
        bio: document.getElementById('conf-bio').value.trim(),
        theme: document.getElementById('conf-theme').value.trim(),
        events: getMultiSelectValues('conf-events'),
        photo: ''
      };
      if (!sp.name) { alert('Nom requis'); return; }
      data.speakers.push(sp);
      saveData(data);
      closeExtraModal();
      render();
    });
    showExtraModal(modal);
  };

  EXTRA_MOD.confEdit = function(id) {
    data = loadData();
    var sp = data.speakers.find(function(s){return s.id===id;});
    if (!sp) return;
    var evOpts = data.events.map(function(e){return {value:e.id,label:e.name,selected:(sp.events||[]).indexOf(e.id)!==-1};});
    var modal = buildModal('Modifier conferencier', [
      {id:'conf-name',label:'Nom complet',type:'text',value:sp.name},
      {id:'conf-title',label:'Titre / Fonction',type:'text',value:sp.title},
      {id:'conf-org',label:'Organisation',type:'text',value:sp.org},
      {id:'conf-bio',label:'Biographie',type:'textarea',value:sp.bio},
      {id:'conf-theme',label:'Theme',type:'text',value:sp.theme},
      {id:'conf-events',label:'Sessions',type:'select-multi',options:evOpts}
    ], function() {
      sp.name = document.getElementById('conf-name').value.trim();
      sp.title = document.getElementById('conf-title').value.trim();
      sp.org = document.getElementById('conf-org').value.trim();
      sp.bio = document.getElementById('conf-bio').value.trim();
      sp.theme = document.getElementById('conf-theme').value.trim();
      sp.events = getMultiSelectValues('conf-events');
      saveData(data);
      closeExtraModal();
      render();
    });
    showExtraModal(modal);
  };

  EXTRA_MOD.confView = function(id) {
    data = loadData();
    var sp = data.speakers.find(function(s){return s.id===id;});
    if (!sp) return;
    var evNames = (sp.events||[]).map(function(eid){var e=getEvent(eid);return e?'<li>'+esc(e.name)+' — '+fmtDate(e.date)+' '+e.time+'</li>':'';}).join('');
    var html = '<div style="text-align:center;margin-bottom:20px;">';
    html += '<div style="width:80px;height:80px;border-radius:50%;background:rgba(201,168,76,.15);display:inline-flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:800;color:#C9A84C;">' + esc(sp.name.split(' ').map(function(w){return w[0];}).join('').substring(0,2)) + '</div>';
    html += '<h2 style="color:#E8E4DC;margin-top:12px;">' + esc(sp.name) + '</h2>';
    html += '<div style="color:#C9A84C;font-size:.88rem;">' + esc(sp.title) + '</div>';
    html += '<div style="color:#9B978F;font-size:.82rem;">' + esc(sp.org) + '</div>';
    html += '</div>';
    html += '<div style="color:#9B978F;line-height:1.8;margin-bottom:16px;">' + esc(sp.bio) + '</div>';
    if (evNames) html += '<h3 style="color:#C9A84C;font-size:.88rem;margin-bottom:8px;">Sessions</h3><ul style="color:#9B978F;font-size:.82rem;line-height:1.8;">' + evNames + '</ul>';
    showExtraModal(html);
  };

  EXTRA_MOD.confPrint = function(id) {
    data = loadData();
    var sp = data.speakers.find(function(s){return s.id===id;});
    if (!sp) return;
    var w = window.open('','','width=600,height=400');
    w.document.write('<html><head><title>Fiche conferencier — ' + esc(sp.name) + '</title><style>body{font-family:Georgia,serif;padding:40px;max-width:600px;margin:auto;} h1{font-size:1.4rem;} .meta{color:#666;font-size:.88rem;} .bio{line-height:1.8;margin-top:16px;}</style></head><body>');
    w.document.write('<p style="text-align:center;color:#999;font-size:.8rem;">CONGRES DE LA SAUCISSE — STRASBOURG 2026</p>');
    w.document.write('<h1 style="text-align:center;">' + esc(sp.name) + '</h1>');
    w.document.write('<p class="meta" style="text-align:center;">' + esc(sp.title) + '<br>' + esc(sp.org) + '</p>');
    w.document.write('<p class="bio">' + esc(sp.bio) + '</p>');
    w.document.write('</body></html>');
    w.document.close();
    w.print();
  };

  render();
};

// ══════════════════════════════════════════════════════════
// 4. BENEVOLES
// ══════════════════════════════════════════════════════════
SPA_INIT['benevoles'] = function() {
  var el = document.getElementById('section-benevoles');
  var data = loadData();

  var DAYS = ['2026-06-12','2026-06-13','2026-06-14'];
  var DAY_LABELS = {'2026-06-12':'Jeu. 12','2026-06-13':'Ven. 13','2026-06-14':'Sam. 14'};
  var SLOTS = ['08:00-12:00','12:00-14:00','14:00-18:00','18:00-22:00'];
  var LIEUX = ['Hall Europe','Salle Erasme','Salle Schweitzer','Salle Curie','Accueil','Regie technique'];
  var STATUS_MAP = {candidat:{label:'Candidat',cls:'pending'},confirme:{label:'Confirme',cls:'paid'},affecte:{label:'Affecte',cls:'confirmed'}};

  function render() {
    data = loadData();
    var total = data.volunteers.length;
    var confirmes = data.volunteers.filter(function(v){return v.status==='confirme'||v.status==='affecte';}).length;
    var affectes = data.volunteers.filter(function(v){return v.status==='affecte';}).length;

    var html = '<div class="erp-content">';
    html += '<h2 class="panel-title">Benevoles</h2>';

    // KPIs
    html += '<div class="kpi-grid">';
    html += '<div class="kpi-card"><div class="kpi-icon">👥</div><div class="kpi-value">' + total + '</div><div class="kpi-label">Benevoles total</div></div>';
    html += '<div class="kpi-card success"><div class="kpi-icon">✅</div><div class="kpi-value">' + confirmes + '</div><div class="kpi-label">Confirmes</div></div>';
    html += '<div class="kpi-card"><div class="kpi-icon">📋</div><div class="kpi-value">' + affectes + '</div><div class="kpi-label">Affectes</div></div>';
    html += '<div class="kpi-card"><div class="kpi-icon">⏳</div><div class="kpi-value">' + (total-confirmes) + '</div><div class="kpi-label">Candidatures</div></div>';
    html += '</div>';

    // Toolbar
    html += '<div class="erp-toolbar">';
    html += '<button class="erp-btn erp-btn-gold" onclick="EXTRA_MOD.benAdd()">+ Recruter benevole</button>';
    html += '<button class="erp-btn erp-btn-outline" onclick="EXTRA_MOD.benExportCSV()">Exporter CSV</button>';
    html += '</div>';

    // Volunteer list
    html += '<div class="erp-table-wrap"><table class="erp-table"><thead><tr><th>Nom</th><th>Email</th><th>Telephone</th><th>Disponibilites</th><th>Competences</th><th>Statut</th><th>Actions</th></tr></thead><tbody>';
    data.volunteers.forEach(function(v) {
      var sDays = (v.availability||[]).map(function(d){return DAY_LABELS[d]||d;}).join(', ');
      var st = STATUS_MAP[v.status] || STATUS_MAP.candidat;
      html += '<tr>';
      html += '<td style="color:#E8E4DC;font-weight:600;">' + esc(v.name) + '</td>';
      html += '<td>' + esc(v.email) + '</td>';
      html += '<td>' + esc(v.phone) + '</td>';
      html += '<td style="font-size:.75rem;">' + esc(sDays) + '</td>';
      html += '<td style="font-size:.75rem;">' + esc(v.skills) + '</td>';
      html += '<td>' + badgeHtml(st.label, st.cls) + '</td>';
      html += '<td>';
      html += '<button class="erp-btn erp-btn-outline erp-btn-sm" onclick="EXTRA_MOD.benView(\'' + v.id + '\')">Voir</button> ';
      if (v.status === 'candidat') html += '<button class="erp-btn erp-btn-green erp-btn-sm" onclick="EXTRA_MOD.benConfirm(\'' + v.id + '\')">Confirmer</button> ';
      html += '<button class="erp-btn erp-btn-blue erp-btn-sm" onclick="EXTRA_MOD.benAssign(\'' + v.id + '\')">Affecter</button>';
      html += '</td></tr>';
    });
    html += '</tbody></table></div>';

    // Planning grid
    html += adminCard('Planning benevoles', renderPlanningGrid());

    // Moderateur section
    html += adminCard('Moderateurs', '<p style="color:#9B978F;font-size:.82rem;margin-bottom:12px;">Benevoles confirmes avec expertise specifique assignes a la moderation de conferences.</p>' +
      '<div id="moderateurs-list">' + renderModerateurs() + '</div>');

    html += '</div>';
    el.innerHTML = html;
  }

  function renderPlanningGrid() {
    var h = '<div style="overflow-x:auto;"><table class="erp-table"><thead><tr><th>Jour</th><th>Creneau</th><th>Lieu</th><th>Benevole(s)</th></tr></thead><tbody>';
    DAYS.forEach(function(day) {
      SLOTS.forEach(function(slot, si) {
        LIEUX.forEach(function(lieu, li) {
          // Find assigned volunteers
          var assigned = data.volunteers.filter(function(v) {
            return (v.assignments||[]).some(function(a){return a.day===day && a.slot===slot && a.lieu===lieu;});
          });
          if (si === 0 && li === 0) {
            h += '<tr><td rowspan="' + (SLOTS.length*LIEUX.length) + '" style="color:#C9A84C;font-weight:700;vertical-align:top;">' + (DAY_LABELS[day]||day) + '</td>';
          } else if (li === 0) {
            h += '<tr>';
          } else {
            h += '<tr>';
          }
          if (li === 0) h += '<td rowspan="' + LIEUX.length + '" style="font-weight:600;">' + slot + '</td>';
          h += '<td style="font-size:.78rem;">' + esc(lieu) + '</td>';
          h += '<td style="font-size:.78rem;">' + (assigned.length?assigned.map(function(v){return esc(v.name);}).join(', '):'<span style="color:#5F5C55;">—</span>') + '</td>';
          h += '</tr>';
        });
      });
    });
    h += '</tbody></table></div>';
    return h;
  }

  function renderModerateurs() {
    var mods = data.volunteers.filter(function(v) { return v.preferences && v.preferences.toLowerCase().indexOf('moder') !== -1; });
    if (mods.length === 0) return '<p style="color:#5F5C55;font-size:.82rem;">Aucun moderateur designe. Affectez des benevoles avec la preference "Moderation".</p>';
    return mods.map(function(v) {
      return '<div style="padding:12px;border:1px solid rgba(201,168,76,.1);border-radius:10px;margin-bottom:8px;"><div style="font-weight:700;color:#E8E4DC;">' + esc(v.name) + '</div><div style="font-size:.78rem;color:#9B978F;">' + esc(v.skills) + '</div></div>';
    }).join('');
  }

  EXTRA_MOD.benAdd = function() {
    var dayOpts = DAYS.map(function(d){return {value:d,label:DAY_LABELS[d]||d};});
    var modal = buildModal('Recruter un benevole', [
      {id:'ben-name',label:'Nom complet',type:'text'},
      {id:'ben-email',label:'Email',type:'email'},
      {id:'ben-phone',label:'Telephone',type:'tel'},
      {id:'ben-avail',label:'Disponibilites (Ctrl+clic)',type:'select-multi',options:dayOpts},
      {id:'ben-skills',label:'Competences',type:'text',placeholder:'Ex: Accueil, langues FR/DE'},
      {id:'ben-prefs',label:'Preferences',type:'text',placeholder:'Ex: Accueil visiteurs'}
    ], function() {
      var v = {
        id: uid('V'),
        name: document.getElementById('ben-name').value.trim(),
        email: document.getElementById('ben-email').value.trim(),
        phone: document.getElementById('ben-phone').value.trim(),
        availability: getMultiSelectValues('ben-avail'),
        skills: document.getElementById('ben-skills').value.trim(),
        preferences: document.getElementById('ben-prefs').value.trim(),
        status: 'candidat',
        assignments: []
      };
      if (!v.name || !v.email) { alert('Nom et email requis'); return; }
      data.volunteers.push(v);
      saveData(data);
      closeExtraModal();
      render();
    });
    showExtraModal(modal);
  };

  EXTRA_MOD.benConfirm = function(id) {
    data = loadData();
    var v = data.volunteers.find(function(x){return x.id===id;});
    if (v) { v.status = 'confirme'; saveData(data); render(); }
  };

  EXTRA_MOD.benAssign = function(id) {
    data = loadData();
    var v = data.volunteers.find(function(x){return x.id===id;});
    if (!v) return;
    var dayOpts = DAYS.map(function(d){return {value:d,label:DAY_LABELS[d]||d};});
    var slotOpts = SLOTS.map(function(s){return {value:s,label:s};});
    var lieuOpts = LIEUX.map(function(l){return {value:l,label:l};});
    var modal = buildModal('Affecter ' + v.name, [
      {id:'asgn-day',label:'Jour',type:'select',options:dayOpts},
      {id:'asgn-slot',label:'Creneau',type:'select',options:slotOpts},
      {id:'asgn-lieu',label:'Lieu',type:'select',options:lieuOpts}
    ], function() {
      var a = {
        day: document.getElementById('asgn-day').value,
        slot: document.getElementById('asgn-slot').value,
        lieu: document.getElementById('asgn-lieu').value
      };
      if (!v.assignments) v.assignments = [];
      v.assignments.push(a);
      v.status = 'affecte';
      saveData(data);
      closeExtraModal();
      render();
    });
    showExtraModal(modal);
  };

  EXTRA_MOD.benView = function(id) {
    data = loadData();
    var v = data.volunteers.find(function(x){return x.id===id;});
    if (!v) return;
    var st = STATUS_MAP[v.status] || STATUS_MAP.candidat;
    var sDays = (v.availability||[]).map(function(d){return DAY_LABELS[d]||d;}).join(', ');
    var html = '<h2 style="color:#E8E4DC;margin-bottom:16px;">' + esc(v.name) + ' ' + badgeHtml(st.label,st.cls) + '</h2>';
    html += '<p style="color:#9B978F;"><strong>Email :</strong> ' + esc(v.email) + '<br><strong>Tel :</strong> ' + esc(v.phone) + '</p>';
    html += '<p style="color:#9B978F;"><strong>Disponibilites :</strong> ' + esc(sDays) + '</p>';
    html += '<p style="color:#9B978F;"><strong>Competences :</strong> ' + esc(v.skills) + '</p>';
    html += '<p style="color:#9B978F;"><strong>Preferences :</strong> ' + esc(v.preferences) + '</p>';
    if (v.assignments && v.assignments.length) {
      html += '<h3 style="color:#C9A84C;margin-top:16px;font-size:.88rem;">Planning</h3>';
      html += '<table class="erp-table"><thead><tr><th>Jour</th><th>Creneau</th><th>Lieu</th></tr></thead><tbody>';
      v.assignments.forEach(function(a) {
        html += '<tr><td>' + (DAY_LABELS[a.day]||a.day) + '</td><td>' + a.slot + '</td><td>' + esc(a.lieu) + '</td></tr>';
      });
      html += '</tbody></table>';
    }
    // Badge download button
    html += '<div style="margin-top:16px;"><button class="erp-btn erp-btn-gold" onclick="EXTRA_MOD.benBadge(\'' + v.id + '\')">Telecharger badge benevole</button></div>';
    showExtraModal(html);
  };

  EXTRA_MOD.benBadge = function(id) {
    data = loadData();
    var v = data.volunteers.find(function(x){return x.id===id;});
    if (!v) return;
    var w = window.open('','','width=400,height=300');
    w.document.write('<html><head><title>Badge benevole</title><style>body{font-family:Georgia,serif;text-align:center;padding:40px;} .role{background:#C9A84C;color:#111;padding:4px 12px;border-radius:6px;font-weight:700;display:inline-block;margin-top:12px;}</style></head><body>');
    w.document.write('<p style="color:#999;font-size:.8rem;">CONGRES DE LA SAUCISSE 2026</p>');
    w.document.write('<h1 style="font-size:1.3rem;">' + esc(v.name) + '</h1>');
    w.document.write('<div class="role">BENEVOLE</div>');
    w.document.write('<p style="color:#666;margin-top:16px;">' + esc(v.skills) + '</p>');
    w.document.write('</body></html>');
    w.document.close();
    w.print();
  };

  EXTRA_MOD.benExportCSV = function() {
    data = loadData();
    var csv = 'Nom,Email,Telephone,Disponibilites,Competences,Preferences,Statut\n';
    data.volunteers.forEach(function(v) {
      var days = (v.availability||[]).map(function(d){return DAY_LABELS[d]||d;}).join(' + ');
      csv += '"' + v.name + '","' + v.email + '","' + v.phone + '","' + days + '","' + v.skills + '","' + v.preferences + '","' + v.status + '"\n';
    });
    downloadCSV(csv, 'benevoles_' + new Date().toISOString().slice(0,10) + '.csv');
  };

  render();
};

// ══════════════════════════════════════════════════════════
// 5. LOGISTIQUE
// ══════════════════════════════════════════════════════════
SPA_INIT['logistique'] = function() {
  var el = document.getElementById('section-logistique');
  var data = loadData();
  var STATUS_MAP = {a_reserver:{label:'A reserver',cls:'overdue'},reserve:{label:'Reserve',cls:'pending'},confirme:{label:'Confirme',cls:'paid'}};

  function render() {
    data = loadData();
    var totalBudget = data.logistics.reduce(function(s,l){return s+l.trainCost+l.hotelCost+l.perDiem;},0);
    var confirmed = data.logistics.filter(function(l){return l.trainStatus==='confirme'&&l.hotelStatus==='confirme';}).length;

    var html = '<div class="erp-content">';
    html += '<h2 class="panel-title">Logistique Intervenants</h2>';

    // KPIs
    html += '<div class="kpi-grid">';
    html += '<div class="kpi-card"><div class="kpi-icon">✈️</div><div class="kpi-value">' + data.logistics.length + '</div><div class="kpi-label">Intervenants a gerer</div></div>';
    html += '<div class="kpi-card success"><div class="kpi-icon">✅</div><div class="kpi-value">' + confirmed + '</div><div class="kpi-label">Tout confirme</div></div>';
    html += '<div class="kpi-card"><div class="kpi-icon">💰</div><div class="kpi-value">' + totalBudget.toLocaleString('fr-FR') + ' &euro;</div><div class="kpi-label">Budget total logistique</div></div>';
    html += '</div>';

    // Toolbar
    html += '<div class="erp-toolbar">';
    html += '<button class="erp-btn erp-btn-gold" onclick="EXTRA_MOD.logAdd()">+ Ajouter intervenant</button>';
    html += '</div>';

    // Table
    html += '<div class="erp-table-wrap"><table class="erp-table"><thead><tr><th>Intervenant</th><th>Depart</th><th>Arrivee</th><th>Dates</th><th>Nuitees</th><th>Train</th><th>Hotel</th><th>Per diem</th><th>Total</th><th>Status train</th><th>Status hotel</th><th>Actions</th></tr></thead><tbody>';
    data.logistics.forEach(function(l) {
      var total = l.trainCost + l.hotelCost + l.perDiem;
      var tSt = STATUS_MAP[l.trainStatus]||STATUS_MAP.a_reserver;
      var hSt = STATUS_MAP[l.hotelStatus]||STATUS_MAP.a_reserver;
      html += '<tr>';
      html += '<td style="color:#E8E4DC;font-weight:600;">' + esc(l.speakerName) + '</td>';
      html += '<td>' + esc(l.departure) + '</td>';
      html += '<td>' + esc(l.arrival) + '</td>';
      html += '<td>' + esc(l.dates) + '</td>';
      html += '<td>' + l.hotelNights + '</td>';
      html += '<td style="text-align:right;">' + l.trainCost.toLocaleString('fr-FR') + ' &euro;</td>';
      html += '<td style="text-align:right;">' + l.hotelCost.toLocaleString('fr-FR') + ' &euro;</td>';
      html += '<td style="text-align:right;">' + l.perDiem.toLocaleString('fr-FR') + ' &euro;</td>';
      html += '<td style="text-align:right;font-weight:700;color:#C9A84C;">' + total.toLocaleString('fr-FR') + ' &euro;</td>';
      html += '<td>' + badgeHtml(tSt.label,tSt.cls) + '</td>';
      html += '<td>' + badgeHtml(hSt.label,hSt.cls) + '</td>';
      html += '<td>';
      html += '<button class="erp-btn erp-btn-outline erp-btn-sm" onclick="EXTRA_MOD.logEdit(\'' + l.id + '\')">Modifier</button> ';
      html += '<button class="erp-btn erp-btn-blue erp-btn-sm" onclick="EXTRA_MOD.logEmail(\'' + l.id + '\')">Email</button>';
      html += '</td></tr>';
    });
    // Total row
    var totals = data.logistics.reduce(function(s,l){return {t:s.t+l.trainCost,h:s.h+l.hotelCost,p:s.p+l.perDiem};},{t:0,h:0,p:0});
    html += '<tr class="total-row"><td colspan="5">TOTAL</td><td style="text-align:right;">' + totals.t.toLocaleString('fr-FR') + ' &euro;</td><td style="text-align:right;">' + totals.h.toLocaleString('fr-FR') + ' &euro;</td><td style="text-align:right;">' + totals.p.toLocaleString('fr-FR') + ' &euro;</td><td style="text-align:right;">' + (totals.t+totals.h+totals.p).toLocaleString('fr-FR') + ' &euro;</td><td colspan="3"></td></tr>';
    html += '</tbody></table></div>';

    // Upload section
    html += adminCard('Documents de voyage', '<p style="color:#9B978F;font-size:.82rem;margin-bottom:12px;">Uploadez les billets de train et confirmations hotel pour chaque intervenant.</p>' +
      '<div class="drop-zone" onclick="document.getElementById(\'log-file-input\').click()">' +
      '<div class="dz-icon">📎</div><div class="dz-text">Glissez les documents ici</div><div class="dz-sub">PDF, JPG, PNG</div>' +
      '<input type="file" id="log-file-input" accept=".pdf,.jpg,.png" style="display:none" multiple>' +
      '</div>');

    html += '</div>';
    el.innerHTML = html;
  }

  EXTRA_MOD.logAdd = function() {
    var modal = buildModal('Ajouter intervenant logistique', [
      {id:'log-name',label:'Nom intervenant',type:'text'},
      {id:'log-dep',label:'Ville de depart',type:'text'},
      {id:'log-arr',label:'Ville d\'arrivee',type:'text',value:'Strasbourg'},
      {id:'log-dates',label:'Dates',type:'text',placeholder:'Ex: 11-14 juin'},
      {id:'log-nights',label:'Nuitees hotel',type:'number',value:'2'},
      {id:'log-train',label:'Cout train (euros)',type:'number',value:'200'},
      {id:'log-hotel',label:'Cout hotel (euros)',type:'number',value:'300'},
      {id:'log-perdiem',label:'Per diem (euros)',type:'number',value:'100'}
    ], function() {
      var l = {
        id: uid('L'),
        speakerName: document.getElementById('log-name').value.trim(),
        departure: document.getElementById('log-dep').value.trim(),
        arrival: document.getElementById('log-arr').value.trim(),
        dates: document.getElementById('log-dates').value.trim(),
        hotelNights: parseInt(document.getElementById('log-nights').value)||2,
        trainCost: parseInt(document.getElementById('log-train').value)||0,
        hotelCost: parseInt(document.getElementById('log-hotel').value)||0,
        perDiem: parseInt(document.getElementById('log-perdiem').value)||0,
        trainStatus: 'a_reserver',
        hotelStatus: 'a_reserver',
        trainDoc: null,
        hotelDoc: null
      };
      if (!l.speakerName) { alert('Nom requis'); return; }
      data.logistics.push(l);
      saveData(data);
      closeExtraModal();
      render();
    });
    showExtraModal(modal);
  };

  EXTRA_MOD.logEdit = function(id) {
    data = loadData();
    var l = data.logistics.find(function(x){return x.id===id;});
    if (!l) return;
    var statusOpts = [{value:'a_reserver',label:'A reserver'},{value:'reserve',label:'Reserve'},{value:'confirme',label:'Confirme'}];
    var modal = buildModal('Modifier logistique — ' + l.speakerName, [
      {id:'log-name',label:'Nom intervenant',type:'text',value:l.speakerName},
      {id:'log-dep',label:'Ville de depart',type:'text',value:l.departure},
      {id:'log-arr',label:'Ville d\'arrivee',type:'text',value:l.arrival},
      {id:'log-dates',label:'Dates',type:'text',value:l.dates},
      {id:'log-nights',label:'Nuitees hotel',type:'number',value:String(l.hotelNights)},
      {id:'log-train',label:'Cout train',type:'number',value:String(l.trainCost)},
      {id:'log-hotel',label:'Cout hotel',type:'number',value:String(l.hotelCost)},
      {id:'log-perdiem',label:'Per diem',type:'number',value:String(l.perDiem)},
      {id:'log-train-st',label:'Statut train',type:'select',options:statusOpts.map(function(o){return {value:o.value,label:o.label,selected:o.value===l.trainStatus};})},
      {id:'log-hotel-st',label:'Statut hotel',type:'select',options:statusOpts.map(function(o){return {value:o.value,label:o.label,selected:o.value===l.hotelStatus};})}
    ], function() {
      l.speakerName = document.getElementById('log-name').value.trim();
      l.departure = document.getElementById('log-dep').value.trim();
      l.arrival = document.getElementById('log-arr').value.trim();
      l.dates = document.getElementById('log-dates').value.trim();
      l.hotelNights = parseInt(document.getElementById('log-nights').value)||2;
      l.trainCost = parseInt(document.getElementById('log-train').value)||0;
      l.hotelCost = parseInt(document.getElementById('log-hotel').value)||0;
      l.perDiem = parseInt(document.getElementById('log-perdiem').value)||0;
      l.trainStatus = document.getElementById('log-train-st').value;
      l.hotelStatus = document.getElementById('log-hotel-st').value;
      saveData(data);
      closeExtraModal();
      render();
    });
    showExtraModal(modal);
  };

  EXTRA_MOD.logEmail = function(id) {
    data = loadData();
    var l = data.logistics.find(function(x){return x.id===id;});
    if (!l) return;
    var subject = encodeURIComponent('Congres de la Saucisse 2026 — Logistique voyage');
    var body = encodeURIComponent('Bonjour ' + l.speakerName + ',\n\nNous organisons votre voyage pour le Congres de la Saucisse 2026.\n\nTrajet : ' + l.departure + ' → ' + l.arrival + '\nDates : ' + l.dates + '\nHotel : ' + l.hotelNights + ' nuitees\n\nStatut train : ' + l.trainStatus + '\nStatut hotel : ' + l.hotelStatus + '\n\nMerci de confirmer ces informations.\n\nCordialement,\nEquipe logistique');
    window.open('mailto:?subject=' + subject + '&body=' + body, '_blank');
  };

  render();
};

// ══════════════════════════════════════════════════════════
// 6. PORTAIL PRESTATAIRE
// ══════════════════════════════════════════════════════════
SPA_INIT['prestataire'] = function() {
  var el = document.getElementById('section-prestataire');
  var data = loadData();
  var STATUS_ORDER = ['recue','en_verification','validee','en_paiement','payee'];
  var STATUS_LABELS = {recue:'Recue',en_verification:'En verification',validee:'Validee',en_paiement:'En paiement',payee:'Payee'};
  var STATUS_COLORS = {recue:'#9B978F',en_verification:'#F59E0B',validee:'#3B82F6',en_paiement:'#8B5CF6',payee:'#22C55E'};
  var STATUS_BADGES = {recue:'pending',en_verification:'pending',validee:'contacted',en_paiement:'prospect',payee:'paid'};

  function render() {
    data = loadData();
    var totalAmount = data.invoices.reduce(function(s,f){return s+f.amount;},0);
    var pending = data.invoices.filter(function(f){return f.status!=='payee';}).length;

    var html = '<div class="erp-content">';
    html += '<h2 class="panel-title">Portail Prestataire</h2>';

    // KPIs
    html += '<div class="kpi-grid">';
    html += '<div class="kpi-card"><div class="kpi-icon">📨</div><div class="kpi-value">' + data.invoices.length + '</div><div class="kpi-label">Factures recues</div></div>';
    html += '<div class="kpi-card"><div class="kpi-icon">💶</div><div class="kpi-value">' + totalAmount.toLocaleString('fr-FR') + ' &euro;</div><div class="kpi-label">Montant total</div></div>';
    html += '<div class="kpi-card' + (pending>0?' danger':'') + '"><div class="kpi-icon">⏳</div><div class="kpi-value">' + pending + '</div><div class="kpi-label">En attente</div></div>';
    html += '</div>';

    // Submit invoice form
    html += adminCard('Soumettre une facture', '<div class="erp-toolbar" style="flex-wrap:wrap;">' +
      '<input type="text" id="prest-company" placeholder="Nom entreprise" style="flex:1;min-width:180px;">' +
      '<input type="text" id="prest-siret" placeholder="SIRET (14 chiffres)" style="width:180px;">' +
      '<input type="number" id="prest-amount" placeholder="Montant TTC (euros)" style="width:150px;">' +
      '<input type="text" id="prest-desc" placeholder="Description" style="flex:2;min-width:200px;">' +
      '<button class="erp-btn erp-btn-gold" onclick="EXTRA_MOD.prestSubmit()">Soumettre</button>' +
      '</div>' +
      '<div class="drop-zone" style="margin-top:12px;" onclick="document.getElementById(\'prest-file\').click()">' +
      '<div class="dz-icon">📎</div><div class="dz-text">Joindre la facture PDF</div><div class="dz-sub">PDF uniquement</div>' +
      '<input type="file" id="prest-file" accept=".pdf" style="display:none">' +
      '</div>');

    // Invoices list
    html += '<div class="erp-table-wrap"><table class="erp-table"><thead><tr><th>Prestataire</th><th>SIRET</th><th>Montant TTC</th><th>Description</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead><tbody>';
    data.invoices.forEach(function(f) {
      var bCls = STATUS_BADGES[f.status]||'pending';
      html += '<tr>';
      html += '<td style="color:#E8E4DC;font-weight:600;">' + esc(f.company) + '</td>';
      html += '<td style="font-size:.75rem;">' + esc(f.siret) + '</td>';
      html += '<td style="text-align:right;font-weight:700;color:#C9A84C;">' + f.amount.toLocaleString('fr-FR') + ' &euro;</td>';
      html += '<td style="font-size:.78rem;">' + esc(f.description) + '</td>';
      html += '<td>' + esc(f.date) + '</td>';
      html += '<td>' + badgeHtml(STATUS_LABELS[f.status]||f.status, bCls) + '</td>';
      html += '<td>';
      html += '<button class="erp-btn erp-btn-outline erp-btn-sm" onclick="EXTRA_MOD.prestTimeline(\'' + f.id + '\')">Timeline</button> ';
      html += '<button class="erp-btn erp-btn-blue erp-btn-sm" onclick="EXTRA_MOD.prestChangeStatus(\'' + f.id + '\')">Statut</button> ';
      html += '</td></tr>';
    });
    html += '</tbody></table></div>';

    // Export buttons
    html += '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px;">';
    html += '<button class="erp-btn erp-btn-outline" onclick="EXTRA_MOD.prestExportCSV()">Exporter CSV</button>';
    html += '<button class="erp-btn erp-btn-green" onclick="EXTRA_MOD.prestExportSEPA()">Generer SEPA XML</button>';
    html += '</div>';

    html += '</div>';
    el.innerHTML = html;
  }

  EXTRA_MOD.prestSubmit = function() {
    var f = {
      id: uid('F'),
      company: (document.getElementById('prest-company').value||'').trim(),
      siret: (document.getElementById('prest-siret').value||'').trim(),
      amount: parseInt(document.getElementById('prest-amount').value)||0,
      description: (document.getElementById('prest-desc').value||'').trim(),
      status: 'recue',
      notes: '',
      date: new Date().toISOString().slice(0,10),
      history: [{date:new Date().toISOString().slice(0,10),status:'recue'}]
    };
    if (!f.company || !f.amount) { alert('Entreprise et montant requis'); return; }
    data.invoices.push(f);
    saveData(data);
    render();
  };

  EXTRA_MOD.prestTimeline = function(id) {
    data = loadData();
    var f = data.invoices.find(function(x){return x.id===id;});
    if (!f) return;
    var html = '<h2 style="color:#C9A84C;margin-bottom:16px;">Timeline — ' + esc(f.company) + '</h2>';
    html += '<p style="color:#9B978F;margin-bottom:16px;">Montant : <strong style="color:#C9A84C;">' + f.amount.toLocaleString('fr-FR') + ' &euro;</strong> — ' + esc(f.description) + '</p>';
    if (f.notes) html += '<p style="color:#9B978F;font-size:.82rem;"><em>Notes : ' + esc(f.notes) + '</em></p>';
    // Timeline
    html += '<div style="margin-top:16px;">';
    STATUS_ORDER.forEach(function(st, i) {
      var done = (f.history||[]).some(function(h){return h.status===st;});
      var entry = (f.history||[]).find(function(h){return h.status===st;});
      var color = done ? STATUS_COLORS[st] : '#5F5C55';
      var lineColor = done ? STATUS_COLORS[st] : 'rgba(255,255,255,.06)';
      html += '<div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:4px;">';
      html += '<div style="display:flex;flex-direction:column;align-items:center;width:24px;">';
      html += '<div style="width:16px;height:16px;border-radius:50%;background:' + (done?color:'transparent') + ';border:2px solid ' + color + ';flex-shrink:0;"></div>';
      if (i < STATUS_ORDER.length-1) html += '<div style="width:2px;height:24px;background:' + lineColor + ';"></div>';
      html += '</div>';
      html += '<div style="padding-top:1px;"><div style="color:' + color + ';font-weight:600;font-size:.85rem;">' + STATUS_LABELS[st] + '</div>';
      if (entry) html += '<div style="color:#5F5C55;font-size:.72rem;">' + entry.date + '</div>';
      html += '</div></div>';
    });
    html += '</div>';
    showExtraModal(html);
  };

  EXTRA_MOD.prestChangeStatus = function(id) {
    data = loadData();
    var f = data.invoices.find(function(x){return x.id===id;});
    if (!f) return;
    var opts = STATUS_ORDER.map(function(s){return {value:s,label:STATUS_LABELS[s],selected:s===f.status};});
    var modal = buildModal('Changer statut — ' + f.company, [
      {id:'prest-new-status',label:'Nouveau statut',type:'select',options:opts},
      {id:'prest-note',label:'Note (optionnel)',type:'text',value:f.notes||''}
    ], function() {
      var newSt = document.getElementById('prest-new-status').value;
      var note = document.getElementById('prest-note').value.trim();
      f.status = newSt;
      f.notes = note;
      if (!f.history) f.history = [];
      if (!f.history.some(function(h){return h.status===newSt;})) {
        f.history.push({date:new Date().toISOString().slice(0,10), status:newSt});
      }
      saveData(data);
      closeExtraModal();
      render();
    });
    showExtraModal(modal);
  };

  EXTRA_MOD.prestExportCSV = function() {
    data = loadData();
    var csv = 'Prestataire,SIRET,Montant TTC,Description,Date,Statut\n';
    data.invoices.forEach(function(f) {
      csv += '"' + f.company + '","' + f.siret + '",' + f.amount + ',"' + f.description + '","' + f.date + '","' + (STATUS_LABELS[f.status]||f.status) + '"\n';
    });
    downloadCSV(csv, 'factures_prestataires_' + new Date().toISOString().slice(0,10) + '.csv');
  };

  EXTRA_MOD.prestExportSEPA = function() {
    data = loadData();
    var payable = data.invoices.filter(function(f){return f.status==='validee'||f.status==='en_paiement';});
    if (payable.length === 0) { alert('Aucune facture validee a payer.'); return; }
    var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">\n';
    xml += '  <CstmrCdtTrfInitn>\n';
    xml += '    <GrpHdr>\n';
    xml += '      <MsgId>CONGRES-SAUCISSE-' + Date.now() + '</MsgId>\n';
    xml += '      <CreDtTm>' + new Date().toISOString() + '</CreDtTm>\n';
    xml += '      <NbOfTxs>' + payable.length + '</NbOfTxs>\n';
    xml += '      <CtrlSum>' + payable.reduce(function(s,f){return s+f.amount;},0).toFixed(2) + '</CtrlSum>\n';
    xml += '    </GrpHdr>\n';
    payable.forEach(function(f, i) {
      xml += '    <PmtInf>\n';
      xml += '      <PmtInfId>' + f.id + '</PmtInfId>\n';
      xml += '      <Cdtr><Nm>' + esc(f.company) + '</Nm></Cdtr>\n';
      xml += '      <Amt><InstdAmt Ccy="EUR">' + f.amount.toFixed(2) + '</InstdAmt></Amt>\n';
      xml += '      <RmtInf><Ustrd>' + esc(f.description) + '</Ustrd></RmtInf>\n';
      xml += '    </PmtInf>\n';
    });
    xml += '  </CstmrCdtTrfInitn>\n';
    xml += '</Document>';

    var blob = new Blob([xml], {type:'application/xml'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sepa_paiement_' + new Date().toISOString().slice(0,10) + '.xml';
    a.click();
  };

  render();
};

// ══════════════════════════════════════════════════════════
// DASHBOARD WIDGETS (augment existing dashboard)
// ══════════════════════════════════════════════════════════
var origDashInit = SPA_INIT['erp-dashboard'];
SPA_INIT['erp-dashboard'] = function() {
  if (typeof origDashInit === 'function') origDashInit();
  // Add extra widgets to ERP dashboard
  setTimeout(function() {
    var container = document.querySelector('#section-erp-dashboard .erp-content');
    if (!container) return;
    var data = loadData();
    var totalRes = data.reservations.length;
    var scanned = data.reservations.filter(function(r){return r.scanned;}).length;
    var benConfirmed = data.volunteers.filter(function(v){return v.status==='confirme'||v.status==='affecte';}).length;
    var benNeeded = data.volunteers.length;
    var invoicesPending = data.invoices.filter(function(f){return f.status!=='payee';}).length;

    var widgetHtml = '<div class="erp-section-card" style="margin-top:24px;"><h3>Modules evenementiels</h3>';
    widgetHtml += '<div class="kpi-grid">';
    widgetHtml += '<div class="kpi-card"><div class="kpi-icon">🎫</div><div class="kpi-value">' + totalRes + '</div><div class="kpi-label">Reservations totales</div></div>';
    widgetHtml += '<div class="kpi-card' + (scanned>0?' success':'') + '"><div class="kpi-icon">🎟️</div><div class="kpi-value">' + scanned + ' / ' + totalRes + '</div><div class="kpi-label">Badges scannes</div></div>';
    widgetHtml += '<div class="kpi-card' + (benConfirmed===benNeeded?' success':'') + '"><div class="kpi-icon">👥</div><div class="kpi-value">' + benConfirmed + ' / ' + benNeeded + '</div><div class="kpi-label">Benevoles confirmes</div></div>';
    widgetHtml += '<div class="kpi-card' + (invoicesPending>0?' danger':'') + '"><div class="kpi-icon">📨</div><div class="kpi-value">' + invoicesPending + '</div><div class="kpi-label">Factures en attente</div></div>';
    widgetHtml += '</div></div>';
    container.insertAdjacentHTML('beforeend', widgetHtml);
  }, 100);
};

// Also augment the Stephanie dashboard
var origStephInit = SPA_INIT['stephanie'];
SPA_INIT['stephanie'] = function() {
  if (typeof origStephInit === 'function') origStephInit();
  setTimeout(function() {
    var container = document.getElementById('section-stephanie');
    if (!container) return;
    var data = loadData();
    var totalRes = data.reservations.length;
    var scanned = data.reservations.filter(function(r){return r.scanned;}).length;
    var benConfirmed = data.volunteers.filter(function(v){return v.status==='confirme'||v.status==='affecte';}).length;
    var invoicesPending = data.invoices.filter(function(f){return f.status!=='payee';}).length;

    var widgetHtml = '<div style="padding:0 24px 24px;"><div class="erp-section-card"><h3 style="color:#C9A84C;">Modules evenementiels</h3>';
    widgetHtml += '<div class="kpi-grid">';
    widgetHtml += '<div class="kpi-card"><div class="kpi-icon">🎫</div><div class="kpi-value">' + totalRes + '</div><div class="kpi-label">Reservations</div></div>';
    widgetHtml += '<div class="kpi-card"><div class="kpi-icon">🎟️</div><div class="kpi-value">' + scanned + '/' + totalRes + '</div><div class="kpi-label">Scannes</div></div>';
    widgetHtml += '<div class="kpi-card"><div class="kpi-icon">👥</div><div class="kpi-value">' + benConfirmed + '</div><div class="kpi-label">Benevoles OK</div></div>';
    widgetHtml += '<div class="kpi-card' + (invoicesPending>0?' danger':'') + '"><div class="kpi-icon">📨</div><div class="kpi-value">' + invoicesPending + '</div><div class="kpi-label">Factures en attente</div></div>';
    widgetHtml += '</div></div></div>';
    container.insertAdjacentHTML('beforeend', widgetHtml);
  }, 200);
};

// ══════════════════════════════════════════════════════════
// SHARED: Modal system, CSV export, multi-select helpers
// ══════════════════════════════════════════════════════════
function buildModal(title, fields, onSubmit) {
  var html = '<h2 style="color:#C9A84C;margin-bottom:16px;">' + title + '</h2>';
  fields.forEach(function(f) {
    html += '<div class="form-group" style="margin-bottom:14px;">';
    html += '<label style="display:block;font-size:.78rem;font-weight:600;color:#C9A84C;margin-bottom:4px;">' + f.label + '</label>';
    var val = f.value || '';
    if (f.type === 'textarea') {
      html += '<textarea id="' + f.id + '" style="width:100%;padding:10px 14px;border-radius:10px;border:1px solid rgba(201,168,76,.1);background:#1a1c2a;color:#E8E4DC;font-size:.85rem;min-height:80px;resize:vertical;">' + esc(val) + '</textarea>';
    } else if (f.type === 'select') {
      html += '<select id="' + f.id + '" style="width:100%;padding:10px 14px;border-radius:10px;border:1px solid rgba(201,168,76,.1);background:#1a1c2a;color:#E8E4DC;font-size:.85rem;">';
      (f.options||[]).forEach(function(o) {
        html += '<option value="' + esc(o.value) + '"' + (o.selected?' selected':'') + '>' + esc(o.label) + '</option>';
      });
      html += '</select>';
    } else if (f.type === 'select-multi') {
      html += '<select id="' + f.id + '" multiple size="4" style="width:100%;padding:10px 14px;border-radius:10px;border:1px solid rgba(201,168,76,.1);background:#1a1c2a;color:#E8E4DC;font-size:.85rem;">';
      (f.options||[]).forEach(function(o) {
        html += '<option value="' + esc(o.value) + '"' + (o.selected?' selected':'') + '>' + esc(o.label) + '</option>';
      });
      html += '</select>';
    } else {
      html += '<input type="' + (f.type||'text') + '" id="' + f.id + '" value="' + esc(val) + '"' + (f.placeholder?' placeholder="' + esc(f.placeholder) + '"':'') + ' style="width:100%;padding:10px 14px;border-radius:10px;border:1px solid rgba(201,168,76,.1);background:#1a1c2a;color:#E8E4DC;font-size:.85rem;">';
    }
    html += '</div>';
  });
  html += '<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px;">';
  html += '<button class="erp-btn erp-btn-outline" onclick="closeExtraModal()">Annuler</button>';
  html += '<button class="erp-btn erp-btn-gold" id="extra-modal-submit">Valider</button>';
  html += '</div>';

  return {html: html, onSubmit: onSubmit};
}

function showExtraModal(content) {
  var overlay = document.getElementById('extra-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'extra-modal-overlay';
    overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:10000;align-items:center;justify-content:center;backdrop-filter:blur(4px);';
    overlay.onclick = function(e) { if (e.target === overlay) closeExtraModal(); };
    var box = document.createElement('div');
    box.id = 'extra-modal-box';
    box.style.cssText = 'background:#161822;border:1px solid rgba(201,168,76,.1);border-radius:14px;padding:28px;max-width:650px;width:92%;max-height:90vh;overflow-y:auto;';
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }
  var box = document.getElementById('extra-modal-box');
  if (typeof content === 'string') {
    box.innerHTML = content + '<div style="text-align:right;margin-top:20px;"><button class="erp-btn erp-btn-outline" onclick="closeExtraModal()">Fermer</button></div>';
  } else {
    box.innerHTML = content.html;
    setTimeout(function() {
      var btn = document.getElementById('extra-modal-submit');
      if (btn && content.onSubmit) btn.onclick = content.onSubmit;
    }, 50);
  }
  overlay.style.display = 'flex';
}

window.showExtraModal = showExtraModal;
window.closeExtraModal = function() {
  var overlay = document.getElementById('extra-modal-overlay');
  if (overlay) overlay.style.display = 'none';
};

function getMultiSelectValues(id) {
  var sel = document.getElementById(id);
  if (!sel) return [];
  var vals = [];
  for (var i = 0; i < sel.options.length; i++) {
    if (sel.options[i].selected) vals.push(sel.options[i].value);
  }
  return vals;
}

function downloadCSV(csv, filename) {
  var blob = new Blob(['\ufeff' + csv], {type:'text/csv;charset=utf-8;'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

})();
