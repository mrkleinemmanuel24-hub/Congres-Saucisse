/* ═══════════════════════════════════════════════════════
   CONGRES DE LA SAUCISSE — DATA
   Speakers, Sessions, Rooms, Hotels, Demo registrations
   ═══════════════════════════════════════════════════════ */

window.CONGRES = (function() {
  'use strict';

  // ─── SALLES (Palais des Congrès de Strasbourg) ───
  var SALLES = [
    { id: 'erasme', nom: 'Salle Erasme', etage: 'RDC', capacite: 450, type: 'auditorium', equipement: 'Scène, écran géant, traduction simultanée' },
    { id: 'schweitzer', nom: 'Salle Schweitzer', etage: 'RDC', capacite: 320, type: 'auditorium', equipement: 'Scène, vidéoprojecteur, micro HF' },
    { id: 'cassin', nom: 'Salle Cassin', etage: '1er', capacite: 200, type: 'conference', equipement: 'Vidéoprojecteur, tables en U' },
    { id: 'schuman', nom: 'Salle Schuman', etage: '1er', capacite: 150, type: 'conference', equipement: 'Vidéoprojecteur, micro' },
    { id: 'curie', nom: 'Salle Curie', etage: '1er', capacite: 100, type: 'atelier', equipement: 'Tables, cuisine de démonstration' },
    { id: 'gutenberg', nom: 'Salle Gutenberg', etage: 'RDC', capacite: 80, type: 'atelier', equipement: 'Espace dégustation, réfrigérateur' },
    { id: 'kleber', nom: 'Salle Kléber', etage: 'RDC', capacite: 120, type: 'conference', equipement: 'Vidéoprojecteur, micro' },
    { id: 'tomi', nom: 'Salle Tomi Ungerer', etage: '1er', capacite: 60, type: 'reunion', equipement: 'Table ronde, écran' },
    { id: 'brandt', nom: 'Salle Willy Brandt', etage: 'RDC', capacite: 500, type: 'expo', equipement: 'Espace exposition 800m2' },
    { id: 'europe', nom: 'Hall Europe', etage: 'RDC', capacite: 300, type: 'restauration', equipement: 'Buffet, tables, service' }
  ];

  // ─── THEMATIQUES ───
  var THEMES = [
    'Histoire & Patrimoine', 'Gastronomie & Recettes', 'Nutrition & Santé',
    'Innovation & Technologie', 'Terroir & Filière', 'International',
    'Réglementation', 'Dégustation', 'Atelier pratique', 'Keynote'
  ];

  // ─── SPEAKERS (20+) ───
  var SPEAKERS = [
    { id: 1, nom: 'Jean-Marc Schaller', prenom: 'Jean-Marc', titre: 'Maître charcutier, MOF 2018', org: 'Maison Schaller, Strasbourg', bio: 'Maître charcutier depuis 35 ans, Meilleur Ouvrier de France 2018. Spécialiste des saucisses fumées traditionnelles alsaciennes. A remporté le Grand Prix de la Knack d\'Or en 2020.', theme: 'Gastronomie & Recettes', initiales: 'JS' },
    { id: 2, nom: 'Marie Koenig', prenom: 'Marie', titre: 'Historienne de l\'alimentation', org: 'Université de Strasbourg', bio: 'Professeure d\'histoire de l\'alimentation à l\'Université de Strasbourg. Auteure de "La Saucisse dans l\'Histoire : de Rome à Strasbourg" (2024). Spécialiste de la charcuterie médiévale.', theme: 'Histoire & Patrimoine', initiales: 'MK' },
    { id: 3, nom: 'Klaus Müller', prenom: 'Klaus', titre: 'Maître charcutier, Bratwurst Akademie', org: 'Bratwurst Akademie, Nuremberg', bio: 'Directeur de la Bratwurst Akademie de Nuremberg. Expert en saucisses germaniques traditionnelles. Auteur de 3 ouvrages de référence sur la Bratwurst.', theme: 'International', initiales: 'KM' },
    { id: 4, nom: 'Sophie Delacroix', prenom: 'Sophie', titre: 'Nutritionniste, Dr en sciences alimentaires', org: 'INRAE Strasbourg', bio: 'Chercheuse à l\'INRAE, spécialiste en nutrition des produits carnés. A publié 45 articles sur l\'impact nutritionnel des saucisses artisanales vs industrielles.', theme: 'Nutrition & Santé', initiales: 'SD' },
    { id: 5, nom: 'Pierre Andrieu', prenom: 'Pierre', titre: 'Chef étoilé', org: 'Restaurant Le Knack, Colmar', bio: 'Chef étoilé Michelin, pionnier de la haute gastronomie charcutière. Son restaurant "Le Knack" à Colmar sublime la saucisse alsacienne dans des créations avant-gardistes.', theme: 'Gastronomie & Recettes', initiales: 'PA' },
    { id: 6, nom: 'Isabella Rossi', prenom: 'Isabella', titre: 'Experte en saucisses italiennes', org: 'Università di Bologna', bio: 'Professeure à Bologne, spécialiste mondiale de la mortadelle et des salumi italiens. Consultante pour le consortium de la Mortadella di Bologna IGP.', theme: 'International', initiales: 'IR' },
    { id: 7, nom: 'Thomas Weber', prenom: 'Thomas', titre: 'Directeur Innovation', org: 'Fleischwerke Strasbourg', bio: 'Ingénieur alimentaire, pionnier de la saucisse végétale hybride. 12 brevets déposés. Développe des saucisses à empreinte carbone réduite de 60%.', theme: 'Innovation & Technologie', initiales: 'TW' },
    { id: 8, nom: 'Anne-Laure Fritsch', prenom: 'Anne-Laure', titre: 'Sommelière en bières', org: 'Brasserie Meteor, Hochfelden', bio: 'Première femme sommelière en bières d\'Alsace. Spécialiste des accords bière-saucisse. Collabore avec 30 charcutiers artisanaux.', theme: 'Dégustation', initiales: 'AF' },
    { id: 9, nom: 'Yuki Tanaka', prenom: 'Yuki', titre: 'Chef spécialiste saucisses japonaises', org: 'Arabiki Lab, Tokyo', bio: 'Chef japonais ayant réinventé la saucisse à la japonaise (arabiki). Ses saucisses au wasabi et au yuzu ont conquis le Japon. 3 millions de followers sur Instagram.', theme: 'International', initiales: 'YT' },
    { id: 10, nom: 'François Heim', prenom: 'François', titre: 'Président IFCC', org: 'Institut Français de la Charcuterie-Cuisine', bio: 'Président de l\'Institut Français de la Charcuterie-Cuisine depuis 2019. Défenseur du patrimoine charcutier français. Auteur de la norme NF V46-003 sur la knack.', theme: 'Terroir & Filière', initiales: 'FH' },
    { id: 11, nom: 'Elena Popova', prenom: 'Elena', titre: 'Experte réglementation UE', org: 'Commission Européenne, Bruxelles', bio: 'Fonctionnaire à la DG SANTE de la Commission Européenne. Responsable de la réglementation sur les produits de charcuterie. Architecte du règlement EU 2024/1532.', theme: 'Réglementation', initiales: 'EP' },
    { id: 12, nom: 'Marc Bertrand', prenom: 'Marc', titre: 'Éleveur porcin, Label Rouge', org: 'Ferme du Ried, Sélestat', bio: 'Éleveur de porcs Label Rouge depuis 20 ans. Pionnier de l\'élevage en plein air en Alsace. Fournisseur de 15 charcutiers artisanaux de la région.', theme: 'Terroir & Filière', initiales: 'MB' },
    { id: 13, nom: 'Charlotte Schmitt', prenom: 'Charlotte', titre: 'Food designer', org: 'Studio Miam, Paris', bio: 'Food designer primée, spécialiste du design culinaire appliqué à la charcuterie. A redessiné le packaging de 50 marques. TED Talk "The Sausage Renaissance" vu 2M fois.', theme: 'Innovation & Technologie', initiales: 'CS' },
    { id: 14, nom: 'Hans Gruber', prenom: 'Hans', titre: 'Maître fumeur traditionnel', org: 'Räucherei Gruber, Forêt-Noire', bio: 'Maître fumeur en 5e génération. Utilise exclusivement le bois de hêtre de la Forêt-Noire. Ses techniques de fumage sont classées patrimoine immatériel du Bade-Wurtemberg.', theme: 'Gastronomie & Recettes', initiales: 'HG' },
    { id: 15, nom: 'Amina Benali', prenom: 'Amina', titre: 'Chercheuse en fermentation', org: 'Institut Pasteur, Strasbourg', bio: 'Microbiologiste spécialisée dans les ferments lactiques des saucisses sèches. A identifié 3 nouvelles souches bactériennes bénéfiques pour la maturation.', theme: 'Innovation & Technologie', initiales: 'AB' },
    { id: 16, nom: 'Roberto Gonzalez', prenom: 'Roberto', titre: 'Expert chorizo & embutidos', org: 'Real Academia de Gastronomía, Madrid', bio: 'Académicien de la gastronomie espagnole. Expert mondial du chorizo ibérique. A cartographié 247 variétés régionales de chorizo en Espagne.', theme: 'International', initiales: 'RG' },
    { id: 17, nom: 'Lucie Wagner', prenom: 'Lucie', titre: 'Directrice du Musée de la Charcuterie', org: 'Musée de la Charcuterie, Strasbourg', bio: 'Directrice depuis 2020 du premier Musée de la Charcuterie en France. Commissaire de l\'exposition "Saucisse : 3000 ans d\'histoire" qui a attiré 200,000 visiteurs.', theme: 'Histoire & Patrimoine', initiales: 'LW' },
    { id: 18, nom: 'Patrick O\'Sullivan', prenom: 'Patrick', titre: 'Butcher Master, Guild of Butchers', org: 'Guild of Master Butchers, Londres', bio: 'Grand Maître de la Guilde des Bouchers de Londres. Expert en saucisses britanniques (bangers). Organisateur du World Sausage Championship depuis 2015.', theme: 'International', initiales: 'PO' },
    { id: 19, nom: 'Nathalie Rohr', prenom: 'Nathalie', titre: 'Vétérinaire inspectrice', org: 'DDPP Bas-Rhin', bio: 'Vétérinaire inspectrice à la DDPP du Bas-Rhin. 20 ans d\'expérience en contrôle sanitaire des charcuteries. Formatrice à l\'École Nationale Vétérinaire.', theme: 'Réglementation', initiales: 'NR' },
    { id: 20, nom: 'David Kim', prenom: 'David', titre: 'CEO FoodTech', org: 'SausageTech, Berlin', bio: 'Fondateur de SausageTech, startup berlinoise qui utilise l\'IA pour optimiser les recettes de saucisses. Levée de fonds de 15M€ en 2025. Forbes 30 under 30.', theme: 'Innovation & Technologie', initiales: 'DK' },
    { id: 21, nom: 'Monique Pfleger', prenom: 'Monique', titre: 'Présidente du Comité des Fêtes', org: 'Marché de Noël de Strasbourg', bio: 'Présidente du Comité des Fêtes du Marché de Noël. Supervise la vente de 2 millions de saucisses chaque année pendant le Christkindelsmärik.', theme: 'Terroir & Filière', initiales: 'MP' },
    { id: 22, nom: 'Ahmed Toufik', prenom: 'Ahmed', titre: 'Expert saucisses halal', org: 'Institut Halal de France', bio: 'Directeur technique de l\'Institut Halal de France. Spécialiste de la charcuterie halal, secteur en croissance de 12% par an. Conseille 80 entreprises.', theme: 'Terroir & Filière', initiales: 'AT' }
  ];

  // ─── SESSIONS (30+ across 3 days) ───
  var SESSIONS = [
    // ── JOUR 1 : 12 juin — Ouverture + Histoire + Filière ──
    { id: 1, jour: 1, debut: '09:00', fin: '09:45', titre: 'Cérémonie d\'ouverture — La Saucisse, patrimoine vivant', speakers: [10, 21], salle: 'erasme', theme: 'Keynote', inscrits: 380 },
    { id: 2, jour: 1, debut: '10:00', fin: '10:45', titre: 'De Rome à Strasbourg : 3000 ans de saucisse', speakers: [2], salle: 'erasme', theme: 'Histoire & Patrimoine', inscrits: 290 },
    { id: 3, jour: 1, debut: '10:00', fin: '10:45', titre: 'La filière porcine Label Rouge en Alsace', speakers: [12], salle: 'schweitzer', theme: 'Terroir & Filière', inscrits: 180 },
    { id: 4, jour: 1, debut: '11:00', fin: '11:45', titre: 'L\'art du fumage traditionnel en Forêt-Noire', speakers: [14], salle: 'curie', theme: 'Gastronomie & Recettes', inscrits: 85 },
    { id: 5, jour: 1, debut: '11:00', fin: '11:45', titre: 'Réglementation UE : ce qui change en 2026', speakers: [11], salle: 'cassin', theme: 'Réglementation', inscrits: 145 },
    { id: 6, jour: 1, debut: '11:00', fin: '12:00', titre: 'Le Musée de la Charcuterie : une aventure culturelle', speakers: [17], salle: 'schuman', theme: 'Histoire & Patrimoine', inscrits: 95 },
    { id: 7, jour: 1, debut: '14:00', fin: '14:45', titre: 'Knack, cervelas, saucisse de Strasbourg : les secrets du goût', speakers: [1], salle: 'erasme', theme: 'Gastronomie & Recettes', inscrits: 410 },
    { id: 8, jour: 1, debut: '14:00', fin: '15:00', titre: 'Atelier dégustation : accords bière-saucisse', speakers: [8], salle: 'gutenberg', theme: 'Dégustation', inscrits: 78 },
    { id: 9, jour: 1, debut: '15:00', fin: '15:45', titre: 'Saucisse et santé : mythes et réalités nutritionnelles', speakers: [4], salle: 'schweitzer', theme: 'Nutrition & Santé', inscrits: 220 },
    { id: 10, jour: 1, debut: '15:00', fin: '16:00', titre: 'La charcuterie halal : un marché en plein essor', speakers: [22], salle: 'cassin', theme: 'Terroir & Filière', inscrits: 130 },
    { id: 11, jour: 1, debut: '16:30', fin: '17:30', titre: 'Table ronde : l\'avenir de la saucisse artisanale', speakers: [1, 10, 12], salle: 'erasme', theme: 'Terroir & Filière', inscrits: 350 },

    // ── JOUR 2 : 13 juin — International + Innovation ──
    { id: 12, jour: 2, debut: '09:00', fin: '09:45', titre: 'Keynote : La Bratwurst, trésor germanique', speakers: [3], salle: 'erasme', theme: 'Keynote', inscrits: 340 },
    { id: 13, jour: 2, debut: '10:00', fin: '10:45', titre: 'Mortadella di Bologna : la reine des saucisses italiennes', speakers: [6], salle: 'schweitzer', theme: 'International', inscrits: 260 },
    { id: 14, jour: 2, debut: '10:00', fin: '10:45', titre: 'Chorizo ibérique : 247 variétés régionales', speakers: [16], salle: 'cassin', theme: 'International', inscrits: 170 },
    { id: 15, jour: 2, debut: '10:00', fin: '11:00', titre: 'Arabiki : la révolution saucisse au Japon', speakers: [9], salle: 'curie', theme: 'International', inscrits: 90 },
    { id: 16, jour: 2, debut: '11:00', fin: '11:45', titre: 'British Bangers : tradition et innovation outre-Manche', speakers: [18], salle: 'schuman', theme: 'International', inscrits: 110 },
    { id: 17, jour: 2, debut: '11:00', fin: '11:45', titre: 'Intelligence artificielle et recettes de saucisses', speakers: [20], salle: 'schweitzer', theme: 'Innovation & Technologie', inscrits: 280 },
    { id: 18, jour: 2, debut: '14:00', fin: '14:45', titre: 'La saucisse végétale hybride : le futur est là', speakers: [7], salle: 'erasme', theme: 'Innovation & Technologie', inscrits: 370 },
    { id: 19, jour: 2, debut: '14:00', fin: '15:00', titre: 'Atelier : fumage au bois de hêtre', speakers: [14], salle: 'curie', theme: 'Atelier pratique', inscrits: 75 },
    { id: 20, jour: 2, debut: '15:00', fin: '15:45', titre: 'Ferments lactiques : les micro-organismes de la maturation', speakers: [15], salle: 'cassin', theme: 'Innovation & Technologie', inscrits: 140 },
    { id: 21, jour: 2, debut: '15:00', fin: '15:45', titre: 'Food design : réinventer l\'image de la saucisse', speakers: [13], salle: 'schweitzer', theme: 'Innovation & Technologie', inscrits: 200 },
    { id: 22, jour: 2, debut: '16:30', fin: '17:30', titre: 'Grand débat international : quelle saucisse pour 2030 ?', speakers: [3, 6, 9, 18], salle: 'erasme', theme: 'International', inscrits: 400 },

    // ── JOUR 3 : 14 juin — Ateliers + Clôture ──
    { id: 23, jour: 3, debut: '09:00', fin: '09:45', titre: 'Le contrôle sanitaire en charcuterie', speakers: [19], salle: 'schweitzer', theme: 'Réglementation', inscrits: 160 },
    { id: 24, jour: 3, debut: '09:00', fin: '10:00', titre: 'Atelier : fabriquer sa knack maison', speakers: [1], salle: 'curie', theme: 'Atelier pratique', inscrits: 98 },
    { id: 25, jour: 3, debut: '10:00', fin: '10:45', titre: 'Le Christkindelsmärik : 2 millions de saucisses par an', speakers: [21], salle: 'cassin', theme: 'Terroir & Filière', inscrits: 120 },
    { id: 26, jour: 3, debut: '10:00', fin: '11:00', titre: 'Atelier : créer un accord bière-saucisse parfait', speakers: [8], salle: 'gutenberg', theme: 'Atelier pratique', inscrits: 72 },
    { id: 27, jour: 3, debut: '11:00', fin: '11:45', titre: 'Haute gastronomie charcutière : la saucisse étoilée', speakers: [5], salle: 'erasme', theme: 'Gastronomie & Recettes', inscrits: 310 },
    { id: 28, jour: 3, debut: '11:00', fin: '11:45', titre: 'SausageTech : quand la startup rencontre le terroir', speakers: [20], salle: 'schuman', theme: 'Innovation & Technologie', inscrits: 105 },
    { id: 29, jour: 3, debut: '14:00', fin: '14:45', titre: 'Nutrition de la saucisse : les études 2025-2026', speakers: [4], salle: 'cassin', theme: 'Nutrition & Santé', inscrits: 130 },
    { id: 30, jour: 3, debut: '14:00', fin: '15:00', titre: 'Atelier : design culinaire et dressage créatif', speakers: [13], salle: 'curie', theme: 'Atelier pratique', inscrits: 65 },
    { id: 31, jour: 3, debut: '15:00', fin: '16:00', titre: 'Grand concours de la meilleure saucisse 2026', speakers: [1, 3, 5, 14], salle: 'erasme', theme: 'Dégustation', inscrits: 440 },
    { id: 32, jour: 3, debut: '16:30', fin: '17:30', titre: 'Cérémonie de clôture et remise des prix', speakers: [10, 2, 17], salle: 'erasme', theme: 'Keynote', inscrits: 420 }
  ];

  // ─── HOTELS ───
  var HOTELS = [
    { id: 1, nom: 'Hilton Strasbourg', distance: '200m', prix: 180, etoiles: 4, adresse: '1 Avenue Herrenschmidt', tel: '03 88 37 10 10', lien: '#' },
    { id: 2, nom: 'Mercure Palais des Congrès', distance: '50m', prix: 120, etoiles: 3, adresse: '3 Rue du Wacken', tel: '03 88 37 59 50', lien: '#' },
    { id: 3, nom: 'ibis Styles Wacken', distance: '300m', prix: 85, etoiles: 3, adresse: '5 Place Adrien Zeller', tel: '03 90 22 90 22', lien: '#' },
    { id: 4, nom: 'AC Hotel by Marriott', distance: '400m', prix: 150, etoiles: 4, adresse: '24 Boulevard de Dresde', tel: '03 88 23 90 00', lien: '#' },
    { id: 5, nom: 'Hôtel D Strasbourg', distance: '350m', prix: 160, etoiles: 4, adresse: '15 Rue du Fossé des Treize', tel: '03 88 15 78 88', lien: '#' },
    { id: 6, nom: 'Holiday Inn Express', distance: '450m', prix: 95, etoiles: 3, adresse: '2 Rue du Rhin', tel: '03 88 37 80 00', lien: '#' },
    { id: 7, nom: 'Novotel Centre Halles', distance: '500m', prix: 130, etoiles: 4, adresse: '4 Quai Kléber', tel: '03 88 21 50 50', lien: '#' },
    { id: 8, nom: 'Hôtel Régent Petite France', distance: '600m', prix: 220, etoiles: 5, adresse: '5 Rue des Moulins', tel: '03 88 76 43 43', lien: '#' }
  ];

  // ─── PASS TYPES ───
  var PASSES = [
    { id: 'standard', nom: 'Standard', prix: 150, couleur: '#E5E7EB', textColor: '#374151', features: ['Accès aux conférences', 'Pauses café incluses', 'Accès espace exposition', 'Badge nominatif', 'Programme imprimé'] },
    { id: 'bronze', nom: 'VIP Bronze', prix: 350, couleur: '#CD7F32', textColor: '#FFF', features: ['Tout Standard +', 'Places réservées rang 1-5', 'Cocktail de bienvenue (12 juin)', 'Pochette VIP avec goodies', 'Accès Wi-Fi premium'] },
    { id: 'gold', nom: 'VIP Gold', prix: 650, couleur: '#FFD300', textColor: '#111', features: ['Tout Bronze +', 'Dîner de gala (13 juin soir)', 'Accès lounge VIP', 'Rencontre speakers (15 min)', 'Dégustation privée'] },
    { id: 'platinum', nom: 'VIP Platinum', prix: 1200, couleur: '#C8C8DC', textColor: '#2D2D3A', features: ['Tout Gold +', 'Hôtel Hilton 3 nuits inclus', 'Transfert gare/aéroport', 'Dîner privé avec les speakers', 'Accès backstage', 'Photo officielle encadrée'] },
    { id: 'staff', nom: 'Staff', prix: 0, couleur: '#DC2626', textColor: '#FFF', code: 'STAFF2026', features: ['Accès total', 'Badge staff', 'Talkie-walkie', 'Repas inclus 3 jours'] }
  ];

  // ─── REPAS ───
  var REPAS_OPTIONS = [
    { id: 'standard', nom: 'Menu standard', prix: 15, desc: 'Charcuterie alsacienne, plat chaud, dessert' },
    { id: 'veggie', nom: 'Menu végétarien', prix: 15, desc: 'Salade composée, plat végétal, dessert' },
    { id: 'halal', nom: 'Menu halal', prix: 15, desc: 'Viande halal certifiée, plat chaud, dessert' },
    { id: 'gluten', nom: 'Menu sans gluten', prix: 15, desc: 'Plat sans gluten certifié, dessert adapté' }
  ];

  // ─── DEMO INSCRIPTIONS (5) ───
  var INSCRIPTIONS = [
    { id: 'INS-001', nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@gmail.com', tel: '06 12 34 56 78', entreprise: 'Charcuterie Dupont', pass: 'gold', sessions: [1,2,7,9,11,12,13,18,22,27,31,32], repas: 'standard', hotel: 2, jours: [1,2,3], statut: 'confirmed', date: '2026-02-15' },
    { id: 'INS-002', nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@inrae.fr', tel: '06 98 76 54 32', entreprise: 'INRAE', pass: 'standard', sessions: [1,4,9,12,17,20,23,29], repas: 'veggie', hotel: null, jours: [1,2,3], statut: 'confirmed', date: '2026-02-28' },
    { id: 'INS-003', nom: 'Schmidt', prenom: 'Hans', email: 'h.schmidt@bratwurst-akademie.de', tel: '+49 911 234 567', entreprise: 'Bratwurst Akademie', pass: 'platinum', sessions: [1,2,3,7,8,11,12,13,15,18,19,22,24,27,31,32], repas: 'standard', hotel: 1, jours: [1,2,3], statut: 'confirmed', date: '2026-03-01' },
    { id: 'INS-004', nom: 'Petit', prenom: 'Claire', email: 'claire.petit@lemonde.fr', tel: '06 55 44 33 22', entreprise: 'Le Monde', pass: 'standard', sessions: [1,7,12,18,22,27,31,32], repas: 'gluten', hotel: 3, jours: [1,2,3], statut: 'pending', date: '2026-03-10' },
    { id: 'INS-005', nom: 'Weber', prenom: 'Marc', email: 'marc.weber@staff.org', tel: '06 11 22 33 44', entreprise: 'Organisation', pass: 'staff', sessions: [], repas: 'standard', hotel: null, jours: [1,2,3], statut: 'confirmed', date: '2026-01-15' }
  ];

  // ─── HELPERS ───
  function getSalle(id) { return SALLES.find(function(s) { return s.id === id; }); }
  function getSpeaker(id) { return SPEAKERS.find(function(s) { return s.id === id; }); }
  function getSession(id) { return SESSIONS.find(function(s) { return s.id === id; }); }
  function getHotel(id) { return HOTELS.find(function(h) { return h.id === id; }); }
  function getPass(id) { return PASSES.find(function(p) { return p.id === id; }); }

  function getSessionsBySpeaker(speakerId) {
    return SESSIONS.filter(function(s) { return s.speakers.indexOf(speakerId) !== -1; });
  }
  function getSessionsByDay(jour) {
    return SESSIONS.filter(function(s) { return s.jour === jour; }).sort(function(a,b) { return a.debut.localeCompare(b.debut); });
  }
  function getSessionsBySalle(salleId) {
    return SESSIONS.filter(function(s) { return s.salle === salleId; });
  }
  function getCapacityClass(salle, inscrits) {
    var cap = getSalle(salle);
    if (!cap) return 'green';
    var pct = (inscrits / cap.capacite) * 100;
    if (pct >= 100) return 'black';
    if (pct >= 80) return 'red';
    if (pct >= 50) return 'orange';
    return 'green';
  }
  function getPlacesRestantes(session) {
    var salle = getSalle(session.salle);
    if (!salle) return 0;
    return Math.max(0, salle.capacite - session.inscrits);
  }

  // ─── LOCAL STORAGE ───
  function loadInscriptions() {
    try {
      var data = localStorage.getItem('congres_inscriptions');
      return data ? JSON.parse(data) : INSCRIPTIONS.slice();
    } catch(e) { return INSCRIPTIONS.slice(); }
  }
  function saveInscriptions(list) {
    localStorage.setItem('congres_inscriptions', JSON.stringify(list));
  }
  function initData() {
    if (!localStorage.getItem('congres_inscriptions')) {
      saveInscriptions(INSCRIPTIONS);
    }
  }
  function loadFavorites() {
    try { return JSON.parse(localStorage.getItem('congres_favorites') || '[]'); } catch(e) { return []; }
  }
  function saveFavorites(f) { localStorage.setItem('congres_favorites', JSON.stringify(f)); }
  function loadReminders() {
    try { return JSON.parse(localStorage.getItem('congres_reminders') || '[]'); } catch(e) { return []; }
  }
  function saveReminders(r) { localStorage.setItem('congres_reminders', JSON.stringify(r)); }

  // ─── STATS ───
  function getStats() {
    var ins = loadInscriptions();
    var total = ins.length;
    var byPass = {};
    var revenue = 0;
    var repasCount = { standard: 0, veggie: 0, halal: 0, gluten: 0 };

    ins.forEach(function(i) {
      var p = getPass(i.pass);
      byPass[i.pass] = (byPass[i.pass] || 0) + 1;
      if (p) revenue += p.prix;
      if (i.repas && repasCount.hasOwnProperty(i.repas)) {
        repasCount[i.repas] += i.jours ? i.jours.length : 1;
      }
    });

    return { total: total, byPass: byPass, revenue: revenue, repasCount: repasCount };
  }

  // Init on load
  initData();

  return {
    SALLES: SALLES,
    THEMES: THEMES,
    SPEAKERS: SPEAKERS,
    SESSIONS: SESSIONS,
    HOTELS: HOTELS,
    PASSES: PASSES,
    REPAS_OPTIONS: REPAS_OPTIONS,
    getSalle: getSalle,
    getSpeaker: getSpeaker,
    getSession: getSession,
    getHotel: getHotel,
    getPass: getPass,
    getSessionsBySpeaker: getSessionsBySpeaker,
    getSessionsByDay: getSessionsByDay,
    getSessionsBySalle: getSessionsBySalle,
    getCapacityClass: getCapacityClass,
    getPlacesRestantes: getPlacesRestantes,
    loadInscriptions: loadInscriptions,
    saveInscriptions: saveInscriptions,
    loadFavorites: loadFavorites,
    saveFavorites: saveFavorites,
    loadReminders: loadReminders,
    saveReminders: saveReminders,
    getStats: getStats
  };
})();
