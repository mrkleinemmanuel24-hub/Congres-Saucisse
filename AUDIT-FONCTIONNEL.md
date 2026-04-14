# AUDIT FONCTIONNEL — Congres-Saucisse
**Date : 2026-04-13**
**Auditeur : Claude Sonnet 4.6**

---

## 1. Fonctions vides ou données codées en dur

| # | Fichier | Ligne | Statut | Problème |
|---|---------|-------|--------|---------|
| 1.1 | `js/config.js` | 23 | ⚠️ | `emailContact: ""` — champ vide non complété, utilisé nulle part mais censé centraliser le contact. |
| 1.2 | `stephanie.html` | 199, 239 | ❌ | `href="tel:"` — lien téléphonique vide : `<a href="tel:" class="phone-strip">`. Cliquer dessus ne fait rien. |
| 1.3 | `js/ip-protection.js` | 139, `mentions-legales.html` L148 | ⚠️ | Référence INPI `DSO2024-XXXXXX` encore placeholder dans le footer IP injecté sur toutes les pages et dans les mentions légales. Déjà signalé par AUDIT_GEMINI. |
| 1.4 | `js/dashboard-stephanie.js` | 24–30 | ⚠️ | Dépenses par poste (53 000 €, 28 000 €…) et revenus sponsors (75 000 €) et dons (2 000 €) sont des valeurs fixes codées en dur, indépendantes du simulateur financier et de l'ERP. Le dashboard Stéphanie et l'ERP vivent dans deux silos de données. |
| 1.5 | `js/dashboard-stephanie.js` | 51–55 | ⚠️ | Courbe d'évolution des inscriptions générée avec `Math.random()` à chaque appel de `SPA_INIT.stephanie`. Le graphique change à chaque navigation vers la section. |
| 1.6 | `js/spa-sections.js` | ~296–300 | ⚠️ | Boutons "Télécharger" du kit presse déclenchent `alert('Telechargement demo')` — fonctionnalité non implémentée exposée à l'utilisateur sans avertissement. |

---

## 2. Race conditions

| # | Fichier | Ligne | Statut | Problème |
|---|---------|-------|--------|---------|
| 2.1 | `js/rvgs-upgrade.js` | 971 | ⚠️ | `setTimeout(addGalaFinaleEvents, 500)` suppose que les données de `modules-extra.js` (chargé juste avant dans admin.html L940) sont prêtes dans 500 ms. Si le browser est lent ou si l'ordre des scripts change, `addGalaFinaleEvents` tente d'accéder à des structures non initialisées. |
| 2.2 | `js/dashboard-stephanie.js` | 293–295 | ⚠️ | `setTimeout(function() { for(var i=0;i<5;i++) createChart(i); }, 100)` — les canvas `steph-chart-*` sont injectés par `el.innerHTML = html` juste avant. 100 ms est généralement suffisant, mais sur CPU chargé (mobile bas de gamme) le repaint peut ne pas être terminé, causant un canvas à taille zéro. |
| 2.3 | `js/spa-sections.js` | 287 | ⚠️ | `setTimeout(function(){ L.map('spa-map')... }, 200)` avec un `invalidateSize` imbriqué à +300 ms. Double setTimeout pour pallier un problème de rendu : fragile si la section est naviguée rapidement (l'utilisateur repart avant les 500 ms cumulés). |
| 2.4 | `js/simulateur-financier.js` | 611 | ⚠️ | `window._simRenderTimer = setTimeout(render, 300)` — debounce manuel sans annulation propre si la fonction est rappelée avant expiration (bien que 300 ms soit court, pattern à surveiller). |
| 2.5 | `js/modules-extra.js` | 1170, 1195 | ⚠️ | Deux `setTimeout` distincts pour initialiser des charts dans la section badges/check-in. Même fragilité que 2.2. |

---

## 3. Données partagées entre fichiers avec formats incompatibles

| # | Fichiers | Statut | Problème |
|---|----------|--------|---------|
| 3.1 | `js/data.js` ↔ `js/rvgs-upgrade.js` | ❌ | **Conflit de schéma `pass` critique.** `data.js` (L110–116) définit les PASSES avec ids `standard/bronze/gold/platinum/staff`. `rvgs-upgrade.js` (L12–17) les remplace par `vip/speaker/invite/spectateur` et écrase `CONGRES.PASSES` et `CONGRES.getPass`. Les 5 inscriptions demo de `data.js` utilisent `pass: 'gold'`, `pass: 'standard'`, `pass: 'platinum'`, `pass: 'staff'` — après override, `CONGRES.getPass('gold')` retourne `undefined`. Le dashboard Stéphanie calcule `stats.revenue` via `getPass(i.pass).prix` — le `getPass` renvoie `undefined` → `undefined.prix` → **TypeError** potentiel (protégé par `if(p) revenue += p.prix` mais le revenu calculé sera **faux : 0 €** pour tous les anciens pass). |
| 3.2 | `js/data.js` ↔ `js/rvgs-upgrade.js` | ⚠️ | Les 250 participants générés par `rvgs-upgrade.js` ont les champs `checkedIn` et `scanTime` (non présents dans le schéma de `data.js`). Les fonctions de `data.js` (`loadInscriptions`, `getStats`) ignorent ces champs — le KPI "check-in" dans le dashboard lit ces champs directement depuis localStorage, créant deux lectures parallèles du même dataset. |
| 3.3 | `js/data.js` ↔ `admin.html` (ERP) | ⚠️ | `data.js` stocke les inscriptions sous `congres_inscriptions`. L'ERP dans `admin.html` stocke ses propres inscriptions sous `congres_erp_data.inscriptions`. Les deux listes coexistent sans synchronisation : une inscription ajoutée dans l'ERP n'apparaît pas dans les stats `CONGRES.getStats()`. |
| 3.4 | `js/modules-extra.js` ↔ `js/data.js` | ⚠️ | `modules-extra.js` gère ses propres événements/réservations sous la clé `congres_extra_data`. Les sessions dans ces événements (`E001`–`E005`) sont distinctes des sessions de `data.js` (ids numériques 1–32) : deux référentiels de sessions non connectés. |

---

## 4. Boutons ou liens qui ne font rien

| # | Fichier | Ligne | Statut | Problème |
|---|---------|-------|--------|---------|
| 4.1 | `stephanie.html` | 199, 239 | ❌ | Les deux liens `href="tel:"` (mode préparation ET mode Jour J) ne composent aucun numéro. |
| 4.2 | `admin.html` (footer section accueil) | L500–514 | ⚠️ | Les liens réseaux sociaux du footer (`href="#"` pour Facebook, X, Instagram, LinkedIn, YouTube, TikTok) ne pointent vers rien. Acceptable pour une démo mais à noter. |
| 4.3 | `js/spa-sections.js` (section Presse) | ~296 | ⚠️ | Boutons "Télécharger" communiqué/programme/biographies déclenchent un `alert('Telechargement demo')` — bouton visible mais non fonctionnel. |
| 4.4 | `stephanie.html` | 143–173 | ⚠️ | Les 8 raccourcis bento (`localStorage.setItem('rvgs-goto', 'participants')` etc.) écrivent une clé localStorage qui **n'est jamais lue** dans `admin.html` (aucune occurrence de `rvgs-goto` dans admin.html ni dans les JS). La navigation profonde depuis stephanie.html vers une section précise d'admin ne fonctionne pas : on atterrit toujours sur la section par défaut d'admin. |

---

## 5. Features disparues (commentaires, IDs orphelins)

| # | Fichier | Statut | Problème |
|---|---------|--------|---------|
| 5.1 | `admin.html` | L947 | ⚠️ | Commentaire `/* Password removed — open access for demo */` et `var adminUnlocked = true` — le système d'authentification a été retiré. La fonction `showAdmin()` ne fait plus rien de différent de `show()`. Si le projet passe en prod, il n'y a **aucune protection** des sections admin. |
| 5.2 | `js/content-filter.js` | L131 | ⚠️ | `var origAlert = window.alert;` et `window._contentFilterActive = true` — début d'une interception des alertes jamais complétée. `origAlert` est assigné mais jamais utilisé. |
| 5.3 | `admin.html` | L527 (`section-stephanie`) | ⚠️ | La section `stephanie` est dans admin.html et dans le dashboard admin, mais `stephanie.html` est un fichier séparé de tableau de bord organisateur. Les deux fichiers ont des fonctions identiques (mode prep/jour J, accès admin) sans lien clair : risque de divergence de maintenance. |

---

## 6. Appels réseau sans gestion d'erreur

| # | Fichier | Lignes | Statut | Problème |
|---|---------|--------|--------|---------|
| 6.1 | `vote.html` | 504–508 | ⚠️ | `fetch(API, { action: 'create' })` — `.catch(function() {})` silencieux. Si la session ne se crée pas sur le Worker, aucun feedback à l'animateur. |
| 6.2 | `vote.html` | 529–536 | ⚠️ | `fetchSession()` — `.catch(function() {})` silencieux. En cas de perte réseau prolongée, le compteur de participants reste figé à sa dernière valeur sans indication. |
| 6.3 | `vote.html` | 645–649, 931–935 | ⚠️ | `set_question` et `close_vote` vers l'API — `.catch(function() {})` silencieux. L'animateur pense avoir lancé/fermé un vote alors que l'API peut ne pas avoir reçu la commande. |
| 6.4 | `vote-participant.html` | 596–605, 622, 639, 652, 661, 670, 685 | ⚠️ | Tous les `submitVote`, `submitEstimation`, `submitWord`, `sendReaction`, `sendQuestion` — `.catch(function() {})` silencieux. Le participant voit "Vote enregistré !" même si le fetch a échoué (le vote est marqué localement dans `votedQuestions` mais l'API ne l'a pas reçu). |
| 6.5 | `vote-participant.html` | 406–410 | ⚠️ | `joinSession` — le `.catch` fait `saveLocal(); enterWaiting()` en mode dégradé sans avertir l'utilisateur que la connexion a échoué. Il croit être connecté à une session qui n'existe peut-être pas. |

---

## 7. Boucles infinies potentielles

| # | Fichier | Statut | Problème |
|---|---------|--------|---------|
| 7.1 | `vote.html` | ✅ OK | `startPolling` / `fetchSession` toutes les 2 s — bien géré : `clearInterval` avant de recréer, pas de récursion. |
| 7.2 | `vote-participant.html` | ✅ OK | `startPolling` / `fetchState` toutes les 2.5 s — même pattern sûr. |
| 7.3 | `js/simulateur-financier.js` | ✅ OK | `window._simRenderTimer` avec annulation du précédent avant relance — pas de boucle. |
| 7.4 | Aucun `while` non borné détecté | ✅ OK | Aucun pattern `while(true)` ou récursion sans condition d'arrêt identifié dans le code audité. |

---

## Conclusion

Trois bugs bloquants en conditions réelles :
1. **Conflit de schéma `pass`** (point 3.1) : après chargement de `rvgs-upgrade.js`, `CONGRES.getPass('gold')` retourne `undefined` — les revenus calculés par le dashboard Stéphanie sont nuls pour les 5 inscriptions demo originales.
2. **Navigation deep-link stephanie→admin cassée** (point 4.4) : `localStorage.setItem('rvgs-goto', ...)` écrit une clé que `admin.html` ne lit jamais — tous les raccourcis "Participants", "Badges", "Sécurité"… amènent sur la page par défaut.
3. **Votes silencieusement perdus** (point 6.4) : un participant voit la confirmation de vote même si le fetch a échoué — les données n'atteignent pas l'API Worker.
