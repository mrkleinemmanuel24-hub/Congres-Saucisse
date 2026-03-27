/* ═══════════════════════════════════════════════════════
   CONGRES DE LA SAUCISSE — SPA SECTIONS JS
   All section init/render functions
   ═══════════════════════════════════════════════════════ */

// ═══════════════════════════════════════
// PROGRAMME
// ═══════════════════════════════════════
var pgCurrentDay = 1, pgCurrentTheme = null, pgCurrentSalle = null;
var pgFavorites = CONGRES.loadFavorites();
var pgReminders = CONGRES.loadReminders();

window.initSection_programme = function() {
  var html = '<button class="filter-btn active" onclick="pgFilterTheme(null)">Toutes</button>';
  CONGRES.SALLES.forEach(function(s) { html += '<button class="filter-btn" data-salle="'+s.id+'" onclick="pgFilterSalle(\''+s.id+'\')">'+s.nom+'</button>'; });
  CONGRES.THEMES.forEach(function(t) { html += '<button class="filter-btn" data-theme="'+t+'" onclick="pgFilterTheme(\''+t+'\')">'+t+'</button>'; });
  document.getElementById('pg-filters').innerHTML = html;
  pgRenderSessions();
};

function pgShowDay(d) {
  pgCurrentDay = d;
  document.querySelectorAll('#section-programme .tab-btn').forEach(function(b,i){b.classList.toggle('active',i===d-1);});
  pgRenderSessions();
}
function pgFilterTheme(t) { pgCurrentTheme=t; pgCurrentSalle=null; pgUpdateFilters(); pgRenderSessions(); }
function pgFilterSalle(s) { pgCurrentSalle=(pgCurrentSalle===s)?null:s; pgCurrentTheme=null; pgUpdateFilters(); pgRenderSessions(); }
function pgUpdateFilters() {
  document.querySelectorAll('#section-programme .filter-btn').forEach(function(b){
    var a=false;
    if(!pgCurrentTheme&&!pgCurrentSalle&&!b.dataset.theme&&!b.dataset.salle) a=true;
    if(pgCurrentTheme&&b.dataset.theme===pgCurrentTheme) a=true;
    if(pgCurrentSalle&&b.dataset.salle===pgCurrentSalle) a=true;
    b.classList.toggle('active',a);
  });
}
function pgToggleFav(id){var i=pgFavorites.indexOf(id);if(i===-1)pgFavorites.push(id);else pgFavorites.splice(i,1);CONGRES.saveFavorites(pgFavorites);pgRenderSessions();}
function pgToggleReminder(id){var i=pgReminders.indexOf(id);if(i===-1)pgReminders.push(id);else pgReminders.splice(i,1);CONGRES.saveReminders(pgReminders);pgRenderSessions();}

function pgRenderSessions() {
  var sessions = CONGRES.getSessionsByDay(pgCurrentDay);
  if(pgCurrentTheme) sessions=sessions.filter(function(s){return s.theme===pgCurrentTheme;});
  if(pgCurrentSalle) sessions=sessions.filter(function(s){return s.salle===pgCurrentSalle;});
  var html='';
  if(!sessions.length) html='<div class="text-center" style="padding:40px;color:#6B7280;">Aucune session trouvee.</div>';
  sessions.forEach(function(s){
    var salle=CONGRES.getSalle(s.salle), places=CONGRES.getPlacesRestantes(s), capClass=CONGRES.getCapacityClass(s.salle,s.inscrits);
    var isFav=pgFavorites.indexOf(s.id)!==-1, isRem=pgReminders.indexOf(s.id)!==-1;
    var spkNames=s.speakers.map(function(id){var sp=CONGRES.getSpeaker(id);return sp?sp.prenom+' '+sp.nom:'';}).join(', ');
    html+='<div class="session-card"><div class="session-time">'+s.debut+'<br><span style="font-size:.7rem;color:#6B7280;">'+s.fin+'</span></div><div class="session-info"><h3>'+s.titre+'</h3><div class="speaker">'+spkNames+'</div><div class="meta">'+(salle?salle.nom+' · '+salle.etage:'')+' · <span class="capacity-badge capacity-'+capClass+'">'+places+' places</span></div><div class="meta" style="margin-top:2px;"><span class="filter-btn" style="padding:2px 8px;font-size:.7rem;cursor:default;">'+s.theme+'</span></div></div><div class="session-actions"><button class="heart-btn'+(isFav?' active':'')+'" onclick="pgToggleFav('+s.id+')">'+(isFav?'&#9829;':'&#9825;')+'</button><button class="reminder-toggle'+(isRem?' active':'')+'" onclick="pgToggleReminder('+s.id+')">'+(isRem?'Rappel ON':'Rappel')+'</button></div></div>';
  });
  document.getElementById('pg-sessions-list').innerHTML=html;
}

// ═══════════════════════════════════════
// INTERVENANTS
// ═══════════════════════════════════════
var ivFilter = null;
window.initSection_intervenants = function() {
  var themes=[];
  CONGRES.SPEAKERS.forEach(function(s){if(themes.indexOf(s.theme)===-1)themes.push(s.theme);});
  var html='<button class="filter-btn active" onclick="ivFilterBy(null)">Tous</button>';
  themes.forEach(function(t){html+='<button class="filter-btn" data-t="'+t+'" onclick="ivFilterBy(\''+t+'\')">'+t+'</button>';});
  document.getElementById('iv-theme-filters').innerHTML=html;
  ivRenderSpeakers();
};
function ivFilterBy(t){
  ivFilter=t;
  document.querySelectorAll('#section-intervenants .filter-btn').forEach(function(b){b.classList.toggle('active',(!t&&!b.dataset.t)||(t&&b.dataset.t===t));});
  ivRenderSpeakers();
}
function ivRenderSpeakers(){
  var speakers=CONGRES.SPEAKERS;
  if(ivFilter) speakers=speakers.filter(function(s){return s.theme===ivFilter;});
  var html='';
  speakers.forEach(function(s){
    html+='<div class="speaker-card" id="speaker-'+s.id+'" onclick="ivOpenSpeaker('+s.id+')"><div class="speaker-avatar">'+s.initiales+'</div><h3>'+s.prenom+' '+s.nom+'</h3><div class="title">'+s.titre+'</div><div class="org">'+s.org+'</div></div>';
  });
  document.getElementById('iv-speakers-grid').innerHTML=html;
}
function ivOpenSpeaker(id){
  var s=CONGRES.getSpeaker(id); if(!s) return;
  var sessions=CONGRES.getSessionsBySpeaker(id);
  var dayNames=['','Jeu. 12','Ven. 13','Sam. 14'];
  var html='<div style="text-align:center;margin-bottom:20px;"><div class="speaker-avatar" style="width:100px;height:100px;font-size:2.2rem;margin:0 auto 12px;">'+s.initiales+'</div><h2 style="font-size:1.3rem;">'+s.prenom+' '+s.nom+'</h2><div style="color:#FFD300;font-weight:600;font-size:.9rem;">'+s.titre+'</div><div style="color:#6B7280;font-size:.82rem;">'+s.org+'</div></div><div style="background:rgba(255,255,255,.03);border-radius:12px;padding:16px;margin-bottom:20px;"><p style="font-size:.88rem;color:#B1B9C3;line-height:1.7;">'+s.bio+'</p></div>';
  if(sessions.length){
    html+='<h3 style="font-size:.95rem;color:#2AD783;margin-bottom:12px;">Sessions ('+sessions.length+')</h3>';
    sessions.forEach(function(sess){var salle=CONGRES.getSalle(sess.salle);html+='<div style="display:flex;gap:12px;padding:10px;background:rgba(255,255,255,.02);border-radius:10px;margin-bottom:8px;"><div style="min-width:60px;text-align:center;font-weight:700;color:#2AD783;font-size:.85rem;">'+sess.debut+'</div><div><div style="font-weight:600;font-size:.88rem;">'+sess.titre+'</div><div style="font-size:.78rem;color:#6B7280;">'+dayNames[sess.jour]+' · '+(salle?salle.nom:'')+'</div></div></div>';});
  }
  document.getElementById('speaker-modal-content').innerHTML=html;
  document.getElementById('speaker-modal').classList.add('active');
}
function closeSpeakerModal(){document.getElementById('speaker-modal').classList.remove('active');}
document.getElementById('speaker-modal').addEventListener('click',function(e){if(e.target===this)closeSpeakerModal();});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeSpeakerModal();});

// ═══════════════════════════════════════
// INSCRIPTION
// ═══════════════════════════════════════
var insReg = {prenom:'',nom:'',email:'',tel:'',entreprise:'',pass:'standard',sessions:[],repas:'standard',hotel:null,jours:[1,2,3],regime:'standard',regimeAutre:'',accessibilite:[],accAutre:'',droitsImage:false,rgpd:false};

window.initSection_inscription = function() {
  document.getElementById('f-regime').addEventListener('change',function(){document.getElementById('regime-autre-group').style.display=this.value==='autre'?'block':'none';});
  document.getElementById('f-acc-autre-check').addEventListener('change',function(){document.getElementById('acc-autre-group').style.display=this.checked?'block':'none';});
};

function insNextStep(step) {
  if(step===2){
    insReg.prenom=document.getElementById('f-prenom').value.trim();
    insReg.nom=document.getElementById('f-nom').value.trim();
    insReg.email=document.getElementById('f-email').value.trim();
    insReg.tel=document.getElementById('f-tel').value.trim();
    insReg.entreprise=document.getElementById('f-entreprise').value.trim();
    if(!insReg.prenom||!insReg.nom||!insReg.email){alert('Remplissez les champs obligatoires.');return;}
    insReg.rgpd=document.getElementById('f-rgpd').checked;
    if(!insReg.rgpd){alert('Vous devez accepter le RGPD.');return;}
    insReg.regime=document.getElementById('f-regime').value;
    insReg.regimeAutre=document.getElementById('f-regime-autre').value.trim();
    insReg.droitsImage=document.getElementById('f-droits-image').checked;
    var acc=[];
    if(document.getElementById('f-acc-fauteuil').checked) acc.push('fauteuil');
    if(document.getElementById('f-acc-malvoyant').checked) acc.push('malvoyant');
    if(document.getElementById('f-acc-malentendant').checked) acc.push('malentendant');
    if(document.getElementById('f-acc-calme').checked) acc.push('salle-calme');
    if(document.getElementById('f-acc-autre-check').checked) acc.push('autre');
    insReg.accessibilite=acc;
    insReg.accAutre=document.getElementById('f-acc-autre').value.trim();
    var fields=[insReg.prenom,insReg.nom,insReg.entreprise,insReg.regimeAutre,insReg.accAutre];
    for(var i=0;i<fields.length;i++){var c=ContentFilter.check(fields[i]);if(!c.ok){alert(c.reason);return;}}
  }
  if(step===3&&insReg.pass==='staff'){var code=document.getElementById('f-staff-code').value.trim();if(code!=='STAFF2026'){alert('Code staff invalide.');return;}}
  var container=document.getElementById('section-inscription');
  container.querySelectorAll('.step-content').forEach(function(el){el.classList.remove('active');});
  container.querySelector('.step-content[data-step="'+step+'"]').classList.add('active');
  container.querySelectorAll('.step-indicator').forEach(function(el){var s=parseInt(el.dataset.step);el.classList.toggle('active',s===step);el.classList.toggle('done',s<step);});
  document.querySelector('.main-content').scrollTo({top:0,behavior:'smooth'});
  if(step===2) insInitPasses();
  if(step===3) insShowSessionDay(1);
  if(step===4) insInitRepas();
  if(step===5) insInitHotels();
  if(step===6) insBuildRecap();
}

function insInitPasses(){
  var html='';
  CONGRES.PASSES.forEach(function(p){
    var cls='';if(p.id==='bronze')cls=' vip-bronze';if(p.id==='gold')cls=' vip-gold';if(p.id==='platinum')cls=' vip-platinum';if(p.id==='staff')cls=' staff';
    var sel=insReg.pass===p.id?' selected':'';
    html+='<div class="pass-card'+cls+sel+'" onclick="insSelectPass(\''+p.id+'\',this)"><div class="pass-name">'+p.nom+'</div><div class="pass-price">'+(p.prix===0?'Gratuit':p.prix+' &euro;')+'</div><ul class="pass-features">';
    p.features.forEach(function(f){html+='<li>'+f+'</li>';});
    html+='</ul></div>';
  });
  document.getElementById('ins-pass-grid').innerHTML=html;
}
function insSelectPass(id,el){insReg.pass=id;document.getElementById('ins-staff-code-section').classList.toggle('visible',id==='staff');document.querySelectorAll('#ins-pass-grid .pass-card').forEach(function(c){c.classList.remove('selected');});el.classList.add('selected');}

function insShowSessionDay(day,btn){
  if(btn){btn.parentElement.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('active');});btn.classList.add('active');}
  var sessions=CONGRES.getSessionsByDay(day);var html='';
  sessions.forEach(function(s){
    var speakers=s.speakers.map(function(id){var sp=CONGRES.getSpeaker(id);return sp?sp.prenom+' '+sp.nom:'';}).join(', ');
    var salle=CONGRES.getSalle(s.salle);var checked=insReg.sessions.indexOf(s.id)!==-1;
    html+='<label class="session-check'+(checked?' checked':'')+'"><input type="checkbox" '+(checked?'checked':'')+' onchange="insToggleSession('+s.id+',this)"><div><strong>'+s.debut+'</strong> '+s.titre+'<br><span style="font-size:.78rem;color:#6B7280;">'+speakers+' · '+(salle?salle.nom:'')+'</span></div></label>';
  });
  document.getElementById('ins-session-choices').innerHTML=html;
}
function insToggleSession(id,el){var i=insReg.sessions.indexOf(id);if(i===-1)insReg.sessions.push(id);else insReg.sessions.splice(i,1);el.closest('.session-check').classList.toggle('checked',el.checked);}

function insInitRepas(){
  var html='';
  CONGRES.REPAS_OPTIONS.forEach(function(r){
    var sel=insReg.repas===r.id;
    html+='<label class="repas-option'+(sel?' selected':'')+'" onclick="insSelectRepas(\''+r.id+'\')"><input type="radio" name="repas" '+(sel?'checked':'')+'><div><strong>'+r.nom+'</strong> — '+r.prix+' &euro;/jour<br><span style="font-size:.8rem;color:#6B7280;">'+r.desc+'</span></div></label>';
  });
  document.getElementById('ins-repas-choices').innerHTML=html;
}
function insSelectRepas(id){insReg.repas=id;}

function insInitHotels(){
  var html='';
  CONGRES.HOTELS.forEach(function(h){
    var sel=insReg.hotel===h.id;var stars='';for(var i=0;i<h.etoiles;i++)stars+='&#9733;';
    html+='<div class="hotel-option'+(sel?' selected':'')+'" onclick="insSelectHotel('+h.id+')" data-hotel="'+h.id+'"><div style="flex:1;"><strong>'+h.nom+'</strong> <span class="hotel-stars">'+stars+'</span><br><span style="font-size:.82rem;color:#6B7280;">'+h.distance+' · '+h.adresse+'</span></div><div style="text-align:right;"><div style="font-size:1.1rem;font-weight:800;color:#2AD783;">'+h.prix+' &euro;</div><div style="font-size:.75rem;color:#6B7280;">/nuit (3n = '+(h.prix*3)+' &euro;)</div></div></div>';
  });
  document.getElementById('ins-hotel-choices').innerHTML=html;
}
function insSelectHotel(id){
  insReg.hotel=id;
  document.querySelectorAll('#section-inscription .hotel-option').forEach(function(el){el.classList.remove('selected');});
  if(id===null){document.getElementById('ins-hotel-none').classList.add('selected');}
  else{var el=document.querySelector('[data-hotel="'+id+'"]');if(el)el.classList.add('selected');document.getElementById('ins-hotel-none').classList.remove('selected');}
}

function insBuildRecap(){
  var pass=CONGRES.getPass(insReg.pass),repas=CONGRES.REPAS_OPTIONS.find(function(r){return r.id===insReg.repas;}),hotel=insReg.hotel?CONGRES.getHotel(insReg.hotel):null;
  var pp=pass?pass.prix:0,rp=repas?repas.prix*3:0,hp=hotel?hotel.prix*3:0;
  if(insReg.pass==='platinum')hp=0;var total=pp+rp+hp;
  var html='<div class="recap-section"><h4>Informations</h4><div class="recap-row"><span>Nom</span><span>'+insReg.prenom+' '+insReg.nom+'</span></div><div class="recap-row"><span>Email</span><span>'+insReg.email+'</span></div></div>';
  html+='<div class="recap-section"><h4>Pass</h4><div class="recap-row"><span>'+(pass?pass.nom:'')+'</span><span>'+pp+' &euro;</span></div></div>';
  html+='<div class="recap-section"><h4>Sessions ('+insReg.sessions.length+')</h4>';
  insReg.sessions.forEach(function(sid){var s=CONGRES.getSession(sid);if(s)html+='<div class="recap-row"><span>J'+s.jour+' '+s.debut+' — '+s.titre+'</span><span></span></div>';});
  html+='</div>';
  html+='<div class="recap-section"><h4>Repas</h4><div class="recap-row"><span>'+(repas?repas.nom:'')+' x 3j</span><span>'+rp+' &euro;</span></div></div>';
  if(hotel) html+='<div class="recap-section"><h4>Hotel</h4><div class="recap-row"><span>'+hotel.nom+' x 3n</span><span>'+hp+' &euro;</span></div></div>';
  html+='<div class="recap-total">Total : '+total+' &euro;</div><p style="font-size:.78rem;color:#6B7280;text-align:center;">Mode demonstration.</p>';
  document.getElementById('ins-recap-content').innerHTML=html;
}

function insConfirm(){
  var id='INS-'+String(Date.now()).slice(-6);
  var ins={id:id,nom:insReg.nom,prenom:insReg.prenom,email:insReg.email,tel:insReg.tel,entreprise:insReg.entreprise,pass:insReg.pass,sessions:insReg.sessions,repas:insReg.repas,hotel:insReg.hotel,jours:[1,2,3],regime:insReg.regime,regimeAutre:insReg.regimeAutre,accessibilite:insReg.accessibilite,accAutre:insReg.accAutre,droitsImage:insReg.droitsImage,rgpd:insReg.rgpd,statut:'confirmed',date:new Date().toISOString().split('T')[0]};
  var list=CONGRES.loadInscriptions();list.push(ins);CONGRES.saveInscriptions(list);
  document.getElementById('ins-badge-container').innerHTML=generateBadge(ins);
  insNextStep(7);
}

// ═══════════════════════════════════════
// PLAN
// ═══════════════════════════════════════
window.initSection_plan = function() {
  var typeClasses={auditorium:'type-auditorium',conference:'type-conference',atelier:'type-atelier',reunion:'type-reunion',expo:'type-expo',restauration:'type-restauration'};
  var html='';
  CONGRES.SALLES.forEach(function(s){
    var sessions=CONGRES.getSessionsBySalle(s.id);
    html+='<div class="room-info-card"><h4>'+s.nom+' <span class="room-type-badge '+(typeClasses[s.type]||'')+'">'+s.type+'</span></h4><div class="room-meta">'+s.etage+' · '+s.capacite+' places · '+sessions.length+' sessions</div><div class="room-meta">'+s.equipement+'</div></div>';
  });
  document.getElementById('plan-room-list').innerHTML=html;
};

function planShowFloor(f,btn){
  document.querySelectorAll('.plan-floor').forEach(function(el){el.classList.remove('active');});
  document.getElementById('floor-'+f).classList.add('active');
  btn.parentElement.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('active');});
  btn.classList.add('active');
  planClosePopup();
}
function planShowRoom(id,event){
  var salle=CONGRES.getSalle(id);if(!salle)return;
  var sessions=CONGRES.getSessionsBySalle(id);
  var typeClasses={auditorium:'type-auditorium',conference:'type-conference',atelier:'type-atelier',reunion:'type-reunion',expo:'type-expo',restauration:'type-restauration'};
  var dayNames=['','Jeu. 12','Ven. 13','Sam. 14'];
  var html='<h4>'+salle.nom+'</h4><p><span class="room-type-badge '+(typeClasses[salle.type]||'')+'">'+salle.type+'</span> · '+salle.etage+'</p><p>Capacite : <strong>'+salle.capacite+'</strong></p>';
  if(sessions.length){
    html+='<div style="margin-top:10px;border-top:1px solid rgba(255,255,255,.08);padding-top:8px;"><p style="font-weight:700;font-size:.82rem;color:#2AD783;">'+sessions.length+' sessions</p>';
    sessions.slice(0,4).forEach(function(s){html+='<p style="font-size:.78rem;">'+dayNames[s.jour]+' '+s.debut+' — '+s.titre+'</p>';});
    if(sessions.length>4) html+='<p style="font-size:.75rem;color:#2AD783;">+ '+(sessions.length-4)+' autres...</p>';
    html+='</div>';
  }
  document.getElementById('popup-content').innerHTML=html;
  var popup=document.getElementById('room-popup');popup.classList.add('visible');
  var wrapper=document.querySelector('.plan-wrapper');var rect=wrapper.getBoundingClientRect();
  popup.style.left=Math.min(event.clientX-rect.left,rect.width-290)+'px';
  popup.style.top=Math.min(event.clientY-rect.top+10,rect.height-200)+'px';
}
function planClosePopup(){document.getElementById('room-popup').classList.remove('visible');}

// ═══════════════════════════════════════
// INFOS (Leaflet map)
// ═══════════════════════════════════════
var leafletMap = null;
window.initSection_infos = function() {
  setTimeout(function() {
    if(leafletMap) return;
    var el = document.getElementById('leaflet-map');
    if(!el || !el.offsetHeight) return;
    leafletMap = L.map('leaflet-map').setView([48.5953, 7.7700], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution:'&copy; OpenStreetMap'}).addTo(leafletMap);
    L.marker([48.5953, 7.7700]).addTo(leafletMap).bindPopup('<strong>Palais des Congres</strong>').openPopup();
    [[48.5948,7.7720,'Hilton'],[48.5956,7.7695,'Mercure'],[48.5940,7.7710,'ibis Styles']].forEach(function(h){L.marker([h[0],h[1]],{opacity:.8}).addTo(leafletMap).bindPopup(h[2]);});
    L.marker([48.5850,7.7340]).addTo(leafletMap).bindPopup('Gare de Strasbourg');
  }, 200);
};

// ═══════════════════════════════════════
// PRESSE
// ═══════════════════════════════════════
function submitPressForm(e){
  e.preventDefault();
  var fields=['p-prenom','p-nom','p-media','p-objet'];
  for(var i=0;i<fields.length;i++){var v=document.getElementById(fields[i]).value;if(v){var c=ContentFilter.check(v);if(!c.ok){alert(c.reason);return;}}}
  document.getElementById('press-form').classList.add('hidden');
  document.getElementById('press-success').classList.remove('hidden');
}

// ═══════════════════════════════════════
// ADMIN: DASHBOARD
// ═══════════════════════════════════════
window.initSection_admin_dashboard = function() {
  var stats=CONGRES.getStats(), ins=CONGRES.loadInscriptions();
  var passNames={standard:'Standard',bronze:'VIP Bronze',gold:'VIP Gold',platinum:'VIP Platinum',staff:'Staff'};
  var sh='<div class="stat-card"><div class="stat-value">'+stats.total+'</div><div class="stat-label">Inscrits</div></div><div class="stat-card"><div class="stat-value">'+stats.revenue.toLocaleString('fr-FR')+' &euro;</div><div class="stat-label">Revenus</div></div>';
  Object.keys(passNames).forEach(function(k){sh+='<div class="stat-card"><div class="stat-value">'+(stats.byPass[k]||0)+'</div><div class="stat-label">'+passNames[k]+'</div></div>';});
  var recent=ins.slice(-5).reverse();
  var th='';recent.forEach(function(i){var p=CONGRES.getPass(i.pass);th+='<tr><td>'+i.id+'</td><td>'+i.prenom+' '+i.nom+'</td><td>'+i.email+'</td><td>'+(p?p.nom:i.pass)+'</td><td>'+i.date+'</td><td>'+i.statut+'</td></tr>';});
  document.getElementById('admin-dashboard-content').innerHTML='<h1 class="admin-title"><img src="img/icons/icon-dashboard.png" alt="" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle"> Dashboard</h1><div class="stats-grid">'+sh+'</div><div class="chart-card"><h3>Dernieres inscriptions</h3><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>ID</th><th>Nom</th><th>Email</th><th>Pass</th><th>Date</th><th>Statut</th></tr></thead><tbody>'+th+'</tbody></table></div></div>';
};

// ═══════════════════════════════════════
// ADMIN: PARTICIPANTS
// ═══════════════════════════════════════
window.initSection_admin_participants = function() {
  document.getElementById('admin-participants-content').innerHTML='<h1 class="admin-title"><img src="img/icons/icon-participants.png" alt="" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle"> Participants</h1><div class="search-bar"><input type="text" id="ap-search" placeholder="Rechercher..." oninput="apRender()"><select id="ap-filter-pass" onchange="apRender()"><option value="">Tous passes</option><option value="standard">Standard</option><option value="bronze">Bronze</option><option value="gold">Gold</option><option value="platinum">Platinum</option><option value="staff">Staff</option></select><button onclick="apExport()">Export CSV</button></div><div id="ap-count" style="font-size:.82rem;color:#9B978F;margin-bottom:12px;"></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>ID</th><th>Nom</th><th>Email</th><th>Pass</th><th>Sessions</th><th>Statut</th></tr></thead><tbody id="ap-body"></tbody></table></div>';
  apRender();
};
function apRender(){
  var ins=CONGRES.loadInscriptions(),search=(document.getElementById('ap-search')||{}).value||'',pf=(document.getElementById('ap-filter-pass')||{}).value||'';
  search=search.toLowerCase();
  var filtered=ins.filter(function(i){
    if(search&&!(i.nom+' '+i.prenom+' '+i.email).toLowerCase().includes(search))return false;
    if(pf&&i.pass!==pf)return false;return true;
  });
  var el=document.getElementById('ap-count');if(el)el.textContent=filtered.length+' participant(s)';
  var html='';
  filtered.forEach(function(i){var p=CONGRES.getPass(i.pass);html+='<tr><td>'+i.id+'</td><td><strong>'+i.prenom+' '+i.nom+'</strong></td><td>'+i.email+'</td><td>'+(p?p.nom:i.pass)+'</td><td>'+(i.sessions?i.sessions.length:0)+'</td><td>'+i.statut+'</td></tr>';});
  var el2=document.getElementById('ap-body');if(el2)el2.innerHTML=html;
}
function apExport(){
  var ins=CONGRES.loadInscriptions();var csv='ID,Prenom,Nom,Email,Pass,Statut,Date\n';
  ins.forEach(function(i){csv+=[i.id,i.prenom,i.nom,i.email,i.pass,i.statut,i.date].join(',')+'\n';});
  var blob=new Blob([csv],{type:'text/csv'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='participants.csv';a.click();
}
function closeDetail(){document.getElementById('detail-modal').style.display='none';}

// ═══════════════════════════════════════
// ADMIN: INVITATIONS (simplified)
// ═══════════════════════════════════════
window.initSection_admin_invitations = function() {
  document.getElementById('admin-invitations-content').innerHTML='<h1 class="admin-title"><img src="img/icons/icon-invitations.png" alt="" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle"> Templates d\'invitation</h1><div class="vars-info"><strong>Variables :</strong> <code>{NOM}</code> <code>{PRENOM}</code> <code>{DATE}</code> <code>{PASS}</code></div><div class="inv-template-grid"><div class="inv-template-card" onclick="this.classList.toggle(\'selected\')"><span class="type-badge" style="background:#C9A84C;color:#111;">Speaker</span><h3>Invitation Speaker</h3><p>Ton formel, prestigieux</p></div><div class="inv-template-card" onclick="this.classList.toggle(\'selected\')"><span class="type-badge" style="background:#C8C8DC;color:#111;">VIP Platinum</span><h3>Invitation VIP Platinum</h3><p>Ton luxueux, exclusif</p></div><div class="inv-template-card" onclick="this.classList.toggle(\'selected\')"><span class="type-badge" style="background:#FFD300;color:#111;">VIP Gold</span><h3>Invitation VIP Gold / Bronze</h3><p>Ton premium, chaleureux</p></div><div class="inv-template-card" onclick="this.classList.toggle(\'selected\')"><span class="type-badge" style="background:#9CA3AF;color:#111;">Standard</span><h3>Invitation Standard</h3><p>Ton chaleureux, enthousiaste</p></div><div class="inv-template-card" onclick="this.classList.toggle(\'selected\')"><span class="type-badge" style="background:#22C55E;color:#111;">Presse</span><h3>Accreditation Presse</h3><p>Ton professionnel, factuel</p></div></div><div class="chart-card"><h3>Suivi des invitations</h3><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Destinataire</th><th>Type</th><th>Date</th><th>Statut</th></tr></thead><tbody><tr><td>Jean-Marc Schaller</td><td>Speaker</td><td>2026-02-01</td><td><span class="tag tag-confirmed">confirmed</span></td></tr><tr><td>Klaus Muller</td><td>Speaker</td><td>2026-02-01</td><td><span class="tag tag-confirmed">confirmed</span></td></tr><tr><td>Hans Schmidt</td><td>VIP Platinum</td><td>2026-02-15</td><td><span class="tag tag-confirmed">confirmed</span></td></tr><tr><td>Claire Petit</td><td>Presse</td><td>2026-03-05</td><td><span class="tag tag-pending">pending</span></td></tr></tbody></table></div></div>';
};

// ═══════════════════════════════════════
// ADMIN: TRAITEUR
// ═══════════════════════════════════════
window.initSection_admin_traiteur = function() {
  var ins=CONGRES.loadInscriptions();var regimes={standard:0,veggie:0,halal:0,gluten:0};
  ins.forEach(function(i){var r=i.repas||'standard';var days=i.jours||[1,2,3];days.forEach(function(){regimes[r]=(regimes[r]||0)+1;});});
  var total=Object.values(regimes).reduce(function(a,b){return a+b;},0);
  var icons={standard:'&#127830;',veggie:'&#129367;',halal:'&#127769;',gluten:'&#127806;'};
  var names={standard:'Standard',veggie:'Vegetarien',halal:'Halal',gluten:'Sans gluten'};
  var mh='';Object.keys(names).forEach(function(k){mh+='<div class="meal-card"><div class="meal-icon">'+icons[k]+'</div><div class="meal-count">'+regimes[k]+'</div><div class="meal-label">'+names[k]+'</div></div>';});
  mh+='<div class="meal-card"><div class="meal-icon">&#127860;</div><div class="meal-count">'+total+'</div><div class="meal-label">Total repas</div></div>';
  var costTotal=total*15;var costTTC=Math.round(costTotal*1.15);
  document.getElementById('admin-traiteur-content').innerHTML='<h1 class="admin-title"><img src="img/icons/icon-traiteur.png" alt="" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle"> Gestion Traiteur</h1><h2 style="font-size:1rem;color:#9B978F;margin-bottom:16px;">Repas par regime (total 3 jours)</h2><div class="meal-grid">'+mh+'</div><div class="cost-summary"><h3>Estimation des couts</h3><div class="cost-row"><span>Dejeuners ('+total+' x 15&euro;)</span><span style="font-weight:700;">'+costTotal.toLocaleString('fr-FR')+' &euro;</span></div><div class="cost-row" style="color:#F59E0B;"><span>Marge traiteur (+15%)</span><span style="font-weight:700;">+ '+Math.round(costTotal*0.15).toLocaleString('fr-FR')+' &euro;</span></div><div class="cost-total">Total estime TTC : '+costTTC.toLocaleString('fr-FR')+' &euro;</div></div>';
};

// ═══════════════════════════════════════
// ADMIN: SALLES
// ═══════════════════════════════════════
window.initSection_admin_salles = function() {
  var html='<h1 class="admin-title"><img src="img/icons/icon-salles.png" alt="" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle"> Jauge des salles</h1><div class="gauge-grid">';
  var dayNames=['','J1','J2','J3'];
  CONGRES.SALLES.forEach(function(salle){
    var sessions=CONGRES.getSessionsBySalle(salle.id);var maxFill=0;var sh='';
    sessions.forEach(function(s){
      var pct=Math.round((s.inscrits/salle.capacite)*100);maxFill=Math.max(maxFill,pct);
      var cc=pct>=100?'#999':pct>=80?'#DC2626':pct>=50?'#F59E0B':'#22C55E';
      sh+='<div class="session-item"><span>'+dayNames[s.jour]+' '+s.debut+' — '+s.titre.substring(0,30)+'</span><span style="font-weight:700;color:'+cc+';">'+pct+'%</span></div>';
    });
    var gc=maxFill>=100?'black':maxFill>=80?'red':maxFill>=50?'orange':'green';
    html+='<div class="gauge-card"><h4>'+salle.nom+'</h4><div class="gauge-info">'+salle.etage+' · '+salle.capacite+' pl. · '+sessions.length+' sessions</div><div class="gauge-track"><div class="gauge-fill '+gc+'" style="width:'+Math.min(maxFill,100)+'%;"></div></div><div style="text-align:right;font-size:.75rem;color:#5F5C55;margin-top:4px;">Max: '+maxFill+'%</div><div class="session-list">'+sh+'</div></div>';
  });
  html+='</div>';
  document.getElementById('admin-salles-content').innerHTML=html;
};

// ═══════════════════════════════════════
// ADMIN: CHECK-IN
// ═══════════════════════════════════════
var ciCheckedIn=JSON.parse(localStorage.getItem('congres_checkins')||'[]');
var ciLogs=JSON.parse(localStorage.getItem('congres_checkin_logs')||'[]');
var ciLastChecked=null;

window.initSection_admin_checkin = function() {
  document.getElementById('admin-checkin-content').innerHTML='<h1 class="admin-title"><img src="img/icons/icon-checkin.png" alt="" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle"> Check-in Jour J</h1><div class="scanner-area"><div class="scanner-box"><div class="icon"><img src="img/icons/icon-qrcode.png" alt="" style="width:64px;height:64px;border-radius:12px;object-fit:contain"></div><p>Scannez le QR code du badge</p></div><div class="manual-entry"><p style="color:#9B978F;font-size:.82rem;margin-bottom:8px;">Saisie manuelle :</p><input type="text" id="ci-code" placeholder="Ex: INS-001" onkeydown="if(event.key===\'Enter\')ciCheckIn()"><button onclick="ciCheckIn()" style="margin-top:10px;padding:10px 24px;border-radius:10px;background:#C9A84C;color:#111;font-weight:700;border:none;cursor:pointer;width:100%;">Valider</button></div><div class="checkin-result checkin-ok" id="ci-ok" style="display:none;"><div class="icon">&check;</div><h2 style="color:#22C55E;" id="ci-ok-name"></h2><p id="ci-ok-info"></p></div><div class="checkin-result checkin-error" id="ci-err" style="display:none;"><div class="icon">&times;</div><h2 style="color:#DC2626;" id="ci-err-msg"></h2><p id="ci-err-info"></p></div></div><h2 style="font-size:1rem;color:#9B978F;margin-bottom:12px;">Compteurs</h2><div class="realtime-counters" id="ci-counters"></div><div class="checkin-log"><h2 style="font-size:1rem;color:#9B978F;margin-bottom:12px;">Historique</h2><div id="ci-logs"></div></div>';
  ciRenderCounters();ciRenderLogs();
};

function ciCheckIn(){
  var code=(document.getElementById('ci-code')||{}).value;if(!code)return;code=code.trim().toUpperCase();
  document.getElementById('ci-ok').style.display='none';document.getElementById('ci-err').style.display='none';
  var ins=CONGRES.loadInscriptions();var found=ins.find(function(i){return i.id.toUpperCase()===code;});
  if(!found){document.getElementById('ci-err-msg').textContent='Badge inconnu';document.getElementById('ci-err-info').textContent='"'+code+'" introuvable.';document.getElementById('ci-err').style.display='block';return;}
  if(ciCheckedIn.indexOf(found.id)!==-1){document.getElementById('ci-err-msg').textContent='Deja scanne';document.getElementById('ci-err-info').textContent=found.prenom+' '+found.nom+' deja enregistre(e).';document.getElementById('ci-err').style.display='block';return;}
  ciCheckedIn.push(found.id);localStorage.setItem('congres_checkins',JSON.stringify(ciCheckedIn));ciLastChecked=found;
  var pass=CONGRES.getPass(found.pass);
  document.getElementById('ci-ok-name').textContent=found.prenom+' '+found.nom;
  document.getElementById('ci-ok-info').textContent=(pass?pass.nom:found.pass);
  document.getElementById('ci-ok').style.display='block';
  var time=new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
  ciLogs.unshift({time:time,label:found.id+' — '+found.prenom+' '+found.nom,status:'OK',ok:true});
  localStorage.setItem('congres_checkin_logs',JSON.stringify(ciLogs));
  document.getElementById('ci-code').value='';ciRenderCounters();ciRenderLogs();
}
function ciRenderCounters(){
  var ins=CONGRES.loadInscriptions();
  var el=document.getElementById('ci-counters');if(!el)return;
  el.innerHTML='<div class="counter-card"><div class="counter-val">'+ciCheckedIn.length+' / '+ins.length+'</div><div class="counter-label">Check-ins total</div></div>';
}
function ciRenderLogs(){
  var el=document.getElementById('ci-logs');if(!el)return;
  var html='';ciLogs.slice(0,20).forEach(function(l){html+='<div class="log-entry'+(l.ok?'':' error')+'"><span class="log-time">'+l.time+'</span><span class="log-status '+(l.ok?'ok':'err')+'">'+l.status+'</span><span>'+l.label+'</span></div>';});
  el.innerHTML=html||'<p style="color:#5F5C55;font-size:.85rem;">Aucun check-in.</p>';
}

// ═══════════════════════════════════════
// ADMIN: EMAILS (simplified)
// ═══════════════════════════════════════
window.initSection_admin_emails = function() {
  document.getElementById('admin-emails-content').innerHTML='<h1 class="admin-title"><img src="img/icons/icon-emails.png" alt="" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle"> Emails automatiques</h1><div class="email-grid"><div class="email-card" onclick="this.classList.toggle(\'selected\')"><h3>Confirmation d\'inscription</h3><div class="timing">Envoi immediat</div><p>Email automatique apres inscription.</p></div><div class="email-card" onclick="this.classList.toggle(\'selected\')"><h3>Rappel J-7</h3><div class="timing">5 juin 2026</div><p>Rappel une semaine avant.</p></div><div class="email-card" onclick="this.classList.toggle(\'selected\')"><h3>Rappel J-1</h3><div class="timing">11 juin 2026</div><p>Dernier rappel la veille.</p></div><div class="email-card" onclick="this.classList.toggle(\'selected\')"><h3>Programme du jour</h3><div class="timing">Chaque matin a 7h</div><p>Programme personnalise.</p></div></div>';
};

// ═══════════════════════════════════════
// ADMIN: CHECKLIST
// ═══════════════════════════════════════
var CL_SECTIONS=[{id:'j6m',title:'J-6 mois',color:'#9CA3AF',items:['Lieu confirme','Budget valide','Assurance RC','Contrat signe','Comite constitue','Site web en ligne']},{id:'j3m',title:'J-3 mois',color:'#C9A84C',items:['Speakers confirmes','Traiteur reserve','Hotels reserves','Programme finalise','Technique AV','Sponsors confirmes']},{id:'j1m',title:'J-1 mois',color:'#F59E0B',items:['Invitations envoyees','Badges commandes','Signaletique','Plan evacuation','Staff recrute','Autorisations']},{id:'jourj',title:'Jour J',color:'#22C55E',items:['Accueil ouvert','Check-in teste','Traiteur installe','Staff briefing','Photographe','Secouriste sur place']}];
var CL_KEY='congres_checklist_spa';

window.initSection_admin_checklist = function() {
  var state;try{state=JSON.parse(localStorage.getItem(CL_KEY)||'{}');}catch(e){state={};}
  var totalItems=0,doneItems=0;
  CL_SECTIONS.forEach(function(sec){sec.items.forEach(function(item,i){totalItems++;if(state[sec.id+'_'+i])doneItems++;});});
  var pct=totalItems>0?Math.round((doneItems/totalItems)*100):0;
  var fillColor=pct>=80?'#22C55E':pct>=50?'#C9A84C':'#DC2626';

  var html='<h1 class="admin-title"><img src="img/icons/icon-checkin.png" alt="" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle"> Checklist Maitre</h1>';
  html+='<div class="checklist-progress"><h2>Progression globale</h2><div class="progress-global"><div class="progress-bar-track"><div class="progress-bar-fill" style="width:'+pct+'%;background:'+fillColor+';">'+pct+'%</div></div><div class="progress-pct">'+pct+'%</div></div></div>';

  CL_SECTIONS.forEach(function(sec){
    html+='<div class="checklist-section"><h3 style="color:'+sec.color+';">'+sec.title+'</h3><div style="margin-top:12px;">';
    sec.items.forEach(function(item,i){
      var key=sec.id+'_'+i;var checked=state[key]||false;
      html+='<div class="checklist-item'+(checked?' done':'')+'"><input type="checkbox" '+(checked?'checked':'')+' onchange="clToggle(\''+key+'\',this.checked)"><div class="item-label">'+item+'</div></div>';
    });
    html+='</div></div>';
  });
  document.getElementById('admin-checklist-content').innerHTML=html;
};
function clToggle(key,val){
  var state;try{state=JSON.parse(localStorage.getItem(CL_KEY)||'{}');}catch(e){state={};}
  state[key]=val;localStorage.setItem(CL_KEY,JSON.stringify(state));
  // Re-render
  sectionInited['admin-checklist']=false;initSection('admin-checklist');
}

// ═══════════════════════════════════════
// ADMIN: SPEAKERS
// ═══════════════════════════════════════
window.initSection_admin_speakers = function() {
  var speakers=CONGRES.SPEAKERS;
  var html='<h1 class="admin-title"><img src="img/icons/icon-participants.png" alt="" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle"> Gestion des intervenants</h1>';
  html+='<div class="spk-stats"><div class="stat-card"><div class="stat-value">'+speakers.length+'</div><div class="stat-label">Total speakers</div></div><div class="stat-card"><div class="stat-value" style="color:#22C55E;">'+speakers.length+'</div><div class="stat-label">Confirmes</div></div></div>';
  html+='<div class="spk-grid">';
  speakers.forEach(function(spk){
    var sessions=CONGRES.getSessionsBySpeaker(spk.id);
    html+='<div class="spk-card"><div class="spk-header"><div class="spk-avatar">'+spk.initiales+'</div><div><div class="spk-name">'+spk.prenom+' '+spk.nom+'</div><div class="spk-title">'+spk.titre+'</div></div></div><div class="spk-meta"><strong>Org :</strong> '+spk.org+'</div><div class="spk-meta"><strong>Theme :</strong> '+spk.theme+'</div>';
    html+='<div class="spk-sessions">';
    sessions.forEach(function(s){html+='<div class="spk-session-item">J'+s.jour+' '+s.debut+' : '+s.titre+'</div>';});
    html+='</div></div>';
  });
  html+='</div>';
  document.getElementById('admin-speakers-content').innerHTML=html;
};

// ═══════════════════════════════════════
// ADMIN: STAFF
// ═══════════════════════════════════════
window.initSection_admin_staff = function() {
  var stats=CONGRES.getStats();var needed=Math.ceil(stats.total/50);
  var state;try{state=JSON.parse(localStorage.getItem('congres_staff_state')||'{}');}catch(e){state={};}
  var current=state.currentStaff||0;
  document.getElementById('admin-staff-content').innerHTML='<h1 class="admin-title"><img src="img/icons/icon-participants.png" alt="" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle"> Gestion Staff</h1><div class="staff-calculator"><h3>Calculateur automatique</h3><div class="calc-grid"><div class="calc-card"><div class="calc-value">'+stats.total+'</div><div class="calc-label">Participants</div></div><div class="calc-card"><div class="calc-value">'+needed+'</div><div class="calc-label">Staff necessaire (1/50)</div></div><div class="calc-card '+(current>=needed?'ok':'alert')+'"><div class="calc-value">'+current+'</div><div class="calc-label">Staff actuel</div></div></div></div><div class="chart-card"><h3>Planning de rotation (max 6h)</h3><div class="admin-table-wrap"><table class="planning-table"><thead><tr><th>Creneau</th><th>Equipe A</th><th>Equipe B</th><th>Duree</th></tr></thead><tbody><tr><td>06:30-09:00</td><td>Installation</td><td>Repos</td><td>2h30</td></tr><tr><td>09:00-12:00</td><td>Sessions matin</td><td>Support</td><td>3h</td></tr><tr><td>12:00-14:00</td><td>Pause A</td><td>Service dejeuner</td><td>2h</td></tr><tr><td>14:00-17:30</td><td>Sessions PM</td><td>Rotation</td><td>3h30</td></tr><tr><td>17:30-19:00</td><td>Rangement</td><td>Repos</td><td>1h30</td></tr></tbody></table></div></div>';
};

// ═══════════════════════════════════════
// ADMIN: SECURITE
// ═══════════════════════════════════════
window.initSection_admin_securite = function() {
  var state;try{state=JSON.parse(localStorage.getItem('congres_securite_state')||'{}');}catch(e){state={};}
  var checks=[state.evacPlan,state.daeLocated,state.secouristePresent,state.kitReady,state.rampesOk,state.ascenseursOk,state.toilettesOk,state.portes80cm,state.salleCalme,state.lsfDispo,state.droitsImage,state.autoMunicipale,state.autoSonore,state.assuranceRC];
  var done=checks.filter(Boolean).length;var pct=Math.round((done/14)*100);
  var sc=pct>=80?'green':pct>=50?'orange':'red';
  document.getElementById('admin-securite-content').innerHTML='<h1 class="admin-title"><img src="img/icons/icon-salles.png" alt="" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle"> Securite &amp; Accessibilite</h1><div class="security-status '+sc+'"><h2 style="color:var(--'+sc+');">'+done+'/14 points valides ('+pct+'%)</h2><div class="status-text">'+(pct>=80?'Operationnelle':pct>=50?'Points a finaliser':'Attention : incomplete')+'</div></div><div class="security-grid"><div class="sec-card"><h4>Agents de securite</h4><div class="sec-row"><span class="sec-label">Agents necessaires</span><span class="sec-value">'+Math.max(1,Math.ceil(CONGRES.getStats().total/250))+'</span></div></div><div class="sec-card"><h4>Evacuation</h4><div class="sec-row"><span class="sec-label">Sorties de secours</span><span class="sec-value">6</span></div><div class="sec-row"><span class="sec-label">Temps cible</span><span class="sec-value">8 min</span></div></div><div class="sec-card"><h4>Services inclusifs</h4><div class="sec-row"><span class="sec-label">Salle calme</span><span class="sec-value">'+(state.salleCalme?'Oui':'Non')+'</span></div><div class="sec-row"><span class="sec-label">Interpretation LSF</span><span class="sec-value">'+(state.lsfDispo?'Prevue':'Non')+'</span></div></div></div>';
};

// ═══════════════════════════════════════
// ADMIN: BUDGET
// ═══════════════════════════════════════
window.initSection_admin_budget = function() {
  var stats=CONGRES.getStats();var ins=CONGRES.loadInscriptions();
  var totalRevenue=0;ins.forEach(function(i){var p=CONGRES.getPass(i.pass);if(p)totalRevenue+=p.prix;});
  var totalPrevu=165300;var contingence=Math.round(totalPrevu*0.30);totalPrevu+=contingence;
  var state;try{state=JSON.parse(localStorage.getItem('congres_budget_state')||'{}');}catch(e){state={};}
  var totalReel=0;Object.values(state).forEach(function(v){if(typeof v==='number')totalReel+=v;});
  var pctUsed=totalPrevu>0?Math.round((totalReel/totalPrevu)*100):0;
  var gc=pctUsed>=100?'danger':pctUsed>=90?'warn':'ok';
  var profit=totalRevenue-totalReel;

  document.getElementById('admin-budget-content').innerHTML='<h1 class="admin-title"><img src="img/icons/icon-traiteur.png" alt="" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle"> Budget Detaille</h1><div class="budget-gauge '+gc+'"><h2 style="color:#C9A84C;">Consommation du budget</h2><div class="gauge-display"><div class="gauge-bar-track"><div class="gauge-bar-fill" style="width:'+Math.min(pctUsed,100)+'%;background:'+(pctUsed>=100?'#DC2626':pctUsed>=90?'#F59E0B':'#22C55E')+';">'+pctUsed+'%</div></div><div class="gauge-pct" style="color:'+(pctUsed>=100?'#DC2626':'#C9A84C')+';">'+pctUsed+'%</div></div></div><div class="budget-summary"><div class="stat-card"><div class="stat-value">'+totalPrevu.toLocaleString('fr-FR')+' &euro;</div><div class="stat-label">Budget prevu</div></div><div class="stat-card"><div class="stat-value">'+totalReel.toLocaleString('fr-FR')+' &euro;</div><div class="stat-label">Depenses reelles</div></div><div class="stat-card"><div class="stat-value" style="color:'+(totalReel<=totalPrevu?'#22C55E':'#DC2626')+';">'+(totalPrevu-totalReel).toLocaleString('fr-FR')+' &euro;</div><div class="stat-label">Reste</div></div></div><div class="revenue-section"><h3>Revenus inscriptions</h3><div class="revenue-grid"><div class="revenue-card" style="border:1px solid #22C55E;border-radius:8px;"><div class="rev-val" style="font-size:1.8rem;">'+totalRevenue.toLocaleString('fr-FR')+' &euro;</div><div class="rev-label">Total revenus</div></div></div></div><div class="profit-box"><div class="profit-val '+(profit>=0?'positive':'negative')+'">'+(profit>=0?'+':'')+profit.toLocaleString('fr-FR')+' &euro;</div><div class="profit-label">'+(profit>=0?'Benefice':'Perte')+' en temps reel</div></div>';
};

// ═══════════════════════════════════════
// ADMIN: POST-EVENT
// ═══════════════════════════════════════
window.initSection_admin_postevent = function() {
  var state;try{state=JSON.parse(localStorage.getItem('congres_post_event')||'{}');}catch(e){state={};}
  var nps=72;
  var purgeDate=new Date('2026-12-14');var today=new Date();var daysLeft=Math.ceil((purgeDate-today)/(1000*60*60*24));

  document.getElementById('admin-postevent-content').innerHTML='<h1 class="admin-title"><img src="img/icons/icon-emails.png" alt="" style="width:48px;height:48px;border-radius:12px;object-fit:contain;vertical-align:middle"> Post-evenement</h1><div class="survey-section"><h3>Sondage satisfaction (simulation)</h3><div class="nps-gauge"><div class="nps-score" style="color:#22C55E;">'+nps+'</div><div class="nps-label">Net Promoter Score — 187 reponses</div><div class="nps-scale"><div class="nps-item nps-detractors">0</div><div class="nps-item nps-detractors">1</div><div class="nps-item nps-detractors">2</div><div class="nps-item nps-detractors">3</div><div class="nps-item nps-detractors">4</div><div class="nps-item nps-detractors">5</div><div class="nps-item nps-detractors">6</div><div class="nps-item nps-passives">7</div><div class="nps-item nps-passives">8</div><div class="nps-item nps-promoters">9</div><div class="nps-item nps-promoters">10</div></div></div><div style="text-align:center;"><button onclick="alert(\'Sondage envoye (simulation).\')" style="padding:10px 24px;border-radius:10px;background:#C9A84C;color:#111;font-weight:700;border:none;cursor:pointer;">Envoyer le sondage</button></div></div><div class="pe-template-grid"><div class="pe-template-card"><h4>Remerciement speakers</h4><p>22 speakers</p><button onclick="alert(\'Email envoye (simulation).\')">Envoyer</button></div><div class="pe-template-card"><h4>Remerciement sponsors</h4><p>8 sponsors</p><button onclick="alert(\'Email envoye (simulation).\')">Envoyer</button></div><div class="pe-template-card"><h4>Remerciement staff</h4><p>Equipe staff</p><button onclick="alert(\'Email envoye (simulation).\')">Envoyer</button></div><div class="pe-template-card"><h4>Remerciement participants</h4><p>Tous les participants</p><button onclick="alert(\'Email envoye (simulation).\')">Envoyer</button></div></div><div class="rgpd-card"><h3>RGPD — Suppression des donnees</h3><p style="font-size:.82rem;color:#9B978F;margin-bottom:8px;">Donnees a supprimer 6 mois apres l\'evenement.</p><div class="countdown">'+(daysLeft>0?daysLeft+' jours restants':'SUPPRESSION REQUISE')+'</div><p style="font-size:.78rem;color:#5F5C55;text-align:center;">Date limite : 14 decembre 2026</p></div>';
};
// End of spa-sections.js
