# BWE — Beeken Web Engineering

**Inhaber:** Max Beeken · **Domain:** beekenwebengineering.com (Registrar: Squarespace) · **Hosting:** GitHub Pages · **Verfügbar:** ab Juli 2026

## Hauptdatei & Live-Seite
**Masterdatei: `index.html`** — die EINZIGE Quelldatei der Homepage, direkt hier editieren. GitHub Pages liefert sie unter `/` aus. (`codeform.html` wurde am 2026-06-11 abgeschafft — es gibt keinen Kopier-/Sync-Schritt mehr.) `legal.html` → `/legal` · `404.html` → Fehlerseite. Andere HTML-Dateien sind nicht live.

## Deployment (GitHub Pages — NICHT Vercel!)
Hosting = **GitHub Pages**. Repo `maxbeeken-dot/beekenwebengineering`, Branch `main`, Custom-Domain via `CNAME`. Die Domain ist bei **Squarespace** nur registriert (Registrar/DNS → zeigt auf GitHub Pages); es gibt **keinen Squarespace-Baukasten**. `vercel.json` / `.vercelignore` sind Altlasten und werden von GitHub Pages **ignoriert**.

**Veröffentlichen:** Aus der Agent-/Sandbox-Umgebung **hängt `git push`** (Schreibpfad zu GitHub blockiert; Lesen + `gh api` funktionieren). Daher per **GitHub Contents API** committen:
`gh api -X PUT repos/maxbeeken-dot/beekenwebengineering/contents/<datei> --input <payload.json>` mit JSON `{message, content:<base64>, sha:<aktuelle Blob-sha aus `gh api repos/.../contents/<datei>?ref=main --jq .sha`>, branch:"main"}` (neue Dateien: ohne `sha`; Löschen: `-X DELETE` mit `sha`). Danach lokal `git fetch origin main && git reset --hard origin/main`. GitHub Pages baut automatisch (~1 Min). **Von Max' eigenem Rechner** geht normaler `git push origin main`.

## Tech
Reines HTML/CSS/JS · Bricolage Grotesque (Display) + Epilogue (Body) — **selbst gehostet** in `fonts/` (variable WOFF2, DSGVO: keine Google-Font-Server!) · GA4 `G-8TF95LBYRV` (Consent v2) · Formspree `https://formspree.io/f/xaqzwzja` → `maxbeeken@beekenwebengineering.com` · CSP per `<meta>` + Referrer-Policy · MCP: 21st.dev Magic

## Design-Tokens (Dark Mode Standard / Light: `[data-theme="light"]`)
```css
--bg:oklch(0.08 0 0); --surface:oklch(0.13 0.010 280); --surface-hi:oklch(0.18 0.013 280);
--ink:oklch(0.96 0.004 280); --ink-muted:oklch(0.56 0.010 280); --ink-dim:oklch(0.34 0.008 280);
--primary:oklch(0.60 0.200 280); --primary-hi:oklch(0.66 0.188 280); --primary-dim:oklch(0.60 0.200 280/0.14);
--accent:oklch(0.74 0.148 195); --border:oklch(0.22 0.012 280); --border-subtle:oklch(0.15 0.007 280);
--font-display:'Bricolage Grotesque'; --font-body:'Epilogue';
--ease-expo:cubic-bezier(0.16,1,0.3,1); --ease-quart:cubic-bezier(0.25,1,0.5,1);
--max-w:1280px; --nav-h:68px; --pad:clamp(1.5rem,5vw,4rem); --section-gap:clamp(6rem,12vw,10rem);
```
Klassen: `.t-display` `.t-heading` `.t-body` `.t-small` `.t-label`

## Seitenstruktur (index.html)
Skip-Link → `.nav` (fixed, frosted-glass @scroll, Scroll-Spy) → `.trace` (integrierter Tracing-Beam: Spur links im Inhalt von Hero-Ende bis Kontakt, Füllung Violett→Teal + Leuchtkopf = Lesefortschritt, Desktop ≥961px) → `.hero` (fullscreen, SVG-Laptop + Typewriter, Canvas-Dotgrid, Orbs; mobil: Laptop statisch im Fluss) → `.strip` (Marquee) → `.services#services` (DL-Layout, 3 Einträge, gezeichnete SVG-Icons) → `.work2#arbeiten` (3 Browser-Mockups, 3D-Tilt) → `.versus#vergleich` (Baukasten vs. Handarbeit) → `.process#process` (4-Grid + Linie) → `.play#interaktiv` (interaktives Punktfeld, Canvas) → `.proof#beweis` (Live-Performance-Messung, Performance-API) → `.contact#contact` (Formspree, Inline-Fehler) → Cookie-Banner (DSGVO, `bwe_cookie_consent`) → `<footer>` · Theme: Dark = Standard, Wahl in localStorage `bwe_theme`

## A11y (nicht verhandelbar)
WCAG AA · Semantisches HTML · `aria-*` vollständig · `:focus-visible` 2px `--primary` offset 3px · Kontrast body≥4.5:1 groß≥3:1 · `prefers-reduced-motion` überall

## Brand
Präzise · Vertrauenswürdig · Modern · Zeigen statt erzählen · **Anti-Pattern:** Neon-Glow, Stock-Fotos, AI-Ästhetik, leere Zahlenversprechen
**Angebot/Positionierung:** Die fertige Website gehört dem Kunden (kein Mietmodell). **Aber:** es gibt einen **optionalen monatlichen Service** (Pflege/Betreuung). Deshalb in der Copy **niemals** mit „keine monatlichen Gebühren / für immer kostenlos" o.ä. werben — das widerspricht dem Service. Eigentum ja, „nie monatlich zahlen" nein.

## Keys
GA4 `G-8TF95LBYRV` · Formspree `https://formspree.io/f/xaqzwzja` · localStorage `bwe_cookie_consent` · 21st.dev `89b85c03f38207003d959ae937154b04e93288e41b4fdb94910fd2a70c56b2fd`

## Dateien auf einen Blick

| Datei | Beschreibung |
|---|---|
| `index.html` | **Masterdatei & Live-Homepage** unter `/` — die einzige Quelldatei, direkt hier editieren |
| `legal.html` | Impressum & Datenschutz — live unter `/legal` |
| `404.html` | Markenkonforme Fehlerseite (GitHub Pages nutzt sie automatisch) |
| `fonts/` | Selbst gehostete variable WOFF2-Fonts (Bricolage Grotesque, Epilogue — DSGVO) |
| `fonts/bricolage-grotesque-var.woff2` | Variable WOFF2-Font: Bricolage Grotesque (Display-Schrift) |
| `fonts/epilogue-var.woff2` | Variable WOFF2-Font: Epilogue (Body-Schrift) |
| `og-image.png` | Social-Sharing-Bild 1200×630 (Open Graph / Twitter) |
| `index_deploy.html` | Staging-/Deploy-Testversion, nicht live |
| `signatur-kopieren.html` | E-Mail-Signatur-Generator, lokal genutzt |
| `dashboard.html` | J.A.R.V.I.S. Business-Dashboard — lokales HUD mit Aufgaben, Projekten, Leads und Analytics (nicht live) |
| `vercel.json` | Altlast aus Vercel-Zeit — von GitHub Pages **ignoriert** (kein aktives Deployment) |
| `.vercelignore` | Altlast aus Vercel-Zeit — von GitHub Pages **ignoriert** |
| `.htaccess` | Apache-Konfiguration (Weiterleitungen, Caching) |
| `.gitignore` | Git-Ausschlussliste |
| `.mcp.json` | MCP-Server-Konfiguration (21st.dev Magic) |
| `CLAUDE.md` | Projektdokumentation für Claude Code |
| `PRODUCT.md` | Produktbeschreibung / Feature-Dokumentation |
| `CNAME` | Custom-Domain für **GitHub Pages** (`beekenwebengineering.com`) |
| `robots.txt` | SEO-Crawling-Steuerung |
| `llms.txt` | Kontextdatei für AI-Systeme (llmstxt.org-Standard) zur besseren AI-Sichtbarkeit |
| `sitemap.xml` | XML-Sitemap für Suchmaschinen |
| `google9fc278bb26ec797c.html` | Google-Search-Console-Verifizierungsdatei (muss live bleiben) |
| `skills-lock.json` | Claude-Skills-Versionsdatei |
| `logo.png` | Haupt-Logo (Originalformat) |
| `logo-200.png` | Logo-Variante 200 px |
| `logo-96.png` | Logo-Variante 96 px (Favicon-Größe) |
| `logo-square.png` | Quadratisches Logo |
| `Gemini_Generated_Image_s1ulens1ulens1ul.png` | KI-generiertes Bild (Gemini, nicht produktiv) |
| `Müll/` | Archiv/Papierkorb — ausgemusterte Dateien und alte Entwürfe |
| `Müll/index.html` | Archivierte alte Startseite |
| `Müll/README.md` | Archivierte Projektdokumentation |
| `Müll/DEPLOYMENT-GUIDE.md` | Archivierter Deployment-Leitfaden |
| `Müll/QUICK-START.md` | Archivierte Schnellstart-Anleitung |
| `Müll/SKILL.md` | Archivierte Skill-Definition |
| `Müll/skills-lock.json` | Archivierte Skills-Versionsdatei |
| `Müll/LICENSE.txt` | Archivierte Lizenzdatei |
| `.env.ads` | Lokale Ads-Agent API-Keys (gitignored, nie committen) |
| `.env.ads.example` | Template für Ads-Agent API-Keys (→ `.env.ads` lokal, nie committen) |
| `package.json` | npm-Manifest im Hauptverzeichnis (Abhängigkeiten des Projekts) |
| `package-lock.json` | npm-Sperrdatei im Hauptverzeichnis (exakte Abhängigkeitsversionen) |
| `render-creatives.mjs` | Node.js-Script zum Rendern von Werbe-Creatives (lokal ausgeführt) |
| `ads-log.json` | Automatisches Upload-Log des Ads-Agenten (gitignored) |
| `ads-videos/` | Gerenderte Werbevideos (gitignored) |
| `ads-videos/kampagne-launch-2026/` | Kampagnen-Unterordner mit Creatives, Scripts, Copy und Briefing für die Launch-Kampagne 2026 |
| `ads-videos/accounts/` | Social-Media-Account-Daten und Assets für den Ads-Agenten |
| `.agents/` | Claude Code Agent-Aufgabendateien (automatisch erzeugt) |
| `.vscode/` | VS Code Editor-Konfiguration |
| `node_modules/` | npm-Abhängigkeiten (automatisch installiert, nicht committet) |
| `.claude/` | Claude Code Skills, Einstellungen und Memory-Dateien |
| `.git/` | Git-Repository-Daten (Versionskontrolle, automatisch verwaltet) |
| `jarvis-mcp-server/` | Lokaler MCP-Server „Jarvis" (TypeScript) — Tools für Wetter, Websuche u.a. |
| `jarvis-mcp-server/package.json` | npm-Manifest des Jarvis-MCP-Servers |
| `jarvis-mcp-server/package-lock.json` | Gesperrte Abhängigkeiten des Jarvis-MCP-Servers |
| `jarvis-mcp-server/tsconfig.json` | TypeScript-Konfiguration des Jarvis-MCP-Servers |
| `jarvis-mcp-server/src/` | Quellcode des Jarvis-MCP-Servers |
| `jarvis-mcp-server/dist/` | Kompiliertes JavaScript (Build-Ausgabe) |
| `jarvis-mcp-server/node_modules/` | npm-Abhängigkeiten des Jarvis-MCP-Servers (automatisch installiert, nicht committet) |
| `jarvis-mcp-server/README.md` | Dokumentation und Setup-Anleitung für den Jarvis-MCP-Server |

## Ads Agent
Trigger: `/ads` · Skill: `.claude/skills/ads-agent/SKILL.md`  
**Plattformen:** TikTok · Meta (Facebook + Instagram) · LinkedIn · YouTube Shorts  
**API-Keys:** `.env.ads` (lokal, gitignored) — Template: `.env.ads.example`  
**Scripts:** `.claude/skills/ads-agent/scripts/` — einzeln oder via `campaign-manager.mjs`
