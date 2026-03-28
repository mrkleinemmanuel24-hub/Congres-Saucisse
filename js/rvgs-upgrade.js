/* ═══════════════════════════════════════════════════════
   RVGS 2027 — Mega Upgrade
   250 demo participants, badge colors, notifications,
   gala & finale, dietary management, survey, social wall
   ═══════════════════════════════════════════════════════ */
(function() {
'use strict';

// ═══════════════════════════════════════════════════════
// TASK 2: NEW PASS TYPES FOR RVGS
// ═══════════════════════════════════════════════════════
var RVGS_PASSES = [
  { id: 'vip', nom: 'VIP', prix: 0, couleur: '#DC2626', textColor: '#FFF', emoji: '\uD83D\uDD34', access: 'ACCES TOUTES ZONES', features: ['Acces toutes zones', 'Places reservees rang 1', 'Salon VIP', 'Soiree de gala', 'Securite dediee', 'Parking VIP'] },
  { id: 'speaker', nom: 'Speaker', prix: 0, couleur: '#F59E0B', textColor: '#111', emoji: '\uD83D\uDFE1', access: 'BACKSTAGE + CONFERENCES', features: ['Backstage + conferences', 'Loge intervenant', 'Green room', 'Repas inclus', 'Transfert'] },
  { id: 'invite', nom: 'Invite', prix: 0, couleur: '#3B82F6', textColor: '#FFF', emoji: '\uD83D\uDD35', access: 'ZONES RESERVEES', features: ['Zones reservees', 'Presse / Partenaires', 'Acces salon', 'Cocktail bienvenue'] },
  { id: 'spectateur', nom: 'Spectateur', prix: 0, couleur: '#9CA3AF', textColor: '#374151', emoji: '\u26AA', access: 'CONFERENCES', features: ['Acces conferences', 'Expositions', 'Projections', 'Programme imprime'] }
];

// Override CONGRES.PASSES
if (window.CONGRES) {
  window.CONGRES.PASSES = RVGS_PASSES;
  window.CONGRES.getPass = function(id) { return RVGS_PASSES.find(function(p) { return p.id === id; }); };
}

// ═══════════════════════════════════════════════════════
// TASK 3: 250 DEMO PARTICIPANTS
// ═══════════════════════════════════════════════════════

var VIP_NAMES = [
  { prenom: 'Jean-Marc', nom: 'Aubry', entreprise: 'Ambassade de France en Estonie', titre: 'S.E. Ambassadeur' },
  { prenom: 'Catherine', nom: 'Vidal', entreprise: 'Senat', titre: 'Senatrice du Bas-Rhin' },
  { prenom: 'Philippe', nom: 'Etienne', entreprise: 'Ministere des Affaires etrangeres', titre: 'Ancien Ambassadeur' },
  { prenom: 'Jeanne', nom: 'D\'Hauteserre', entreprise: 'Mairie du 8e arrondissement Paris', titre: 'Maire' },
  { prenom: 'Marc', nom: 'Perrin de Brichambaut', entreprise: 'Cour Internationale de Justice', titre: 'Juge' },
  { prenom: 'Sylvie', nom: 'Bermann', entreprise: 'Ambassade de France en Chine (ret.)', titre: 'S.E. Ambassadrice' },
  { prenom: 'Gerard', nom: 'Araud', entreprise: 'Ambassade de France aux USA (ret.)', titre: 'S.E. Ambassadeur' },
  { prenom: 'Elisabeth', nom: 'Guigou', entreprise: 'Assemblee nationale (ret.)', titre: 'Ancienne Ministre' },
  { prenom: 'Hubert', nom: 'Vedrine', entreprise: 'Cabinet Vedrine', titre: 'Ancien Ministre des Affaires etrangeres' },
  { prenom: 'Nathalie', nom: 'Loiseau', entreprise: 'Parlement europeen', titre: 'Deputee europeenne' },
  { prenom: 'Bruno', nom: 'Tertrais', entreprise: 'Fondation pour la recherche strategique', titre: 'Directeur adjoint' },
  { prenom: 'Dominique', nom: 'De Villepin', entreprise: 'Cabinet DV', titre: 'Ancien Premier Ministre' },
  { prenom: 'Claude', nom: 'Fischer', entreprise: 'Conseil de l\'Europe', titre: 'Secretaire general adjoint' },
  { prenom: 'Christophe', nom: 'Bigot', entreprise: 'Ambassade de France au Senegal (ret.)', titre: 'S.E. Ambassadeur' },
  { prenom: 'Anne', nom: 'Grillo', entreprise: 'Ambassade de France en Autriche', titre: 'S.E. Ambassadrice' },
  { prenom: 'Pierre', nom: 'Lellouche', entreprise: 'Assemblee nationale (ret.)', titre: 'Ancien Secretaire d\'Etat' },
  { prenom: 'Roland', nom: 'Ries', entreprise: 'Mairie de Strasbourg (ret.)', titre: 'Ancien Senateur-Maire' },
  { prenom: 'Fabienne', nom: 'Keller', entreprise: 'Parlement europeen', titre: 'Deputee europeenne' },
  { prenom: 'Denis', nom: 'Bauchard', entreprise: 'IFRI', titre: 'Conseiller special' },
  { prenom: 'Laurence', nom: 'Tubiana', entreprise: 'Fondation europeenne pour le climat', titre: 'Directrice' }
];

var SPEAKER_NAMES = [
  { prenom: 'Pierre', nom: 'Haski', entreprise: 'Reporters Sans Frontieres', titre: 'President de RSF' },
  { prenom: 'Marie', nom: 'Lefevre', entreprise: 'Sciences Po Strasbourg', titre: 'Professeure de geopolitique' },
  { prenom: 'Philippe', nom: 'Martin', entreprise: 'IRSEM', titre: 'General (2S)' },
  { prenom: 'Pascal', nom: 'Music', entreprise: 'ENA Strasbourg', titre: 'Directeur d\'etudes' },
  { prenom: 'Dominique', nom: 'Moisi', entreprise: 'IFRI', titre: 'Conseiller special' },
  { prenom: 'Nathalie', nom: 'Tocci', entreprise: 'Istituto Affari Internazionali', titre: 'Directrice' },
  { prenom: 'Valerie', nom: 'Masson-Delmotte', entreprise: 'GIEC', titre: 'Paleoclimatologue' },
  { prenom: 'Jean', nom: 'Jouzel', entreprise: 'CEA / GIEC', titre: 'Glaciologue' },
  { prenom: 'Cedric', nom: 'Villani', entreprise: 'Institut Henri Poincare', titre: 'Mathematicien' },
  { prenom: 'Laurence', nom: 'Devillers', entreprise: 'Sorbonne / CNRS', titre: 'Professeure IA' },
  { prenom: 'Asma', nom: 'Mhalla', entreprise: 'Sciences Po Paris', titre: 'Enseignante tech & geopolitique' },
  { prenom: 'Philippe', nom: 'Meirieu', entreprise: 'Universite Lumiere Lyon 2', titre: 'Chercheur en sciences de l\'education' },
  { prenom: 'Thomas', nom: 'Piketty', entreprise: 'EHESS / PSE', titre: 'Economiste' },
  { prenom: 'Gilles', nom: 'Boeuf', entreprise: 'MNHN', titre: 'Biologiste' },
  { prenom: 'Isabelle', nom: 'Autissier', entreprise: 'WWF France', titre: 'Navigatrice, presidente d\'honneur' },
  { prenom: 'Martin', nom: 'Hirsch', entreprise: 'AP-HP (ret.)', titre: 'Ancien DG AP-HP' },
  { prenom: 'Agnes', nom: 'Buzyn', entreprise: 'Ministere de la Sante (ret.)', titre: 'Ancienne Ministre' },
  { prenom: 'Francois', nom: 'Gemenne', entreprise: 'Universite de Liege', titre: 'Politologue, expert GIEC' },
  { prenom: 'Catherine', nom: 'Wihtol de Wenden', entreprise: 'Sciences Po / CERI', titre: 'Politologue migrations' },
  { prenom: 'Jean-Marc', nom: 'Jancovici', entreprise: 'The Shift Project', titre: 'President' },
  { prenom: 'Corinne', nom: 'Lepage', entreprise: 'Cabinet Huglo Lepage', titre: 'Avocate, ancienne ministre' },
  { prenom: 'Sylvie', nom: 'Kauffmann', entreprise: 'Le Monde', titre: 'Editorialiste' },
  { prenom: 'Catherine', nom: 'Trautmann', entreprise: 'Mairie de Strasbourg (ret.)', titre: 'Ancienne Ministre de la Culture' },
  { prenom: 'Julia', nom: 'Cage', entreprise: 'Sciences Po Paris', titre: 'Economiste des medias' },
  { prenom: 'Christophe', nom: 'Deloire', entreprise: 'RSF (ret.)', titre: 'Journaliste' },
  { prenom: 'Dominique', nom: 'Meda', entreprise: 'Universite Paris-Dauphine', titre: 'Sociologue' },
  { prenom: 'Denis', nom: 'Maillard', entreprise: 'Temps Commun', titre: 'Essayiste' },
  { prenom: 'Najat', nom: 'Vallaud-Belkacem', entreprise: 'ONE France', titre: 'Ancienne Ministre de l\'Education' },
  { prenom: 'Alexandra', nom: 'De Hoop Scheffer', entreprise: 'German Marshall Fund', titre: 'Directrice Paris' },
  { prenom: 'Bertrand', nom: 'Badie', entreprise: 'Sciences Po Paris', titre: 'Professeur emerite' }
];

var INVITE_NAMES = [
  { prenom: 'Jean-Claude', nom: 'Dupont', entreprise: 'France Inter', titre: 'Journaliste' },
  { prenom: 'Sophie', nom: 'Martin', entreprise: 'ECFR', titre: 'Chargee de programme' },
  { prenom: 'Laurent', nom: 'Desbois', entreprise: 'Arte', titre: 'Redacteur en chef' },
  { prenom: 'Camille', nom: 'Renard', entreprise: 'France Culture', titre: 'Productrice' },
  { prenom: 'Matthieu', nom: 'Bock-Cote', entreprise: 'Le Figaro', titre: 'Chroniqueur' },
  { prenom: 'Anne', nom: 'Sinclair', entreprise: 'Huffington Post France', titre: 'Journaliste' },
  { prenom: 'Guillaume', nom: 'Erner', entreprise: 'France Culture', titre: 'Producteur' },
  { prenom: 'Patrick', nom: 'Cohen', entreprise: 'TF1', titre: 'Journaliste' },
  { prenom: 'Lea', nom: 'Salame', entreprise: 'France 2', titre: 'Presentatrice' },
  { prenom: 'Virginie', nom: 'Calmels', entreprise: 'Institut Montaigne', titre: 'Vice-presidente' },
  { prenom: 'Henri', nom: 'Guaino', entreprise: 'Conseil constitutionnel (ret.)', titre: 'Editorialiste' },
  { prenom: 'Margaux', nom: 'Briand', entreprise: 'Euronews', titre: 'Correspondante' },
  { prenom: 'Florian', nom: 'Keller', entreprise: 'Region Grand Est', titre: 'Directeur des relations internationales' },
  { prenom: 'Isabelle', nom: 'Haas', entreprise: 'DNA / L\'Alsace', titre: 'Redactrice en chef' },
  { prenom: 'Christophe', nom: 'Zagrodzki', entreprise: 'CESDIP', titre: 'Chercheur' },
  { prenom: 'Nadia', nom: 'Bellaoui', entreprise: 'Ligue de l\'enseignement', titre: 'Secretaire generale' },
  { prenom: 'Marc', nom: 'Trevise', entreprise: 'TV5 Monde', titre: 'Chef d\'antenne' },
  { prenom: 'Fatima', nom: 'El-Arabi', entreprise: 'Al Jazeera', titre: 'Correspondante Europe' },
  { prenom: 'Stefan', nom: 'Kornelius', entreprise: 'Suddeutsche Zeitung', titre: 'Chef du service etranger' },
  { prenom: 'Olivia', nom: 'Gesbert', entreprise: 'France Culture', titre: 'Productrice' },
  { prenom: 'Alexandre', nom: 'Devecchio', entreprise: 'Le Figaro', titre: 'Journaliste' },
  { prenom: 'Claire', nom: 'Gatinois', entreprise: 'Le Monde', titre: 'Grand reporter' },
  { prenom: 'Thomas', nom: 'Wieder', entreprise: 'Le Monde', titre: 'Correspondant Berlin' },
  { prenom: 'Michel', nom: 'Duclos', entreprise: 'Institut Montaigne', titre: 'Conseiller special' },
  { prenom: 'Arancha', nom: 'Gonzalez Laya', entreprise: 'IE School', titre: 'Doyenne' },
  { prenom: 'Benjamin', nom: 'Haddad', entreprise: 'Assemblee nationale', titre: 'Depute' },
  { prenom: 'Daniela', nom: 'Schwarzer', entreprise: 'DGAP Berlin', titre: 'Directrice' },
  { prenom: 'Elise', nom: 'Vincent', entreprise: 'Le Monde', titre: 'Journaliste defense' },
  { prenom: 'Nicolas', nom: 'Henin', entreprise: 'Ex-otage, ecrivain', titre: 'Journaliste' },
  { prenom: 'Paula', nom: 'Music', entreprise: 'Parlement europeen', titre: 'Attachee de presse' },
  { prenom: 'Romain', nom: 'Musik', entreprise: 'France 24', titre: 'Producteur' },
  { prenom: 'Helene', nom: 'Francois', entreprise: 'RFI', titre: 'Journaliste' },
  { prenom: 'Eric', nom: 'Albert', entreprise: 'Le Monde', titre: 'Correspondant Londres' },
  { prenom: 'Cecile', nom: 'Ducourtieux', entreprise: 'Le Monde', titre: 'Journaliste Europe' },
  { prenom: 'Sylvain', nom: 'Cypel', entreprise: 'Orient XXI', titre: 'Journaliste' },
  { prenom: 'Juliette', nom: 'Meadel', entreprise: 'Mines ParisTech', titre: 'Professeure medias' },
  { prenom: 'Alain', nom: 'Frachon', entreprise: 'Le Monde (ret.)', titre: 'Editorialiste' },
  { prenom: 'Emmanuel', nom: 'Grynszpan', entreprise: 'Les Echos', titre: 'Correspondant Tel-Aviv' },
  { prenom: 'Caroline', nom: 'Roux', entreprise: 'France 5', titre: 'Presentatrice C dans l\'air' },
  { prenom: 'Thierry', nom: 'Arnaud', entreprise: 'BFMTV', titre: 'Editorialiste politique' },
  { prenom: 'Marie-Pierre', nom: 'Subtil', entreprise: 'Le Monde (ret.)', titre: 'Redactrice en chef' },
  { prenom: 'Didier', nom: 'Billion', entreprise: 'IRIS', titre: 'Directeur adjoint' },
  { prenom: 'Richard', nom: 'Werly', entreprise: 'Le Temps', titre: 'Correspondant Paris' },
  { prenom: 'Serge', nom: 'Michel', entreprise: 'Heidi.news', titre: 'Cofondateur' },
  { prenom: 'Nicole', nom: 'Bacharan', entreprise: 'Sciences Po', titre: 'Politologue' },
  { prenom: 'Marie-France', nom: 'Garaud', entreprise: 'Institut CEVIPOF', titre: 'Chercheuse associee' },
  { prenom: 'Jacques', nom: 'Rupnik', entreprise: 'Sciences Po / CERI', titre: 'Politologue Europe centrale' },
  { prenom: 'Luuk', nom: 'Van Middelaar', entreprise: 'Universite de Leiden', titre: 'Philosophe politique' },
  { prenom: 'Bruno', nom: 'Cautres', entreprise: 'Sciences Po / CEVIPOF', titre: 'Directeur de recherche' },
  { prenom: 'Yves', nom: 'Meny', entreprise: 'Institut universitaire europeen (ret.)', titre: 'President emerite' }
];

var SPECTATEUR_PRENOMS = ['Antoine','Benoit','Celine','David','Emilie','Franck','Gabrielle','Hugo','Isabelle','Julien','Karine','Louis','Marion','Nicolas','Oceane','Pierre','Quentin','Rachel','Sebastien','Therese','Ugo','Valerie','William','Xavier','Yasmine','Zoe','Alexis','Brigitte','Charles','Delphine','Etienne','Florence','Guillaume','Heloise','Ivan','Joelle','Kevin','Laure','Maxime','Noemie','Olivier','Pauline','Remi','Sandrine','Thibaut','Ursula','Vincent','Wendy','Yannick','Aurelie','Baptiste','Clemence','Damien','Elsa','Fabien','Gaelle','Herve','Ines','Jerome','Katia','Leo','Margot','Nathan','Ophelie','Pascal','Raphael','Solene','Tristan','Violaine','Albert','Berenice','Christophe','Diane','Edgar','Fanny','Gregoire','Hortense','Idriss','Juliette','Karl','Lena','Mathis','Nadege','Patrice','Romane','Stephane','Tatiana','Ulysse','Victoire','Achille','Bernard','Colette','Denis','Eva','Fernand','Gisele','Harold','Irene','Jean','Klaus','Lucie','Marcel','Nelly','Oriane','Philippe','Rosa','Simone','Theo','Ursule','Andre','Blanche','Cyrille','Daphne','Ernest','Flore','Gaston','Henriette','Iris','Jules','Lise','Maurice','Norbert','Odile','Prosper','Roger','Sarah','Thomas','Viviane','Armand','Berthe','Claude','Denise','Edouard','Francoise','Gilbert','Huguette','Joel','Louise','Michel','Odette','Paul','Roland','Suzanne','Thierry','Yvette','Agathe','Bastien','Coralie','Dylan','Elena','Felix','Gwendoline','Hippolyte','Jade','Leonard'];
var SPECTATEUR_NOMS = ['Dupont','Martin','Bernard','Thomas','Petit','Robert','Richard','Durand','Dubois','Moreau','Laurent','Simon','Michel','Lefebvre','Leroy','Roux','David','Bertrand','Morel','Fournier','Girard','Bonnet','Dupuis','Lambert','Fontaine','Rousseau','Vincent','Muller','Lefevre','Faure','Andre','Mercier','Blanc','Guerin','Boyer','Garnier','Chevalier','Francois','Legrand','Gauthier','Garcia','Perrin','Robin','Clement','Morin','Nicolas','Henry','Roussel','Mathieu','Gautier','Masson','Marchand','Duval','Denis','Lemaire','Noel','Meyer','Dufour','Meunier','Brun','Blanchard','Giraud','Joly','Riviere','Lucas','Brunet','Gaillard','Barbier','Arnaud','Martinez','Gerard','Schmitt','Collet','Wagner','Keller','Weber','Fischer','Muller','Braun','Hartmann','Zimmermann','Lang','Walter','Wolff','Stein','Frank','Baumann','Beck','Winter','Schwartz','Gross','Kraus','Schiller','Pfeiffer','Moser','Herman','Reiter','Neumann','Koch','Bauer','Schulz'];
var SPECTATEUR_ENTREPRISES = ['','Universite de Strasbourg','Lycee Kleber Strasbourg','IEP Paris','CNRS','Universite de Lorraine','etudiant Sciences Po','Citoyen','Universite de Mulhouse','Retraite','Enseignant','etudiant INSA','etudiant IEP Strasbourg','Avocat','Medecin','Ingenieur','Architecte','Consultant','Fonctionnaire','Entreprise','Libraire','Editeur','Photographe','Artiste','Militaire (ret.)','Enseignant-chercheur','Etudiant EHESS','Etudiant ENA','Doctorant','Post-doctorant','Association citoyenne','ONG','Chercheur independant','Auto-entrepreneur','Startup','PME','Artisan','Commercant','Benevole','Retraite education','Retraite fonction publique','Fonctionnaire europeen'];

var SESSIONS_IDS = [];
for (var si = 1; si <= 32; si++) SESSIONS_IDS.push(si);

var REGIMES = ['standard','vegetarien','vegan','sans-gluten','halal','casher','autre'];

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomSessions(count) {
  var s = SESSIONS_IDS.slice();
  for (var i = s.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = s[i]; s[i] = s[j]; s[j] = t; }
  return s.slice(0, count).sort(function(a,b){return a-b;});
}
function randomTime(day) {
  var hours = [8,9,9,10,10,11,11,12,13,14,14,15,15,16,17];
  var h = randomFrom(hours);
  var m = Math.floor(Math.random() * 60);
  var baseDate = new Date(2027, 2, 16 + day);
  baseDate.setHours(h, m, 0, 0);
  return baseDate.toISOString();
}
function randomEmail(prenom, nom) {
  var domains = ['gmail.com','outlook.fr','orange.fr','free.fr','yahoo.fr','protonmail.com','wanadoo.fr','laposte.net'];
  var clean = function(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z]/g,''); };
  return clean(prenom) + '.' + clean(nom) + '@' + randomFrom(domains);
}
function randomPhone() {
  return '06 ' + String(10 + Math.floor(Math.random() * 90)) + ' ' + String(10 + Math.floor(Math.random() * 90)) + ' ' + String(10 + Math.floor(Math.random() * 90)) + ' ' + String(10 + Math.floor(Math.random() * 90));
}

function generateParticipants() {
  var participants = [];
  var id = 1;

  // 20 VIP
  VIP_NAMES.forEach(function(v) {
    var p = {
      id: 'RVGS-' + String(id).padStart(3, '0'),
      prenom: v.prenom, nom: v.nom,
      email: randomEmail(v.prenom, v.nom),
      tel: randomPhone(),
      entreprise: v.entreprise,
      titre: v.titre,
      pass: 'vip',
      sessions: randomSessions(8 + Math.floor(Math.random() * 8)),
      repas: 'standard',
      regime: randomFrom(['standard','standard','standard','vegetarien']),
      allergies: '',
      hotel: Math.floor(Math.random() * 8) + 1,
      jours: [1,2,3],
      statut: 'confirmed',
      date: '2027-01-' + String(10 + Math.floor(Math.random() * 20)).padStart(2,'0'),
      checkedIn: Math.random() < 0.85,
      scanTime: null
    };
    if (p.checkedIn) p.scanTime = randomTime(3);
    id++;
    participants.push(p);
  });

  // 30 Speakers
  SPEAKER_NAMES.forEach(function(v) {
    var p = {
      id: 'RVGS-' + String(id).padStart(3, '0'),
      prenom: v.prenom, nom: v.nom,
      email: randomEmail(v.prenom, v.nom),
      tel: randomPhone(),
      entreprise: v.entreprise,
      titre: v.titre,
      pass: 'speaker',
      sessions: randomSessions(4 + Math.floor(Math.random() * 6)),
      repas: 'standard',
      regime: randomFrom(['standard','standard','vegetarien','vegan']),
      allergies: Math.random() < 0.1 ? 'Noix' : '',
      hotel: Math.floor(Math.random() * 8) + 1,
      jours: [1,2,3],
      statut: 'confirmed',
      date: '2026-12-' + String(1 + Math.floor(Math.random() * 28)).padStart(2,'0'),
      checkedIn: Math.random() < 0.9,
      scanTime: null
    };
    if (p.checkedIn) p.scanTime = randomTime(3);
    id++;
    participants.push(p);
  });

  // 50 Invites
  INVITE_NAMES.forEach(function(v) {
    var p = {
      id: 'RVGS-' + String(id).padStart(3, '0'),
      prenom: v.prenom, nom: v.nom,
      email: randomEmail(v.prenom, v.nom),
      tel: randomPhone(),
      entreprise: v.entreprise,
      titre: v.titre,
      pass: 'invite',
      sessions: randomSessions(4 + Math.floor(Math.random() * 5)),
      repas: 'standard',
      regime: randomFrom(['standard','standard','standard','halal','vegetarien']),
      allergies: Math.random() < 0.08 ? randomFrom(['Arachides','Lactose','Gluten','Fruits de mer']) : '',
      hotel: Math.random() < 0.4 ? Math.floor(Math.random() * 8) + 1 : null,
      jours: [1,2,3],
      statut: 'confirmed',
      date: '2027-01-' + String(1 + Math.floor(Math.random() * 28)).padStart(2,'0'),
      checkedIn: Math.random() < 0.8,
      scanTime: null
    };
    if (p.checkedIn) p.scanTime = randomTime(3);
    id++;
    participants.push(p);
  });

  // 150 Spectateurs
  var usedNames = {};
  for (var i = 0; i < 150; i++) {
    var prenom, nom, key;
    do {
      prenom = SPECTATEUR_PRENOMS[i % SPECTATEUR_PRENOMS.length];
      nom = SPECTATEUR_NOMS[Math.floor(Math.random() * SPECTATEUR_NOMS.length)];
      key = prenom + nom;
    } while (usedNames[key]);
    usedNames[key] = true;

    var p = {
      id: 'RVGS-' + String(id).padStart(3, '0'),
      prenom: prenom, nom: nom,
      email: randomEmail(prenom, nom),
      tel: randomPhone(),
      entreprise: randomFrom(SPECTATEUR_ENTREPRISES),
      titre: '',
      pass: 'spectateur',
      sessions: randomSessions(3 + Math.floor(Math.random() * 6)),
      repas: 'standard',
      regime: randomFrom(['standard','standard','standard','standard','vegetarien','vegan','halal','sans-gluten']),
      allergies: Math.random() < 0.06 ? randomFrom(['Arachides','Lactose','Gluten','Crustaces','Oeufs','Soja']) : '',
      hotel: Math.random() < 0.15 ? Math.floor(Math.random() * 8) + 1 : null,
      jours: Math.random() < 0.5 ? [1,2,3] : Math.random() < 0.5 ? [2,3] : [3],
      statut: Math.random() < 0.95 ? 'confirmed' : 'pending',
      date: '2027-02-' + String(1 + Math.floor(Math.random() * 28)).padStart(2,'0'),
      checkedIn: Math.random() < 0.75,
      scanTime: null
    };
    if (p.checkedIn) p.scanTime = randomTime(3);
    id++;
    participants.push(p);
  }

  return participants;
}

// Initialize 250 participants in localStorage
function initRVGSParticipants() {
  var key = 'congres_inscriptions';
  var existing = localStorage.getItem(key);
  var existingData = [];
  try { existingData = JSON.parse(existing); } catch(e) {}
  // Only seed if less than 50 participants (i.e. not yet seeded)
  if (!existingData || existingData.length < 50) {
    var participants = generateParticipants();
    localStorage.setItem(key, JSON.stringify(participants));
    // Also update the CONGRES object
    if (window.CONGRES && window.CONGRES.saveInscriptions) {
      window.CONGRES.saveInscriptions(participants);
    }
  }
}

initRVGSParticipants();

// ═══════════════════════════════════════════════════════
// TASK 4: BADGE COLORS BY TYPE
// ═══════════════════════════════════════════════════════
window.generateRVGSBadge = function(participant) {
  var pass = RVGS_PASSES.find(function(p) { return p.id === participant.pass; }) || RVGS_PASSES[3];
  var borderColor, headerBg, accessText;
  switch (participant.pass) {
    case 'vip': borderColor = '#DC2626'; headerBg = 'linear-gradient(135deg, #8B0000, #DC2626)'; accessText = 'ACCES TOUTES ZONES'; break;
    case 'speaker': borderColor = '#F59E0B'; headerBg = 'linear-gradient(135deg, #B8860B, #F59E0B)'; accessText = 'BACKSTAGE + CONFERENCES'; break;
    case 'invite': borderColor = '#3B82F6'; headerBg = 'linear-gradient(135deg, #1E40AF, #3B82F6)'; accessText = 'ZONES RESERVEES'; break;
    default: borderColor = '#9CA3AF'; headerBg = 'linear-gradient(135deg, #4B5563, #9CA3AF)'; accessText = 'CONFERENCES'; break;
  }

  var qr = '';
  if (typeof generateQRSVG === 'function') { qr = generateQRSVG(participant.id + '-' + participant.nom + '-' + participant.pass, 140); }

  return '<div style="background:#FFF;border-radius:20px;padding:0;max-width:400px;margin:0 auto;text-align:center;position:relative;border:4px solid ' + borderColor + ';overflow:hidden;" id="badge-print-area">' +
    '<div style="background:' + headerBg + ';padding:16px;color:#FFF;">' +
      '<div style="font-size:1.1rem;font-weight:800;">RVGS 2027</div>' +
      '<div style="font-size:.72rem;opacity:.8;">Rendez-vous Geopolitiques de Strasbourg</div>' +
      '<div style="font-size:.68rem;opacity:.7;">19-22 mars 2027 — Palais de la Musique et des Congres</div>' +
    '</div>' +
    '<div style="padding:20px 24px;">' +
      '<div style="width:72px;height:72px;border-radius:50%;background:' + headerBg + ';margin:0 auto 10px;display:flex;align-items:center;justify-content:center;font-size:1.6rem;font-weight:800;color:#FFF;">' +
        (participant.prenom ? participant.prenom[0] : '') + (participant.nom ? participant.nom[0] : '') +
      '</div>' +
      '<div style="font-size:1.2rem;font-weight:800;color:#111;">' + (participant.titre ? participant.titre + ' ' : '') + participant.prenom + ' ' + participant.nom + '</div>' +
      '<div style="font-size:.82rem;color:#666;">' + (participant.entreprise || '') + '</div>' +
      '<div style="display:inline-block;padding:6px 20px;border-radius:8px;font-size:.85rem;font-weight:800;margin:12px 0;background:' + pass.couleur + ';color:' + pass.textColor + ';">' + pass.emoji + ' ' + pass.nom + '</div>' +
      '<div style="font-size:.72rem;font-weight:700;color:' + borderColor + ';letter-spacing:1px;margin-bottom:10px;">' + accessText + '</div>' +
      '<div style="margin:12px auto;max-width:140px;">' + qr + '</div>' +
      '<div style="font-size:.68rem;color:#999;">' + participant.id + '</div>' +
    '</div>' +
  '</div>';
};

// Override the old generateBadge if it exists
window.generateBadge = window.generateRVGSBadge;

// ═══════════════════════════════════════════════════════
// TASK 5: NOTIFICATIONS ON SCAN
// ═══════════════════════════════════════════════════════
var NOTIF_KEY = 'rvgs_notifications';

function loadNotifications() {
  try { return JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]'); } catch(e) { return []; }
}
function saveNotifications(n) { localStorage.setItem(NOTIF_KEY, JSON.stringify(n)); }

function addScanNotification(participant) {
  var pass = RVGS_PASSES.find(function(p) { return p.id === participant.pass; }) || RVGS_PASSES[3];
  var now = new Date();
  var timeStr = now.getHours().toString().padStart(2,'0') + 'h' + now.getMinutes().toString().padStart(2,'0');
  var notif = {
    id: Date.now(),
    emoji: pass.emoji,
    type: pass.nom,
    name: (participant.titre ? participant.titre + ' ' : '') + participant.prenom + ' ' + participant.nom,
    message: 'vient d\'arriver',
    time: timeStr,
    timestamp: now.toISOString(),
    passId: participant.pass
  };
  var notifs = loadNotifications();
  notifs.unshift(notif);
  if (notifs.length > 200) notifs = notifs.slice(0, 200);
  saveNotifications(notifs);
  return notif;
}

// Pre-fill notifications for Day 3
function initDemoNotifications() {
  if (localStorage.getItem(NOTIF_KEY)) return;
  var ins = [];
  try { ins = JSON.parse(localStorage.getItem('congres_inscriptions') || '[]'); } catch(e) {}
  var notifs = [];
  var checked = ins.filter(function(p) { return p.checkedIn; });
  checked.forEach(function(p) {
    var pass = RVGS_PASSES.find(function(x) { return x.id === p.pass; }) || RVGS_PASSES[3];
    var t = p.scanTime ? new Date(p.scanTime) : new Date(2027, 2, 21, 8 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
    notifs.push({
      id: Date.now() + Math.random(),
      emoji: pass.emoji,
      type: pass.nom,
      name: (p.titre ? p.titre + ' ' : '') + p.prenom + ' ' + p.nom,
      message: 'vient d\'arriver',
      time: t.getHours().toString().padStart(2,'0') + 'h' + t.getMinutes().toString().padStart(2,'0'),
      timestamp: t.toISOString(),
      passId: p.pass
    });
  });
  notifs.sort(function(a,b) { return b.timestamp.localeCompare(a.timestamp); });
  saveNotifications(notifs.slice(0, 200));
}

// Expose for scan integration
window.RVGS_NOTIF = { add: addScanNotification, load: loadNotifications, save: saveNotifications };

// Notifications admin section
SPA_INIT['notifications'] = function() {
  var el = document.getElementById('section-notifications');
  var notifs = loadNotifications();
  var html = '<div class="erp-content"><h2 class="panel-title" style="color:#C9A84C;">Notifications en direct</h2>';
  html += '<div style="margin-bottom:16px;display:flex;gap:10px;flex-wrap:wrap;">';
  html += '<button onclick="document.getElementById(\'notif-feed\').innerHTML=\'\';localStorage.removeItem(\'' + NOTIF_KEY + '\');" style="padding:8px 16px;background:rgba(220,38,38,.12);color:#DC2626;border:1px solid rgba(220,38,38,.2);border-radius:8px;font-size:.82rem;font-weight:700;cursor:pointer;">Effacer tout</button>';
  html += '<span style="font-size:.82rem;color:#9B978F;padding:8px;">' + notifs.length + ' notifications</span>';
  html += '</div>';
  html += '<div id="notif-feed" style="max-height:70vh;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">';
  notifs.slice(0, 100).forEach(function(n) {
    var bgColor = n.passId === 'vip' ? 'rgba(220,38,38,.08)' : n.passId === 'speaker' ? 'rgba(245,158,11,.08)' : n.passId === 'invite' ? 'rgba(59,130,246,.08)' : 'rgba(156,163,175,.05)';
    var borderCol = n.passId === 'vip' ? '#DC2626' : n.passId === 'speaker' ? '#F59E0B' : n.passId === 'invite' ? '#3B82F6' : '#6B7280';
    html += '<div style="padding:12px 16px;background:' + bgColor + ';border-left:4px solid ' + borderCol + ';border-radius:8px;">';
    html += '<span style="font-weight:700;">' + n.emoji + ' ' + n.type + '</span> — ';
    html += '<span style="color:#E8E4DC;">' + n.name + '</span> ';
    html += '<span style="color:#9B978F;">' + n.message + '</span> — ';
    html += '<span style="color:#C9A84C;font-weight:600;">' + n.time + '</span>';
    html += '</div>';
  });
  html += '</div></div>';
  el.innerHTML = html;
};

// ═══════════════════════════════════════════════════════
// TASK 6: SOIREE DE GALA + GRAND FINALE
// ═══════════════════════════════════════════════════════
// These events are added to the extra module data
function addGalaFinaleEvents() {
  var LS_KEY = 'congres_extra_data';
  var data;
  try { data = JSON.parse(localStorage.getItem(LS_KEY)); } catch(e) {}
  if (!data || !data.events) return;

  // Check if gala already added
  var hasGala = data.events.some(function(e) { return e.id === 'GALA'; });
  if (hasGala) return;

  data.events.push({
    id: 'GALA',
    name: 'Soiree de Gala — Les batailles de l\'eau',
    date: '2027-03-21',
    time: '19:30',
    lieu: 'Hotel de Ville de Strasbourg',
    max: 120,
    reservations: [],
    description: 'Cocktail d\'accueil 19h30 | Diner de gala 20h30 (menu 3 services, accord mets-vins d\'Alsace) | Discours de cloture par Pierre Haski | Remise du Prix RVGS du meilleur livre geopolitique | Concert : Ensemble de musique de chambre du Conservatoire de Strasbourg | Dress code : tenue de soiree | Sur invitation uniquement'
  });

  data.events.push({
    id: 'FINALE',
    name: 'Grand Finale — Journee mondiale de l\'eau',
    date: '2027-03-22',
    time: '10:00',
    lieu: 'Parlement europeen',
    max: 500,
    reservations: [],
    description: 'Projection du film "Water Wars" (documentaire inedit) | Table ronde finale avec les intervenants cles | Signature de la "Declaration de Strasbourg sur l\'eau" | Cloture officielle par le Maire de Strasbourg'
  });

  // Pre-fill some gala reservations (VIP + speakers)
  var ins = [];
  try { ins = JSON.parse(localStorage.getItem('congres_inscriptions') || '[]'); } catch(e) {}
  var galaCount = 0;
  ins.forEach(function(p) {
    if ((p.pass === 'vip' || p.pass === 'speaker') && galaCount < 80) {
      data.reservations.push({
        id: 'RG-' + String(galaCount + 1).padStart(3,'0'),
        name: (p.titre ? p.titre + ' ' : '') + p.prenom + ' ' + p.nom,
        email: p.email,
        phone: p.tel,
        eventId: 'GALA',
        scanned: Math.random() < 0.6,
        scanTime: Math.random() < 0.6 ? '2027-03-21T19:' + String(30 + Math.floor(Math.random() * 30)).padStart(2,'0') + ':00' : null
      });
      galaCount++;
    }
  });

  // Pre-fill finale reservations
  var finaleCount = 0;
  ins.forEach(function(p) {
    if (finaleCount < 200) {
      data.reservations.push({
        id: 'RF-' + String(finaleCount + 1).padStart(3,'0'),
        name: p.prenom + ' ' + p.nom,
        email: p.email,
        phone: p.tel,
        eventId: 'FINALE',
        scanned: false,
        scanTime: null
      });
      finaleCount++;
    }
  });

  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

// ═══════════════════════════════════════════════════════
// TASK 7: DIETARY MANAGEMENT (admin section)
// ═══════════════════════════════════════════════════════
SPA_INIT['regimes'] = function() {
  var el = document.getElementById('section-regimes');
  var ins = [];
  try { ins = JSON.parse(localStorage.getItem('congres_inscriptions') || '[]'); } catch(e) {}

  var regimeCounts = {};
  var allergiesList = [];
  ins.forEach(function(p) {
    var r = p.regime || 'standard';
    regimeCounts[r] = (regimeCounts[r] || 0) + 1;
    if (p.allergies && p.allergies.trim()) {
      allergiesList.push({ name: p.prenom + ' ' + p.nom, pass: p.pass, allergie: p.allergies });
    }
  });

  var regimeLabels = {
    standard: 'Standard',
    vegetarien: 'Vegetarien',
    vegan: 'Vegan',
    'sans-gluten': 'Sans gluten',
    halal: 'Halal',
    casher: 'Casher',
    autre: 'Autre'
  };

  var html = '<div class="erp-content"><h2 class="panel-title" style="color:#C9A84C;">Regimes alimentaires — Synthese traiteur</h2>';

  // KPIs
  html += '<div class="kpi-grid">';
  html += '<div class="kpi-card"><div class="kpi-value">' + ins.length + '</div><div class="kpi-label">Total participants</div></div>';
  Object.keys(regimeLabels).forEach(function(k) {
    if (regimeCounts[k]) {
      html += '<div class="kpi-card"><div class="kpi-value">' + regimeCounts[k] + '</div><div class="kpi-label">' + regimeLabels[k] + '</div></div>';
    }
  });
  html += '</div>';

  // Detailed table by type
  var passTypes = ['vip','speaker','invite','spectateur'];
  var passLabels = { vip: 'VIP', speaker: 'Speaker', invite: 'Invite', spectateur: 'Spectateur' };

  html += '<div class="erp-section-card" style="margin-top:20px;"><h3 style="color:#C9A84C;margin-bottom:16px;">Repartition par type de pass</h3>';
  html += '<table class="erp-table"><thead><tr><th>Regime</th>';
  passTypes.forEach(function(pt) { html += '<th>' + passLabels[pt] + '</th>'; });
  html += '<th>Total</th></tr></thead><tbody>';

  Object.keys(regimeLabels).forEach(function(r) {
    if (!regimeCounts[r]) return;
    html += '<tr><td><strong>' + regimeLabels[r] + '</strong></td>';
    var total = 0;
    passTypes.forEach(function(pt) {
      var count = ins.filter(function(p) { return (p.regime || 'standard') === r && p.pass === pt; }).length;
      total += count;
      html += '<td>' + count + '</td>';
    });
    html += '<td><strong>' + total + '</strong></td></tr>';
  });
  html += '</tbody></table></div>';

  // Allergies
  if (allergiesList.length > 0) {
    html += '<div class="erp-section-card" style="margin-top:20px;"><h3 style="color:#DC2626;margin-bottom:16px;">Allergies declarees (' + allergiesList.length + ')</h3>';
    html += '<table class="erp-table"><thead><tr><th>Nom</th><th>Pass</th><th>Allergie</th></tr></thead><tbody>';
    allergiesList.forEach(function(a) {
      html += '<tr><td>' + a.name + '</td><td>' + a.pass.toUpperCase() + '</td><td style="color:#DC2626;font-weight:700;">' + a.allergie + '</td></tr>';
    });
    html += '</tbody></table></div>';
  }

  // Export button
  html += '<div style="margin-top:16px;"><button onclick="RVGS_REGIMES_EXPORT()" style="padding:10px 20px;background:#C9A84C;color:#111;border:none;border-radius:10px;font-size:.85rem;font-weight:700;cursor:pointer;">Exporter CSV traiteur</button></div>';

  html += '</div>';
  el.innerHTML = html;
};

window.RVGS_REGIMES_EXPORT = function() {
  var ins = [];
  try { ins = JSON.parse(localStorage.getItem('congres_inscriptions') || '[]'); } catch(e) {}
  var csv = 'Nom,Prenom,Pass,Regime,Allergies\n';
  ins.forEach(function(p) {
    csv += [p.nom, p.prenom, p.pass, p.regime || 'standard', p.allergies || ''].join(',') + '\n';
  });
  var b = new Blob([csv], {type:'text/csv'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = 'regimes_alimentaires_rvgs2027.csv';
  a.click();
};

// ═══════════════════════════════════════════════════════
// TASK 8: SURVEY POST-EVENT
// ═══════════════════════════════════════════════════════
var SURVEY_KEY = 'rvgs_survey_responses';

function loadSurveys() { try { return JSON.parse(localStorage.getItem(SURVEY_KEY) || '[]'); } catch(e) { return []; } }
function saveSurveys(s) { localStorage.setItem(SURVEY_KEY, JSON.stringify(s)); }

// Pre-fill with 30 demo responses
function initDemoSurveys() {
  if (localStorage.getItem(SURVEY_KEY)) return;
  var conferences = [
    'Les batailles de l\'eau — Ouverture',
    'Table ronde sur la defense europeenne',
    'Cyberguerre et souverainete numerique',
    'Le defi climatique — Valerie Masson-Delmotte',
    'Medias et desinformation — Pierre Haski',
    'L\'avenir de l\'UE — Thomas Piketty',
    'Migrations et geopolitique',
    'Grand debat — Quelle eau pour 2050 ?',
    'Soiree de Gala',
    'Grand Finale — Parlement europeen'
  ];
  var comments = [
    'Excellent festival, bravo pour l\'organisation !',
    'Les intervenants etaient de tres haut niveau.',
    'J\'aurais aime plus de temps pour les questions.',
    'La soiree de gala etait magnifique.',
    'Tres bonne ambiance, Strasbourg est la ville ideale.',
    'Manque de signaletique dans le Palais des Congres.',
    'Pierre Haski etait brillant comme toujours.',
    'Le documentaire Water Wars m\'a bouleverse.',
    'J\'ai adore les tables rondes thematiques.',
    'Organisation impeccable, a refaire chaque annee !',
    'Le wifi etait parfois lent dans les salles.',
    'Les pauses cafe auraient pu etre plus longues.',
    'Festival a recommander absolument !',
    'Un niveau d\'intervenants exceptionnel.',
    'La Declaration de Strasbourg est un moment historique.'
  ];
  var improvements = [
    'Plus de place pour les questions du public',
    'Ameliorer le wifi',
    'Plus de sessions en anglais',
    'Ajouter une application mobile',
    'Plus de sessions le samedi',
    'Proposer des sous-titres en direct',
    'Plus d\'ateliers interactifs',
    'Ameliorer la signaletique',
    'Plus de sessions sur l\'Afrique',
    'Proposer du streaming en ligne'
  ];
  var demos = [];
  for (var i = 0; i < 30; i++) {
    demos.push({
      id: 'SRV-' + String(i + 1).padStart(3, '0'),
      note: 3 + Math.floor(Math.random() * 3),
      bestConf: randomFrom(conferences),
      improve: randomFrom(improvements),
      nps: 6 + Math.floor(Math.random() * 5),
      comment: Math.random() < 0.7 ? randomFrom(comments) : '',
      date: '2027-03-22T' + String(14 + Math.floor(Math.random() * 8)) + ':' + String(Math.floor(Math.random() * 60)).padStart(2,'0') + ':00'
    });
  }
  saveSurveys(demos);
}

// Admin survey section
SPA_INIT['enquete'] = function() {
  var el = document.getElementById('section-enquete');
  var surveys = loadSurveys();

  var avgNote = 0, avgNPS = 0;
  if (surveys.length > 0) {
    surveys.forEach(function(s) { avgNote += s.note; avgNPS += s.nps; });
    avgNote = (avgNote / surveys.length).toFixed(1);
    avgNPS = (avgNPS / surveys.length).toFixed(1);
  }

  // NPS categories
  var promoters = surveys.filter(function(s) { return s.nps >= 9; }).length;
  var detractors = surveys.filter(function(s) { return s.nps <= 6; }).length;
  var npsScore = surveys.length > 0 ? Math.round((promoters - detractors) / surveys.length * 100) : 0;

  // Best conf ranking
  var confCounts = {};
  surveys.forEach(function(s) { if (s.bestConf) confCounts[s.bestConf] = (confCounts[s.bestConf] || 0) + 1; });
  var confRanked = Object.keys(confCounts).sort(function(a,b) { return confCounts[b] - confCounts[a]; });

  var html = '<div class="erp-content"><h2 class="panel-title" style="color:#C9A84C;">Enquete post-evenement — Resultats</h2>';

  // KPIs
  html += '<div class="kpi-grid">';
  html += '<div class="kpi-card"><div class="kpi-value">' + surveys.length + '</div><div class="kpi-label">Reponses</div></div>';
  html += '<div class="kpi-card"><div class="kpi-value">' + avgNote + '/5</div><div class="kpi-label">Note moyenne</div></div>';
  html += '<div class="kpi-card ' + (npsScore >= 50 ? 'success' : npsScore >= 0 ? '' : 'danger') + '"><div class="kpi-value">' + npsScore + '</div><div class="kpi-label">NPS Score</div></div>';
  html += '<div class="kpi-card"><div class="kpi-value">' + avgNPS + '/10</div><div class="kpi-label">Recommandation moy.</div></div>';
  html += '</div>';

  // Top conferences
  if (confRanked.length > 0) {
    html += '<div class="erp-section-card" style="margin-top:20px;"><h3 style="color:#C9A84C;">Meilleures conferences</h3>';
    confRanked.slice(0, 5).forEach(function(c, i) {
      html += '<div style="padding:8px 12px;background:rgba(201,168,76,.05);border-radius:8px;margin-bottom:6px;font-size:.88rem;">';
      html += '<span style="color:#C9A84C;font-weight:800;">#' + (i + 1) + '</span> ' + c + ' <span style="color:#9B978F;">(' + confCounts[c] + ' votes)</span>';
      html += '</div>';
    });
    html += '</div>';
  }

  // Responses table
  html += '<div class="erp-section-card" style="margin-top:20px;"><h3 style="color:#C9A84C;">Toutes les reponses</h3>';
  html += '<table class="erp-table"><thead><tr><th>Date</th><th>Note</th><th>Meilleure conf.</th><th>A ameliorer</th><th>NPS</th><th>Commentaire</th></tr></thead><tbody>';
  surveys.slice().reverse().forEach(function(s) {
    var stars = '';
    for (var i = 0; i < 5; i++) stars += i < s.note ? '\u2B50' : '\u2606';
    html += '<tr><td>' + new Date(s.date).toLocaleDateString('fr-FR') + '</td><td>' + stars + '</td><td style="max-width:200px;">' + (s.bestConf || '-') + '</td><td style="max-width:200px;">' + (s.improve || '-') + '</td><td>' + s.nps + '/10</td><td style="max-width:250px;font-size:.8rem;">' + (s.comment || '-') + '</td></tr>';
  });
  html += '</tbody></table></div>';

  html += '</div>';
  el.innerHTML = html;
};

// Public survey form
SPA_INIT['enquete-public'] = function() {
  var el = document.getElementById('section-enquete-public');
  el.innerHTML = '<section class="section" style="max-width:700px;">' +
    '<span class="section-label section-label-green">Votre avis</span>' +
    '<h1 class="section-title">Enquete de satisfaction — RVGS 2027</h1>' +
    '<p class="section-subtitle">Votre retour est precieux pour ameliorer les prochaines editions.</p>' +
    '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:24px;margin-top:20px;">' +
      '<div class="form-group"><label style="color:#C9A84C;font-weight:700;">Note globale</label>' +
        '<div id="survey-stars" style="font-size:2rem;cursor:pointer;display:flex;gap:4px;">' +
          '<span onclick="RVGS_SURVEY.setNote(1)" data-star="1">\u2606</span>' +
          '<span onclick="RVGS_SURVEY.setNote(2)" data-star="2">\u2606</span>' +
          '<span onclick="RVGS_SURVEY.setNote(3)" data-star="3">\u2606</span>' +
          '<span onclick="RVGS_SURVEY.setNote(4)" data-star="4">\u2606</span>' +
          '<span onclick="RVGS_SURVEY.setNote(5)" data-star="5">\u2606</span>' +
        '</div>' +
      '</div>' +
      '<div class="form-group"><label style="color:#FFF;">Meilleure conference / evenement</label>' +
        '<input type="text" id="survey-best" placeholder="Quel evenement vous a le plus marque ?" style="width:100%;padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:#252547;color:#FFF;font-size:.88rem;">' +
      '</div>' +
      '<div class="form-group"><label style="color:#FFF;">Points a ameliorer</label>' +
        '<textarea id="survey-improve" rows="3" placeholder="Que pourrions-nous ameliorer ?" style="width:100%;padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:#252547;color:#FFF;font-size:.88rem;resize:vertical;"></textarea>' +
      '</div>' +
      '<div class="form-group"><label style="color:#FFF;">Recommanderiez-vous le festival ? (0-10)</label>' +
        '<input type="range" id="survey-nps" min="0" max="10" value="8" oninput="document.getElementById(\'nps-val\').textContent=this.value+\'/10\'" style="width:100%;accent-color:#C9A84C;">' +
        '<div id="nps-val" style="text-align:center;color:#C9A84C;font-weight:700;">8/10</div>' +
      '</div>' +
      '<div class="form-group"><label style="color:#FFF;">Commentaire libre</label>' +
        '<textarea id="survey-comment" rows="3" placeholder="Partagez vos impressions..." style="width:100%;padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:#252547;color:#FFF;font-size:.88rem;resize:vertical;"></textarea>' +
      '</div>' +
      '<button onclick="RVGS_SURVEY.submit()" style="width:100%;padding:14px;border-radius:12px;background:#C9A84C;color:#111;font-weight:800;font-size:1rem;border:none;cursor:pointer;margin-top:12px;">Envoyer mon avis</button>' +
      '<div id="survey-msg" style="margin-top:12px;text-align:center;"></div>' +
    '</div>' +
  '</section>';

  window.RVGS_SURVEY = {
    note: 0,
    setNote: function(n) {
      this.note = n;
      document.querySelectorAll('#survey-stars span').forEach(function(s) {
        s.textContent = parseInt(s.dataset.star) <= n ? '\u2B50' : '\u2606';
      });
    },
    submit: function() {
      if (this.note === 0) { alert('Veuillez donner une note.'); return; }
      var response = {
        id: 'SRV-' + Date.now(),
        note: this.note,
        bestConf: document.getElementById('survey-best').value.trim(),
        improve: document.getElementById('survey-improve').value.trim(),
        nps: parseInt(document.getElementById('survey-nps').value),
        comment: document.getElementById('survey-comment').value.trim(),
        date: new Date().toISOString()
      };
      var surveys = loadSurveys();
      surveys.push(response);
      saveSurveys(surveys);
      document.getElementById('survey-msg').innerHTML = '<div style="padding:16px;background:rgba(34,197,94,.12);border:1px solid #22C55E;border-radius:12px;color:#22C55E;font-weight:700;">Merci pour votre retour !</div>';
    }
  };
};

// ═══════════════════════════════════════════════════════
// TASK 9: SOCIAL WALL
// ═══════════════════════════════════════════════════════
var SOCIAL_KEY = 'rvgs_social_posts';

function loadPosts() { try { return JSON.parse(localStorage.getItem(SOCIAL_KEY) || '[]'); } catch(e) { return []; } }
function savePosts(p) { localStorage.setItem(SOCIAL_KEY, JSON.stringify(p)); }

// Demo posts
function initDemoPosts() {
  if (localStorage.getItem(SOCIAL_KEY)) return;
  var demoPosts = [
    { name: 'Marie Lefevre', msg: 'Quelle ouverture magistrale pour les #RVGS2027 ! Pierre Haski a donne le ton : "Il est urgent de s\'informer, de comprendre, de debattre."', approved: true },
    { name: 'Jean-Claude Dupont', msg: 'En direct du Palais des Congres de Strasbourg, ambiance electrique pour cette edition consacree aux batailles de l\'eau. #RVGS2027', approved: true },
    { name: 'Sophie Martin', msg: 'La table ronde sur la cyberguerre etait passionnante. Cedric Villani et Asma Mhalla au sommet. #RVGS2027', approved: true },
    { name: 'Etudiant Sciences Po', msg: 'Premier festival geopolitique pour moi et franchement, c\'est impressionnant. Le niveau des intervenants est incroyable.', approved: true },
    { name: 'Laurent Desbois', msg: 'ARTE est fier d\'etre partenaire des RVGS 2027. Retrouvez nos reportages sur arte.tv/rvgs #RVGS2027', approved: true },
    { name: 'Camille R.', msg: 'Valerie Masson-Delmotte a emu toute la salle en parlant du degel du permafrost. Des applaudissements a n\'en plus finir.', approved: true },
    { name: 'Thomas W.', msg: 'Water Wars : le documentaire qui va marquer cette edition. Projection au Parlement europeen samedi. A ne pas manquer !', approved: true },
    { name: 'Isabelle Haas', msg: 'Tres fiere que Strasbourg accueille cet evenement international. La ville est a la hauteur de l\'enjeu. #FierteStrasbourgeoise', approved: true },
    { name: 'Nicolas H.', msg: 'Le debat sur les migrations avec Francois Gemenne et Catherine Wihtol de Wenden — deux visions complementaires remarquables.', approved: true },
    { name: 'Lea S.', msg: 'Le salon du livre geopolitique est une pepite. J\'ai deja 5 livres dans mon sac. Merci aux editeurs presents ! #RVGS2027', approved: true },
    { name: 'Marc Trevise', msg: 'TV5 Monde couvre le festival en direct. Interviews exclusives a retrouver sur tv5monde.com #RVGS2027', approved: true },
    { name: 'Margaux Briand', msg: 'Jancovici sans filtre sur l\'energie et l\'eau. Salle comble, gens debout dans les allees. #RVGS2027', approved: true },
    { name: 'Florian K.', msg: 'En tant que Strasbourgeois, voir le Parlement europeen accueillir le Grand Finale, c\'est emouvant. #RVGS2027 #Strasbourg', approved: true },
    { name: 'Fatima El-Arabi', msg: 'Al Jazeera covering the geopolitical festival in Strasbourg. Impressive lineup of speakers. #RVGS2027', approved: true },
    { name: 'Pascal Music', msg: 'La Declaration de Strasbourg sur l\'eau sera signee demain. Un moment historique pour la diplomatie hydrique.', approved: true },
    { name: 'Etudiant INSA', msg: 'Les ateliers interactifs sont top ! On a simule une negociation sur le partage des eaux du Nil. #RVGS2027', approved: true },
    { name: 'Caroline Roux', msg: 'Speciale C dans l\'air depuis les RVGS de Strasbourg ce soir sur France 5. Ne manquez pas !', approved: true },
    { name: 'Stefan Kornelius', msg: 'Beeindruckend: Strasbourg zeigt, wie geopolitische Bildung funktionieren kann. #RVGS2027', approved: true },
    { name: 'Helene F.', msg: 'Les vins d\'Alsace au cocktail de bienvenue... la geopolitique a aussi ses moments de convivialite ! #RVGS2027', approved: true },
    { name: 'Alexandra De Hoop Scheffer', msg: 'The transatlantic dialogue session was outstanding. Strasbourg proves it is THE European hub for geopolitics. #RVGS2027', approved: true }
  ];

  var posts = demoPosts.map(function(p, i) {
    var d = new Date(2027, 2, 19 + Math.floor(i / 7));
    d.setHours(8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60));
    return {
      id: 'POST-' + String(i + 1).padStart(3, '0'),
      name: p.name,
      message: p.msg,
      approved: p.approved,
      rejected: false,
      date: d.toISOString()
    };
  });
  savePosts(posts);
}

// Public social wall
SPA_INIT['social'] = function() {
  var el = document.getElementById('section-social');
  var posts = loadPosts().filter(function(p) { return p.approved && !p.rejected; });
  posts.sort(function(a,b) { return b.date.localeCompare(a.date); });

  var html = '<section class="section" style="max-width:900px;">' +
    '<span class="section-label section-label-green">#RVGS2027</span>' +
    '<h1 class="section-title">Mur social</h1>' +
    '<p class="section-subtitle">Partagez vos impressions sur le festival avec le hashtag #RVGS2027</p>' +
    '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:20px;margin-bottom:24px;">' +
      '<div class="form-group"><label style="color:#FFF;">Votre nom</label>' +
        '<input type="text" id="social-name" placeholder="Votre nom" style="width:100%;padding:10px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:#252547;color:#FFF;font-size:.88rem;">' +
      '</div>' +
      '<div class="form-group"><label style="color:#FFF;">Votre message</label>' +
        '<textarea id="social-msg" rows="3" placeholder="Partagez votre experience au RVGS 2027..." style="width:100%;padding:10px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:#252547;color:#FFF;font-size:.88rem;resize:vertical;"></textarea>' +
      '</div>' +
      '<button onclick="RVGS_SOCIAL.post()" style="padding:10px 24px;border-radius:10px;background:#C9A84C;color:#111;font-weight:700;border:none;cursor:pointer;">Publier</button>' +
      '<div id="social-post-msg" style="margin-top:8px;"></div>' +
    '</div>' +
    '<div id="social-wall-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;">';

  posts.forEach(function(p) {
    var d = new Date(p.date);
    html += '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:16px;">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">' +
        '<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#C9A84C,#D4A843);display:flex;align-items:center;justify-content:center;font-weight:800;color:#111;font-size:.78rem;">' + (p.name ? p.name.split(' ').map(function(w){return w[0]||'';}).join('').substring(0,2) : '?') + '</div>' +
        '<div><div style="font-weight:700;color:#E8E4DC;font-size:.88rem;">' + p.name + '</div>' +
        '<div style="font-size:.72rem;color:#9B978F;">' + d.toLocaleDateString('fr-FR') + ' a ' + d.getHours().toString().padStart(2,'0') + 'h' + d.getMinutes().toString().padStart(2,'0') + '</div></div>' +
      '</div>' +
      '<p style="color:#B8B8D0;font-size:.88rem;line-height:1.6;margin:0;">' + p.message + '</p>' +
    '</div>';
  });

  html += '</div></section>';
  el.innerHTML = html;

  window.RVGS_SOCIAL = {
    post: function() {
      var name = document.getElementById('social-name').value.trim();
      var msg = document.getElementById('social-msg').value.trim();
      if (!name || !msg) { alert('Remplissez votre nom et votre message.'); return; }
      if (typeof ContentFilter !== 'undefined') {
        var cf = ContentFilter.check(msg);
        if (!cf.ok) { alert(cf.reason); return; }
        var cfn = ContentFilter.check(name);
        if (!cfn.ok) { alert(cfn.reason); return; }
      }
      var post = {
        id: 'POST-' + Date.now(),
        name: name,
        message: msg,
        approved: false,
        rejected: false,
        date: new Date().toISOString()
      };
      var posts = loadPosts();
      posts.push(post);
      savePosts(posts);
      document.getElementById('social-post-msg').innerHTML = '<div style="padding:10px;background:rgba(34,197,94,.12);border:1px solid #22C55E;border-radius:8px;color:#22C55E;font-size:.85rem;">Message envoye ! Il sera visible apres moderation.</div>';
      document.getElementById('social-name').value = '';
      document.getElementById('social-msg').value = '';
    }
  };
};

// Social wall admin (moderation)
SPA_INIT['social-admin'] = function() {
  var el = document.getElementById('section-social-admin');
  renderSocialAdmin(el);
};

function renderSocialAdmin(el) {
  if (!el) el = document.getElementById('section-social-admin');
  var posts = loadPosts();
  posts.sort(function(a,b) { return b.date.localeCompare(a.date); });

  var pending = posts.filter(function(p) { return !p.approved && !p.rejected; });
  var approved = posts.filter(function(p) { return p.approved; });
  var rejected = posts.filter(function(p) { return p.rejected; });

  var html = '<div class="erp-content"><h2 class="panel-title" style="color:#C9A84C;">Moderation du mur social #RVGS2027</h2>';

  html += '<div class="kpi-grid">';
  html += '<div class="kpi-card"><div class="kpi-value">' + posts.length + '</div><div class="kpi-label">Total posts</div></div>';
  html += '<div class="kpi-card" style="border-color:#F59E0B;"><div class="kpi-value" style="color:#F59E0B;">' + pending.length + '</div><div class="kpi-label">En attente</div></div>';
  html += '<div class="kpi-card success"><div class="kpi-value">' + approved.length + '</div><div class="kpi-label">Approuves</div></div>';
  html += '<div class="kpi-card"><div class="kpi-value" style="color:#DC2626;">' + rejected.length + '</div><div class="kpi-label">Rejetes</div></div>';
  html += '</div>';

  // Pending
  if (pending.length > 0) {
    html += '<div class="erp-section-card" style="margin-top:20px;border-left:4px solid #F59E0B;"><h3 style="color:#F59E0B;">En attente de moderation (' + pending.length + ')</h3>';
    pending.forEach(function(p) {
      html += '<div style="padding:12px;background:rgba(245,158,11,.05);border-radius:8px;margin-bottom:8px;display:flex;gap:12px;align-items:flex-start;">' +
        '<div style="flex:1;"><strong style="color:#E8E4DC;">' + p.name + '</strong> <span style="color:#9B978F;font-size:.78rem;">' + new Date(p.date).toLocaleString('fr-FR') + '</span><p style="color:#B8B8D0;margin:6px 0 0;font-size:.88rem;">' + p.message + '</p></div>' +
        '<div style="display:flex;gap:6px;flex-shrink:0;">' +
          '<button onclick="RVGS_SOCIAL_MOD.approve(\'' + p.id + '\')" style="padding:6px 12px;background:#22C55E;color:#FFF;border:none;border-radius:6px;cursor:pointer;font-weight:700;font-size:.78rem;">Approuver</button>' +
          '<button onclick="RVGS_SOCIAL_MOD.reject(\'' + p.id + '\')" style="padding:6px 12px;background:#DC2626;color:#FFF;border:none;border-radius:6px;cursor:pointer;font-weight:700;font-size:.78rem;">Rejeter</button>' +
        '</div></div>';
    });
    html += '</div>';
  }

  // Approved
  html += '<div class="erp-section-card" style="margin-top:20px;"><h3 style="color:#22C55E;">Posts approuves (' + approved.length + ')</h3>';
  html += '<table class="erp-table"><thead><tr><th>Date</th><th>Nom</th><th>Message</th><th>Action</th></tr></thead><tbody>';
  approved.slice(0, 30).forEach(function(p) {
    html += '<tr><td style="white-space:nowrap;">' + new Date(p.date).toLocaleDateString('fr-FR') + '</td><td>' + p.name + '</td><td style="max-width:400px;font-size:.82rem;">' + p.message + '</td><td><button onclick="RVGS_SOCIAL_MOD.reject(\'' + p.id + '\')" style="padding:4px 8px;background:rgba(220,38,38,.12);color:#DC2626;border:1px solid rgba(220,38,38,.2);border-radius:6px;cursor:pointer;font-size:.75rem;">Retirer</button></td></tr>';
  });
  html += '</tbody></table></div>';

  html += '</div>';
  el.innerHTML = html;
}

window.RVGS_SOCIAL_MOD = {
  approve: function(id) {
    var posts = loadPosts();
    var p = posts.find(function(x) { return x.id === id; });
    if (p) { p.approved = true; p.rejected = false; savePosts(posts); renderSocialAdmin(); }
  },
  reject: function(id) {
    var posts = loadPosts();
    var p = posts.find(function(x) { return x.id === id; });
    if (p) { p.rejected = true; p.approved = false; savePosts(posts); renderSocialAdmin(); }
  }
};

// ═══════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════
initDemoNotifications();
initDemoSurveys();
initDemoPosts();

// Delay gala/finale to ensure extra data is loaded
setTimeout(addGalaFinaleEvents, 500);

})();
