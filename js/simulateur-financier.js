/* ═══════════════════════════════════════════════════════
   SIMULATEUR FINANCIER — Congres de la Saucisse
   Partie A: Depenses (exhaustif)
   Partie B: Revenus
   Partie C: Resultat + seuil de rentabilite
   Design: Noir et Or
   ═══════════════════════════════════════════════════════ */

SPA_INIT.simulateur = function() {
  var el = document.getElementById('section-simulateur');
  var LS_KEY = 'congres_simulateur';

  // Default values
  var DEFAULTS = {
    // Nombre d'inscrits par type
    nb_standard: 200,
    nb_bronze: 50,
    nb_gold: 30,
    nb_platinum: 15,
    nb_staff: 20,

    // LIEU
    location_palais: 15000,
    salles_sous_comm: 8000,
    hall_exposition: 5000,
    electricite: 2000,
    wifi: 3000,
    parking: 500,
    nettoyage: 1500,

    // TECHNIQUE
    sonorisation: 6000,
    videoprojection: 3000,
    eclairage: 4000,
    captation_video: 5000,
    traduction: 8000,
    techniciens: 4500,
    groupe_electrogene: 1500,

    // TRAITEUR (prix unitaires)
    prix_dejeuner: 15,
    prix_pause: 5,
    prix_cocktail: 25,
    prix_gala: 65,
    prix_diner_speakers: 80,
    nb_speakers_diner: 20,
    eau_boissons: 800,
    prix_repas_staff: 12,

    // PERSONNEL
    nb_hotesses: 6,
    prix_hotesse_jour: 180,
    nb_securite: 4,
    prix_securite_jour: 200,
    nb_secouristes: 2,
    prix_secouriste_jour: 250,
    nb_cynophile: 1,
    prix_cynophile_jour: 500,
    regisseur: 2000,
    nb_staff_tech: 5,
    prix_staff_tech_jour: 150,
    photographe: 1500,
    videaste: 2500,
    community_manager: 800,

    // SPEAKERS
    nb_speakers: 20,
    transport_speaker: 200,
    nb_nuits_speaker: 2,
    prix_nuit_speaker: 120,
    honoraires_speakers: 3000,
    diners_speakers: 1600,

    // COMMUNICATION
    site_internet: 0,
    nb_programmes: 500,
    prix_programme: 3,
    badges_lanyards: 800,
    signaletique: 2500,
    goodies: 3000,
    pub_social: 1500,
    relations_presse: 3000,
    affiches_flyers: 800,

    // LOGISTIQUE
    transport_materiel: 1200,
    mobilier: 2000,
    decoration_florale: 1000,
    vestiaire: 500,
    navettes_vip: 1500,

    // ASSURANCES
    rc_organisateur: 800,
    assurance_annulation: 1200,
    assurance_materiel: 400,

    // ADMINISTRATIF
    sacem: 500,
    licence_boissons: 200,
    comptabilite: 1000,
    juridique: 1500,

    // Contingence
    contingence_pct: 15,

    // REVENUS
    prix_standard: 150,
    prix_bronze: 350,
    prix_gold: 650,
    prix_platinum: 1200,
    nb_sponsors_plat: 3,
    prix_sponsor_plat: 10000,
    nb_sponsors_gold: 5,
    prix_sponsor_gold: 5000,
    nb_sponsors_silver: 10,
    prix_sponsor_silver: 2000,
    nb_stands: 20,
    prix_stand: 1500,
    subventions: 15000,
    vente_programmes: 2000,
    autres_revenus: 0
  };

  // Load saved or defaults
  function loadData() {
    try {
      var saved = JSON.parse(localStorage.getItem(LS_KEY));
      if (saved) {
        // Merge with defaults for any new fields
        var merged = {};
        for (var k in DEFAULTS) merged[k] = saved.hasOwnProperty(k) ? saved[k] : DEFAULTS[k];
        return merged;
      }
    } catch(e) {}
    return JSON.parse(JSON.stringify(DEFAULTS));
  }

  function saveData(data) {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  }

  var data = loadData();

  function calcDepenses(d) {
    var nbTotal = d.nb_standard + d.nb_bronze + d.nb_gold + d.nb_platinum;
    var nbVIP = d.nb_bronze + d.nb_gold + d.nb_platinum;
    var nbGala = d.nb_gold + d.nb_platinum;
    var jours = 3;

    var lieu = d.location_palais + d.salles_sous_comm + d.hall_exposition + d.electricite + d.wifi + d.parking + d.nettoyage;
    var technique = d.sonorisation + d.videoprojection + d.eclairage + d.captation_video + d.traduction + d.techniciens + d.groupe_electrogene;

    var traiteur_dejeuners = nbTotal * jours * d.prix_dejeuner;
    var traiteur_pauses = nbTotal * jours * 2 * d.prix_pause;
    var traiteur_cocktail = nbVIP * d.prix_cocktail;
    var traiteur_gala = nbGala * d.prix_gala;
    var traiteur_speakers = d.nb_speakers_diner * d.prix_diner_speakers;
    var traiteur_staff = d.nb_staff * jours * d.prix_repas_staff;
    var traiteur = traiteur_dejeuners + traiteur_pauses + traiteur_cocktail + traiteur_gala + traiteur_speakers + d.eau_boissons + traiteur_staff;

    var personnel_hotesses = d.nb_hotesses * jours * d.prix_hotesse_jour;
    var personnel_securite = d.nb_securite * jours * d.prix_securite_jour;
    var personnel_secouristes = d.nb_secouristes * jours * d.prix_secouriste_jour;
    var personnel_cynophile = d.nb_cynophile * jours * d.prix_cynophile_jour;
    var personnel_tech = d.nb_staff_tech * jours * d.prix_staff_tech_jour;
    var personnel = personnel_hotesses + personnel_securite + personnel_secouristes + personnel_cynophile + d.regisseur + personnel_tech + d.photographe + d.videaste + d.community_manager;

    var speakers_transport = d.nb_speakers * d.transport_speaker;
    var speakers_hotel = d.nb_speakers * d.nb_nuits_speaker * d.prix_nuit_speaker;
    var speakers = speakers_transport + speakers_hotel + d.honoraires_speakers + d.diners_speakers;

    var comm_programmes = d.nb_programmes * d.prix_programme;
    var communication = d.site_internet + comm_programmes + d.badges_lanyards + d.signaletique + d.goodies + d.pub_social + d.relations_presse + d.affiches_flyers;

    var logistique = d.transport_materiel + d.mobilier + d.decoration_florale + d.vestiaire + d.navettes_vip;

    var assurances = d.rc_organisateur + d.assurance_annulation + d.assurance_materiel;

    // Frais bancaires Stripe = 2.9% des revenus inscriptions
    var rev_inscr = d.nb_standard * d.prix_standard + d.nb_bronze * d.prix_bronze + d.nb_gold * d.prix_gold + d.nb_platinum * d.prix_platinum;
    var frais_stripe = Math.round(rev_inscr * 0.029);
    var administratif = d.sacem + d.licence_boissons + frais_stripe + d.comptabilite + d.juridique;

    var subtotal = lieu + technique + traiteur + personnel + speakers + communication + logistique + assurances + administratif;
    var contingence = Math.round(subtotal * d.contingence_pct / 100);
    var total = subtotal + contingence;

    return {
      lieu: lieu, technique: technique, traiteur: traiteur, personnel: personnel,
      speakers: speakers, communication: communication, logistique: logistique,
      assurances: assurances, administratif: administratif, frais_stripe: frais_stripe,
      subtotal: subtotal, contingence: contingence, total: total,
      detail: {
        traiteur_dejeuners: traiteur_dejeuners, traiteur_pauses: traiteur_pauses,
        traiteur_cocktail: traiteur_cocktail, traiteur_gala: traiteur_gala,
        traiteur_speakers: traiteur_speakers, traiteur_staff: traiteur_staff,
        personnel_hotesses: personnel_hotesses, personnel_securite: personnel_securite,
        personnel_secouristes: personnel_secouristes, personnel_cynophile: personnel_cynophile,
        personnel_tech: personnel_tech, speakers_transport: speakers_transport,
        speakers_hotel: speakers_hotel, comm_programmes: comm_programmes
      }
    };
  }

  function calcRevenus(d) {
    var inscriptions = d.nb_standard * d.prix_standard + d.nb_bronze * d.prix_bronze + d.nb_gold * d.prix_gold + d.nb_platinum * d.prix_platinum;
    var sponsors = d.nb_sponsors_plat * d.prix_sponsor_plat + d.nb_sponsors_gold * d.prix_sponsor_gold + d.nb_sponsors_silver * d.prix_sponsor_silver;
    var stands = d.nb_stands * d.prix_stand;
    var total = inscriptions + sponsors + stands + d.subventions + d.vente_programmes + d.autres_revenus;
    return {
      inscriptions: inscriptions, sponsors: sponsors, stands: stands,
      subventions: d.subventions, vente_programmes: d.vente_programmes,
      autres: d.autres_revenus, total: total
    };
  }

  function calcSeuilRentabilite(d, depTotal) {
    // Weighted average price per inscrit
    var nbTotal = d.nb_standard + d.nb_bronze + d.nb_gold + d.nb_platinum;
    if (nbTotal === 0) return 0;
    var revInscr = d.nb_standard * d.prix_standard + d.nb_bronze * d.prix_bronze + d.nb_gold * d.prix_gold + d.nb_platinum * d.prix_platinum;
    var prixMoyen = revInscr / nbTotal;

    // Non-inscription revenues
    var autresRev = d.nb_sponsors_plat * d.prix_sponsor_plat + d.nb_sponsors_gold * d.prix_sponsor_gold +
      d.nb_sponsors_silver * d.prix_sponsor_silver + d.nb_stands * d.prix_stand +
      d.subventions + d.vente_programmes + d.autres_revenus;

    var depASansVar = depTotal - (nbTotal * 3 * d.prix_dejeuner) - (nbTotal * 6 * d.prix_pause);
    // Fixed costs minus other revenues
    var needed = depASansVar - autresRev;
    if (needed <= 0) return 0;
    // Revenue per inscrit minus variable cost per inscrit
    var margParInscrit = prixMoyen - (3 * d.prix_dejeuner) - (6 * d.prix_pause);
    if (margParInscrit <= 0) return 9999;
    return Math.ceil(needed / margParInscrit);
  }

  function fmt(n) { return Math.round(n).toLocaleString('fr-FR'); }

  function inputRow(label, key, suffix, isComputed, computedVal) {
    if (isComputed) {
      return '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.03);">' +
        '<span style="font-size:.82rem;color:#9B978F;">' + label + '</span>' +
        '<span style="font-size:.88rem;font-weight:700;color:#C9A84C;">' + fmt(computedVal) + ' ' + (suffix || '\u20ac') + '</span>' +
      '</div>';
    }
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.03);">' +
      '<span style="font-size:.82rem;color:#9B978F;">' + label + '</span>' +
      '<input type="number" data-key="' + key + '" value="' + data[key] + '" style="width:120px;padding:6px 10px;border-radius:8px;border:1px solid rgba(201,168,76,.15);background:rgba(255,255,255,.04);color:#E8E4DC;font-size:.88rem;text-align:right;font-weight:600;" onchange="SPA_SIM.update(this)">' +
      '<span style="font-size:.75rem;color:#5F5C55;width:24px;text-align:right;">' + (suffix || '\u20ac') + '</span>' +
    '</div>';
  }

  function sectionCard(title, rows) {
    return '<div style="background:#161822;border:1px solid rgba(201,168,76,.1);border-radius:14px;padding:20px;margin-bottom:16px;">' +
      '<h3 style="color:#C9A84C;font-size:.95rem;font-weight:700;margin-bottom:12px;border-bottom:1px solid rgba(201,168,76,.1);padding-bottom:8px;">' + title + '</h3>' +
      rows +
    '</div>';
  }

  function render() {
    var dep = calcDepenses(data);
    var rev = calcRevenus(data);
    var nbTotal = data.nb_standard + data.nb_bronze + data.nb_gold + data.nb_platinum;
    var nbVIP = data.nb_bronze + data.nb_gold + data.nb_platinum;
    var nbGala = data.nb_gold + data.nb_platinum;
    var benefice = rev.total - dep.total;
    var seuil = calcSeuilRentabilite(data, dep.total);

    var html = '<div class="admin-content" style="display:block !important;">' +
      '<h1 style="color:#C9A84C;font-size:1.5rem;font-weight:800;margin-bottom:8px;">&#128176; Simulateur Financier</h1>' +
      '<p style="color:#9B978F;font-size:.9rem;margin-bottom:24px;">Tous les frais d\'un congres de 3 jours au Palais des Congres de Strasbourg. Chaque montant est modifiable.</p>' +

      // Sliders for inscrits
      '<div style="background:linear-gradient(135deg,#1a1a2e,#161822);border:2px solid rgba(201,168,76,.3);border-radius:20px;padding:24px;margin-bottom:24px;">' +
        '<h2 style="color:#C9A84C;font-size:1.1rem;margin-bottom:16px;">Nombre d\'inscrits (curseurs)</h2>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;">' +
          sliderCard('Standard (150\u20ac)', 'nb_standard', 0, 500, data.nb_standard) +
          sliderCard('VIP Bronze (350\u20ac)', 'nb_bronze', 0, 100, data.nb_bronze) +
          sliderCard('VIP Gold (650\u20ac)', 'nb_gold', 0, 50, data.nb_gold) +
          sliderCard('VIP Platinum (1 200\u20ac)', 'nb_platinum', 0, 30, data.nb_platinum) +
          sliderCard('Staff', 'nb_staff', 0, 50, data.nb_staff) +
        '</div>' +
        '<div style="text-align:center;margin-top:16px;font-size:1.2rem;font-weight:800;color:#C9A84C;">Total inscrits : ' + nbTotal + '</div>' +
      '</div>' +

      // TABS for Depenses / Revenus / Resultat
      '<div style="display:flex;gap:8px;margin-bottom:16px;">' +
        '<button class="sim-tab active" onclick="SPA_SIM.showTab(\'depenses\',this)" style="padding:10px 24px;border-radius:10px;background:#C9A84C;color:#111;font-weight:700;border:none;cursor:pointer;font-size:.88rem;">A. Depenses</button>' +
        '<button class="sim-tab" onclick="SPA_SIM.showTab(\'revenus\',this)" style="padding:10px 24px;border-radius:10px;background:rgba(201,168,76,.15);color:#C9A84C;font-weight:700;border:none;cursor:pointer;font-size:.88rem;">B. Revenus</button>' +
        '<button class="sim-tab" onclick="SPA_SIM.showTab(\'resultat\',this)" style="padding:10px 24px;border-radius:10px;background:rgba(201,168,76,.15);color:#C9A84C;font-weight:700;border:none;cursor:pointer;font-size:.88rem;">C. Resultat</button>' +
      '</div>' +

      // TAB A: DEPENSES
      '<div id="sim-tab-depenses" class="sim-panel">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">' +

          sectionCard('LIEU',
            inputRow('Location Palais des Congres (3j)', 'location_palais') +
            inputRow('Salles sous-commission (10 salles x 3j)', 'salles_sous_comm') +
            inputRow('Hall d\'exposition', 'hall_exposition') +
            inputRow('Electricite / puissance supp.', 'electricite') +
            inputRow('WiFi haut debit dedie', 'wifi') +
            inputRow('Parking reserve', 'parking') +
            inputRow('Nettoyage', 'nettoyage') +
            '<div style="text-align:right;font-weight:800;color:#C9A84C;font-size:.9rem;padding-top:8px;">Sous-total : ' + fmt(dep.lieu) + ' \u20ac</div>'
          ) +

          sectionCard('TECHNIQUE',
            inputRow('Sonorisation (3 auditoriums)', 'sonorisation') +
            inputRow('Videoprojection', 'videoprojection') +
            inputRow('Eclairage scenique', 'eclairage') +
            inputRow('Captation video / livestream', 'captation_video') +
            inputRow('Traduction simultanee (2 cabines x 3j)', 'traduction') +
            inputRow('Techniciens son/lumiere (3j)', 'techniciens') +
            inputRow('Groupe electrogene secours', 'groupe_electrogene') +
            '<div style="text-align:right;font-weight:800;color:#C9A84C;font-size:.9rem;padding-top:8px;">Sous-total : ' + fmt(dep.technique) + ' \u20ac</div>'
          ) +

          sectionCard('TRAITEUR',
            inputRow('Prix dejeuner/pers', 'prix_dejeuner', '\u20ac/p') +
            inputRow('Dejeuners (' + nbTotal + ' x 3j x ' + data.prix_dejeuner + '\u20ac)', null, null, true, dep.detail.traiteur_dejeuners) +
            inputRow('Prix pause cafe/pers', 'prix_pause', '\u20ac/p') +
            inputRow('Pauses cafe (matin+apres-midi x 3j)', null, null, true, dep.detail.traiteur_pauses) +
            inputRow('Prix cocktail VIP/pers', 'prix_cocktail', '\u20ac/p') +
            inputRow('Cocktail d\'ouverture (' + nbVIP + ' VIP)', null, null, true, dep.detail.traiteur_cocktail) +
            inputRow('Prix diner de gala/pers', 'prix_gala', '\u20ac/p') +
            inputRow('Diner de gala (' + nbGala + ' Gold+Plat.)', null, null, true, dep.detail.traiteur_gala) +
            inputRow('Prix diner speakers/pers', 'prix_diner_speakers', '\u20ac/p') +
            inputRow('Nb speakers diner prive', 'nb_speakers_diner', 'pers') +
            inputRow('Diner prive speakers', null, null, true, dep.detail.traiteur_speakers) +
            inputRow('Eau / boissons soft', 'eau_boissons') +
            inputRow('Prix repas staff/pers/jour', 'prix_repas_staff', '\u20ac/p') +
            inputRow('Repas staff (' + data.nb_staff + ' x 3j)', null, null, true, dep.detail.traiteur_staff) +
            '<div style="text-align:right;font-weight:800;color:#C9A84C;font-size:.9rem;padding-top:8px;">Sous-total : ' + fmt(dep.traiteur) + ' \u20ac</div>'
          ) +

          sectionCard('PERSONNEL',
            inputRow('Nb hotesses', 'nb_hotesses', 'pers') +
            inputRow('Prix hotesse/jour', 'prix_hotesse_jour', '\u20ac/j') +
            inputRow('Hotesses (' + data.nb_hotesses + ' x 3j)', null, null, true, dep.detail.personnel_hotesses) +
            inputRow('Nb agents securite SSIAP', 'nb_securite', 'pers') +
            inputRow('Prix securite/jour', 'prix_securite_jour', '\u20ac/j') +
            inputRow('Securite (' + data.nb_securite + ' x 3j)', null, null, true, dep.detail.personnel_securite) +
            inputRow('Nb secouristes', 'nb_secouristes', 'pers') +
            inputRow('Prix secouriste/jour', 'prix_secouriste_jour', '\u20ac/j') +
            inputRow('Secouristes (' + data.nb_secouristes + ' x 3j)', null, null, true, dep.detail.personnel_secouristes) +
            inputRow('Nb equipe cynophile', 'nb_cynophile', 'pers') +
            inputRow('Prix cynophile/jour', 'prix_cynophile_jour', '\u20ac/j') +
            inputRow('Equipe cynophile', null, null, true, dep.detail.personnel_cynophile) +
            inputRow('Regisseur general', 'regisseur') +
            inputRow('Nb staff technique', 'nb_staff_tech', 'pers') +
            inputRow('Prix staff tech/jour', 'prix_staff_tech_jour', '\u20ac/j') +
            inputRow('Staff technique', null, null, true, dep.detail.personnel_tech) +
            inputRow('Photographe officiel', 'photographe') +
            inputRow('Videaste', 'videaste') +
            inputRow('Community manager', 'community_manager') +
            '<div style="text-align:right;font-weight:800;color:#C9A84C;font-size:.9rem;padding-top:8px;">Sous-total : ' + fmt(dep.personnel) + ' \u20ac</div>'
          ) +

          sectionCard('SPEAKERS',
            inputRow('Nb speakers', 'nb_speakers', 'pers') +
            inputRow('Transport moyen/speaker', 'transport_speaker') +
            inputRow('Transport speakers', null, null, true, dep.detail.speakers_transport) +
            inputRow('Nb nuits/speaker', 'nb_nuits_speaker', 'nuits') +
            inputRow('Prix nuit/speaker', 'prix_nuit_speaker') +
            inputRow('Hebergement speakers', null, null, true, dep.detail.speakers_hotel) +
            inputRow('Honoraires / cadeaux', 'honoraires_speakers') +
            inputRow('Diners speakers', 'diners_speakers') +
            '<div style="text-align:right;font-weight:800;color:#C9A84C;font-size:.9rem;padding-top:8px;">Sous-total : ' + fmt(dep.speakers) + ' \u20ac</div>'
          ) +

          sectionCard('COMMUNICATION',
            inputRow('Site internet', 'site_internet') +
            inputRow('Nb programmes', 'nb_programmes', 'ex.') +
            inputRow('Prix/programme', 'prix_programme') +
            inputRow('Impression programmes', null, null, true, dep.detail.comm_programmes) +
            inputRow('Badges + lanyards', 'badges_lanyards') +
            inputRow('Signaletique / kakemonos', 'signaletique') +
            inputRow('Goodies / sacs', 'goodies') +
            inputRow('Publicite Facebook/LinkedIn', 'pub_social') +
            inputRow('Relations presse', 'relations_presse') +
            inputRow('Affiches / flyers', 'affiches_flyers') +
            '<div style="text-align:right;font-weight:800;color:#C9A84C;font-size:.9rem;padding-top:8px;">Sous-total : ' + fmt(dep.communication) + ' \u20ac</div>'
          ) +

          sectionCard('LOGISTIQUE',
            inputRow('Transport materiel', 'transport_materiel') +
            inputRow('Mobilier supplementaire', 'mobilier') +
            inputRow('Decoration florale', 'decoration_florale') +
            inputRow('Vestiaire', 'vestiaire') +
            inputRow('Navettes aeroport/gare VIP', 'navettes_vip') +
            '<div style="text-align:right;font-weight:800;color:#C9A84C;font-size:.9rem;padding-top:8px;">Sous-total : ' + fmt(dep.logistique) + ' \u20ac</div>'
          ) +

          sectionCard('ASSURANCES',
            inputRow('RC organisateur', 'rc_organisateur') +
            inputRow('Assurance annulation', 'assurance_annulation') +
            inputRow('Assurance materiel', 'assurance_materiel') +
            '<div style="text-align:right;font-weight:800;color:#C9A84C;font-size:.9rem;padding-top:8px;">Sous-total : ' + fmt(dep.assurances) + ' \u20ac</div>'
          ) +

          sectionCard('ADMINISTRATIF',
            inputRow('SACEM', 'sacem') +
            inputRow('Licence boissons', 'licence_boissons') +
            inputRow('Frais bancaires Stripe (2.9%)', null, null, true, dep.frais_stripe) +
            inputRow('Comptabilite', 'comptabilite') +
            inputRow('Juridique / contrats', 'juridique') +
            '<div style="text-align:right;font-weight:800;color:#C9A84C;font-size:.9rem;padding-top:8px;">Sous-total : ' + fmt(dep.administratif) + ' \u20ac</div>'
          ) +

          sectionCard('IMPR\u00c9VUS',
            inputRow('Contingence (%)', 'contingence_pct', '%') +
            inputRow('Montant contingence (+' + data.contingence_pct + '% du sous-total)', null, null, true, dep.contingence)
          ) +

        '</div>' +

        // TOTAL DEPENSES
        '<div style="background:linear-gradient(135deg,#1a1a2e,#161822);border:2px solid #DC2626;border-radius:16px;padding:24px;text-align:center;margin-top:16px;">' +
          '<div style="font-size:.88rem;color:#9B978F;margin-bottom:8px;">TOTAL DEPENSES ESTIMEES</div>' +
          '<div style="font-size:2.5rem;font-weight:800;color:#DC2626;">' + fmt(dep.total) + ' \u20ac</div>' +
        '</div>' +
      '</div>' +

      // TAB B: REVENUS
      '<div id="sim-tab-revenus" class="sim-panel" style="display:none;">' +
        sectionCard('INSCRIPTIONS',
          inputRow('Standard (' + data.nb_standard + ' x ' + data.prix_standard + '\u20ac)', null, null, true, data.nb_standard * data.prix_standard) +
          inputRow('VIP Bronze (' + data.nb_bronze + ' x ' + data.prix_bronze + '\u20ac)', null, null, true, data.nb_bronze * data.prix_bronze) +
          inputRow('VIP Gold (' + data.nb_gold + ' x ' + data.prix_gold + '\u20ac)', null, null, true, data.nb_gold * data.prix_gold) +
          inputRow('VIP Platinum (' + data.nb_platinum + ' x ' + data.prix_platinum + '\u20ac)', null, null, true, data.nb_platinum * data.prix_platinum) +
          '<div style="text-align:right;font-weight:800;color:#C9A84C;font-size:.9rem;padding-top:8px;">Sous-total inscriptions : ' + fmt(rev.inscriptions) + ' \u20ac</div>'
        ) +
        sectionCard('SPONSORS',
          inputRow('Nb sponsors Platinum', 'nb_sponsors_plat', 'sp.') +
          inputRow('Prix sponsor Platinum', 'prix_sponsor_plat') +
          inputRow('Nb sponsors Gold', 'nb_sponsors_gold', 'sp.') +
          inputRow('Prix sponsor Gold', 'prix_sponsor_gold') +
          inputRow('Nb sponsors Silver', 'nb_sponsors_silver', 'sp.') +
          inputRow('Prix sponsor Silver', 'prix_sponsor_silver') +
          '<div style="text-align:right;font-weight:800;color:#C9A84C;font-size:.9rem;padding-top:8px;">Sous-total sponsors : ' + fmt(rev.sponsors) + ' \u20ac</div>'
        ) +
        sectionCard('STANDS & AUTRES',
          inputRow('Nb stands exposants', 'nb_stands', 'st.') +
          inputRow('Prix par stand', 'prix_stand') +
          inputRow('Stands exposants', null, null, true, rev.stands) +
          inputRow('Subventions (Region, Ville)', 'subventions') +
          inputRow('Vente de programmes', 'vente_programmes') +
          inputRow('Autres revenus', 'autres_revenus')
        ) +

        // TOTAL REVENUS
        '<div style="background:linear-gradient(135deg,#1a1a2e,#161822);border:2px solid #22C55E;border-radius:16px;padding:24px;text-align:center;margin-top:16px;">' +
          '<div style="font-size:.88rem;color:#9B978F;margin-bottom:8px;">TOTAL REVENUS</div>' +
          '<div style="font-size:2.5rem;font-weight:800;color:#22C55E;">' + fmt(rev.total) + ' \u20ac</div>' +
        '</div>' +
      '</div>' +

      // TAB C: RESULTAT
      '<div id="sim-tab-resultat" class="sim-panel" style="display:none;">' +

        // Summary cards
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:24px;">' +
          '<div style="background:#161822;border:1px solid rgba(220,38,38,.3);border-radius:14px;padding:24px;text-align:center;">' +
            '<div style="font-size:.82rem;color:#9B978F;">Total Depenses</div>' +
            '<div style="font-size:1.8rem;font-weight:800;color:#DC2626;">' + fmt(dep.total) + ' \u20ac</div>' +
          '</div>' +
          '<div style="background:#161822;border:1px solid rgba(34,197,94,.3);border-radius:14px;padding:24px;text-align:center;">' +
            '<div style="font-size:.82rem;color:#9B978F;">Total Revenus</div>' +
            '<div style="font-size:1.8rem;font-weight:800;color:#22C55E;">' + fmt(rev.total) + ' \u20ac</div>' +
          '</div>' +
          '<div style="background:#161822;border:2px solid ' + (benefice >= 0 ? 'rgba(34,197,94,.5)' : 'rgba(220,38,38,.5)') + ';border-radius:14px;padding:24px;text-align:center;">' +
            '<div style="font-size:.82rem;color:#9B978F;">' + (benefice >= 0 ? 'BENEFICE' : 'PERTE') + '</div>' +
            '<div style="font-size:2.2rem;font-weight:800;color:' + (benefice >= 0 ? '#22C55E' : '#DC2626') + ';">' + (benefice >= 0 ? '+' : '') + fmt(benefice) + ' \u20ac</div>' +
          '</div>' +
        '</div>' +

        // Seuil de rentabilite
        '<div style="background:linear-gradient(135deg,#1a1a2e,#161822);border:2px solid rgba(201,168,76,.3);border-radius:20px;padding:32px;margin-bottom:24px;text-align:center;">' +
          '<div style="font-size:1rem;color:#9B978F;margin-bottom:8px;">Seuil de rentabilite (point mort)</div>' +
          '<div style="font-size:3rem;font-weight:800;color:#C9A84C;">' + seuil + ' inscrits</div>' +
          '<div style="font-size:.88rem;color:' + (nbTotal >= seuil ? '#22C55E' : '#F59E0B') + ';margin-top:8px;font-weight:700;">' +
            (nbTotal >= seuil ? 'Seuil atteint ! (' + nbTotal + ' / ' + seuil + ')' : 'Il vous manque ' + (seuil - nbTotal) + ' inscrits pour etre rentable') +
          '</div>' +
        '</div>' +

        // Graphique rentabilite
        '<div style="background:#161822;border:1px solid rgba(201,168,76,.1);border-radius:14px;padding:24px;margin-bottom:24px;">' +
          '<h3 style="color:#C9A84C;font-size:1rem;font-weight:700;margin-bottom:16px;">Courbe de rentabilite</h3>' +
          '<div style="max-height:350px;"><canvas id="sim-chart-rentabilite"></canvas></div>' +
        '</div>' +

        // Export PDF
        '<div style="text-align:center;margin-top:16px;">' +
          '<button onclick="SPA_SIM.exportPDF()" style="padding:14px 40px;border-radius:14px;background:#C9A84C;color:#111;font-weight:800;font-size:1rem;border:none;cursor:pointer;">Exporter en PDF</button>' +
          '<button onclick="SPA_SIM.reset()" style="padding:14px 40px;border-radius:14px;background:rgba(220,38,38,.15);color:#DC2626;font-weight:700;font-size:.88rem;border:none;cursor:pointer;margin-left:12px;">Reinitialiser</button>' +
        '</div>' +

      '</div>' +

    '</div>';

    el.innerHTML = html;

    // Build the rentability chart
    setTimeout(function() {
      var canvas = document.getElementById('sim-chart-rentabilite');
      if (!canvas) return;

      // Simulate: x = number of inscrits (0 to 500), y = benefice
      var labels = [];
      var dataPoints = [];
      var revInscr = data.nb_standard * data.prix_standard + data.nb_bronze * data.prix_bronze + data.nb_gold * data.prix_gold + data.nb_platinum * data.prix_platinum;
      var nbT = data.nb_standard + data.nb_bronze + data.nb_gold + data.nb_platinum;
      var prixMoyen = nbT > 0 ? revInscr / nbT : 300;
      var coutVarParInscrit = 3 * data.prix_dejeuner + 6 * data.prix_pause;

      // Fixed costs = total deps minus variable costs for current inscrits
      var fixedCosts = dep.total - (nbT * coutVarParInscrit);
      // Non-inscription revenues
      var autresRev = rev.sponsors + rev.stands + rev.subventions + rev.vente_programmes + rev.autres;

      for (var x = 0; x <= 500; x += 10) {
        labels.push(x);
        var revX = x * prixMoyen + autresRev;
        var depX = fixedCosts + x * coutVarParInscrit;
        dataPoints.push(Math.round(revX - depX));
      }

      if (window._simChart) window._simChart.destroy();
      window._simChart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Benefice (\u20ac)',
            data: dataPoints,
            borderColor: '#C9A84C',
            backgroundColor: function(ctx) {
              var val = ctx.raw;
              return val >= 0 ? 'rgba(34,197,94,.15)' : 'rgba(220,38,38,.15)';
            },
            fill: true,
            tension: 0.2,
            pointRadius: 0,
            segment: {
              borderColor: function(ctx) {
                return ctx.p0.parsed.y < 0 ? '#DC2626' : '#22C55E';
              }
            }
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#9B978F' } },
            annotation: undefined
          },
          scales: {
            x: {
              title: { display: true, text: 'Nombre d\'inscrits', color: '#9B978F' },
              ticks: { color: '#5F5C55' },
              grid: { color: 'rgba(255,255,255,.04)' }
            },
            y: {
              title: { display: true, text: 'Benefice (\u20ac)', color: '#9B978F' },
              ticks: { color: '#5F5C55', callback: function(v) { return v.toLocaleString('fr-FR') + ' \u20ac'; } },
              grid: { color: 'rgba(255,255,255,.04)' }
            }
          }
        }
      });
    }, 150);
  }

  function sliderCard(label, key, min, max, val) {
    return '<div style="background:rgba(255,255,255,.03);border-radius:12px;padding:16px;">' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:8px;">' +
        '<span style="font-size:.82rem;color:#9B978F;">' + label + '</span>' +
        '<span id="slider-val-' + key + '" style="font-size:1rem;font-weight:800;color:#C9A84C;">' + val + '</span>' +
      '</div>' +
      '<input type="range" data-key="' + key + '" min="' + min + '" max="' + max + '" value="' + val + '" style="width:100%;accent-color:#C9A84C;" oninput="SPA_SIM.updateSlider(this)">' +
    '</div>';
  }

  // Initial render
  render();

  // Controller
  window.SPA_SIM = {
    update: function(input) {
      var key = input.getAttribute('data-key');
      if (key && data.hasOwnProperty(key)) {
        data[key] = parseFloat(input.value) || 0;
        saveData(data);
        render();
      }
    },
    updateSlider: function(input) {
      var key = input.getAttribute('data-key');
      if (key && data.hasOwnProperty(key)) {
        data[key] = parseInt(input.value) || 0;
        var valEl = document.getElementById('slider-val-' + key);
        if (valEl) valEl.textContent = data[key];
        saveData(data);
        // Debounce full re-render
        clearTimeout(window._simRenderTimer);
        window._simRenderTimer = setTimeout(function() { render(); }, 300);
      }
    },
    showTab: function(tab, btn) {
      ['depenses', 'revenus', 'resultat'].forEach(function(t) {
        var panel = document.getElementById('sim-tab-' + t);
        if (panel) panel.style.display = t === tab ? 'block' : 'none';
      });
      document.querySelectorAll('.sim-tab').forEach(function(b) {
        b.style.background = 'rgba(201,168,76,.15)';
        b.style.color = '#C9A84C';
      });
      if (btn) {
        btn.style.background = '#C9A84C';
        btn.style.color = '#111';
      }
    },
    reset: function() {
      if (!confirm('Reinitialiser tous les chiffres aux valeurs par defaut ?')) return;
      data = JSON.parse(JSON.stringify(DEFAULTS));
      saveData(data);
      render();
    },
    exportPDF: function() {
      var dep = calcDepenses(data);
      var rev = calcRevenus(data);
      var benefice = rev.total - dep.total;
      var nbTotal = data.nb_standard + data.nb_bronze + data.nb_gold + data.nb_platinum;
      var seuil = calcSeuilRentabilite(data, dep.total);

      var content = 'SIMULATEUR FINANCIER - CONGRES DE LA SAUCISSE 2026\n' +
        '='.repeat(60) + '\n\n' +
        'DEPENSES\n' + '-'.repeat(40) + '\n' +
        'Lieu : ' + fmt(dep.lieu) + ' \u20ac\n' +
        'Technique : ' + fmt(dep.technique) + ' \u20ac\n' +
        'Traiteur : ' + fmt(dep.traiteur) + ' \u20ac\n' +
        'Personnel : ' + fmt(dep.personnel) + ' \u20ac\n' +
        'Speakers : ' + fmt(dep.speakers) + ' \u20ac\n' +
        'Communication : ' + fmt(dep.communication) + ' \u20ac\n' +
        'Logistique : ' + fmt(dep.logistique) + ' \u20ac\n' +
        'Assurances : ' + fmt(dep.assurances) + ' \u20ac\n' +
        'Administratif : ' + fmt(dep.administratif) + ' \u20ac\n' +
        'Contingence (' + data.contingence_pct + '%) : ' + fmt(dep.contingence) + ' \u20ac\n' +
        'TOTAL DEPENSES : ' + fmt(dep.total) + ' \u20ac\n\n' +
        'REVENUS\n' + '-'.repeat(40) + '\n' +
        'Inscriptions : ' + fmt(rev.inscriptions) + ' \u20ac (' + nbTotal + ' inscrits)\n' +
        'Sponsors : ' + fmt(rev.sponsors) + ' \u20ac\n' +
        'Stands : ' + fmt(rev.stands) + ' \u20ac\n' +
        'Subventions : ' + fmt(rev.subventions) + ' \u20ac\n' +
        'Vente programmes : ' + fmt(rev.vente_programmes) + ' \u20ac\n' +
        'Autres : ' + fmt(rev.autres) + ' \u20ac\n' +
        'TOTAL REVENUS : ' + fmt(rev.total) + ' \u20ac\n\n' +
        'RESULTAT\n' + '-'.repeat(40) + '\n' +
        (benefice >= 0 ? 'BENEFICE : +' : 'PERTE : ') + fmt(benefice) + ' \u20ac\n' +
        'Seuil de rentabilite : ' + seuil + ' inscrits\n' +
        'Inscrits actuels : ' + nbTotal + '\n' +
        (nbTotal >= seuil ? 'SEUIL ATTEINT' : 'Il manque ' + (seuil - nbTotal) + ' inscrits') + '\n\n' +
        'Genere le ' + new Date().toLocaleDateString('fr-FR') + ' a ' + new Date().toLocaleTimeString('fr-FR');

      // Create downloadable text file (PDF would need a lib)
      var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'simulateur-financier-congres-saucisse.txt';
      a.click();
    }
  };
};
