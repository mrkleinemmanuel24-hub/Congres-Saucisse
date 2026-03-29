#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const API_KEY = 'AIzaSyAWB5n7DoYj0VQTIMCsvewbT4DNSS9a0_Q';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const PAGES = ['index.html','saucisse.html','strasbourg.html','stephanie.html','admin.html','mentions-legales.html','erp.html'];

async function auditPage(filename, html) {
  const prompt = `Tu es un auditeur UX/UI senior. Audit COMPLET et SANS COMPLAISANCE d'un site evenementiel pour un congres politique/societal/environnemental a Strasbourg. 3 themes graphiques (Classique, Strasbourg, Moderne).

PAGE : ${filename}

Analyse ces 9 points :
1. PREMIERE IMPRESSION (3 secondes)
2. PARCOURS UTILISATEUR
3. CONTENU ET TON
4. DESIGN ET CONFIANCE
5. MOBILE ET ACCESSIBILITE
6. BUGS TECHNIQUES (accents, liens, HTML/JS/CSS)
7. 5 CORRECTIONS PRIORITAIRES (texte AVANT et APRES)
8. NOTE /20 (UX /5, Design /5, Contenu /5, Technique /5)
9. CE QUI EST EXCELLENT (3 points forts)

CODE SOURCE :
\`\`\`html
${html}
\`\`\``;

  const res = await fetch(API_URL + '?key=' + API_KEY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 8000 }
    })
  });
  if (!res.ok) { const e = await res.text(); console.error('  API error:', res.status); return '## ' + filename + '\nERREUR API ' + res.status + '\n\n---\n\n'; }
  const data = await res.json();
  console.log('    tokens:', data.usageMetadata?.totalTokenCount || '?');
  return '## ' + filename + '\n\n' + (data.candidates?.[0]?.content?.parts?.[0]?.text || 'Pas de reponse') + '\n\n---\n\n';
}

async function main() {
  console.log('\n  AUDIT GEMINI — Congres Strasbourg (' + PAGES.length + ' pages)\n');
  let report = '# Audit Gemini — Congres Strasbourg\nDate: ' + new Date().toLocaleDateString('fr-FR') + '\n\n---\n\n';
  for (let i = 0; i < PAGES.length; i++) {
    try {
      const html = readFileSync(join('.', PAGES[i]), 'utf-8');
      console.log('  [' + (i+1) + '/' + PAGES.length + '] ' + PAGES[i] + ' (' + Math.round(html.length/1024) + 'KB)');
      report += await auditPage(PAGES[i], html);
      console.log('  OK\n');
      await new Promise(r => setTimeout(r, 2000));
    } catch(e) { console.log('  SKIP ' + PAGES[i]); }
  }
  writeFileSync('AUDIT_GEMINI.md', report, 'utf-8');
  console.log('  DONE -> AUDIT_GEMINI.md');
}
main();
