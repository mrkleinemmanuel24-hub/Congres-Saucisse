# AUDIT — Congrès / Événementiel SaaS
## Date : 13 avril 2026

---

## CE QUI EXISTE (inventaire complet)

### Fichiers HTML

| Fichier | Lignes | Rôle | Statut |
|---|---|---|---|
| `index.html` | 4 284 | Site public du festival — monobloc SPA + landing de choix de thème | Surchargé, couplé à un événement spécifique |
| `admin.html` | 1 866 | Back-office SPA avec sidebar — 35+ sections (participants, badges, check-in, traiteur, sécurité, ERP, simulateur...) | Bien structuré, le coeur du produit |
| `strasbourg.html` | 2 744 | Ancienne version du site public (avant la refonte avec 5 thèmes) | Doublon à archiver |
| `stephanie.html` | 261 | Dashboard mobile-first pour Stéphanie uniquement — mode Préparation / Jour J | Pertinent, mais trop personnalisé |
| `vote.html` | 966 | Interface animateur de vote en direct — affichage résultats en temps réel, QR code | Module solide |
| `vote-participant.html` | 701 | Interface participant pour voter via code 4 chiffres | Module solide |
| `guide-vote.html` | 298 | Documentation du système de vote (questions pré-configurées par session) | Utile mais à intégrer dans admin |
| `visit-geopolitique.html` | 1 465 | Story Map Leaflet des lieux géopolitiques de Strasbourg | Hors scope SaaS générique |
| `erp.html` | 29 | Page de redirection vers `admin.html#erp-dashboard` | À supprimer |
| `mentions-legales.html` | 213 | Mentions légales | À génériciser |

### Fichiers JS (dossier `/js/`)

| Fichier | Lignes | Rôle |
|---|---|---|
| `data.js` | 241 | Données speakers, salles, thématiques — en dur (saucisses + géopolitique mélangés) |
| `spa-sections.js` | 1 154 | Rendu dynamique des sections de l'admin (programme, intervenants, etc.) |
| `modules-extra.js` | 1 301 | Réservations, badges/QR, intervenants, bénévoles, logistique, prestataires |
| `simulateur-financier.js` | 678 | Simulateur de budget événementiel (dépenses/revenus/seuil de rentabilité) |
| `securite.js` | 626 | Module sécurité et conformité — 5 onglets, 113+ points de contrôle |
| `rvgs-upgrade.js` | 973 | Modules additionnels (slider programme, suggestions, invitations, mur social) |
| `dashboard-stephanie.js` | 312 | Logic du dashboard personnalisé Stéphanie |
| `guided-tour.js` | 173 | Tour guidé interactif de l'interface admin |
| `ip-protection.js` | 185 | Protection basique par IP / rate limiting côté client |
| `content-filter.js` | 170 | Filtre de contenu pour le mur social |
| `qrcode.js` | 108 | Générateur QR code (librairie wrappée) |
| `copyright-footer.js` | 22 | Footer copyright dynamique |

### Fichiers CSS

| Fichier | Lignes | Rôle |
|---|---|---|
| `css/front.css` | 842 | Styles du site public (nav, hero, sections, cards) |
| `css/admin.css` | 228 | Styles de base admin — complété massivement par du CSS inline dans admin.html |

### Autres fichiers notables

- `docs/mail-stephanie-congres.html` — email de présentation à Stéphanie
- `AUDIT_GEMINI.md` / `AUDIT_PERPLEXITY.md` — audits précédents par IA
- `archives/` — dossier d'archives (non lu, à vérifier)

---

## CE QUI EST BIEN (à garder)

### 1. L'admin est le vrai produit — et il est costaud
`admin.html` + ses modules JS forment un ERP événementiel complet : inscriptions, badges QR, check-in, régimes alimentaires, gestion des salles, staff/bénévoles, prestataires, sécurité 113 points, simulateur financier, mur social, enquête satisfaction, invitations. C'est du travail sérieux. Tout cela doit rester.

### 2. Le simulateur financier est une fonctionnalité différenciante
`simulateur-financier.js` (678 lignes) couvre lieu, technique, traiteur, personnel, communication, sécurité et revenus. Le seuil de rentabilité est calculé automatiquement. Aucun concurrent SaaS événementiel grand public n'offre ça nativement.

### 3. Le module vote en direct est professionnel
`vote.html` + `vote-participant.html` : code 4 chiffres, QR code, affichage temps réel, 5 types de questions (oui/non, QCM, likert, estimation, nuage de mots). Utilisable pour n'importe quel congrès sans modification de logique.

### 4. Le module sécurité / conformité est sérieux
`securite.js` : 5 onglets (autorisations, physique, évacuation, VIP, timeline), checkboxes persistées en localStorage, responsables et dates associés. Pour des organisateurs publics ou associatifs, c'est un argument commercial fort.

### 5. L'architecture SPA admin fonctionne
Sidebar fixe + `showAdmin()` pour switcher entre sections, sans rechargement. Hamburger mobile. La structure est propre et extensible.

### 6. `stephanie.html` — bonne idée de dashboard mobile simplifié
Le concept "vue urgences du jour + mode Préparation / Jour J" est le bon usage pattern pour un organisateur sur le terrain. L'idée vaut d'être généralisée sous le nom "Vue organisateur" ou "Accueil rapide".

---

## CE QUI EST CONFUS (les problèmes identifiés)

### Problème 1 — Identité schizophrène : saucisse ou géopolitique ?
Le projet s'appelle `Congres-Saucisse` mais les données dans `data.js` et dans les sections admin mélangent deux événements distincts :
- Intervenants : Jean-Marc Schaller (MOF charcutier) + Pierre Haski (journaliste géopolitique) dans le même tableau
- Sessions : "Les batailles de l'eau" (géopolitique) + "Grand Prix de la Knack d'Or" (saucisse)
- Les dates oscillent entre octobre 2026 et mars 2027 selon les fichiers

**Cause** : le projet a été conçu pour un "Congrès de la Saucisse" générique, puis partiellement migré vers les "Rendez-vous Géopolitiques de Strasbourg" pour Stéphanie, sans nettoyage complet. Les deux réalités coexistent dans le code.

### Problème 2 — Trois fichiers pour le site public
`strasbourg.html` (2 744 lignes), `index.html` (4 284 lignes) et les sections SPA dans `admin.html` couvrent tous le même territoire : site public de l'événement. C'est 3 versions concurrentes du même objet. Un visiteur qui arrive sur `strasbourg.html` voit un thème différent de `index.html`. Aucun lien entre les deux.

### Problème 3 — `index.html` fait 4 284 lignes et porte trop de choses
Ce fichier contient : (a) une landing de sélection de thème avec 5 thèmes CSS complets, (b) la nav et tout le CSS du site public, (c) les données JS en dur (speakers, news, programme), (d) toute la logique JS (countdown, filtres, formulaires, recherche Ctrl+K). C'est un monolithe ingérable pour un SaaS multi-événements.

### Problème 4 — Les données sont hardcodées, en double, et incohérentes
- `data.js` définit `window.CONGRES` avec des speakers saucisse
- `index.html` redéfinit ses propres tableaux `speakers[]` et `news[]` en géopolitique
- `spa-sections.js` utilise `CONGRES.getSpeaker()` mais certaines sections du même fichier génèrent du HTML en dur avec des noms comme "Soiree de Gala — Hotel de Ville"
- Les dates sont différentes partout : `index.html` dit "15-18 octobre 2026", `admin.html` dit "19-22 mars 2027", `stephanie.html` dit "15-18 octobre 2026"

Il n'existe pas une seule source de vérité configurable pour les paramètres de l'événement.

### Problème 5 — `erp.html` ne sert à rien
29 lignes, juste une redirection vers `admin.html`. À supprimer.

### Problème 6 — `visit-geopolitique.html` est un produit entier orphelin
1 465 lignes pour une Story Map Leaflet des lieux géopolitiques de Strasbourg. Aucun lien depuis admin ni depuis index. C'est un module hors scope qui traîne.

### Problème 7 — `guide-vote.html` doit être dans l'admin
C'est un document d'aide qui liste les sessions de vote avec leurs questions. Il devrait être une section de l'admin (onglet "Guide" dans le module vote), pas un fichier HTML séparé navigué via lien externe.

### Problème 8 — Styles CSS fragmentés et incohérents entre les fichiers
- `index.html` : 5 thèmes CSS complets + styles du site public = ~1 800 lignes de CSS en `<style>`
- `admin.html` : styles sidebar + styles ERP + styles invitations = ~380 lignes de CSS inline
- `vote.html` et `vote-participant.html` : chacun a son propre `:root` avec des variables différentes de `index.html`
- `strasbourg.html` : encore un autre `:root` avec des noms de thèmes différents

Le projet a 4 systèmes de design parallèles, aucun partagé. La refonte CHANEL devra tout unifier.

### Problème 9 — Pas de configuration événement centralisée
Pour adapter l'outil à un nouveau congrès, il faut modifier : `index.html` (titre, dates, programme), `admin.html` (sidebar footer, références RVGS), `stephanie.html` (dates, nom), `data.js` (speakers, salles). Il n'existe pas de fichier `config.js` avec `EVENT_NAME`, `EVENT_DATES`, `EVENT_LOCATION`.

### Problème 10 — `stephanie.html` est nominatif et non réutilisable
Le fichier s'appelle Stéphanie, dit "Bonjour Stéphanie", et contient son numéro de téléphone. Pour un SaaS, ce fichier doit devenir un template "vue organisateur" générique.

---

## ARCHITECTURE CIBLE (proposition)

### Principes
1. Une seule source de vérité : `config.js` — nom, dates, lieu, organisateur, logo
2. Deux surfaces distinctes : site public (`site.html`) et back-office (`admin.html`)
3. Les données sont dans `data.js`, jamais en dur dans le HTML
4. Un seul système de design (voir section CHANEL ci-dessous)

### Structure de fichiers cible

```
/
├── config.js              [NOUVEAU] Paramètres événement : nom, dates, lieu, couleur accent
├── site.html              Refonte de index.html — site public SPA (programme, intervenants, inscription)
├── admin.html             Garder — back-office SPA avec sidebar (à dé-branded)
├── vote.html              Garder — interface animateur vote
├── vote-participant.html  Garder — interface participant vote
├── accueil-orga.html      Refonte de stephanie.html — vue mobile générique organisateur
├── mentions-legales.html  À génériciser (retirer "Strasbourg" hardcodé)
│
├── js/
│   ├── config.js          [NOUVEAU] Event config object
│   ├── data.js            À nettoyer — une seule réalité
│   ├── spa-sections.js    Garder
│   ├── modules-extra.js   Garder
│   ├── simulateur-financier.js  Garder
│   ├── securite.js        Garder
│   ├── rvgs-upgrade.js    Garder (renommer en modules-avances.js)
│   ├── vote-engine.js     Extraire la logique vote de vote.html
│   └── qrcode.js          Garder
│
├── css/
│   ├── chanel.css         [NOUVEAU] Système de design unique CHANEL
│   ├── front.css          Refonte
│   └── admin.css          Refonte
│
└── archives/
    ├── strasbourg.html    Archiver
    ├── visit-geopolitique.html  Archiver
    └── guide-vote.html    Intégrer dans admin ou archiver
```

### Modules de l'admin (à conserver tels quels)

| Module | Fichier source | Statut |
|---|---|---|
| Dashboard organisateur (vue urgences) | dashboard-stephanie.js | A génériciser |
| Inscriptions participants | modules-extra.js | OK |
| Badges & QR codes | modules-extra.js | OK |
| Check-in jour J | modules-extra.js | OK |
| Régimes alimentaires / traiteur | modules-extra.js | OK |
| Salles & jauges | spa-sections.js | OK |
| Intervenants | modules-extra.js | OK |
| Staff & bénévoles | modules-extra.js | OK |
| Transports | spa-sections.js | OK |
| Emails & invitations | rvgs-upgrade.js | OK |
| Mur social | rvgs-upgrade.js | OK |
| Enquête satisfaction | spa-sections.js | OK |
| Sessions de vote | vote.html (séparé) | OK |
| Simulateur financier | simulateur-financier.js | OK |
| Sécurité & conformité | securite.js | OK |
| Prestataires | modules-extra.js | OK |
| Checklist projet | spa-sections.js | OK |

---

## PASSAGE EN STYLE CHANEL

### Ce qu'on remplace

| Élément actuel | Ce qu'on applique |
|---|---|
| `Playfair Display` (serif décoratif) | Supprimer — remplacer par `Montserrat` |
| `Inter` | Garder uniquement pour corps de texte |
| Navy `#0D1B4A` / `#0e0e20` | Fond : `#000000` ou `#111111` |
| Or `#C9A84C` / `#D4A843` | Supprimer les ors — accent unique : `#FFFFFF` ou un gris clair |
| 5 thèmes CSS concurrents dans index.html | Un seul thème, noir/blanc, sans selector de thème |
| Dégradés `linear-gradient` partout | Supprimer — aplats uniquement |
| `border-radius: 14px` partout | Réduit à 0 ou 2px max |
| Animations `goldRotate`, `heroGlow`, `pulseGlow` | Supprimer les animations décoratives |
| Cercles dorés rotatifs sur la landing | Supprimer |
| Emojis dans la sidebar admin | Supprimer — remplacer par icônes SVG ou texte |
| Badges colorés (vert, bleu, rouge, orange) | Noir/blanc uniquement — bordure fine |
| Barre tricolore thème "République" | Supprimer |

### Charte typographique cible

```css
/* CHANEL SYSTEM */
--font-head: 'Montserrat', sans-serif;
--font-body: 'Montserrat', sans-serif;
--weight-light: 300;
--weight-regular: 400;
--weight-bold: 700;
--weight-black: 900;

--bg: #111111;
--bg-surface: #1A1A1A;
--bg-card: #222222;
--text-primary: #FFFFFF;
--text-secondary: #AAAAAA;
--text-muted: #666666;
--border: rgba(255,255,255,0.08);
--border-strong: rgba(255,255,255,0.2);
--accent: #FFFFFF;  /* ou un blanc cassé #F5F5F5 */

/* Titres : Montserrat uppercase espacé */
h1, h2, h3, h4 {
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 700;
}
```

### Ce qu'on garde dans l'esprit
- La sidebar admin sombre fonctionne — on la garde en noir pur
- Les badges de statut (paid/pending/overdue) restent utiles — en niveaux de gris uniquement
- Le simulateur financier avec ses tableaux clairs est fonctionnel — on adapte la palette

---

## ORDRE DE TRAVAIL RECOMMANDÉ

### Priorité 1 — Nettoyage et débranding (1-2h)

1. **Créer `js/config.js`** avec un objet `EVENT` : `{ name, dates, lieu, organisateur, logo, accent }`. Toutes les références hardcodées à "Strasbourg", "RVGS", "Stéphanie", "octobre 2026" / "mars 2027" doivent en venir.
2. **Supprimer `erp.html`** — inutile.
3. **Archiver `strasbourg.html`** et `visit-geopolitique.html` dans `/archives/`.
4. **Nettoyer `data.js`** : choisir une seule réalité événement (saucisse OU géopolitique), supprimer les données de l'autre.

### Priorité 2 — Passage CHANEL sur l'admin (3-4h)

5. **Créer `css/chanel.css`** avec le système de design ci-dessus.
6. **Refondre `admin.html`** : importer `chanel.css`, remplacer les variables CSS, supprimer les dégradés et les animations, remplacer les emojis sidebar par du texte uppercase.
7. **Refondre `css/admin.css`** en cohérence.

### Priorité 3 — Refonte du site public (4-6h)

8. **Réécrire `index.html`** de zéro ou repartir de `strasbourg.html` comme base (plus simple, moins surchargé). Objectif : landing propre + 5-6 sections (programme, intervenants, inscription, infos pratiques). Les données viennent de `config.js` + `data.js`. Pas de selector de thème — un seul thème CHANEL.
9. **Remplacer `css/front.css`** par le système CHANEL.

### Priorité 4 — Dashboard organisateur générique (1h)

10. **Renommer `stephanie.html` → `accueil-orga.html`**, remplacer "Stéphanie" par `config.EVENT.organisateur`, supprimer le numéro de téléphone hardcodé.

### Priorité 5 — Tests et cohérence (1h)

11. Vérifier que `vote.html` + `vote-participant.html` fonctionnent après refonte CSS.
12. Vérifier que tous les `localStorage` keys sont cohérents (actuellement mélange de `rvgs_*` et `congres_*`).
13. Unifier les keys en `EVENT_*` ou préfixé par `config.EVENT.id`.

### Ce qu'on ne fait PAS maintenant
- Pas de backend — tout reste localStorage. C'est le bon choix pour la v1 (portabilité, zéro infrastructure).
- Pas de refonte du module vote — il fonctionne bien.
- Pas de refonte du simulateur financier — il fonctionne bien.
- Pas de refonte du module sécurité — il fonctionne bien.

---

## RÉSUMÉ DÉCISIONNEL

| Question | Décision |
|---|---|
| Garder index.html tel quel ? | Non — trop gros, trop couplé, trop de thèmes |
| Garder admin.html ? | Oui — c'est le coeur, refonte cosmétique uniquement |
| Garder strasbourg.html ? | Non — archiver |
| Garder erp.html ? | Non — supprimer |
| Garder stephanie.html ? | Oui mais génériciser → accueil-orga.html |
| Garder visit-geopolitique.html ? | Non — hors scope, archiver |
| Garder guide-vote.html ? | À intégrer dans admin ou archiver |
| Refaire le design de zéro ? | Non — adapter l'existant en CHANEL |
| Créer un backend ? | Non en priorité — localStorage d'abord |
| Créer config.js ? | Oui — c'est la priorité 1 absolue |
