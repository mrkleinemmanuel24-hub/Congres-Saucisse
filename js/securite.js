/* ═══════════════════════════════════════════════════════
   CONGRES DE LA SAUCISSE — MODULE SECURITE COMPLET
   5 onglets : Autorisations, Physique, Evacuation, VIP, Timeline
   Design Noir & Or (#0F1118, #C9A84C)
   ═══════════════════════════════════════════════════════ */

(function() {
  'use strict';

  var LS_KEY = 'congres_securite_v2';

  // ═══ PERSISTENCE ═══
  function loadState() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch(e) { return {}; }
  }
  function saveState(s) {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  }
  function getCheck(key) {
    var s = loadState();
    return s[key] || { checked: false, date: '', responsable: '', document: '', notes: '' };
  }
  function setCheck(key, field, value) {
    var s = loadState();
    if (!s[key]) s[key] = { checked: false, date: '', responsable: '', document: '', notes: '' };
    s[key][field] = value;
    saveState(s);
  }

  // ═══ STATS FROM CONGRES ═══
  function getTotal() {
    try {
      var st = CONGRES.getStats();
      return st.total || 0;
    } catch(e) { return 0; }
  }

  // ═══ STYLES ═══
  var CSS = '' +
    '<style>' +
    '.sec-tabs{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:24px;border-bottom:1px solid rgba(201,168,76,.1);padding-bottom:12px;}' +
    '.sec-tab{padding:10px 18px;border-radius:10px 10px 0 0;font-size:.82rem;font-weight:700;color:#9B978F;cursor:pointer;transition:all .2s;border:none;background:transparent;}' +
    '.sec-tab:hover{color:#C9A84C;background:rgba(201,168,76,.05);}' +
    '.sec-tab.active{color:#C9A84C;background:rgba(201,168,76,.1);border-bottom:2px solid #C9A84C;}' +
    '.sec-panel{display:none;}' +
    '.sec-panel.active{display:block;}' +
    '.sec-group{background:#161822;border:1px solid rgba(201,168,76,.1);border-radius:14px;padding:20px;margin-bottom:16px;}' +
    '.sec-group h3{color:#C9A84C;font-size:.95rem;font-weight:700;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid rgba(201,168,76,.06);}' +
    '.sec-group h4{color:#E8D48B;font-size:.85rem;font-weight:700;margin:16px 0 10px;}' +
    '.sec-item{display:grid;grid-template-columns:28px 1fr 110px 140px 140px 120px;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid rgba(201,168,76,.03);font-size:.8rem;}' +
    '.sec-item:last-child{border-bottom:none;}' +
    '.sec-item input[type=checkbox]{width:18px;height:18px;accent-color:#22C55E;cursor:pointer;}' +
    '.sec-item .sec-label{color:#E8E4DC;line-height:1.4;}' +
    '.sec-item .sec-detail{font-size:.72rem;color:#5F5C55;margin-top:2px;}' +
    '.sec-item input[type=text],.sec-item input[type=date]{padding:5px 8px;border-radius:6px;border:1px solid rgba(201,168,76,.1);background:rgba(255,255,255,.03);color:#E8E4DC;font-size:.75rem;width:100%;}' +
    '.sec-item input[type=text]:focus,.sec-item input[type=date]:focus{outline:none;border-color:#C9A84C;}' +
    '.sec-status{display:inline-block;padding:2px 8px;border-radius:6px;font-size:.7rem;font-weight:700;text-align:center;}' +
    '.sec-status-fait{background:rgba(34,197,94,.12);color:#22C55E;}' +
    '.sec-status-encours{background:rgba(245,158,11,.12);color:#F59E0B;}' +
    '.sec-status-retard{background:rgba(220,38,38,.12);color:#DC2626;}' +
    '.sec-status-todo{background:rgba(255,255,255,.04);color:#5F5C55;}' +
    '.sec-gauge{display:flex;align-items:center;gap:12px;margin:12px 0;}' +
    '.sec-gauge-bar{flex:1;height:24px;background:rgba(255,255,255,.04);border-radius:12px;overflow:hidden;position:relative;}' +
    '.sec-gauge-fill{height:100%;border-radius:12px;transition:width .4s;}' +
    '.sec-gauge-label{font-size:.82rem;font-weight:700;min-width:50px;text-align:right;}' +
    '.sec-crisis-table{width:100%;border-collapse:collapse;font-size:.8rem;}' +
    '.sec-crisis-table th{text-align:left;padding:10px 12px;color:#C9A84C;font-weight:700;border-bottom:1px solid rgba(201,168,76,.15);font-size:.78rem;}' +
    '.sec-crisis-table td{padding:10px 12px;border-bottom:1px solid rgba(201,168,76,.04);color:#E8E4DC;vertical-align:top;}' +
    '.sec-crisis-table tr:hover td{background:rgba(201,168,76,.03);}' +
    '.sec-badge-table{width:100%;border-collapse:collapse;font-size:.82rem;}' +
    '.sec-badge-table th{text-align:left;padding:10px 12px;color:#C9A84C;font-weight:700;border-bottom:1px solid rgba(201,168,76,.15);}' +
    '.sec-badge-table td{padding:10px 12px;border-bottom:1px solid rgba(201,168,76,.04);color:#E8E4DC;}' +
    '.sec-badge-color{display:inline-block;width:14px;height:14px;border-radius:4px;vertical-align:middle;margin-right:6px;border:1px solid rgba(255,255,255,.1);}' +
    '.sec-kpi{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;margin-bottom:20px;}' +
    '.sec-kpi-card{background:#161822;border:1px solid rgba(201,168,76,.1);border-radius:12px;padding:16px;text-align:center;}' +
    '.sec-kpi-val{font-size:1.6rem;font-weight:900;color:#C9A84C;}' +
    '.sec-kpi-label{font-size:.75rem;color:#9B978F;margin-top:4px;}' +
    '.sec-emergency{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;margin:12px 0;}' +
    '.sec-emergency-card{background:rgba(220,38,38,.06);border:1px solid rgba(220,38,38,.15);border-radius:10px;padding:12px 16px;text-align:center;}' +
    '.sec-emergency-card .num{font-size:1.3rem;font-weight:900;color:#DC2626;letter-spacing:1px;}' +
    '.sec-emergency-card .lbl{font-size:.75rem;color:#9B978F;margin-top:2px;}' +
    '.sec-progress-summary{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-bottom:24px;}' +
    '.sec-progress-card{background:#161822;border:1px solid rgba(201,168,76,.1);border-radius:10px;padding:14px;text-align:center;}' +
    '.sec-progress-card .pct{font-size:1.2rem;font-weight:900;}' +
    '.sec-progress-card .lbl{font-size:.72rem;color:#9B978F;margin-top:2px;}' +
    '@media(max-width:900px){' +
      '.sec-item{grid-template-columns:28px 1fr;gap:6px;}' +
      '.sec-item input[type=text],.sec-item input[type=date]{margin-top:4px;}' +
      '.sec-tabs{gap:2px;}' +
      '.sec-tab{padding:8px 12px;font-size:.75rem;}' +
      '.sec-crisis-table,.sec-badge-table{font-size:.72rem;}' +
      '.sec-crisis-table td,.sec-crisis-table th,.sec-badge-table td,.sec-badge-table th{padding:6px 8px;}' +
    '}' +
    '@media print{' +
      '.sec-tabs{display:none;}' +
      '.sec-panel{display:block!important;page-break-inside:avoid;margin-bottom:24px;}' +
      '.sec-group{break-inside:avoid;}' +
    '}' +
    '</style>';

  // ═══ CHECKLIST ITEM BUILDER ═══
  function checkItem(key, label, detail) {
    var st = getCheck(key);
    var statusClass = st.checked ? 'sec-status-fait' : (st.date && new Date(st.date) < new Date() ? 'sec-status-retard' : (st.responsable || st.date ? 'sec-status-encours' : 'sec-status-todo'));
    var statusText = st.checked ? 'Fait' : (st.date && new Date(st.date) < new Date() ? 'En retard' : (st.responsable || st.date ? 'En cours' : 'A faire'));
    return '<div class="sec-item">' +
      '<input type="checkbox" ' + (st.checked ? 'checked' : '') + ' onchange="SEC_MOD.toggle(\'' + key + '\',this.checked)">' +
      '<div class="sec-label">' + label + (detail ? '<div class="sec-detail">' + detail + '</div>' : '') + '</div>' +
      '<input type="date" value="' + (st.date || '') + '" onchange="SEC_MOD.set(\'' + key + '\',\'date\',this.value)" title="Date limite">' +
      '<input type="text" value="' + (st.responsable || '') + '" placeholder="Responsable" onchange="SEC_MOD.set(\'' + key + '\',\'responsable\',this.value)">' +
      '<input type="text" value="' + (st.document || '') + '" placeholder="Document joint" onchange="SEC_MOD.set(\'' + key + '\',\'document\',this.value)">' +
      '<span class="sec-status ' + statusClass + '">' + statusText + '</span>' +
    '</div>';
  }

  // ═══ PROGRESS CALCULATOR ═══
  function calcProgress(keys) {
    var state = loadState();
    var done = 0;
    keys.forEach(function(k) { if (state[k] && state[k].checked) done++; });
    return { done: done, total: keys.length, pct: keys.length > 0 ? Math.round(done / keys.length * 100) : 0 };
  }

  // ═══════════════════════════════════════
  // TAB 1 : AUTORISATIONS ADMINISTRATIVES
  // ═══════════════════════════════════════
  function renderAutorisations() {
    var h = '';

    // Prefecture / Mairie
    h += '<div class="sec-group"><h3>Prefecture / Mairie</h3>';
    h += checkItem('auth_cerfa', 'Declaration prealable en mairie (formulaire CERFA n\u00b013985*01)', 'Obligatoire si >300 personnes. Delai : 1 mois minimum avant l\'evenement.');
    h += checkItem('auth_prefet', 'Autorisation prefectorale si >1500 personnes', 'Dossier complet avec plan de securite, attestation assurance, identite organisateur.');
    h += checkItem('auth_commission', 'Avis de la Commission de Securite (ERP type L/T/X)', 'Visite de la commission obligatoire pour ERP de 1ere categorie (>1500 pers).');
    h += checkItem('auth_domaine', 'Demande d\'occupation du domaine public', 'Si stands exterieurs, terrasses, signaletique sur voie publique.');
    h += checkItem('auth_circulation', 'Arrete municipal de circulation', 'Si fermeture de rues, modification itineraires bus, stationnement reserve.');
    h += checkItem('auth_sacem', 'Declaration SACEM si musique', 'Meme musique d\'ambiance. Formulaire en ligne sacem.fr, tarif selon jauge.');
    h += checkItem('auth_boissons', 'Licence debit de boissons temporaire', 'Demande en mairie 15 jours avant. Categories : biere/vin ou alcools forts.');
    h += '</div>';

    // Securite civile
    h += '<div class="sec-group"><h3>Securite civile</h3>';
    h += checkItem('auth_incendie', 'Plan de securite incendie depose', 'Plan cote avec emplacement extincteurs, issues, DAE, eclairage securite.');
    h += checkItem('auth_erp', 'Attestation de conformite ERP', 'Delivree par le gestionnaire du Palais des Congres.');
    h += checkItem('auth_registre', 'Registre de securite a jour', 'Verifications periodiques : electricite, gaz, ascenseurs, extincteurs, alarmes.');
    h += checkItem('auth_pv', 'PV de la derniere visite commission de securite', 'Avis favorable obligatoire pour ouverture au public.');
    h += checkItem('auth_vigipirate', 'Plan Vigipirate applicable (niveau en cours)', 'Verifier le niveau actuel sur gouvernement.fr. Mesures adaptees obligatoires.');
    h += '</div>';

    // Assurances
    h += '<div class="sec-group"><h3>Assurances</h3>';
    h += checkItem('auth_rc', 'RC professionnelle organisateur (min 2M\u20ac)', 'Responsabilite civile couvrant dommages aux tiers, participants et prestataires.');
    h += checkItem('auth_annulation', 'Assurance annulation evenement', 'Couvre intemperies, pandemie, arrete prefectoral, cas de force majeure.');
    h += checkItem('auth_accident', 'Assurance accidents corporels', 'Couvre les frais medicaux pour participants et staff en cas d\'accident.');
    h += checkItem('auth_rc_traiteur', 'RC traiteur', 'Attestation RC du traiteur couvrant intoxication alimentaire, allergies.');
    h += checkItem('auth_materiel', 'Assurance materiel technique', 'Sono, video, eclairage, mobilier. Vol, casse, degat des eaux.');
    h += checkItem('auth_liquor', 'Assurance liquor liability', 'Obligatoire si alcool servi. Couvre responsabilite en cas d\'ivresse.');
    h += '</div>';

    // RGPD
    h += '<div class="sec-group"><h3>RGPD / Donnees personnelles</h3>';
    h += checkItem('auth_registre_cnil', 'Registre des traitements (CNIL)', 'Article 30 RGPD. Documenter : finalite, base legale, duree, destinataires.');
    h += checkItem('auth_politique', 'Politique de confidentialite publiee', 'Accessible depuis le site web et le formulaire d\'inscription.');
    h += checkItem('auth_dpo', 'DPO designe ou referent', 'Obligatoire si traitement a grande echelle. Sinon : referent interne.');
    h += checkItem('auth_consentement', 'Consentements collectes a l\'inscription', 'Checkbox non pre-cochees : newsletter, photos, partage sponsors.');
    h += checkItem('auth_suppression', 'Procedure de suppression post-event (J+6 mois)', 'Donnees personnelles supprimees ou anonymisees 6 mois apres l\'evenement.');
    h += checkItem('auth_wifi', 'Securite WiFi (WPA3, reseau isole)', 'Reseau participants isole du reseau staff. Logs conformes LCEN (1 an).');
    h += '</div>';

    // Droit a l'image
    h += '<div class="sec-group"><h3>Droit a l\'image</h3>';
    h += checkItem('auth_panneau', 'Panneau d\'information a l\'entree', 'Mention : "Des photos et videos seront realisees pendant l\'evenement."');
    h += checkItem('auth_form_image', 'Formulaire droit image dans l\'inscription', 'Cession de droit a l\'image avec objet, duree, support, territoire.');
    h += checkItem('auth_brief_photo', 'Brief photographe / videastes', 'Zones interdites, VIP a ne pas photographier, mineurs, consignes RGPD.');
    h += '</div>';

    return h;
  }

  // ═══════════════════════════════════════
  // TAB 2 : SECURITE PHYSIQUE
  // ═══════════════════════════════════════
  function renderPhysique() {
    var total = getTotal();
    var ssiap = Math.max(1, Math.ceil(total / 250));
    var accueil = Math.max(1, Math.ceil(total / 100));
    var secouristes = Math.max(2, Math.ceil(total / 500));
    var medecin = total >= 5000 ? 'OUI' : 'Recommande';
    var totalStaff = ssiap + accueil + secouristes + (total >= 5000 ? 1 : 0);

    var h = '';

    // KPIs
    h += '<div class="sec-kpi">';
    h += '<div class="sec-kpi-card"><div class="sec-kpi-val">' + total + '</div><div class="sec-kpi-label">Participants inscrits</div></div>';
    h += '<div class="sec-kpi-card"><div class="sec-kpi-val">' + ssiap + '</div><div class="sec-kpi-label">Agents SSIAP</div></div>';
    h += '<div class="sec-kpi-card"><div class="sec-kpi-val">' + accueil + '</div><div class="sec-kpi-label">Agents accueil</div></div>';
    h += '<div class="sec-kpi-card"><div class="sec-kpi-val">' + secouristes + '</div><div class="sec-kpi-label">Secouristes PSC1/PSE</div></div>';
    h += '<div class="sec-kpi-card"><div class="sec-kpi-val">' + medecin + '</div><div class="sec-kpi-label">Medecin sur place</div></div>';
    h += '<div class="sec-kpi-card"><div class="sec-kpi-val">' + totalStaff + '</div><div class="sec-kpi-label">Total staff securite</div></div>';
    h += '</div>';

    // Effectifs
    h += '<div class="sec-group"><h3>Effectifs securite (calculateur automatique)</h3>';
    h += '<p style="font-size:.82rem;color:#9B978F;margin-bottom:12px;">Calcul base sur <strong style="color:#C9A84C;">' + total + ' participants inscrits</strong>. Les effectifs se mettent a jour automatiquement.</p>';
    h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;">';

    var roles = [
      { label: 'Agents de securite SSIAP', ratio: '1 pour 250', need: ssiap, color: '#C9A84C' },
      { label: 'Agents d\'accueil', ratio: '1 pour 100', need: accueil, color: '#2AD783' },
      { label: 'Secouristes PSC1/PSE', ratio: '1 pour 500 (min 2)', need: secouristes, color: '#F59E0B' },
      { label: 'Medecin sur place', ratio: 'Obligatoire si >5000', need: total >= 5000 ? 1 : 0, color: '#DC2626' }
    ];
    roles.forEach(function(r) {
      h += '<div style="background:rgba(201,168,76,.03);border-radius:10px;padding:14px;">' +
        '<div style="font-weight:700;font-size:.85rem;color:#E8E4DC;">' + r.label + '</div>' +
        '<div style="font-size:.75rem;color:#9B978F;">Ratio : ' + r.ratio + '</div>' +
        '<div style="font-size:1.1rem;font-weight:900;color:' + r.color + ';margin-top:6px;">' + r.need + ' necessaire' + (r.need > 1 ? 's' : '') + '</div>' +
      '</div>';
    });
    h += '</div></div>';

    // Equipements obligatoires
    h += '<div class="sec-group"><h3>Equipements obligatoires</h3>';
    h += checkItem('phy_dae', 'Defibrillateurs (DAE)', '1 par etage minimum. Localisation sur plan, verifier piles et patchs.');
    h += checkItem('phy_extincteurs', 'Extincteurs verifies', 'Date derniere verification < 1 an. Types : eau, CO2, poudre.');
    h += checkItem('phy_baes', 'Eclairage de securite (BAES) fonctionnel', 'Blocs Autonomes d\'Eclairage de Securite. Test mensuel, autonomie 1h.');
    h += checkItem('phy_issues', 'Issues de secours degagees et signalees', 'Nombre requis : 1 pour 100 personnes. Barres anti-panique, pas de verrou.');
    h += checkItem('phy_signalisation', 'Signaletique evacuation lumineuse', 'Panneaux verts "sortie" conformes NF. Visibles a 30m.');
    h += checkItem('phy_trousse', 'Trousse premiers secours complete', 'Contenu : pansements, compresses, garrot, couverture survie, serum phy, gants, ciseaux, masque RCP, paracetamol, sucre.');
    h += checkItem('phy_poste_medical', 'Poste medical identifie', 'Salle dediee + lit + eau courante + materiel de base. Signaletique claire.');
    h += '</div>';

    // Controle d'acces
    h += '<div class="sec-group"><h3>Controle d\'acces</h3>';
    h += checkItem('phy_portiques', 'Portiques de securite / detecteurs de metaux', 'Obligatoire si VIP haut profil ou Vigipirate renforce.');
    h += checkItem('phy_fouille', 'Fouille visuelle des sacs', 'Agents formes. Zone depose sacs si necessaire.');
    h += checkItem('phy_scanner', 'Scanner bagages', 'Si niveau Vigipirate renforce ou menace identifiee.');
    h += checkItem('phy_cynophile_explosifs', 'Equipe cynophile anti-explosifs', 'Si menace elevee. Passage avant ouverture des portes.');
    h += checkItem('phy_cynophile_stupefiants', 'Equipe cynophile anti-stupefiants', 'Sur demande de la prefecture ou si evenement le justifie.');
    h += checkItem('phy_badges', 'Badges avec niveaux d\'acces', 'Standard / VIP / Staff / Presse. Verifies a chaque zone.');
    h += checkItem('phy_liste_vip', 'Liste des personnes autorisees en zone VIP', 'Mise a jour J-1, avec photo. Communication aux agents.');
    h += checkItem('phy_parking_vip', 'Parking VIP separe avec controle', 'Acces badge uniquement, camera, agent present.');
    h += '</div>';

    // Videosurveillance
    h += '<div class="sec-group"><h3>Videosurveillance</h3>';
    h += checkItem('phy_cam_entrees', 'Cameras entrees principales', 'Resolution minimum 1080p, angle large, vision nocturne.');
    h += checkItem('phy_cam_vip', 'Cameras zones VIP', 'Salon VIP, backstage, acces parking VIP.');
    h += checkItem('phy_cam_parking', 'Cameras parking', 'Couvrir entrees/sorties + alles principales.');
    h += checkItem('phy_moniteur', 'Moniteur central au PC securite', 'Ecran multiplex + enregistreur DVR/NVR.');
    h += checkItem('phy_cnil_video', 'Declaration CNIL videosurveillance', 'Autorisation prefectorale si lieu ouvert au public.');
    h += checkItem('phy_panneaux_video', 'Panneaux d\'information videosurveillance', 'Affichage obligatoire : finalite, responsable, droits d\'acces, duree conservation.');
    h += '</div>';

    return h;
  }

  // ═══════════════════════════════════════
  // TAB 3 : PLAN D'EVACUATION & URGENCES
  // ═══════════════════════════════════════
  function renderEvacuation() {
    var h = '';

    // Plan d'evacuation
    h += '<div class="sec-group"><h3>Plan d\'evacuation</h3>';
    h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-bottom:16px;">';
    h += '<div style="background:rgba(220,38,38,.06);border-radius:10px;padding:14px;text-align:center;"><div style="font-size:1.5rem;font-weight:900;color:#DC2626;">8 min</div><div style="font-size:.75rem;color:#9B978F;">Temps cible evacuation totale</div></div>';
    h += '<div style="background:rgba(34,197,94,.06);border-radius:10px;padding:14px;text-align:center;"><div style="font-size:1.5rem;font-weight:900;color:#22C55E;">2 min</div><div style="font-size:.75rem;color:#9B978F;">Points de rassemblement</div></div>';
    h += '<div style="background:rgba(201,168,76,.06);border-radius:10px;padding:14px;text-align:center;"><div style="font-size:1.5rem;font-weight:900;color:#C9A84C;">RDC: 4</div><div style="font-size:.75rem;color:#9B978F;">Issues de secours RDC</div></div>';
    h += '<div style="background:rgba(201,168,76,.06);border-radius:10px;padding:14px;text-align:center;"><div style="font-size:1.5rem;font-weight:900;color:#C9A84C;">R+1: 3</div><div style="font-size:.75rem;color:#9B978F;">Issues de secours Etage 1</div></div>';
    h += '</div>';

    h += checkItem('evac_points', 'Points de rassemblement definis (2 minimum)', 'Identifes sur le plan, communiques au staff. Zone degagee, loin du batiment.');
    h += checkItem('evac_itineraires', 'Itineraires d\'evacuation par salle', 'Flechage lumineux, affichage dans chaque salle, sens de circulation.');
    h += checkItem('evac_pmr', 'Procedure personnes a mobilite reduite', 'Ascenseur d\'evacuation ou chaise portoir. Accompagnateur designe.');
    h += checkItem('evac_exercice', 'Exercice d\'evacuation staff planifie', 'Date planifiee : J-1. Duree cible : <8 minutes. Debriefing apres.');
    h += checkItem('evac_serre_file', 'Serre-files designes par zone', 'Derniers a sortir, verifient que la zone est vide, gilet jaune.');
    h += checkItem('evac_plan_affiche', 'Plans d\'evacuation affiches dans chaque salle', 'Format A3 minimum, "Vous etes ici", fleches vers issues.');
    h += '</div>';

    // Scenarios de crise
    h += '<div class="sec-group"><h3>Scenarios de crise</h3>';
    h += '<p style="font-size:.82rem;color:#9B978F;margin-bottom:12px;">14 scenarios identifies. Pour chaque scenario : procedure, responsable, numeros d\'urgence.</p>';
    h += '<div style="overflow-x:auto;">';
    h += '<table class="sec-crisis-table">';
    h += '<thead><tr><th style="width:20%;">Scenario</th><th style="width:45%;">Procedure</th><th style="width:35%;">Qui appeler</th></tr></thead>';
    h += '<tbody>';

    var crises = [
      ['Incendie', 'Evacuation immediate vers points de rassemblement. Activation alarme incendie. Verification zones par serre-files. Appel 18.', 'Pompiers 18 / 112'],
      ['Alerte a la bombe', 'Evacuation calme, perimetre 200m minimum. NE PAS utiliser de telephone portable dans le perimetre. Appel 17.', 'Police 17 / Demineurs SDLP'],
      ['Malaise cardiaque', 'DAE + PLS. Degager la zone. Appel 15. Guide des gestes de premiers secours affiche au poste medical.', 'SAMU 15 / 112'],
      ['Accident corporel', 'Premiers soins sur place, acheminer vers poste medical. Si grave : appel 15. Ne pas deplacer si trauma rachidien.', 'Secouristes sur place + SAMU 15'],
      ['Intrusion / agression', 'Confinement de la zone. Isoler l\'agresseur si possible sans risque. Proteger les victimes. Appel 17.', 'Police 17 / Securite interne'],
      ['Coupure electrique', 'Eclairage de secours automatique (BAES). Activation groupe electrogene si disponible. Calmer les participants.', 'Technicien Palais des Congres'],
      ['Panne climatisation', 'Ouverture des portes laterales. Distribution d\'eau aux participants. Pauses supplementaires.', 'Staff technique Palais'],
      ['Intoxication alimentaire', 'Isoler le lot suspect. Conserver des echantillons sous scelles. Lister les personnes ayant consomme. Appel 15 + ARS.', 'SAMU 15 + ARS Grand Est'],
      ['Inondation / degat des eaux', 'Coupure electrique de la zone touchee. Evacuation partielle. Proteger le materiel technique.', 'Technicien Palais + Pompiers 18'],
      ['Manifestation exterieure', 'Fermer tous les acces du batiment. Information calme aux participants. Contact prefecture pour situation.', 'Prefecture 03 88 21 67 68'],
      ['Attentat / fusillade', 'Protocole national : S\'ECHAPPER si possible, SE CACHER sinon, ALERTER le 17 / 112. NE PAS filmer, NE PAS diffuser sur reseaux.', 'Police 17 / GIGN / 112'],
      ['Panique / mouvement de foule', 'PA calme et ferme. Ouvrir TOUTES les issues. Agents aux points de flux. Eviter goulots d\'etranglement.', 'Agents securite + Serre-files'],
      ['Disparition d\'enfant', 'Fermer toutes les sorties. PA avec description precise (vetements, age). Fouille systematique des zones.', 'Police 17 + Securite interne'],
      ['VIP menace', 'Extraction discrete vers salle securisee. Protection rapprochee active. Appel 17 si menace physique.', 'Protection rapprochee + Police 17']
    ];

    crises.forEach(function(c) {
      h += '<tr><td><strong>' + c[0] + '</strong></td><td>' + c[1] + '</td><td style="color:#DC2626;font-weight:600;">' + c[2] + '</td></tr>';
    });

    h += '</tbody></table></div></div>';

    // Cellule de crise
    h += '<div class="sec-group"><h3>Cellule de crise</h3>';
    h += checkItem('crise_qg', 'QG cellule de crise identifie', 'Salle dediee avec telephone fixe, WiFi, ecran, imprimante. Acces restreint.');
    h += checkItem('crise_responsable', 'Responsable cellule de crise designe', 'Nom + telephone portable. Joignable 24h/24 pendant l\'evenement.');
    h += checkItem('crise_walkies', 'Walkie-talkies distribues', 'Canaux : 1=General, 2=Securite, 3=Technique, 4=VIP. Test J-1.');
    h += checkItem('crise_procedure', 'Procedures ecrites distribuees au staff', 'Fiches reflexes plastifiees pour chaque scenario. Lisibles, concises.');
    h += '</div>';

    // Numeros d'urgence
    h += '<div class="sec-group"><h3>Numeros d\'urgence</h3>';
    h += '<p style="font-size:.82rem;color:#9B978F;margin-bottom:12px;">A afficher au PC securite, a l\'accueil, dans la cellule de crise et au poste medical.</p>';
    h += '<div class="sec-emergency">';
    var nums = [
      ['15', 'SAMU'],
      ['18', 'Pompiers'],
      ['17', 'Police'],
      ['112', 'Urgence europeenne'],
      ['03 88 21 67 68', 'Prefecture Bas-Rhin'],
      ['03 88 12 80 00', 'Hopital Hautepierre'],
      ['03 88 37 37 37', 'Centre antipoison'],
      ['03 88 37 67 67', 'Palais des Congres securite']
    ];
    nums.forEach(function(n) {
      h += '<div class="sec-emergency-card"><div class="num">' + n[0] + '</div><div class="lbl">' + n[1] + '</div></div>';
    });
    h += '</div></div>';

    return h;
  }

  // ═══════════════════════════════════════
  // TAB 4 : SECURITE VIP
  // ═══════════════════════════════════════
  function renderVIP() {
    var h = '';

    // Protocole VIP
    h += '<div class="sec-group"><h3>Protocole VIP</h3>';
    h += checkItem('vip_entree', 'Entree separee (acces parking souterrain direct)', 'Itineraire VIP : parking P2 niveau -1 > ascenseur prive > salon VIP.');
    h += checkItem('vip_salon', 'Salon VIP securise (acces badge uniquement)', 'Boissons, WiFi premium, vestiaire, espace calme. Agent en permanence.');
    h += checkItem('vip_escorte', 'Escorte accompagnee pour deplacements', 'Agent d\'accueil dedie pour chaque VIP Gold/Platinum.');
    h += checkItem('vip_places', 'Places reservees aux premiers rangs', 'Marquage nominatif, rangee 1-2 de chaque salle de conference.');
    h += checkItem('vip_gala', 'Table reservee gala', 'Table d\'honneur avec cartons nominatifs. Plan de table valide.');
    h += checkItem('vip_protection', 'Protection rapprochee si personnalite politique/mediatique', 'Coordination avec services de l\'Etat (SDLP) si necessaire.');
    h += checkItem('vip_chauffeur', 'Vehicule avec chauffeur en standby', 'Vehicule noir, climatise, a proximite parking VIP. Chauffeur professionnel.');
    h += checkItem('vip_repos', 'Salle de repos privee', 'Canape, eau, cafe, miroir, chargeurs. Acces Platinum uniquement.');
    h += '</div>';

    // Niveaux d'acces badge
    h += '<div class="sec-group"><h3>Niveaux d\'acces badge</h3>';
    h += '<p style="font-size:.82rem;color:#9B978F;margin-bottom:12px;">8 niveaux d\'acces. Chaque badge est verifie a l\'entree de chaque zone.</p>';
    h += '<div style="overflow-x:auto;">';
    h += '<table class="sec-badge-table">';
    h += '<thead><tr><th>Badge</th><th>Couleur</th><th>Zones autorisees</th></tr></thead>';
    h += '<tbody>';

    var badges = [
      ['Standard', '#FFFFFF', 'Blanc', 'Zone conferences + pauses cafe + exposition'],
      ['VIP Bronze', '#C0C0C0', 'Argent', '+ Places reservees + cocktail'],
      ['VIP Gold', '#C9A84C', 'Or', '+ Salon VIP + gala'],
      ['VIP Platinum', '#1A1A2E', 'Noir', '+ Backstage + salle privee + parking VIP'],
      ['Staff', '#DC2626', 'Rouge', 'Acces total'],
      ['Presse', '#3B82F6', 'Bleu', 'Conferences + zone presse + cocktail'],
      ['Technique', '#F97316', 'Orange', 'Backstage + technique + regie'],
      ['Securite', '#84CC16', 'Vert fluo', 'Acces total + PC securite']
    ];

    badges.forEach(function(b) {
      h += '<tr><td><strong>' + b[0] + '</strong></td><td><span class="sec-badge-color" style="background:' + b[1] + ';"></span>' + b[2] + '</td><td>' + b[3] + '</td></tr>';
    });

    h += '</tbody></table></div></div>';

    // Checklist VIP supplementaire
    h += '<div class="sec-group"><h3>Checklist VIP supplementaire</h3>';
    h += checkItem('vip_liste_nominative', 'Liste nominative VIP finalisee', 'Avec photo, fonction, niveau badge, besoins specifiques (regime, PMR, langue).');
    h += checkItem('vip_cadeau', 'Cadeaux/kits VIP prepares', 'Pochette personnalisee : programme, badge, cadeau artisanal, plan VIP.');
    h += checkItem('vip_photographe', 'Photographe dedie VIP', 'Photos officielles au salon VIP + remise de prix. Tirage J+3.');
    h += checkItem('vip_interprete', 'Interprete si VIP non francophone', 'Anglais/allemand disponible. Casques traduction simultanee en salle.');
    h += checkItem('vip_allergies', 'Allergies alimentaires VIP repertoriees', 'Transmission au traiteur. Menu specifique si necessaire.');
    h += checkItem('vip_transfert', 'Transferts aeroport/gare organises', 'Planning des arrivees/departs. Vehicule avec panneau nominatif.');
    h += '</div>';

    return h;
  }

  // ═══════════════════════════════════════
  // TAB 5 : AVANT / PENDANT / APRES
  // ═══════════════════════════════════════
  function renderTimeline() {
    var h = '';

    var phases = [
      {
        title: 'J-3 mois',
        color: '#3B82F6',
        items: [
          ['tl_depot_mairie', 'Depot dossier securite en mairie', 'Formulaire CERFA + plan securite + attestation assurance.'],
          ['tl_contact_prefet', 'Contact prefecture (plan Vigipirate)', 'Demander le niveau Vigipirate en cours et les mesures applicables.'],
          ['tl_devis_secu', 'Devis societes de securite (3 devis minimum)', 'Comparer : effectifs, experience evenementiel, references, certifications.'],
          ['tl_assurances', 'Assurances souscrites', 'RC pro, annulation, accidents, materiel. Voir onglet Autorisations.'],
          ['tl_contact_pompiers', 'Premier contact pompiers / SDIS', 'Prise de RDV pour visite du lieu. Transmettre le dossier securite.'],
          ['tl_prestataire_dae', 'Commande / location DAE', 'Minimum 1 par etage + 1 au poste medical. Piles neuves, patchs valides.']
        ]
      },
      {
        title: 'J-1 mois',
        color: '#8B5CF6',
        items: [
          ['tl_plan_evac', 'Plan d\'evacuation finalise', 'Valide par la commission de securite. Affichage prepare.'],
          ['tl_reunion_pompiers', 'Reunion avec pompiers locaux', 'Visite du lieu, validation des issues, emplacement vehicules secours.'],
          ['tl_verif_extincteurs', 'Verification extincteurs et DAE', 'Date de derniere revision. Commander remplacement si perime.'],
          ['tl_brief_societe', 'Brief societe de securite', 'Transmettre : plan, effectifs, horaires, consignes, contacts.'],
          ['tl_badges', 'Commande badges niveaux d\'acces', '8 types de badges. Impression + lanyards couleur. Marge : +10%.'],
          ['tl_video_install', 'Installation videosurveillance temporaire', 'Si cameras supplementaires necessaires. Test enregistrement.'],
          ['tl_walkies', 'Commande walkie-talkies', 'Minimum 20 unites. 4 canaux. Chargeurs pour 3 jours.']
        ]
      },
      {
        title: 'J-1 semaine',
        color: '#EC4899',
        items: [
          ['tl_visite_lieu', 'Visite securite du lieu avec prestataire', 'Tour complet : issues, extincteurs, BAES, cameras, PC securite.'],
          ['tl_test_portiques', 'Test portiques / detecteurs', 'Reglage sensibilite. File d\'attente test : <5 min par personne.'],
          ['tl_brief_staff', 'Brief staff securite', 'Distribution fiches reflexes, tour du lieu, affectation postes.'],
          ['tl_verif_issues', 'Verification issues de secours', 'Toutes les barres anti-panique fonctionnelles. Aucun obstacle.'],
          ['tl_test_eclairage', 'Test eclairage de securite', 'Couper le courant : BAES s\'allument ? Autonomie testee ?'],
          ['tl_test_alarme', 'Test systeme d\'alarme incendie', 'Declenchement manuel + detection auto. Son audible partout.'],
          ['tl_liste_vip_finale', 'Liste VIP finale transmise aux agents', 'Photos, niveaux d\'acces, besoins specifiques, vehicules.']
        ]
      },
      {
        title: 'J-1 jour',
        color: '#F59E0B',
        items: [
          ['tl_signaletique', 'Mise en place signaletique evacuation', 'Plans affiches, fleches au sol, panneaux "point de rassemblement".'],
          ['tl_test_walkies', 'Test walkie-talkies', 'Tous les canaux, portee dans tout le batiment. Batteries chargees 100%.'],
          ['tl_dernier_brief', 'Dernier brief cellule de crise', 'Revue des scenarios, verification contacts, test communications.'],
          ['tl_verif_cameras', 'Verification cameras', 'Toutes operationnelles, angles corrects, enregistrement actif.'],
          ['tl_exercice_rapide', 'Exercice evacuation rapide staff', 'Simulation : alarme > evacuation > comptage au point de rassemblement.'],
          ['tl_pc_securite', 'PC securite installe et equipe', 'Ecrans, walkies, trousse secours, fiches reflexes, listing contacts.'],
          ['tl_poste_medical', 'Poste medical installe et signe', 'Lit, materiel, DAE, flechage depuis l\'accueil et les salles.']
        ]
      },
      {
        title: 'Jour J',
        color: '#DC2626',
        items: [
          ['tl_pc_operationnel', 'PC securite operationnel des 6h', 'Agents presents, cameras actives, walkies distribues, cafe chaud.'],
          ['tl_rondes', 'Rondes regulieres (toutes les 30 min)', 'Parcours defini : issues, zones VIP, parking, sanitaires, technique.'],
          ['tl_comptage', 'Comptage entrees/sorties temps reel', 'Jauge : ne jamais depasser la capacite maximale autorisee.'],
          ['tl_issues_ouvertes', 'Verification issues de secours ouvertes', 'A chaque ronde : aucune issue bloquee, aucun obstacle devant.'],
          ['tl_point_2h', 'Point securite toutes les 2h avec le responsable', 'Tour de table : incidents, jauge, meteo, VIP, points de vigilance.'],
          ['tl_hydratation', 'Points d\'eau et ventilation verifies', 'Fontaines a eau fonctionnelles, temperature des salles correcte.'],
          ['tl_releve', 'Releve des equipes securite', 'Pause toutes les 4h. Briefing au moment de la releve.']
        ]
      },
      {
        title: 'Post-event',
        color: '#22C55E',
        items: [
          ['tl_rapport', 'Rapport securite (incidents, ameliorations)', 'Chronologie des incidents, temps de reaction, recommandations.'],
          ['tl_remise_cles', 'Remise des cles / badges au Palais', 'Inventaire complet. Restitution du lieu en etat.'],
          ['tl_desactivation_video', 'Desactivation videosurveillance', 'Retrait cameras temporaires. Archivage images pendant 30 jours.'],
          ['tl_archivage', 'Archivage images 30 jours puis suppression', 'Conformite RGPD. Suppression certifiee et documentee.'],
          ['tl_retour_materiel', 'Retour materiel de securite (DAE, walkies, portiques)', 'Inventaire, verification etat, restitution au loueur.'],
          ['tl_debrief', 'Debriefing securite avec toute l\'equipe', 'Retour d\'experience, points positifs, axes d\'amelioration.'],
          ['tl_remerciements', 'Remerciements prefet, pompiers, police', 'Courrier officiel + retour d\'experience si evenement recurrent.']
        ]
      }
    ];

    phases.forEach(function(phase) {
      var keys = phase.items.map(function(i) { return i[0]; });
      var prog = calcProgress(keys);

      h += '<div class="sec-group">';
      h += '<h3><span style="color:' + phase.color + ';">' + phase.title + '</span> <span style="font-size:.78rem;font-weight:400;color:#9B978F;">(' + prog.done + '/' + prog.total + ' — ' + prog.pct + '%)</span></h3>';
      h += '<div class="sec-gauge"><div class="sec-gauge-bar"><div class="sec-gauge-fill" style="width:' + prog.pct + '%;background:' + phase.color + ';"></div></div><div class="sec-gauge-label" style="color:' + phase.color + ';">' + prog.pct + '%</div></div>';

      phase.items.forEach(function(item) {
        h += checkItem(item[0], item[1], item[2]);
      });

      h += '</div>';
    });

    return h;
  }

  // ═══════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════
  function renderSecurite() {
    var el = document.getElementById('section-securite');
    if (!el) return;

    // Collect all keys for global progress
    var allKeys = [];
    var state = loadState();

    // Auth keys
    var authKeys = ['auth_cerfa','auth_prefet','auth_commission','auth_domaine','auth_circulation','auth_sacem','auth_boissons',
      'auth_incendie','auth_erp','auth_registre','auth_pv','auth_vigipirate',
      'auth_rc','auth_annulation','auth_accident','auth_rc_traiteur','auth_materiel','auth_liquor',
      'auth_registre_cnil','auth_politique','auth_dpo','auth_consentement','auth_suppression','auth_wifi',
      'auth_panneau','auth_form_image','auth_brief_photo'];

    var phyKeys = ['phy_dae','phy_extincteurs','phy_baes','phy_issues','phy_signalisation','phy_trousse','phy_poste_medical',
      'phy_portiques','phy_fouille','phy_scanner','phy_cynophile_explosifs','phy_cynophile_stupefiants','phy_badges','phy_liste_vip','phy_parking_vip',
      'phy_cam_entrees','phy_cam_vip','phy_cam_parking','phy_moniteur','phy_cnil_video','phy_panneaux_video'];

    var evacKeys = ['evac_points','evac_itineraires','evac_pmr','evac_exercice','evac_serre_file','evac_plan_affiche',
      'crise_qg','crise_responsable','crise_walkies','crise_procedure'];

    var vipKeys = ['vip_entree','vip_salon','vip_escorte','vip_places','vip_gala','vip_protection','vip_chauffeur','vip_repos',
      'vip_liste_nominative','vip_cadeau','vip_photographe','vip_interprete','vip_allergies','vip_transfert'];

    var tlKeys = ['tl_depot_mairie','tl_contact_prefet','tl_devis_secu','tl_assurances','tl_contact_pompiers','tl_prestataire_dae',
      'tl_plan_evac','tl_reunion_pompiers','tl_verif_extincteurs','tl_brief_societe','tl_badges','tl_video_install','tl_walkies',
      'tl_visite_lieu','tl_test_portiques','tl_brief_staff','tl_verif_issues','tl_test_eclairage','tl_test_alarme','tl_liste_vip_finale',
      'tl_signaletique','tl_test_walkies','tl_dernier_brief','tl_verif_cameras','tl_exercice_rapide','tl_pc_securite','tl_poste_medical',
      'tl_pc_operationnel','tl_rondes','tl_comptage','tl_issues_ouvertes','tl_point_2h','tl_hydratation','tl_releve',
      'tl_rapport','tl_remise_cles','tl_desactivation_video','tl_archivage','tl_retour_materiel','tl_debrief','tl_remerciements'];

    allKeys = authKeys.concat(phyKeys).concat(evacKeys).concat(vipKeys).concat(tlKeys);

    var globalProg = calcProgress(allKeys);
    var authProg = calcProgress(authKeys);
    var phyProg = calcProgress(phyKeys);
    var evacProg = calcProgress(evacKeys);
    var vipProg = calcProgress(vipKeys);
    var tlProg = calcProgress(tlKeys);

    // Progress summary
    var progressSummary = '<div class="sec-progress-summary">';
    progressSummary += '<div class="sec-progress-card"><div class="pct" style="color:' + (globalProg.pct >= 80 ? '#22C55E' : globalProg.pct >= 50 ? '#F59E0B' : '#DC2626') + ';">' + globalProg.pct + '%</div><div class="lbl">Global (' + globalProg.done + '/' + globalProg.total + ')</div></div>';
    progressSummary += '<div class="sec-progress-card"><div class="pct" style="color:' + (authProg.pct >= 80 ? '#22C55E' : authProg.pct >= 50 ? '#F59E0B' : '#DC2626') + ';">' + authProg.pct + '%</div><div class="lbl">Autorisations</div></div>';
    progressSummary += '<div class="sec-progress-card"><div class="pct" style="color:' + (phyProg.pct >= 80 ? '#22C55E' : phyProg.pct >= 50 ? '#F59E0B' : '#DC2626') + ';">' + phyProg.pct + '%</div><div class="lbl">Physique</div></div>';
    progressSummary += '<div class="sec-progress-card"><div class="pct" style="color:' + (evacProg.pct >= 80 ? '#22C55E' : evacProg.pct >= 50 ? '#F59E0B' : '#DC2626') + ';">' + evacProg.pct + '%</div><div class="lbl">Evacuation</div></div>';
    progressSummary += '<div class="sec-progress-card"><div class="pct" style="color:' + (vipProg.pct >= 80 ? '#22C55E' : vipProg.pct >= 50 ? '#F59E0B' : '#DC2626') + ';">' + vipProg.pct + '%</div><div class="lbl">VIP</div></div>';
    progressSummary += '<div class="sec-progress-card"><div class="pct" style="color:' + (tlProg.pct >= 80 ? '#22C55E' : tlProg.pct >= 50 ? '#F59E0B' : '#DC2626') + ';">' + tlProg.pct + '%</div><div class="lbl">Timeline</div></div>';
    progressSummary += '</div>';

    // Global gauge
    var globalGauge = '<div class="sec-gauge" style="margin-bottom:24px;">' +
      '<div style="font-size:.85rem;font-weight:700;color:#9B978F;min-width:120px;">Securite globale</div>' +
      '<div class="sec-gauge-bar"><div class="sec-gauge-fill" style="width:' + globalProg.pct + '%;background:' + (globalProg.pct >= 80 ? '#22C55E' : globalProg.pct >= 50 ? '#F59E0B' : '#DC2626') + ';"></div></div>' +
      '<div class="sec-gauge-label" style="color:' + (globalProg.pct >= 80 ? '#22C55E' : globalProg.pct >= 50 ? '#F59E0B' : '#DC2626') + ';">' + globalProg.pct + '% (' + globalProg.done + '/' + globalProg.total + ')</div>' +
    '</div>';

    // Print button
    var printBtn = '<div style="text-align:right;margin-bottom:16px;">' +
      '<button onclick="window.print()" style="padding:8px 18px;border-radius:8px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.2);color:#C9A84C;font-weight:600;font-size:.8rem;cursor:pointer;">Imprimer le dossier securite</button>' +
      ' <button onclick="SEC_MOD.exportJSON()" style="padding:8px 18px;border-radius:8px;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.2);color:#22C55E;font-weight:600;font-size:.8rem;cursor:pointer;">Exporter JSON</button>' +
      ' <button onclick="if(confirm(\'Reinitialiser toute la checklist securite ? Cette action est irreversible.\')){localStorage.removeItem(\'' + LS_KEY + '\');initializedSections[\'securite\']=false;SPA_INIT.securite();}" style="padding:8px 18px;border-radius:8px;background:rgba(220,38,38,.1);border:1px solid rgba(220,38,38,.2);color:#DC2626;font-weight:600;font-size:.8rem;cursor:pointer;">Reinitialiser</button>' +
    '</div>';

    // Tabs
    var tabs = '<div class="sec-tabs">' +
      '<button class="sec-tab active" onclick="SEC_MOD.switchTab(\'autorisations\',this)">Autorisations</button>' +
      '<button class="sec-tab" onclick="SEC_MOD.switchTab(\'physique\',this)">Securite physique</button>' +
      '<button class="sec-tab" onclick="SEC_MOD.switchTab(\'evacuation\',this)">Evacuation & Urgences</button>' +
      '<button class="sec-tab" onclick="SEC_MOD.switchTab(\'vip\',this)">Securite VIP</button>' +
      '<button class="sec-tab" onclick="SEC_MOD.switchTab(\'timeline\',this)">Avant / Pendant / Apres</button>' +
    '</div>';

    // Panels
    var panels = '' +
      '<div id="sec-panel-autorisations" class="sec-panel active">' + renderAutorisations() + '</div>' +
      '<div id="sec-panel-physique" class="sec-panel">' + renderPhysique() + '</div>' +
      '<div id="sec-panel-evacuation" class="sec-panel">' + renderEvacuation() + '</div>' +
      '<div id="sec-panel-vip" class="sec-panel">' + renderVIP() + '</div>' +
      '<div id="sec-panel-timeline" class="sec-panel">' + renderTimeline() + '</div>';

    var inner = CSS + printBtn + progressSummary + globalGauge + tabs + panels;
    el.innerHTML = adminWrap('Securite', 'icon-salles.png', inner);
  }

  // ═══ PUBLIC API ═══
  window.SEC_MOD = {
    render: renderSecurite,
    toggle: function(key, checked) {
      setCheck(key, 'checked', checked);
      // Re-render to update progress
      initializedSections['securite'] = false;
      SPA_INIT.securite();
    },
    set: function(key, field, value) {
      setCheck(key, field, value);
    },
    switchTab: function(tabId, btn) {
      document.querySelectorAll('.sec-panel').forEach(function(p) { p.classList.remove('active'); });
      document.querySelectorAll('.sec-tab').forEach(function(t) { t.classList.remove('active'); });
      var panel = document.getElementById('sec-panel-' + tabId);
      if (panel) panel.classList.add('active');
      if (btn) btn.classList.add('active');
    },
    exportJSON: function() {
      var data = loadState();
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'securite-congres-saucisse-' + new Date().toISOString().slice(0, 10) + '.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // ═══ REGISTER WITH SPA ═══
  SPA_INIT.securite = renderSecurite;

})();
