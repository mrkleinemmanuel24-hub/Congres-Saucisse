/* ═══════════════════════════════════════════════════════
   CONGRES DE LA SAUCISSE — SPA Sections
   All 20 page contents + initialization logic
   ═══════════════════════════════════════════════════════ */

var SPA_INIT = {};

/* ══════════════════════════════════════
   ACCUEIL
   ══════════════════════════════════════ */
SPA_INIT.accueil = function() {
  // Programme summary
  var container = document.getElementById('programme-summary');
  if (!container) return;
  var dayNames = ['', 'Jeudi 12 juin', 'Vendredi 13 juin', 'Samedi 14 juin'];
  var dayThemes = ['', 'Histoire & Filiere', 'International & Innovation', 'Ateliers & Cloture'];
  for (var d = 1; d <= 3; d++) {
    var sessions = CONGRES.getSessionsByDay(d);
    var html = '<div class="day-summary"><h3>' + dayNames[d] + '</h3><p style="font-size:.8rem;color:var(--text-muted);margin-bottom:12px;">' + dayThemes[d] + '</p><ul>';
    sessions.slice(0, 4).forEach(function(s) { html += '<li><strong>' + s.debut + '</strong> ' + s.titre + '</li>'; });
    if (sessions.length > 4) html += '<li style="color:#2AD783;">+ ' + (sessions.length - 4) + ' autres sessions...</li>';
    html += '</ul></div>';
    container.innerHTML += html;
  }
  // Featured speakers
  var featured = [1, 3, 5, 6, 9, 20];
  var speakerContainer = document.getElementById('featured-speakers');
  featured.forEach(function(id) {
    var s = CONGRES.getSpeaker(id);
    if (!s) return;
    speakerContainer.innerHTML += '<div class="speaker-card" onclick="show(\'intervenants\')">' +
      '<div class="speaker-avatar">' + s.initiales + '</div>' +
      '<h3>' + s.prenom + ' ' + s.nom + '</h3>' +
      '<div class="title">' + s.titre + '</div>' +
      '<div class="org">' + s.org + '</div>' +
    '</div>';
  });
};

/* ══════════════════════════════════════
   PROGRAMME
   ══════════════════════════════════════ */
SPA_INIT.programme = function() {
  var el = document.getElementById('section-programme');
  el.innerHTML = '<section class="section"><h1 class="section-title"><img src="img/icons/icon-programme.png" alt="Programme" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle" title="Programme du congres"> Programme complet</h1><p class="section-subtitle">32 sessions sur 3 jours — conferences, ateliers, degustations et tables rondes.</p><div class="tabs"><button class="tab-btn active" onclick="SPA_PROG.showDay(1)">Jour 1 — Jeu. 12 juin</button><button class="tab-btn" onclick="SPA_PROG.showDay(2)">Jour 2 — Ven. 13 juin</button><button class="tab-btn" onclick="SPA_PROG.showDay(3)">Jour 3 — Sam. 14 juin</button></div><div class="filters" id="prog-filters"></div><div id="prog-sessions-list"></div><div class="text-center mt-3" style="padding:20px;"><p style="color:var(--text-muted);font-size:.82rem;">Cliquez sur le coeur pour ajouter a votre programme personnel.</p></div></section>';

  window.SPA_PROG = {
    currentDay: 1, currentTheme: null, currentSalle: null,
    favorites: CONGRES.loadFavorites(), reminders: CONGRES.loadReminders(),
    showDay: function(day) {
      this.currentDay = day;
      document.querySelectorAll('#section-programme .tab-btn').forEach(function(btn, i) { btn.classList.toggle('active', i === day - 1); });
      this.render();
    },
    filterTheme: function(theme) { this.currentTheme = theme; this.currentSalle = null; this.updateFilters(); this.render(); },
    filterSalle: function(salle) { this.currentSalle = (this.currentSalle === salle) ? null : salle; this.currentTheme = null; this.updateFilters(); this.render(); },
    updateFilters: function() {
      var self = this;
      document.querySelectorAll('#prog-filters .filter-btn').forEach(function(btn) {
        var isActive = false;
        if (!self.currentTheme && !self.currentSalle && !btn.dataset.theme && !btn.dataset.salle) isActive = true;
        if (self.currentTheme && btn.dataset.theme === self.currentTheme) isActive = true;
        if (self.currentSalle && btn.dataset.salle === self.currentSalle) isActive = true;
        btn.classList.toggle('active', isActive);
      });
    },
    toggleFavorite: function(id) {
      var idx = this.favorites.indexOf(id);
      if (idx === -1) this.favorites.push(id); else this.favorites.splice(idx, 1);
      CONGRES.saveFavorites(this.favorites); this.render();
    },
    toggleReminder: function(id) {
      var idx = this.reminders.indexOf(id);
      if (idx === -1) this.reminders.push(id); else this.reminders.splice(idx, 1);
      CONGRES.saveReminders(this.reminders); this.render();
    },
    render: function() {
      var self = this;
      var sessions = CONGRES.getSessionsByDay(this.currentDay);
      if (this.currentTheme) sessions = sessions.filter(function(s) { return s.theme === self.currentTheme; });
      if (this.currentSalle) sessions = sessions.filter(function(s) { return s.salle === self.currentSalle; });
      var html = '';
      if (sessions.length === 0) html = '<div class="text-center" style="padding:40px;color:var(--text-muted);">Aucune session trouvee.</div>';
      sessions.forEach(function(s) {
        var salle = CONGRES.getSalle(s.salle);
        var places = CONGRES.getPlacesRestantes(s);
        var capClass = CONGRES.getCapacityClass(s.salle, s.inscrits);
        var isFav = self.favorites.indexOf(s.id) !== -1;
        var isRem = self.reminders.indexOf(s.id) !== -1;
        var names = s.speakers.map(function(id) { var sp = CONGRES.getSpeaker(id); return sp ? sp.prenom + ' ' + sp.nom : ''; }).join(', ');
        html += '<div class="session-card"><div class="session-time">' + s.debut + '<br><span style="font-size:.7rem;color:var(--text-muted);">' + s.fin + '</span></div><div class="session-info"><h3>' + s.titre + '</h3><div class="speaker">' + names + '</div><div class="meta">' + (salle ? salle.nom + ' · ' + salle.etage : '') + ' · <span class="capacity-badge capacity-' + capClass + '">' + places + ' places</span></div><div class="meta" style="margin-top:2px;"><span class="filter-btn" style="padding:2px 8px;font-size:.7rem;cursor:default;">' + s.theme + '</span></div></div><div class="session-actions"><button class="heart-btn' + (isFav ? ' active' : '') + '" onclick="SPA_PROG.toggleFavorite(' + s.id + ')" title="Favori">' + (isFav ? '&#9829;' : '&#9825;') + '</button><button class="reminder-toggle' + (isRem ? ' active' : '') + '" onclick="SPA_PROG.toggleReminder(' + s.id + ')">' + (isRem ? 'Rappel ON' : 'Rappel') + '</button></div></div>';
      });
      document.getElementById('prog-sessions-list').innerHTML = html;
    }
  };
  var fhtml = '<button class="filter-btn active" onclick="SPA_PROG.filterTheme(null)">Toutes</button>';
  CONGRES.SALLES.forEach(function(s) { fhtml += '<button class="filter-btn" data-salle="' + s.id + '" onclick="SPA_PROG.filterSalle(\'' + s.id + '\')">' + s.nom + '</button>'; });
  CONGRES.THEMES.forEach(function(t) { fhtml += '<button class="filter-btn" data-theme="' + t + '" onclick="SPA_PROG.filterTheme(\'' + t + '\')">' + t + '</button>'; });
  document.getElementById('prog-filters').innerHTML = fhtml;
  SPA_PROG.render();
};

/* ══════════════════════════════════════
   INTERVENANTS
   ══════════════════════════════════════ */
SPA_INIT.intervenants = function() {
  var el = document.getElementById('section-intervenants');
  el.innerHTML = '<section class="section"><h1 class="section-title"><img src="img/icons/icon-intervenants.png" alt="Intervenants" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle"> Nos intervenants</h1><p class="section-subtitle">22 experts internationaux.</p><div class="filters" id="interv-theme-filters"></div><div class="grid-3" id="interv-speakers-grid"></div></section>';

  window.SPA_INTERV = {
    currentFilter: null,
    filterBy: function(theme) {
      this.currentFilter = theme;
      document.querySelectorAll('#interv-theme-filters .filter-btn').forEach(function(btn) {
        btn.classList.toggle('active', (!theme && !btn.dataset.t) || (theme && btn.dataset.t === theme));
      });
      this.render();
    },
    render: function() {
      var self = this;
      var speakers = CONGRES.SPEAKERS;
      if (this.currentFilter) speakers = speakers.filter(function(s) { return s.theme === self.currentFilter; });
      var html = '';
      speakers.forEach(function(s) {
        html += '<div class="speaker-card" id="speaker-' + s.id + '" onclick="SPA_INTERV.openSpeaker(' + s.id + ')"><div class="speaker-avatar">' + s.initiales + '</div><h3>' + s.prenom + ' ' + s.nom + '</h3><div class="title">' + s.titre + '</div><div class="org">' + s.org + '</div></div>';
      });
      document.getElementById('interv-speakers-grid').innerHTML = html;
    },
    openSpeaker: function(id) {
      var s = CONGRES.getSpeaker(id); if (!s) return;
      var sessions = CONGRES.getSessionsBySpeaker(id);
      var dayNames = ['', 'Jeu. 12 juin', 'Ven. 13 juin', 'Sam. 14 juin'];
      var html = '<div style="text-align:center;margin-bottom:20px;"><div class="speaker-avatar" style="width:100px;height:100px;font-size:2.2rem;margin:0 auto 12px;">' + s.initiales + '</div><h2 style="font-size:1.3rem;">' + s.prenom + ' ' + s.nom + '</h2><div style="color:#FFD300;font-weight:600;font-size:.9rem;">' + s.titre + '</div><div style="color:#6B7280;font-size:.82rem;">' + s.org + '</div></div><div style="background:rgba(255,255,255,.03);border-radius:12px;padding:16px;margin-bottom:20px;"><p style="font-size:.88rem;color:#B1B9C3;line-height:1.7;">' + s.bio + '</p></div>';
      if (sessions.length > 0) {
        html += '<h3 style="font-size:.95rem;color:#2AD783;margin-bottom:12px;">Sessions (' + sessions.length + ')</h3>';
        sessions.forEach(function(sess) {
          var salle = CONGRES.getSalle(sess.salle);
          html += '<div style="display:flex;gap:12px;padding:10px;background:rgba(255,255,255,.02);border-radius:10px;margin-bottom:8px;"><div style="min-width:60px;text-align:center;font-weight:700;color:#2AD783;font-size:.85rem;">' + sess.debut + '</div><div><div style="font-weight:600;font-size:.88rem;">' + sess.titre + '</div><div style="font-size:.78rem;color:#6B7280;">' + dayNames[sess.jour] + ' · ' + (salle ? salle.nom : '') + '</div></div></div>';
        });
      }
      document.getElementById('modal-content').innerHTML = html;
      document.getElementById('speaker-modal').classList.add('active');
    }
  };
  var themes = [];
  CONGRES.SPEAKERS.forEach(function(s) { if (themes.indexOf(s.theme) === -1) themes.push(s.theme); });
  var html = '<button class="filter-btn active" onclick="SPA_INTERV.filterBy(null)">Tous</button>';
  themes.forEach(function(t) { html += '<button class="filter-btn" data-t="' + t + '" onclick="SPA_INTERV.filterBy(\'' + t + '\')">' + t + '</button>'; });
  document.getElementById('interv-theme-filters').innerHTML = html;
  SPA_INTERV.render();
};

function closeModal() { document.getElementById('speaker-modal').classList.remove('active'); }
document.getElementById('speaker-modal').addEventListener('click', function(e) { if (e.target === this) closeModal(); });
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') { closeModal(); closeDetail(); } });

/* ══════════════════════════════════════
   INSCRIPTION
   ══════════════════════════════════════ */
SPA_INIT.inscription = function() {
  var el = document.getElementById('section-inscription');
  el.innerHTML = '<section class="section" style="max-width:800px;"><h1 class="section-title"><img src="img/icons/icon-inscription.png" alt="Inscription" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle"> Inscription</h1><p class="section-subtitle">Reservez votre place au Congres de la Saucisse 2026.</p><div class="stepper"><div class="step-indicator active" data-step="1">1. Infos</div><div class="step-indicator" data-step="2">2. Pass</div><div class="step-indicator" data-step="3">3. Sessions</div><div class="step-indicator" data-step="4">4. Repas</div><div class="step-indicator" data-step="5">5. Hotel</div><div class="step-indicator" data-step="6">6. Recap</div><div class="step-indicator" data-step="7">7. OK</div></div>' +
    '<div class="step-content active" data-step="1"><h2 style="font-size:1.1rem;margin-bottom:20px;">Informations personnelles</h2><div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;"><div class="form-group"><label>Prenom *</label><input type="text" id="f-prenom" placeholder="Votre prenom"></div><div class="form-group"><label>Nom *</label><input type="text" id="f-nom" placeholder="Votre nom"></div></div><div class="form-group"><label>Email *</label><input type="email" id="f-email" placeholder="votre@email.com"></div><div class="form-group"><label>Telephone</label><input type="tel" id="f-tel" placeholder="06 12 34 56 78"></div><div class="form-group"><label>Entreprise</label><input type="text" id="f-entreprise" placeholder="Nom entreprise"></div><div class="form-group"><label>Regime alimentaire</label><select id="f-regime" style="width:100%;padding:10px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:#1E2430;color:#FFF;font-size:.88rem;"><option value="standard">Standard</option><option value="vegetarien">Vegetarien</option><option value="vegan">Vegan</option><option value="sans-gluten">Sans gluten</option><option value="halal">Halal</option></select></div><label style="display:flex;align-items:flex-start;gap:8px;font-size:.82rem;color:#B1B9C3;margin-top:16px;"><input type="checkbox" id="f-rgpd" style="width:18px;height:18px;accent-color:#2AD783;flex-shrink:0;margin-top:2px;"> J\'accepte le traitement de mes donnees (RGPD) *</label><div style="text-align:right;margin-top:20px;"><button class="btn btn-green" onclick="SPA_REG.nextStep(2)">Suivant</button></div></div>' +
    '<div class="step-content" data-step="2"><h2 style="font-size:1.1rem;margin-bottom:20px;">Choisissez votre pass</h2><div class="pass-grid" id="ins-pass-grid"></div><div style="display:flex;justify-content:space-between;margin-top:20px;"><button class="btn btn-outline" onclick="SPA_REG.nextStep(1)">Retour</button><button class="btn btn-green" onclick="SPA_REG.nextStep(3)">Suivant</button></div></div>' +
    '<div class="step-content" data-step="3"><h2 style="font-size:1.1rem;margin-bottom:20px;">Vos sessions</h2><div class="tabs" style="margin-bottom:16px;"><button class="tab-btn active" onclick="SPA_REG.showSessionDay(1,this)">Jour 1</button><button class="tab-btn" onclick="SPA_REG.showSessionDay(2,this)">Jour 2</button><button class="tab-btn" onclick="SPA_REG.showSessionDay(3,this)">Jour 3</button></div><div id="ins-session-choices"></div><div style="display:flex;justify-content:space-between;margin-top:20px;"><button class="btn btn-outline" onclick="SPA_REG.nextStep(2)">Retour</button><button class="btn btn-green" onclick="SPA_REG.nextStep(4)">Suivant</button></div></div>' +
    '<div class="step-content" data-step="4"><h2 style="font-size:1.1rem;margin-bottom:20px;">Option repas</h2><div id="ins-repas-choices"></div><div style="display:flex;justify-content:space-between;margin-top:20px;"><button class="btn btn-outline" onclick="SPA_REG.nextStep(3)">Retour</button><button class="btn btn-green" onclick="SPA_REG.nextStep(5)">Suivant</button></div></div>' +
    '<div class="step-content" data-step="5"><h2 style="font-size:1.1rem;margin-bottom:20px;">Hotel (optionnel)</h2><div id="ins-hotel-choices"></div><div class="hotel-option" onclick="SPA_REG.selectHotel(null)" id="hotel-none" style="border-color:#2AD783;"><div><strong>Pas besoin</strong></div></div><div style="display:flex;justify-content:space-between;margin-top:20px;"><button class="btn btn-outline" onclick="SPA_REG.nextStep(4)">Retour</button><button class="btn btn-green" onclick="SPA_REG.nextStep(6)">Recapitulatif</button></div></div>' +
    '<div class="step-content" data-step="6"><h2 style="font-size:1.1rem;margin-bottom:20px;">Recapitulatif</h2><div id="ins-recap-content"></div><div style="display:flex;justify-content:space-between;margin-top:20px;"><button class="btn btn-outline" onclick="SPA_REG.nextStep(5)">Retour</button><button class="btn btn-green" onclick="SPA_REG.confirm()">Confirmer</button></div></div>' +
    '<div class="step-content" data-step="7"><div class="confirmation-box"><div class="check-icon">&#10003;</div><h2 style="font-size:1.4rem;margin-bottom:8px;">Inscription confirmee !</h2><p style="color:#B1B9C3;">Badge genere (mode demo).</p><div id="ins-badge-container" style="margin-top:20px;"></div><div style="margin-top:20px;"><a href="javascript:show(\'accueil\')" class="btn btn-green btn-sm">Retour accueil</a></div></div></div></section>';

  window.SPA_REG = {
    reg: { prenom:'', nom:'', email:'', tel:'', entreprise:'', pass:'standard', sessions:[], repas:'standard', hotel:null, regime:'standard', rgpd:false },
    nextStep: function(step) {
      if (step === 2) {
        this.reg.prenom = document.getElementById('f-prenom').value.trim();
        this.reg.nom = document.getElementById('f-nom').value.trim();
        this.reg.email = document.getElementById('f-email').value.trim();
        this.reg.tel = document.getElementById('f-tel').value.trim();
        this.reg.entreprise = document.getElementById('f-entreprise').value.trim();
        this.reg.regime = document.getElementById('f-regime').value;
        this.reg.rgpd = document.getElementById('f-rgpd').checked;
        if (!this.reg.prenom || !this.reg.nom || !this.reg.email) { alert('Remplissez prenom, nom et email.'); return; }
        if (!this.reg.rgpd) { alert('Acceptez le RGPD.'); return; }
        if (typeof ContentFilter !== 'undefined') { var f = [this.reg.prenom,this.reg.nom,this.reg.entreprise]; for(var i=0;i<f.length;i++){var c=ContentFilter.check(f[i]);if(!c.ok){alert(c.reason);return;}} }
      }
      document.querySelectorAll('#section-inscription .step-content').forEach(function(e){e.classList.remove('active');});
      document.querySelector('#section-inscription .step-content[data-step="'+step+'"]').classList.add('active');
      document.querySelectorAll('#section-inscription .step-indicator').forEach(function(e){var s=parseInt(e.dataset.step);e.classList.toggle('active',s===step);e.classList.toggle('done',s<step);});
      if(step===2)this.initPasses();if(step===3)this.showSessionDay(1);if(step===4)this.initRepas();if(step===5)this.initHotels();if(step===6)this.buildRecap();
      window.scrollTo({top:0});
    },
    initPasses: function() { var self=this,html=''; CONGRES.PASSES.forEach(function(p){var sel=self.reg.pass===p.id?' selected':'';html+='<div class="pass-card'+sel+'" onclick="SPA_REG.selectPass(\''+p.id+'\',this)"><div class="pass-name">'+p.nom+'</div><div class="pass-price">'+(p.prix===0?'Gratuit':p.prix+' &euro;')+'</div><ul class="pass-features">';p.features.forEach(function(f){html+='<li>'+f+'</li>';});html+='</ul></div>';}); document.getElementById('ins-pass-grid').innerHTML=html; },
    selectPass: function(id,el) { this.reg.pass=id; document.querySelectorAll('#ins-pass-grid .pass-card').forEach(function(c){c.classList.remove('selected');}); el.classList.add('selected'); },
    showSessionDay: function(day,btn) { if(btn){btn.parentElement.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('active');});btn.classList.add('active');} var self=this,sessions=CONGRES.getSessionsByDay(day),html=''; sessions.forEach(function(s){var sp=s.speakers.map(function(id){var x=CONGRES.getSpeaker(id);return x?x.prenom+' '+x.nom:'';}).join(', ');var salle=CONGRES.getSalle(s.salle);var ck=self.reg.sessions.indexOf(s.id)!==-1;html+='<label class="session-check'+(ck?' checked':'')+'"><input type="checkbox" '+(ck?'checked':'')+' onchange="SPA_REG.toggleSession('+s.id+',this)"><div><strong>'+s.debut+'</strong> '+s.titre+'<br><span style="font-size:.78rem;color:#6B7280;">'+sp+' · '+(salle?salle.nom:'')+'</span></div></label>';}); document.getElementById('ins-session-choices').innerHTML=html; },
    toggleSession: function(id,el) { var idx=this.reg.sessions.indexOf(id); if(idx===-1)this.reg.sessions.push(id);else this.reg.sessions.splice(idx,1); el.closest('.session-check').classList.toggle('checked',el.checked); },
    initRepas: function() { var self=this,html=''; CONGRES.REPAS_OPTIONS.forEach(function(r){var sel=self.reg.repas===r.id;html+='<label class="repas-option'+(sel?' selected':'')+'" onclick="SPA_REG.selectRepas(\''+r.id+'\')"><input type="radio" name="repas" '+(sel?'checked':'')+'><div><strong>'+r.nom+'</strong> — '+r.prix+' &euro;/jour</div></label>';}); document.getElementById('ins-repas-choices').innerHTML=html; },
    selectRepas: function(id) { this.reg.repas=id; },
    initHotels: function() { var self=this,html=''; CONGRES.HOTELS.forEach(function(h){var sel=self.reg.hotel===h.id;html+='<div class="hotel-option'+(sel?' selected':'')+'" onclick="SPA_REG.selectHotel('+h.id+')" data-hotel="'+h.id+'"><div style="flex:1;"><strong>'+h.nom+'</strong><br><span style="font-size:.82rem;color:#6B7280;">'+h.distance+'</span></div><div style="text-align:right;"><div style="font-size:1.1rem;font-weight:800;color:#2AD783;">'+h.prix+' &euro;</div><div style="font-size:.75rem;color:#6B7280;">/nuit</div></div></div>';}); document.getElementById('ins-hotel-choices').innerHTML=html; },
    selectHotel: function(id) { this.reg.hotel=id; document.querySelectorAll('.hotel-option').forEach(function(e){e.classList.remove('selected');}); if(id===null){document.getElementById('hotel-none').classList.add('selected');}else{var e=document.querySelector('[data-hotel="'+id+'"]');if(e)e.classList.add('selected');document.getElementById('hotel-none').classList.remove('selected');} },
    buildRecap: function() { var pass=CONGRES.getPass(this.reg.pass),repas=CONGRES.REPAS_OPTIONS.find(function(r){return r.id===SPA_REG.reg.repas;}),hotel=this.reg.hotel?CONGRES.getHotel(this.reg.hotel):null;var pp=pass?pass.prix:0,rp=repas?repas.prix*3:0,hp=hotel?hotel.prix*3:0;if(this.reg.pass==='platinum')hp=0;var total=pp+rp+hp;var html='<div class="recap-section"><h4>Informations</h4><div class="recap-row"><span>Nom</span><span>'+this.reg.prenom+' '+this.reg.nom+'</span></div><div class="recap-row"><span>Email</span><span>'+this.reg.email+'</span></div></div><div class="recap-section"><h4>Pass</h4><div class="recap-row"><span>'+(pass?pass.nom:'')+'</span><span>'+pp+' &euro;</span></div></div><div class="recap-section"><h4>Sessions ('+this.reg.sessions.length+')</h4>';this.reg.sessions.forEach(function(sid){var s=CONGRES.getSession(sid);if(s)html+='<div class="recap-row"><span>J'+s.jour+' '+s.debut+' — '+s.titre+'</span><span></span></div>';});html+='</div><div class="recap-total">Total : '+total+' &euro;</div><p style="font-size:.78rem;color:#6B7280;text-align:center;">Mode demo.</p>';document.getElementById('ins-recap-content').innerHTML=html; },
    confirm: function() { var id='INS-'+String(Date.now()).slice(-6);var ins={id:id,nom:this.reg.nom,prenom:this.reg.prenom,email:this.reg.email,tel:this.reg.tel,entreprise:this.reg.entreprise,pass:this.reg.pass,sessions:this.reg.sessions,repas:this.reg.repas,hotel:this.reg.hotel,jours:[1,2,3],regime:this.reg.regime,rgpd:this.reg.rgpd,statut:'confirmed',date:new Date().toISOString().split('T')[0]};var list=CONGRES.loadInscriptions();list.push(ins);CONGRES.saveInscriptions(list);document.getElementById('ins-badge-container').innerHTML=generateBadge(ins);this.nextStep(7); }
  };
  SPA_REG.nextStep(1);
};

/* ══════════════════════════════════════
   PLAN
   ══════════════════════════════════════ */
SPA_INIT.plan = function() {
  var el = document.getElementById('section-plan');
  el.innerHTML = '<section class="section"><h1 class="section-title"><img src="img/icons/icon-plan.png" alt="" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle"> Plan du Palais</h1><p class="section-subtitle">Cliquez sur une salle pour voir les details.</p><div class="tabs floor-tabs"><button class="tab-btn active" onclick="SPA_PLAN.showFloor(\'rdc\',this)">Rez-de-chaussee</button><button class="tab-btn" onclick="SPA_PLAN.showFloor(\'1er\',this)">1er etage</button></div><div class="plan-wrapper"><div class="plan-floor active" id="floor-rdc"><div class="plan-svg-container"><svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;"><rect x="20" y="20" width="760" height="460" rx="12" fill="none" stroke="#2AD783" stroke-width="1.5" opacity=".3"/><rect x="40" y="40" width="300" height="180" rx="10" fill="rgba(59,130,246,.12)" stroke="#3B82F6" stroke-width="1.5" class="plan-room" onclick="SPA_PLAN.showRoom(\'erasme\',event)"/><text x="190" y="120" text-anchor="middle" fill="#3B82F6" font-size="14" font-weight="700">Salle Erasme</text><text x="190" y="140" text-anchor="middle" fill="#6B7280" font-size="11">450 places</text><rect x="360" y="40" width="220" height="140" rx="10" fill="rgba(59,130,246,.12)" stroke="#3B82F6" stroke-width="1.5" class="plan-room" onclick="SPA_PLAN.showRoom(\'schweitzer\',event)"/><text x="470" y="100" text-anchor="middle" fill="#3B82F6" font-size="13" font-weight="700">Schweitzer</text><rect x="600" y="40" width="160" height="140" rx="10" fill="rgba(42,215,131,.12)" stroke="#2AD783" stroke-width="1.5" class="plan-room" onclick="SPA_PLAN.showRoom(\'kleber\',event)"/><text x="680" y="100" text-anchor="middle" fill="#2AD783" font-size="12" font-weight="700">Kleber</text><rect x="40" y="240" width="180" height="120" rx="10" fill="rgba(245,158,11,.12)" stroke="#F59E0B" stroke-width="1.5" class="plan-room" onclick="SPA_PLAN.showRoom(\'gutenberg\',event)"/><text x="130" y="295" text-anchor="middle" fill="#F59E0B" font-size="12" font-weight="700">Gutenberg</text><rect x="240" y="240" width="280" height="220" rx="10" fill="rgba(156,163,175,.08)" stroke="#9CA3AF" stroke-width="1.5" class="plan-room" onclick="SPA_PLAN.showRoom(\'brandt\',event)"/><text x="380" y="350" text-anchor="middle" fill="#9CA3AF" font-size="14" font-weight="700">Willy Brandt</text><rect x="540" y="240" width="220" height="220" rx="10" fill="rgba(249,115,22,.08)" stroke="#F97316" stroke-width="1.5" class="plan-room" onclick="SPA_PLAN.showRoom(\'europe\',event)"/><text x="650" y="350" text-anchor="middle" fill="#F97316" font-size="13" font-weight="700">Hall Europe</text><rect x="350" y="464" width="100" height="16" rx="4" fill="rgba(42,215,131,.2)" stroke="#2AD783"/><text x="400" y="477" text-anchor="middle" fill="#2AD783" font-size="9" font-weight="600">ENTREE</text></svg></div></div><div class="plan-floor" id="floor-1er"><div class="plan-svg-container"><svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;"><rect x="20" y="20" width="760" height="360" rx="12" fill="none" stroke="#FFD300" stroke-width="1.5" opacity=".3"/><rect x="40" y="40" width="240" height="150" rx="10" fill="rgba(42,215,131,.12)" stroke="#2AD783" stroke-width="1.5" class="plan-room" onclick="SPA_PLAN.showRoom(\'cassin\',event)"/><text x="160" y="110" text-anchor="middle" fill="#2AD783" font-size="13" font-weight="700">Cassin</text><rect x="300" y="40" width="220" height="150" rx="10" fill="rgba(42,215,131,.12)" stroke="#2AD783" stroke-width="1.5" class="plan-room" onclick="SPA_PLAN.showRoom(\'schuman\',event)"/><text x="410" y="110" text-anchor="middle" fill="#2AD783" font-size="13" font-weight="700">Schuman</text><rect x="540" y="40" width="220" height="150" rx="10" fill="rgba(245,158,11,.12)" stroke="#F59E0B" stroke-width="1.5" class="plan-room" onclick="SPA_PLAN.showRoom(\'curie\',event)"/><text x="650" y="110" text-anchor="middle" fill="#F59E0B" font-size="13" font-weight="700">Curie</text><rect x="40" y="210" width="200" height="130" rx="10" fill="rgba(168,85,247,.12)" stroke="#A855F7" stroke-width="1.5" class="plan-room" onclick="SPA_PLAN.showRoom(\'tomi\',event)"/><text x="140" y="270" text-anchor="middle" fill="#A855F7" font-size="12" font-weight="700">Tomi Ungerer</text></svg></div></div><div class="room-popup" id="room-popup"><button class="close-popup" onclick="SPA_PLAN.closePopup()">&times;</button><div id="popup-content"></div></div></div><h2 class="section-title mt-3">Toutes les salles</h2><div class="room-list" id="plan-room-list"></div></section>';

  window.SPA_PLAN = {
    showFloor: function(f,btn) { document.querySelectorAll('.plan-floor').forEach(function(e){e.classList.remove('active');}); document.getElementById('floor-'+f).classList.add('active'); btn.parentElement.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('active');}); btn.classList.add('active'); this.closePopup(); },
    showRoom: function(id,event) { var salle=CONGRES.getSalle(id);if(!salle)return;var sessions=CONGRES.getSessionsBySalle(id);var dn=['','Jeu.12','Ven.13','Sam.14'];var html='<h4>'+salle.nom+'</h4><p>'+salle.type+' · '+salle.etage+'</p><p>Capacite : <strong>'+salle.capacite+'</strong></p>';if(sessions.length>0){html+='<div style="margin-top:10px;border-top:1px solid rgba(255,255,255,.08);padding-top:8px;"><p style="font-weight:700;font-size:.82rem;color:#2AD783;">'+sessions.length+' sessions</p>';sessions.slice(0,4).forEach(function(s){html+='<p style="font-size:.78rem;">'+dn[s.jour]+' '+s.debut+' — '+s.titre+'</p>';});html+='</div>';}document.getElementById('popup-content').innerHTML=html;var popup=document.getElementById('room-popup');popup.classList.add('visible');var wr=document.querySelector('.plan-wrapper');var rect=wr.getBoundingClientRect();popup.style.left=Math.min(event.clientX-rect.left,rect.width-290)+'px';popup.style.top=Math.min(event.clientY-rect.top+10,rect.height-200)+'px'; },
    closePopup: function() { document.getElementById('room-popup').classList.remove('visible'); }
  };
  var tc={auditorium:'type-auditorium',conference:'type-conference',atelier:'type-atelier',reunion:'type-reunion',expo:'type-expo',restauration:'type-restauration'};
  var html='';CONGRES.SALLES.forEach(function(s){var sessions=CONGRES.getSessionsBySalle(s.id);html+='<div class="room-info-card"><h4>'+s.nom+' <span class="room-type-badge '+(tc[s.type]||'')+'">'+s.type+'</span></h4><div class="room-meta">'+s.etage+' · '+s.capacite+' places · '+sessions.length+' sessions</div></div>';});
  document.getElementById('plan-room-list').innerHTML=html;
};

/* ══════════════════════════════════════
   INFOS PRATIQUES
   ══════════════════════════════════════ */
SPA_INIT.infos = function() {
  var el = document.getElementById('section-infos');
  el.innerHTML = '<section class="section"><h1 class="section-title">Infos pratiques</h1><p class="section-subtitle">Tout pour preparer votre venue.</p><div class="info-section"><h2><img src="img/icons/icon-plan.png" alt="" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle"> Plan du quartier</h2><div id="spa-map" class="map-container" style="margin-bottom:12px;"></div></div><div class="info-section"><h2><img src="img/icons/icon-transport.png" alt="" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle"> Venir a Strasbourg</h2><div class="transport-grid"><div class="transport-card"><h3>TGV</h3><p><strong>Paris → Strasbourg : 1h46</strong><br>Tram B arret Wacken (20 min).</p></div><div class="transport-card"><h3>Avion</h3><p><strong>Aeroport Entzheim (SXB)</strong><br>Navette train 9 min.</p></div><div class="transport-card"><h3>Voiture</h3><p><strong>A4 depuis Paris (4h30)</strong><br>Parking Wacken 800 places.</p></div><div class="transport-card"><h3>Tram</h3><p>Lignes B et E, arret <strong>Wacken</strong>.</p></div></div></div><div class="info-section"><h2><img src="img/icons/icon-restaurant.png" alt="" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle"> Guide gourmand</h2><div class="resto-grid"><div class="resto-card"><h4>Maison Kammerzell</h4><div class="type">Winstub historique</div><p>Cuisine alsacienne, Place de la Cathedrale.</p></div><div class="resto-card"><h4>Chez Yvonne</h4><div class="type">Winstub traditionnelle</div><p>Saucisses grillees, choucroute royale.</p></div><div class="resto-card"><h4>La Corde a Linge</h4><div class="type">Flammekueche creative</div><p>Petite France.</p></div></div></div><div class="info-section"><h2><img src="img/icons/icon-urgence.png" alt="" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle"> Numeros utiles</h2><div class="emergency-grid"><div class="emergency-card"><div class="number">15</div><div class="label">SAMU</div></div><div class="emergency-card"><div class="number">17</div><div class="label">Police</div></div><div class="emergency-card"><div class="number">18</div><div class="label">Pompiers</div></div><div class="emergency-card"><div class="number">112</div><div class="label">Urgences EU</div></div></div></div></section>';
  setTimeout(function(){var m=document.getElementById('spa-map');if(!m||m._leaflet_id)return;var map=L.map('spa-map').setView([48.5953,7.77],15);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'OpenStreetMap'}).addTo(map);L.marker([48.5953,7.77]).addTo(map).bindPopup('<strong>Palais des Congres</strong>').openPopup();setTimeout(function(){map.invalidateSize();},300);},200);
};

/* ══════════════════════════════════════
   PRESSE
   ══════════════════════════════════════ */
SPA_INIT.presse = function() {
  var el = document.getElementById('section-presse');
  el.innerHTML = '<section class="section" style="max-width:800px;"><h1 class="section-title"><img src="img/icons/icon-presse.png" alt="" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle"> Espace Presse</h1><p class="section-subtitle">Accreditation et kit medias.</p><div class="press-section"><h2>Accreditation presse</h2><div class="card" style="padding:24px;"><form id="press-form" onsubmit="SPA_PRESSE.submit(event)"><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;"><div class="form-group"><label>Prenom *</label><input type="text" id="p-prenom" required></div><div class="form-group"><label>Nom *</label><input type="text" id="p-nom" required></div></div><div class="form-group"><label>Email *</label><input type="email" id="p-email" required></div><div class="form-group"><label>Media *</label><input type="text" id="p-media" required></div><button type="submit" class="btn btn-green" style="width:100%;">Demander</button></form><div id="press-success" class="hidden" style="text-align:center;padding:24px;"><h3 style="color:#2AD783;">Demande envoyee ! (demo)</h3></div></div></div><div class="press-section"><h2>Contact presse</h2><div class="contact-press"><p style="font-size:.9rem;line-height:1.8;"><strong>Monique Pfleger</strong><br>presse@congres-saucisse.fr<br>03 88 37 67 67 (poste 3)</p></div></div></section>';
  window.SPA_PRESSE = { submit: function(e) { e.preventDefault(); document.getElementById('press-form').classList.add('hidden'); document.getElementById('press-success').classList.remove('hidden'); } };
};

/* ══════════════════════════════════════
   ADMIN SECTIONS
   ══════════════════════════════════════ */
function adminWrap(title, icon, inner) {
  return '<div class="admin-content" style="display:block !important;"><h1 class="admin-title"><img src="img/icons/' + icon + '" alt="" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle"> ' + title + '</h1>' + inner + '</div>';
}

SPA_INIT.dashboard = function() {
  var el = document.getElementById('section-dashboard');
  var stats = CONGRES.getStats(), ins = CONGRES.loadInscriptions();
  var pn = {standard:'Standard',bronze:'VIP Bronze',gold:'VIP Gold',platinum:'VIP Platinum',staff:'Staff'};
  var sh = '<div class="stat-card"><div class="stat-value">'+stats.total+'</div><div class="stat-label">Inscrits</div></div><div class="stat-card"><div class="stat-value">'+stats.revenue.toLocaleString('fr-FR')+' &euro;</div><div class="stat-label">Revenus</div></div>';
  Object.keys(pn).forEach(function(k){sh+='<div class="stat-card"><div class="stat-value">'+(stats.byPass[k]||0)+'</div><div class="stat-label">'+pn[k]+'</div></div>';});
  var pc = {standard:'#9CA3AF',bronze:'#CD7F32',gold:'#FFD300',platinum:'#C8C8DC',staff:'#DC2626'};
  var maxP = Math.max.apply(null,Object.values(stats.byPass).concat([1]));
  var ph='';Object.keys(pn).forEach(function(k){var v=stats.byPass[k]||0;ph+='<div class="chart-bar"><div class="chart-bar-label">'+pn[k]+'</div><div class="chart-bar-track"><div class="chart-bar-fill" style="width:'+(v/maxP*100)+'%;background:'+pc[k]+';">'+v+'</div></div></div>';});
  var ah='';CONGRES.SESSIONS.forEach(function(s){var sl=CONGRES.getSalle(s.salle);if(sl&&(s.inscrits/sl.capacite)>=.8){var p=Math.round(s.inscrits/sl.capacite*100);ah+='<div style="padding:8px 12px;background:rgba(245,158,11,.06);border-radius:8px;margin-bottom:6px;font-size:.82rem;"><span style="color:'+(p>=100?'#DC2626':'#F59E0B')+';font-weight:700;">'+p+'%</span> '+sl.nom+' — '+s.titre+'</div>';}});
  var th='';ins.slice(-5).reverse().forEach(function(i){var p=CONGRES.getPass(i.pass);th+='<tr><td>'+i.id+'</td><td>'+i.prenom+' '+i.nom+'</td><td>'+i.email+'</td><td><span class="tag tag-'+i.pass+'">'+(p?p.nom:i.pass)+'</span></td><td><span class="tag tag-'+i.statut+'">'+i.statut+'</span></td></tr>';});
  el.innerHTML = adminWrap('Dashboard','icon-dashboard.png','<div class="stats-grid">'+sh+'</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;"><div class="chart-card"><h3>Passes</h3>'+ph+'</div><div class="chart-card"><h3>Alertes</h3>'+(ah||'<p style="color:#5F5C55;">Aucune alerte.</p>')+'</div></div><div class="chart-card" style="margin-top:20px;"><h3>Dernieres inscriptions</h3><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>ID</th><th>Nom</th><th>Email</th><th>Pass</th><th>Statut</th></tr></thead><tbody>'+th+'</tbody></table></div></div>');
};

SPA_INIT.participants = function() {
  var el = document.getElementById('section-participants');
  el.innerHTML = adminWrap('Participants','icon-participants.png','<div class="search-bar"><input type="text" id="adm-search" placeholder="Rechercher..." oninput="SPA_PART.render()"><select id="adm-fpass" onchange="SPA_PART.render()"><option value="">Tous passes</option><option value="standard">Standard</option><option value="bronze">Bronze</option><option value="gold">Gold</option><option value="platinum">Platinum</option></select><button onclick="SPA_PART.csv()">Export CSV</button></div><div id="adm-cnt" style="font-size:.82rem;color:#9B978F;margin-bottom:12px;"></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>ID</th><th>Nom</th><th>Email</th><th>Pass</th><th>Sessions</th><th>Statut</th></tr></thead><tbody id="adm-ptable"></tbody></table></div>');
  window.SPA_PART={render:function(){var ins=CONGRES.loadInscriptions(),s=document.getElementById('adm-search').value.toLowerCase(),pf=document.getElementById('adm-fpass').value;var f=ins.filter(function(i){if(s&&!(i.nom.toLowerCase().includes(s)||i.prenom.toLowerCase().includes(s)||i.email.toLowerCase().includes(s)))return false;if(pf&&i.pass!==pf)return false;return true;});document.getElementById('adm-cnt').textContent=f.length+' participant(s)';var h='';f.forEach(function(i){var p=CONGRES.getPass(i.pass);h+='<tr><td>'+i.id+'</td><td><strong>'+i.prenom+' '+i.nom+'</strong></td><td>'+i.email+'</td><td><span class="tag tag-'+i.pass+'">'+(p?p.nom:i.pass)+'</span></td><td>'+(i.sessions?i.sessions.length:0)+'</td><td><span class="tag tag-'+i.statut+'">'+i.statut+'</span></td></tr>';});document.getElementById('adm-ptable').innerHTML=h;},csv:function(){var ins=CONGRES.loadInscriptions(),csv='ID,Prenom,Nom,Email,Pass,Statut\n';ins.forEach(function(i){csv+=[i.id,i.prenom,i.nom,i.email,i.pass,i.statut].join(',')+'\n';});var b=new Blob([csv],{type:'text/csv'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='participants.csv';a.click();}};
  SPA_PART.render();
};
function closeDetail(){document.getElementById('detail-modal').style.display='none';}

SPA_INIT.invitations = function() { document.getElementById('section-invitations').innerHTML = adminWrap('Invitations','icon-invitations.png','<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;"><div class="chart-card" style="cursor:pointer;" onclick="alert(\'Template Speaker — mode demo\')"><h3>Speaker / Intervenant</h3><p style="font-size:.8rem;color:#9B978F;">Ton formel et prestigieux.</p></div><div class="chart-card" style="cursor:pointer;" onclick="alert(\'Template VIP — mode demo\')"><h3>VIP Gold / Platinum</h3><p style="font-size:.8rem;color:#9B978F;">Ton premium et chaleureux.</p></div><div class="chart-card" style="cursor:pointer;" onclick="alert(\'Template Standard — mode demo\')"><h3>Participant Standard</h3><p style="font-size:.8rem;color:#9B978F;">Ton enthousiaste.</p></div><div class="chart-card" style="cursor:pointer;" onclick="alert(\'Template Presse — mode demo\')"><h3>Presse</h3><p style="font-size:.8rem;color:#9B978F;">Ton professionnel.</p></div></div>'); };

SPA_INIT.traiteur = function() { var ins=CONGRES.loadInscriptions(),r={standard:0,veggie:0,halal:0,gluten:0};ins.forEach(function(i){var x=i.repas||'standard';(i.jours||[1,2,3]).forEach(function(){r[x]=(r[x]||0)+1;});});var t=Object.values(r).reduce(function(a,b){return a+b;},0);var n={standard:'Standard',veggie:'Vegetarien',halal:'Halal',gluten:'Sans gluten'};var h='';Object.keys(n).forEach(function(k){h+='<div class="stat-card"><div class="stat-value">'+r[k]+'</div><div class="stat-label">'+n[k]+'</div></div>';});h+='<div class="stat-card"><div class="stat-value">'+t+'</div><div class="stat-label">Total</div></div>';document.getElementById('section-traiteur').innerHTML=adminWrap('Traiteur','icon-traiteur.png','<div class="stats-grid">'+h+'</div>'); };

SPA_INIT.salles = function() { var h='';CONGRES.SALLES.forEach(function(s){var ss=CONGRES.getSessionsBySalle(s.id),mx=0;ss.forEach(function(x){mx=Math.max(mx,Math.round(x.inscrits/s.capacite*100));});var c=mx>=100?'#333':mx>=80?'#DC2626':mx>=50?'#F59E0B':'#22C55E';h+='<div class="gauge-card"><h4>'+s.nom+'</h4><div class="gauge-info">'+s.etage+' · '+s.capacite+' pl. · '+ss.length+' sessions</div><div class="gauge-track"><div class="gauge-fill" style="width:'+Math.min(mx,100)+'%;background:'+c+';"></div></div><div style="text-align:right;font-size:.75rem;color:#5F5C55;margin-top:4px;">'+mx+'%</div></div>';});document.getElementById('section-salles').innerHTML=adminWrap('Jauge des salles','icon-salles.png','<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;">'+h+'</div>'); };

SPA_INIT.checkin = function() { document.getElementById('section-checkin').innerHTML=adminWrap('Check-in','icon-checkin.png','<div style="text-align:center;max-width:500px;margin:0 auto;"><div style="background:#161822;border:2px dashed rgba(201,168,76,.1);border-radius:20px;padding:40px;"><img src="img/icons/icon-qrcode.png" alt="" style="width:64px;height:64px;border-radius:12px;object-fit:contain;margin:0 auto;display:block;"><p style="color:#9B978F;margin-top:12px;">Scannez ou saisissez le code badge</p></div><input type="text" id="adm-code" placeholder="INS-001" style="width:100%;padding:14px;border-radius:12px;border:1px solid rgba(201,168,76,.1);background:rgba(255,255,255,.04);color:#E8E4DC;font-size:1rem;text-align:center;font-weight:700;margin-top:16px;" onkeydown="if(event.key===\'Enter\')SPA_CI.go()"><button onclick="SPA_CI.go()" style="margin-top:10px;padding:10px 24px;border-radius:10px;background:#C9A84C;color:#111;font-weight:700;border:none;cursor:pointer;width:100%;">Valider</button><div id="adm-ci-res" style="margin-top:20px;"></div></div>');window.SPA_CI={ck:JSON.parse(localStorage.getItem('congres_checkins')||'[]'),go:function(){var c=document.getElementById('adm-code').value.trim().toUpperCase();if(!c)return;var ins=CONGRES.loadInscriptions(),f=ins.find(function(i){return i.id.toUpperCase()===c;}),el=document.getElementById('adm-ci-res');if(!f){el.innerHTML='<div style="padding:20px;background:rgba(220,38,38,.08);border:2px solid #DC2626;border-radius:16px;"><h3 style="color:#DC2626;text-align:center;">Badge inconnu</h3></div>';return;}if(this.ck.indexOf(f.id)!==-1){el.innerHTML='<div style="padding:20px;background:rgba(220,38,38,.08);border:2px solid #DC2626;border-radius:16px;"><h3 style="color:#DC2626;text-align:center;">Deja scanne</h3></div>';return;}this.ck.push(f.id);localStorage.setItem('congres_checkins',JSON.stringify(this.ck));el.innerHTML='<div style="padding:20px;background:rgba(34,197,94,.08);border:2px solid #22C55E;border-radius:16px;"><h3 style="color:#22C55E;text-align:center;">&#10003; '+f.prenom+' '+f.nom+'</h3></div>';document.getElementById('adm-code').value='';}}; };

SPA_INIT.emails = function() { document.getElementById('section-emails').innerHTML=adminWrap('Emails automatiques','icon-emails.png','<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;"><div class="chart-card"><h3>Confirmation inscription</h3><p style="font-size:.82rem;color:#9B978F;">Envoi immediat.</p></div><div class="chart-card"><h3>Rappel J-7</h3><p style="font-size:.82rem;color:#9B978F;">5 juin 2026.</p></div><div class="chart-card"><h3>Rappel J-1</h3><p style="font-size:.82rem;color:#9B978F;">11 juin 2026.</p></div><div class="chart-card"><h3>Programme du jour</h3><p style="font-size:.82rem;color:#9B978F;">Chaque matin a 7h.</p></div></div>'); };

SPA_INIT.checklist = function() { var SECS=[{t:'J-6 mois',items:['Lieu confirme','Budget valide','Assurance RC','Contrat signe','Comite constitue','Site web']},{t:'J-3 mois',items:['Speakers confirmes','Traiteur reserve','Hotels reserves','Programme finalise','Sponsors']},{t:'J-1 mois',items:['Invitations envoyees','Badges commandes','Signaletique','Plan evacuation','Staff recrute']},{t:'J-1 semaine',items:['Speakers reconfirmes','Traiteur final','Test AV','Briefing staff','WiFi teste']},{t:'Jour J',items:['Accueil 07:00','Check-in teste','Traiteur en place','Photographe','DAE verifie']},{t:'Post-event',items:['Sondage satisfaction','Remerciements','Factures payees','RGPD suppression']}];var st={};try{st=JSON.parse(localStorage.getItem('congres_cl_spa')||'{}');}catch(e){}var tot=0,done=0;SECS.forEach(function(s){s.items.forEach(function(item,i){tot++;if(st[s.t+'_'+i])done++;});});var pct=tot>0?Math.round(done/tot*100):0;var h='<div style="background:#161822;border:1px solid #C9A84C;border-radius:14px;padding:24px;margin-bottom:24px;"><h2 style="color:#C9A84C;">Progression : '+pct+'% ('+done+'/'+tot+')</h2><div style="height:20px;background:rgba(255,255,255,.06);border-radius:10px;overflow:hidden;"><div style="height:100%;width:'+pct+'%;background:#C9A84C;border-radius:10px;"></div></div></div>';SECS.forEach(function(sec){h+='<div class="chart-card"><h3>'+sec.t+'</h3>';sec.items.forEach(function(item,i){var k=sec.t+'_'+i,ck=st[k]||false;h+='<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(201,168,76,.05);font-size:.82rem;"><input type="checkbox" '+(ck?'checked':'')+' style="width:18px;height:18px;accent-color:#22C55E;" onchange="SPA_CL.t(\''+k.replace(/'/g,"\\'")+'\',this.checked)"><span style="'+(ck?'text-decoration:line-through;color:#5F5C55;':'')+'">'+item+'</span></div>';});h+='</div>';});document.getElementById('section-checklist').innerHTML=adminWrap('Checklist','icon-checkin.png',h);window.SPA_CL={t:function(k,v){var s={};try{s=JSON.parse(localStorage.getItem('congres_cl_spa')||'{}');}catch(e){}s[k]=v;localStorage.setItem('congres_cl_spa',JSON.stringify(s));initializedSections['checklist']=false;SPA_INIT.checklist();}}; };

SPA_INIT.speakers = function() { var spk=CONGRES.SPEAKERS,df={1:'confirmed',2:'confirmed',3:'confirmed',4:'confirmed',5:'confirmed',6:'cancelled',7:'confirmed',8:'confirmed',9:'confirmed',10:'confirmed',11:'confirmed',12:'confirmed',13:'confirmed',14:'confirmed',15:'confirmed',16:'confirmed',17:'confirmed',18:'pending',19:'confirmed',20:'confirmed',21:'confirmed',22:'confirmed'};var h='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:16px;">';spk.forEach(function(s){var st=df[s.id]||'pending',sc=st==='confirmed'?'#22C55E':st==='cancelled'?'#DC2626':'#F59E0B';var ss=CONGRES.getSessionsBySpeaker(s.id);h+='<div style="background:#161822;border:1px solid rgba(201,168,76,.1);border-radius:14px;padding:20px;"><div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;"><div style="width:48px;height:48px;border-radius:50%;background:rgba(201,168,76,.15);display:flex;align-items:center;justify-content:center;font-weight:800;color:#C9A84C;">'+s.initiales+'</div><div><div style="font-weight:700;font-size:.9rem;">'+s.prenom+' '+s.nom+'</div><div style="font-size:.75rem;color:#9B978F;">'+s.titre+'</div></div></div><div style="font-size:.78rem;color:#9B978F;">'+s.org+' | <span style="color:'+sc+';font-weight:700;">'+st+'</span></div>';if(ss.length>0){h+='<div style="margin-top:8px;">';ss.forEach(function(x){h+='<div style="font-size:.75rem;padding:4px 8px;background:rgba(201,168,76,.05);border-radius:6px;margin-bottom:4px;color:#9B978F;">J'+x.jour+' '+x.debut+' : '+x.titre+'</div>';});h+='</div>';}h+='</div>';});h+='</div>';document.getElementById('section-speakers').innerHTML=adminWrap('Speakers','icon-participants.png',h); };

SPA_INIT.staff = function() { var s=CONGRES.getStats(),n=Math.ceil(s.total/50);document.getElementById('section-staff').innerHTML=adminWrap('Staff','icon-participants.png','<div class="stats-grid"><div class="stat-card"><div class="stat-value">'+s.total+'</div><div class="stat-label">Participants</div></div><div class="stat-card"><div class="stat-value">'+n+'</div><div class="stat-label">Staff necessaire</div></div></div><p style="font-size:.82rem;color:#9B978F;">Module de gestion staff avec postes et planning.</p>'); };

SPA_INIT.securite = function() { var s=CONGRES.getStats();document.getElementById('section-securite').innerHTML=adminWrap('Securite','icon-salles.png','<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;"><div class="chart-card"><h3>Agents securite</h3><p style="color:#9B978F;">Necessaires : '+Math.max(1,Math.ceil(s.total/250))+'</p></div><div class="chart-card"><h3>Secouristes</h3><p style="color:#9B978F;">Necessaires : '+Math.max(1,Math.ceil(s.total/500))+'</p></div><div class="chart-card"><h3>Evacuation</h3><p style="color:#9B978F;">6 sorties, 8 min cible</p></div></div>'); };

SPA_INIT.budget = function() { var s=CONGRES.getStats();document.getElementById('section-budget').innerHTML=adminWrap('Budget','icon-traiteur.png','<div class="stats-grid"><div class="stat-card"><div class="stat-value">164 300 &euro;</div><div class="stat-label">Budget prevu</div></div><div class="stat-card"><div class="stat-value" style="color:#22C55E;">'+s.revenue.toLocaleString('fr-FR')+' &euro;</div><div class="stat-label">Revenus</div></div></div>'); };

SPA_INIT.postevent = function() { var dl=Math.ceil((new Date('2026-12-14')-new Date())/(864e5));document.getElementById('section-postevent').innerHTML=adminWrap('Post-evenement','icon-emails.png','<div class="chart-card"><h3>NPS (simulation)</h3><div style="text-align:center;font-size:4rem;font-weight:900;color:#22C55E;">72</div></div><div style="background:rgba(220,38,38,.05);border:1px solid rgba(220,38,38,.2);border-radius:14px;padding:24px;margin-top:20px;"><h3 style="color:#DC2626;">RGPD</h3><div style="font-size:2rem;font-weight:900;color:#DC2626;text-align:center;">'+(dl>0?dl+' jours':'SUPPRESSION REQUISE')+'</div><p style="font-size:.78rem;color:#5F5C55;text-align:center;">Date limite : 14 dec 2026</p></div>'); };
