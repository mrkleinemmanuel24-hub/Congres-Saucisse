/* ═══════════════════════════════════════════════════════
   DASHBOARD STEPHANIE — Espace personnel
   Design: Noir et Or (admin theme)
   Charts: Chart.js
   ═══════════════════════════════════════════════════════ */

SPA_INIT.stephanie = function() {
  var el = document.getElementById('section-stephanie');
  var stats = CONGRES.getStats();
  var ins = CONGRES.loadInscriptions();

  // Capacite max du congres
  var CAPACITE_MAX = 1800;
  var CONGRESS_DATE = new Date('2026-06-12');
  var today = new Date();
  var joursRestants = Math.max(0, Math.ceil((CONGRESS_DATE - today) / (1000 * 60 * 60 * 24)));

  // Calcul benefice/perte estime (simple: revenus - budget prevu)
  var budgetPrevu = 164300;
  var benefice = stats.revenue - budgetPrevu;
  var tauxRemplissage = Math.round((stats.total / CAPACITE_MAX) * 100);

  // Depenses fictives par poste pour la demo
  var depenses = {
    'Lieu & technique': 53000,
    'Traiteur': 28000,
    'Personnel': 15490,
    'Speakers': 13400,
    'Communication': 13100,
    'Logistique': 6200,
    'Assurances': 2400,
    'Administratif': 3200,
    'Impr\u00e9vus': 24600
  };

  // Revenus par source
  var revenusSources = {
    'Inscriptions': stats.revenue,
    'Sponsors': 75000,
    'Dons': 2000,
    'Subventions': 15000
  };

  // Donnees simulees d'inscriptions jour par jour (3 mois)
  var inscriptionsParJour = [];
  var labelsJours = [];
  var cumul = 0;
  for (var d = 90; d >= 0; d--) {
    var dt = new Date(CONGRESS_DATE);
    dt.setDate(dt.getDate() - d);
    if (dt > today) break;
    var ajout = Math.floor(Math.random() * 4) + (d < 30 ? 2 : 0);
    cumul += ajout;
    inscriptionsParJour.push(cumul);
    labelsJours.push(dt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }));
  }

  // Taux d'occupation des salles
  var sallesOccupation = [];
  CONGRES.SALLES.forEach(function(s) {
    var sessions = CONGRES.getSessionsBySalle(s.id);
    var maxOcc = 0;
    sessions.forEach(function(sess) {
      var pct = Math.round((sess.inscrits / s.capacite) * 100);
      if (pct > maxOcc) maxOcc = pct;
    });
    sallesOccupation.push({ nom: s.nom, pct: maxOcc });
  });
  var occMoyenne = sallesOccupation.length > 0 ? Math.round(sallesOccupation.reduce(function(a, b) { return a + b.pct; }, 0) / sallesOccupation.length) : 0;

  // Build HTML
  var html = '<div class="admin-content" style="display:block !important;">' +

    // Welcome banner
    '<div style="background:linear-gradient(135deg,#1a1a2e,#161822);border:2px solid rgba(201,168,76,.3);border-radius:20px;padding:32px 40px;margin-bottom:32px;">' +
      '<h1 style="color:#C9A84C;font-size:1.6rem;font-weight:800;margin-bottom:8px;">Bonjour Stephanie !</h1>' +
      '<p style="color:#9B978F;font-size:1rem;">Voici votre tableau de bord. Tous les indicateurs de votre congres en un coup d\'oeil.</p>' +
    '</div>' +

    // KPIs
    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;margin-bottom:32px;">' +
      '<div style="background:#161822;border:1px solid rgba(201,168,76,.15);border-radius:14px;padding:24px;text-align:center;">' +
        '<div style="font-size:2.2rem;font-weight:800;color:#C9A84C;">' + stats.total + '</div>' +
        '<div style="font-size:.82rem;color:#9B978F;font-weight:600;">Inscrits total</div>' +
      '</div>' +
      '<div style="background:#161822;border:1px solid rgba(201,168,76,.15);border-radius:14px;padding:24px;text-align:center;">' +
        '<div style="font-size:2.2rem;font-weight:800;color:#C9A84C;">' + stats.revenue.toLocaleString('fr-FR') + ' &euro;</div>' +
        '<div style="font-size:.82rem;color:#9B978F;font-weight:600;">Revenus total</div>' +
      '</div>' +
      '<div style="background:#161822;border:1px solid rgba(201,168,76,.15);border-radius:14px;padding:24px;text-align:center;">' +
        '<div style="font-size:2.2rem;font-weight:800;color:#C9A84C;">' + tauxRemplissage + '%</div>' +
        '<div style="font-size:.82rem;color:#9B978F;font-weight:600;">Taux de remplissage</div>' +
      '</div>' +
      '<div style="background:#161822;border:1px solid ' + (benefice >= 0 ? 'rgba(34,197,94,.3)' : 'rgba(220,38,38,.3)') + ';border-radius:14px;padding:24px;text-align:center;">' +
        '<div style="font-size:2.2rem;font-weight:800;color:' + (benefice >= 0 ? '#22C55E' : '#DC2626') + ';">' + (benefice >= 0 ? '+' : '') + benefice.toLocaleString('fr-FR') + ' &euro;</div>' +
        '<div style="font-size:.82rem;color:#9B978F;font-weight:600;">Benefice / Perte estime</div>' +
      '</div>' +
      '<div style="background:#161822;border:1px solid rgba(201,168,76,.15);border-radius:14px;padding:24px;text-align:center;">' +
        '<div style="font-size:2.2rem;font-weight:800;color:' + (joursRestants < 30 ? '#F59E0B' : '#C9A84C') + ';">' + joursRestants + '</div>' +
        '<div style="font-size:.82rem;color:#9B978F;font-weight:600;">Jours restants</div>' +
      '</div>' +
    '</div>' +

    // Charts row 1: Pie inscrits + Line evolution
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;">' +
      '<div style="background:#161822;border:1px solid rgba(201,168,76,.1);border-radius:14px;padding:24px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
          '<h3 style="color:#C9A84C;font-size:1rem;font-weight:700;">Repartition par type de pass</h3>' +
          '<button onclick="SPA_STEPH.toggleChart(0)" style="background:rgba(201,168,76,.1);border:none;border-radius:8px;padding:4px 12px;color:#C9A84C;cursor:pointer;font-size:.75rem;">Changer type</button>' +
        '</div>' +
        '<div style="max-height:300px;display:flex;justify-content:center;"><canvas id="steph-chart-pass"></canvas></div>' +
      '</div>' +
      '<div style="background:#161822;border:1px solid rgba(201,168,76,.1);border-radius:14px;padding:24px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
          '<h3 style="color:#C9A84C;font-size:1rem;font-weight:700;">Evolution des inscriptions</h3>' +
          '<button onclick="SPA_STEPH.toggleChart(1)" style="background:rgba(201,168,76,.1);border:none;border-radius:8px;padding:4px 12px;color:#C9A84C;cursor:pointer;font-size:.75rem;">Changer type</button>' +
        '</div>' +
        '<div style="max-height:300px;"><canvas id="steph-chart-evolution"></canvas></div>' +
      '</div>' +
    '</div>' +

    // Charts row 2: Bar revenus + Pie depenses
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;">' +
      '<div style="background:#161822;border:1px solid rgba(201,168,76,.1);border-radius:14px;padding:24px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
          '<h3 style="color:#C9A84C;font-size:1rem;font-weight:700;">Revenus par source</h3>' +
          '<button onclick="SPA_STEPH.toggleChart(2)" style="background:rgba(201,168,76,.1);border:none;border-radius:8px;padding:4px 12px;color:#C9A84C;cursor:pointer;font-size:.75rem;">Changer type</button>' +
        '</div>' +
        '<div style="max-height:300px;"><canvas id="steph-chart-revenus"></canvas></div>' +
      '</div>' +
      '<div style="background:#161822;border:1px solid rgba(201,168,76,.1);border-radius:14px;padding:24px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
          '<h3 style="color:#C9A84C;font-size:1rem;font-weight:700;">Repartition des depenses</h3>' +
          '<button onclick="SPA_STEPH.toggleChart(3)" style="background:rgba(201,168,76,.1);border:none;border-radius:8px;padding:4px 12px;color:#C9A84C;cursor:pointer;font-size:.75rem;">Changer type</button>' +
        '</div>' +
        '<div style="max-height:300px;display:flex;justify-content:center;"><canvas id="steph-chart-depenses"></canvas></div>' +
      '</div>' +
    '</div>' +

    // Chart row 3: Jauge occupation salles
    '<div style="background:#161822;border:1px solid rgba(201,168,76,.1);border-radius:14px;padding:24px;margin-bottom:24px;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
        '<h3 style="color:#C9A84C;font-size:1rem;font-weight:700;">Taux d\'occupation moyen des salles : ' + occMoyenne + '%</h3>' +
        '<button onclick="SPA_STEPH.toggleChart(4)" style="background:rgba(201,168,76,.1);border:none;border-radius:8px;padding:4px 12px;color:#C9A84C;cursor:pointer;font-size:.75rem;">Changer type</button>' +
      '</div>' +
      '<div style="max-height:300px;"><canvas id="steph-chart-salles"></canvas></div>' +
    '</div>' +

    // Alertes
    '<div style="background:#161822;border:1px solid rgba(201,168,76,.1);border-radius:14px;padding:24px;margin-bottom:24px;">' +
      '<h3 style="color:#C9A84C;font-size:1rem;font-weight:700;margin-bottom:16px;">Alertes</h3>' +
      '<div style="display:grid;gap:10px;">' +
        '<div style="padding:14px 18px;background:rgba(245,158,11,.08);border-left:4px solid #F59E0B;border-radius:10px;display:flex;align-items:center;gap:12px;">' +
          '<span style="font-size:1.4rem;">&#9888;</span>' +
          '<div><div style="font-weight:700;font-size:.88rem;color:#F59E0B;">Salle Erasme a 85%</div><div style="font-size:.78rem;color:#9B978F;">Risque de surcharge. Envisager une salle supplementaire.</div></div>' +
        '</div>' +
        '<div style="padding:14px 18px;background:rgba(245,158,11,.08);border-left:4px solid #F59E0B;border-radius:10px;display:flex;align-items:center;gap:12px;">' +
          '<span style="font-size:1.4rem;">&#127942;</span>' +
          '<div><div style="font-weight:700;font-size:.88rem;color:#F59E0B;">15 inscriptions VIP Platinum</div><div style="font-size:.78rem;color:#9B978F;">Objectif : 20. Il manque 5 inscriptions Platinum.</div></div>' +
        '</div>' +
        '<div style="padding:14px 18px;background:rgba(220,38,38,.08);border-left:4px solid #DC2626;border-radius:10px;display:flex;align-items:center;gap:12px;">' +
          '<span style="font-size:1.4rem;">&#128680;</span>' +
          '<div><div style="font-weight:700;font-size:.88rem;color:#DC2626;">Budget traiteur depasse de 5%</div><div style="font-size:.78rem;color:#9B978F;">Depense reelle : 29 400 &euro; vs budget 28 000 &euro;. Reneg. necessaire.</div></div>' +
        '</div>' +
        '<div style="padding:14px 18px;background:rgba(245,158,11,.08);border-left:4px solid #F59E0B;border-radius:10px;display:flex;align-items:center;gap:12px;">' +
          '<span style="font-size:1.4rem;">&#9745;</span>' +
          '<div><div style="font-weight:700;font-size:.88rem;color:#F59E0B;">Checklist securite a 45%</div><div style="font-size:.78rem;color:#9B978F;">Plan d\'\u00e9vacuation, SSIAP et verification DAE en attente.</div></div>' +
        '</div>' +
      '</div>' +
    '</div>' +

  '</div>';

  el.innerHTML = html;

  // Initialize Charts
  var chartTypes = ['pie', 'line', 'bar', 'pie', 'bar'];
  var chartInstances = [null, null, null, null, null];
  var chartConfigs = [];

  var passLabels = [];
  var passData = [];
  var passColors = [];
  var pn = { standard: 'Standard', bronze: 'VIP Bronze', gold: 'VIP Gold', platinum: 'VIP Platinum' };
  var pc = { standard: '#9CA3AF', bronze: '#CD7F32', gold: '#FFD300', platinum: '#C8C8DC' };
  Object.keys(pn).forEach(function(k) {
    passLabels.push(pn[k]);
    passData.push(stats.byPass[k] || 0);
    passColors.push(pc[k]);
  });

  // Chart 0: Repartition par pass
  chartConfigs[0] = {
    labels: passLabels,
    datasets: [{ data: passData, backgroundColor: passColors, borderWidth: 0 }]
  };

  // Chart 1: Evolution inscriptions
  chartConfigs[1] = {
    labels: labelsJours,
    datasets: [{
      label: 'Inscriptions cumulees',
      data: inscriptionsParJour,
      borderColor: '#C9A84C',
      backgroundColor: 'rgba(201,168,76,.15)',
      fill: true,
      tension: 0.3,
      pointRadius: 0
    }]
  };

  // Chart 2: Revenus par source
  var revLabels = Object.keys(revenusSources);
  var revData = Object.values(revenusSources);
  var revColors = ['#C9A84C', '#22C55E', '#3B82F6', '#F59E0B'];
  chartConfigs[2] = {
    labels: revLabels,
    datasets: [{ data: revData, backgroundColor: revColors, borderWidth: 0 }]
  };

  // Chart 3: Depenses par poste
  var depLabels = Object.keys(depenses);
  var depData = Object.values(depenses);
  var depColors = ['#3B82F6', '#22C55E', '#F59E0B', '#DC2626', '#A855F7', '#EC4899', '#14B8A6', '#6366F1', '#9CA3AF'];
  chartConfigs[3] = {
    labels: depLabels,
    datasets: [{ data: depData, backgroundColor: depColors, borderWidth: 0 }]
  };

  // Chart 4: Occupation salles
  var salleLabels = sallesOccupation.map(function(s) { return s.nom; });
  var salleData = sallesOccupation.map(function(s) { return s.pct; });
  var salleColors = sallesOccupation.map(function(s) {
    if (s.pct >= 90) return '#DC2626';
    if (s.pct >= 70) return '#F59E0B';
    return '#22C55E';
  });
  chartConfigs[4] = {
    labels: salleLabels,
    datasets: [{
      label: 'Occupation %',
      data: salleData,
      backgroundColor: salleColors,
      borderWidth: 0,
      borderRadius: 6
    }]
  };

  var chartCanvases = [
    'steph-chart-pass',
    'steph-chart-evolution',
    'steph-chart-revenus',
    'steph-chart-depenses',
    'steph-chart-salles'
  ];

  var defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#9B978F', font: { size: 11 } }
      }
    }
  };

  var scaleOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#9B978F', font: { size: 11 } } }
    },
    scales: {
      x: { ticks: { color: '#5F5C55', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,.04)' } },
      y: { ticks: { color: '#5F5C55', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,.04)' } }
    }
  };

  function createChart(idx) {
    var canvas = document.getElementById(chartCanvases[idx]);
    if (!canvas) return;
    if (chartInstances[idx]) chartInstances[idx].destroy();
    var type = chartTypes[idx];
    var opts = (type === 'pie' || type === 'doughnut') ? defaultOptions : scaleOptions;
    chartInstances[idx] = new Chart(canvas, {
      type: type,
      data: JSON.parse(JSON.stringify(chartConfigs[idx])),
      options: opts
    });
  }

  // Create all charts
  setTimeout(function() {
    for (var i = 0; i < 5; i++) createChart(i);
  }, 100);

  // Toggle chart type
  var typeSequence = ['pie', 'bar', 'line', 'doughnut', 'polarArea'];
  window.SPA_STEPH = {
    toggleChart: function(idx) {
      var current = chartTypes[idx];
      var ci = typeSequence.indexOf(current);
      // For line/bar-only charts (idx 1, 4), cycle between line/bar
      if (idx === 1 || idx === 4) {
        chartTypes[idx] = current === 'line' ? 'bar' : (current === 'bar' ? 'line' : 'bar');
      } else {
        chartTypes[idx] = typeSequence[(ci + 1) % typeSequence.length];
      }
      createChart(idx);
    }
  };
};
