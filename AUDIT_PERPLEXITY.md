# Audit Perplexity AI — Congrès Strasbourg

**Date** : 28 mars 2026  
**Modèle** : Perplexity Sonar  
**Auditeur** : Perplexity AI (automatisé)

---


## index.html

### 1. NOTE /10
**UX: 7/10** — Landing premium mais incomplète, responsive partielle.  
**Design: 9/10** — Thèmes sophistiqués, animations élégantes.  
**Contenu: 6/10** — Événementiel clair, mais manquant (page tronquée).  
**Technique: 6/10** — CSS lourd, HTML/CSS incomplet, pas de JS visible.  
**Globale: 7/10**.

### 2. BUGS ou erreurs
- CSS tronqué: `.landing-btn.site-btn:hover { background` incomplet → styles cassés sur hover.
- HTML invalide potentiel: `<style>` massif (15k+ chars), pas de balises body/content complètes → page non fonctionnelle.
- Pas d'accents manquants visibles, mais liens externes (fonts, Leaflet) sans fallback.
- Animations infinies (`goldRotate 120s`) sans `prefers-reduced-motion` → risque épilepsie.
- Meta description OK, mais title long (60+ chars) → tronqué en SERP.

### 3. PROBLÈMES UX
- **Lisibilité mobile**: Police `Playfair Display` (serif) petite sur petits écrans (`clamp(32px,5vw,48px)`), uppercase + letter-spacing excessif → fatigue oculaire.
- **Navigation**: Landing "choice" bloque accès contenu ; pas de menu/skip-to-content → heuristiques Nielsen (visibilité statut, flexibilité).
- **Accessibilité**: Pas d'`aria-label` sur boutons/animations ; contrastes faibles (ex: `--text-muted #7080A0` sur dark bg) ; pas d'`alt` images (logo SVG inline).
- **Performance**: CSS inline énorme + Google Fonts/Leaflet → LCP >2s mobile ; pas de lazy-loading.
- **Cohérence**: 5 thèmes sans switcher facile ; tricolore fixe sur "republique".

### 4. AMÉLIORATIONS concrètes (priorité ↓)
1. **Compléter CSS/HTML**: Fermer `.landing-btn.site-btn:hover` et ajouter `<main>`, `<nav>`, contenu réel (programme, inscriptions).
2. **Accessibilité WCAG**: Ajouter `prefers-reduced-motion`, `aria-label` boutons, `role="img"` SVG logo, contrasts >4.5:1 (tester WebAIM).
3. **Mobile-first**: Réduire padding boutons (`24px 48px` → `20px 32px`), tester sur 320px ; ajouter hamburger menu.
4. **Performance**: Extraire CSS en fichier externe, preload fonts (`<link rel="preload">`), minifier.
5. **CTA clair**: Ajouter bouton "Entrer" avant choice, avec scroll suave vers sections.

### 5. CE QUI EST BIEN
- **Thèmes premium**: 5 variantes cohérentes (diplomatique, tricolore, UE...), adaptées événement géopolitique — désirabilité haute.
- **Animations subtiles**: `goldRotate`, `fadeInUp` — élégant, non intrusif, renforce prestige.
- **Responsive de base**: `clamp()`, `flex-wrap`, viewport meta — fondations solides pour landing.

---


## admin.html

## 1. NOTE /10
**UX: 7/10** | **Design: 8/10** | **Contenu: N/A (styles uniquement)** | **Technique: 6/10**  
**Note globale: 7/10** – Interface admin moderne et responsive, mais lacunes en accessibilité et maintenance.

## 2. BUGS ou erreurs
- Accents corrects (`G&eacute;opolitiques` → devrait être `Géopolitiques` dans `<title>`).
- HTML valide (DOCTYPE, meta viewport OK), mais styles inline massifs (5400+ lignes) = maintenance infernale, risque de duplication.
- Pas de liens cassés visibles (pas de `<a>` dans extrait).
- CDN Leaflet chargé inutilement dans admin (non utilisé ?).

## 3. PROBLÈMES UX
- **Navigation mobile**: Hamburger OK, mais sidebar overlay z-index 999 sous sidebar (1000) → risque de chevauchement.
- **Lisibilité**: Contrastes faibles (ex: `#8888b0` sur `#0e0e20` ≈ 4.5:1, sous WCAG AA 4.5:1 pour texte).
- **Accessibilité**: Pas d'`aria-label` sur icônes/hamburger ; focus invisibles (`outline: none` sur inputs) ; pas d'`alt` sur images sidebar.
- **Responsive**: Grilles KPI/tableaux overflow-x sans scroll fluide sur petits écrans (<900px).
- **Chargement**: Styles inline + externes (front.css, admin.css) = poids excessif, pas de lazy-loading.

## 4. AMÉLIORATIONS concrètes (priorité ↓)
1. **Extraire styles en CSS externe**: Diviser en `spa.css`, `erp.css` ; minifier → -70% taille, meilleure perf/cache.
2. **Accessibilité WCAG**: Ajouter `aria-label` hamburger (`aria-label="Menu"`), `role="navigation"` sidebar, `alt` images, `outline: 2px solid #C9A84C` focus.
3. **Contrastes**: `#8888b0` → `#c0c0e0` (liens) ; tester avec WAVE/Axe.
4. **Mobile sidebar**: `z-index: 1001` overlay ; ajouter `aria-expanded` toggle.
5. **Perf**: Supprimer Leaflet si inutilisé ; ajouter `<link rel="preload">` critical CSS.

## 5. CE QUI EST BIEN
- **Design cohérent**: Thème dark gold (#C9A84C) premium, adapté congrès géopolitique ; hover/animations fluides.
- **Responsive SPA**: Sidebar mobile + tabs ERP = navigation efficace admin.
- **Composants riches**: KPI, pipeline, modals, badges = dashboard pro intuitif.

---


## strasbourg.html

## Audit UX/UI - strasbourg.html

### 1. NOTE /10
**8.5/10**  
(UX: 9/10 - fluide et moderne | Design: 9/10 - thèmes soignés | Contenu: 8/10 - incomplet | Technique: 8/10 - robuste mais perfectible)

### 2. BUGS ou erreurs
- **HTML tronqué** : CSS coupé au milieu de `.section-alt` (incomplet, casse le rendu).
- **JavaScript manquant** : Countdown, thème toggle, search, mobile menu, scroll effects référencés mais non fournis → non fonctionnels.
- **Liens Leaflet inutilisés** : `<link rel="stylesheet" href="leaflet.css">` sans carte → superflu.
- **Accès manquants** : Pas d'`alt` sur images (non présentes mais anticiper), pas de `lang` sur `<html>` cohérent avec contenu FR.
- **Thème moderne incomplet** : Règles spécifiques `!important` risquent conflits (ex: `.hero h1 { color: #fff !important; }`).

### 3. PROBLÈMES UX
- **Navigation mobile** : Menu hamburger + boutons thème/search cachés → UX frustrante sur <1024px.
- **Accessibilité faible** : Contraste insuffisant (ex: `--text-muted` sur `--bg-primary` ~3.5:1 < WCAG AA), pas d'`aria-label` sur toggles/boutons, clavier non testé.
- **Search overlay** : Pas de close button/ESC visible, risque de piège utilisateur.
- **Hero trop dense** : Countdown + scroll indicator + multiples CTAs saturent l'écran mobile.
- **Thèmes incohérents** : Moderne light/dark mal géré (hero overlay force dark).

### 4. AMÉLIORATIONS concrètes (priorité ↓)
1. **Ajouter JS critique** : Countdown, thème switch (localStorage), search (avec résultats mockés), mobile menu toggle.
2. **Accessibilité WCAG** : Ajouter `role="button" aria-expanded` sur toggles, `alt` systématique, tester contrastes (outil : WebAIM Contrast Checker).
3. **Mobile-first nav** : Fusionner hamburger + thème/search en drawer unifié, réduire hauteur nav à 56px.
4. **Performance** : Lazyload fonts (Google Fonts), minifier CSS (24ko+), précharger critical path.
5. **Hero responsive** : Clamp countdown à 32px mobile, stack vertical btns + countdown.

### 5. CE QUI EST BIEN
- **Système de thèmes CSS vars** : Élégant, fluide, 3 variantes cohérentes et switchables.
- **Typographie premium** : Playfair + Inter parfait pour événement politique (luxe + lisibilité).
- **Hero immersif** : Animations subtiles (glow, bounce), overlay gradient pro, responsive clamps excellents.

---


## saucisse.html

## 1. NOTE /10
**UX: 7/10** | **Design: 8/10** | **Contenu: 6/10** (thème saucisse absurde pour congrès sérieux) | **Technique: 7/10**  
**Note globale: 7/10** – Clone réussi de rdv-histoire.com, mais incomplet et thématiquement décalé[1][8].

## 2. BUGS ou erreurs
- **Accents manquants**: "Congres" → "Congrès", "dedie" → "dédié", "1ere" → "1ère" (title/description).
- **HTML incomplet**: CSS tronqué (`.number-item-val` inachevé), pas de `<body>` visible → page non fonctionnelle.
- **Liens potentiellement cassés**: `img/hero-congress.png`, `img/icons/icon-saucisse.png` non vérifiés; Leaflet chargé mais inutilisé.
- **HTML invalide**: Pas de `<body>`, scripts JS manquants pour mobile-toggle/nav; animations CSS orphelines (`.hero-sausage` sans éléments HTML).

## 3. PROBLÈMES UX
- **Navigation mobile**: Toggle visible mais pas de JS pour `.open` → menu inutilisable[1][4].
- **Lisibilité mobile**: Hero stats OK (clamp), mais grids (3 cols → 1fr) trop denses <580px; textes petits (.68rem)[1][2].
- **Accessibilité**: Pas d'`alt` sur images/logo; contrastes bas (texte `--text-dim` sur `--bg`); pas ARIA pour dropdowns/mobile; pas de skip-links[4][9].
- **Performance**: CSS inline massif + Google Fonts/Leaflet non optimisés → lent mobile[3].

## 4. AMÉLIORATIONS concrètes (priorité ↓)
1. **Ajouter JS navigation mobile** : Script toggle pour `.mobile-toggle` (onclick classe `.open`); test sur vrais devices[1].
2. **Corriger accents/compléter HTML** : Fix meta/title; ajouter `<body>` avec sections réelles (à la une, thèmes); valider W3C[3].
3. **Accessibilité WCAG** : Ajouter `alt` images, `aria-expanded` dropdowns, contrastes >4.5:1 (outil WAVE), focus visibles[4][9].
4. **Optimiser mobile-first** : Réduire hero à 100vh mobile; boutons CTA >44px tap; lazyload images[1][4].
5. **Adapter thème contenu** : Remplacer "Saucisse" par géopolitique Strasbourg; CTA réels (inscriptions 2026)[8].

## 5. CE QUI EST BIEN
- **Design cohérent/thème navy premium**: Variables CSS propres, animations fluides (hero/saucisses), clone fidèle rdv-histoire[7][8].
- **Responsive global solide**: Grids adaptatives, clamp fonts, sticky header efficace[1][4].
- **Hiérarchie visuelle claire**: Hero impactant (stats/CTAs), sections structurées (eyebrows/headings)[2][3].

---


## stephanie.html

# Audit UX/UI — stephanie.html (RVGS 2026)

## 1. NOTES /10

| Critère | Note | Justification |
|---------|------|---------------|
| **UX** | 8/10 | Navigation claire, hiérarchie logique, mais manque de feedback utilisateur et d'accessibilité |
| **Design** | 8.5/10 | Cohérent, moderne, palette élégante ; contraste insuffisant sur certains éléments |
| **Contenu** | 7.5/10 | Pertinent mais dense ; manque de clarté sur les rôles/permissions de Stéphanie |
| **Technique** | 7/10 | HTML valide, responsive basique ; pas de gestion d'erreurs, localStorage fragile |
| **GLOBAL** | **7.75/10** | Bon point de départ, mais nécessite optimisations accessibilité et robustesse |

---

## 2. BUGS & ERREURS TECHNIQUES

- **Lien cassé potentiel** : `href="admin.html#site"` devrait être `href="index.html#site"` (cohérence avec le commentaire du bouton)
- **localStorage non sécurisé** : Les `onclick` qui définissent `localStorage` peuvent être contournés ; pas de validation côté serveur
- **Pas de fallback** : Si JavaScript est désactivé, les liens rapides ne fonctionnent pas correctement
- **Accessibilité ARIA manquante** : Pas de `role`, `aria-label`, `aria-describedby` sur les cartes interactives
- **Contraste insuffisant** : Texte `rgba(255,255,255,0.5)` sur fond dégradé foncé < 4.5:1 (WCAG AA)

---

## 3. PROBLÈMES UX

**Navigation & Clarté**
- Ambiguïté : Stéphanie est-elle admin, organisatrice, ou staff ? Le contexte n'est pas explicite
- Les "Accès directs" utilisent `localStorage` pour router, mais aucun feedback visuel ne confirme l'action
- Le bouton "Espace Administrateur" affiche le mot de passe en clair (`Mot de passe : admin`) — risque de sécurité UX

**Accessibilité**
- Pas de support clavier (`:focus` styles manquants)
- Emojis comme seules icônes : non lisibles par lecteurs d'écran
- Texte petit (11-13px) sur mobile peut être difficile à lire

**Mobile**
- Breakpoint unique à 400px insuffisant (pas de tablet)
- Espacement réduit sur petit écran rend les boutons difficiles à taper

---

## 4. AMÉLIORATIONS PRIORITAIRES

### 1. **Accessibilité WCAG AA** (Critique)
Ajouter `role="button"`, `aria-label`, contraste ≥ 4.5:1, support clavier `:focus-visible`. Remplacer emojis par icônes SVG avec `aria-hidden="true"` + texte alternatif.

### 2. **Clarifier le rôle de Stéphanie** (Haute)
Ajouter une section "Qui es-tu ?" avec badge explicite (ex : "Organisatrice Principale") et permissions visibles. Cela réduit la friction cognitive.

### 3. **Sécuriser l'authentification** (Haute)
Retirer le mot de passe en clair du badge. Implémenter une vraie session backend au lieu de `localStorage` pour router vers `admin.html`.

### 4. **Améliorer le responsive** (Moyenne)
Ajouter breakpoints tablet (768px) et desktop (1024px). Augmenter padding/font-size sur mobile pour accessibilité tactile.

### 5. **Ajouter feedback utilisateur** (Moyenne)
Implémenter toast/notification au clic sur "Accès directs" pour confirmer la navigation. Ajouter skeleton loaders sur `admin.html` pour fluidité perçue.

---

## 5. CE QUI EST BIEN

✅ **Hiérarchie visuelle claire** : Les 2 boutons principaux (admin/site) sont immédiatement identifiables ; guide d'emploi bien structuré en 4 étapes.

✅ **Design cohérent & moderne** : Palette or/vert/bleu marine élégante, typographie Playfair+Inter professionnelle, animations subtiles (hover, transitions).

✅ **Contenu orienté utilisateur** : Ton conversationnel ("Bonjour Stéphanie"), accès directs contextualisés, lien téléphone utile pour support vocal.

---


## mentions-legales.html

## 1. NOTE /10
**8/10** (UX: 9/10, Design: 9/10, Contenu: 7/10, Technique: 8/10). Design immersif et cohérent, mais contenu incomplet (manque téléphone, SIREN) et incohérent avec le projet (références vétérinaires).

## 2. BUGS ou erreurs
- **Accents manquants** : "legales" → "légales" (titre, h1), "Conformement" → "Conformément", "numerique" → "numérique", "economie" → "économie", "Editeur" → "Éditeur", "Hebergeur" → "Hébergeur", "donnees" → "données" (multiples), "proteges" → "protégés".
- **HTML invalide** : `&larr;` sans entité complète (`&larr;`), `n&deg;` → `n&nbsp;°`. Script `js/ip-protection.js` non fourni (risque 404).
- **Liens** : Aucun lien cassé visible, mais email `contact@sos-toutou.fr` incohérent avec "Congrès Strasbourg".
- **Date future** : "mars 2026" dans footer (anachronique).

## 3. PROBLÈMES UX
- **Lisibilité mobile** : Texte petit (13px/12px), faible contraste (rgba(200,195,185,0.6) sur #0d0d10), padding trop faible sur petits écrans.
- **Accessibilité** : Pas d'attributs ARIA, ratios contraste insuffisants (<4.5:1 pour AA), pas d'`alt` (images absentes mais prêt), focus invisible sur lien retour, pas de `lang` sur sections.
- **Navigation** : Pas de fil d'Ariane, lien retour vers "/" assume accueil (pas sémantique), scroll long sans table des matières.

## 4. AMÉLIORATIONS concrètes (priorité ↓)
1. **Corriger accents + ajouter mentions obligatoires** : Téléphone, SIREN/SIRET, adresse complète. Aligner sur congrès (supprimer sos-toutou.fr/vétérinaire)[1][2][3].
2. **Améliorer accessibilité** : Ajouter `role="main"`, `aria-labelledby`, media queries pour mobile (`font-size: clamp(14px, 2vw, 16px)`), tester contraste WCAG.
3. **Optimiser mobile** : `padding: 20px 16px` sur `.ml-container`, boutons tactiles (min 44px).
4. **Ajouter table des matières** : Liens internes vers sections (#section1) en haut pour navigation rapide.
5. **Supprimer script externe** : Intégrer inline ou vérifier existence.

## 5. CE QUI EST BIEN
- **Design cohérent/thématique** : Palette sombre élégante, numérotation visuelle, responsive de base.
- **Structure claire** : Sections logiques, bien segmentées, facile à scanner.
- **Contenu complet/juridique** : Couvre RGPD, PI, hébergeur (conforme base légale française)[1][4].

---


## erp.html

# Audit UX/UI - erp.html

## 1. NOTE /10

| Catégorie | Note |
|-----------|------|
| **UX** | 3/10 |
| **Design** | 2/10 |
| **Contenu** | 4/10 |
| **Technique** | 5/10 |
| **MOYENNE** | **3.5/10** |

---

## 2. BUGS ET ERREURS TECHNIQUES

- **Redirection double** : Utilisation simultanée de `<meta http-equiv="refresh">` ET `window.location.href` crée une redirection redondante et inefficace
- **Pas de fallback** : Si `admin.html#erp-dashboard` n'existe pas, l'utilisateur se retrouve bloqué sans message d'erreur explicite
- **Titre générique** : "Redirection ERP..." ne communique pas le contexte du projet (Congrès Strasbourg)
- **Pas de timeout** : Aucun délai défini pour la redirection, risque de boucle infinie si la cible est inaccessible

---

## 3. PROBLÈMES UX

- **Absence totale de feedback utilisateur** : L'utilisateur ne sait pas pourquoi il est redirigé ni vers où
- **Pas de message d'erreur** : Si la redirection échoue, aucune indication n'est donnée
- **Accessibilité critique** : Les lecteurs d'écran ne captent que "Redirection vers le back-office unifié..." sans contexte
- **Mobile** : Le lien de secours est trop petit et peu visible sur petits écrans
- **Violation des heuristiques Nielsen** : Pas de **visibilité du statut système**[1] ni de **contrôle utilisateur**[1]

---

## 4. AMÉLIORATIONS CONCRÈTES (par priorité)

1. **Remplacer la redirection par une page intermédiaire claire**
   - Afficher un message explicite : "Accès au back-office - Congrès Strasbourg"
   - Ajouter une barre de progression ou un spinner
   - Proposer un bouton cliquable comme alternative

2. **Ajouter un timeout et gestion d'erreur**
   ```javascript
   setTimeout(() => {
     if (!window.location.href.includes('admin.html')) {
       document.body.innerHTML = '<p>Erreur de redirection. <a href="index.html">Retour à l\'accueil</a></p>';
     }
   }, 5000);
   ```

3. **Supprimer la redirection HTML au profit du JavaScript seul**
   - Garder uniquement `window.location.href` pour éviter les conflits

4. **Améliorer l'accessibilité**
   - Ajouter `role="status"` et `aria-live="polite"` pour les lecteurs d'écran
   - Utiliser un titre pertinent : `<title>Accès back-office - Les Rendez-vous Géopolitiques</title>`

5. **Implémenter un fallback visible**
   ```html
   <noscript>
     <p>JavaScript désactivé. <a href="admin.html#erp-dashboard">Cliquez ici pour continuer</a></p>
   </noscript>
   ```

---

## 5. CE QUI EST BIEN

- ✓ **Lien de secours présent** : Le texte cliquable offre une alternative si la redirection échoue
- ✓ **Charset UTF-8 déclaré** : Évite les problèmes d'encodage
- ✓ **Simplicité du code** : Structure minimale et rapide à charger

---


## CORRECTIONS APPLIQUEES

### mentions-legales.html (30+ corrections)
- Titre : "Mentions legales" -> "Mentions légales — Les Rendez-vous Géopolitiques de Strasbourg"
- Tous les accents manquants corrigés (légales, Conformément, économie, numérique, Éditeur, Hébergeur, données, propriété, européenne, antériorité, représentation, autorisée, contrefaçon, Règlement, libertés, portabilité, nécessaire, finalité, requièrent, développement, Génération, responsabilité, caractère, résultat, compétente, présentes, défendeurs, réservés)
- Email contact@sos-toutou.fr -> contact@congres-strasbourg.fr (cohérence projet)
- Supprimé référence "Sources scientifiques : PubMed, BSAVA, Merck Veterinary Manual" (incohérent avec congrès)
- Finalité changée de "orientation et triage" à "organisation événementielle"

### erp.html (refonte complète)
- Titre générique -> "Accès back-office — Les Rendez-vous Géopolitiques de Strasbourg"
- Supprimé double redirection (meta refresh + JS)
- Ajout spinner de chargement + style cohérent
- Ajout noscript fallback
- Ajout role="status" aria-live="polite" pour accessibilité
- Fix "unifie" -> "unifié" (accent)

### saucisse.html (100+ corrections)
- Titre et description : accents corrigés (Congrès, 1ère, européen, dédié, dégustations)
- Navigation complète : Actualités, Médiathèque, Thématiques, Cafés, Dégustation
- Hero : 1ère Édition, Dégustations, Conférences, présents, Découvrir le Congrès
- Toutes les sections : actualités, thématiques, programme, intervenants, médiathèque, congrès, cafés, professionnel, infos pratiques, presse, inscription, partenaires, footer
- 100+ accents manquants corrigés dans tout le document
- Lien "Mentions légales" dans footer : href="#" -> href="mentions-legales.html"
- Leaflet popup : Palais des Congrès, Congrès de la Saucisse

### admin.html (1 correction)
- Titre : `G&eacute;opolitiques` -> `Géopolitiques` (UTF-8 natif au lieu d'entité HTML)

### Déploiement
- Site déployé sur Cloudflare Pages : **https://congres-saucisse.pages.dev**

---
*Rapport généré automatiquement par Perplexity Sonar + corrections appliquées par Claude Code*
