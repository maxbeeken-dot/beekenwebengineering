# BWE Content-Plan — 2 Videos/Tag

**Woche:** Mo 2026-06-22 → So 2026-06-28
**Plattformen:** YouTube Shorts · X · TikTok · Facebook · LinkedIn
**Status-Legende:** ✅ hochgeladen · ⏳ offen (Login/CAPTCHA nötig) · 🔲 geplant · ⏸️ blockiert

## Upload-Status pro Video × Plattform

| Tag | Slot | Video | YouTube | X | TikTok | Facebook | LinkedIn |
|---|---|---|---|---|---|---|---|
| **Mo 22.06** | 1 | **Baukasten vs. Handarbeit** (Performance-Showdown) | ✅ | ✅ | ⏸️ | ⏸️ | ⏸️ |
| Mo 22.06 | 2 | **Website Glow-Up** (Before/After, viraler Hook) | ✅ | ✅ | ✅ | ⏸️ | ⏭️ |
| Di 23.06 | 1 | Web Red Flags (3 Zeichen für eine schlechte Website) | ✅ | ✅ | ✅ | ⏸️ | ⏭️ |
| Di 23.06 | 2 | „3,9s = 53% weg" (Ladezeit-Schock) | ✅ | ✅ | ✅ | ⏸️ | ⏭️ |
| Mi 24.06 | 1 | Website-Rettung (Redesign Vorher/Nachher) | ✅ | ✅ | ✅ | ⏸️ | ⏭️ |
| Mi 24.06 | 2 | Eigentum statt Mietmodell (dir gehört die Seite) | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |
| Do 25.06 | 1 | Mobile-Fail (Seite kaputt auf dem Handy) | ✅ | ✅ | ✅ | ✅ | ⏭️ | _(IG: Post blieb auf „Wird geteilt" hängen – frischer Account, später erneut)_
| Do 25.06 | 2 | **Kunde vs. Web-Engineer** (viraler Chat-Dialog, `ChatDeal`) | ✅ | ✅ | ✅ | ✅ | ⏭️ | _(IG: posted=true gemeldet, Profil zeigt aber weiter „0 Beiträge" – frischer Account blockiert)_
| Fr 26.06 | 1 | Trend/Meme-Jacking (aktueller Sound) | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |
| Fr 26.06 | 2 | DSGVO-Falle: Google Fonts | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |
| Sa 27.06 | 1 | Was kostet eine Website wirklich? | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |
| Sa 27.06 | 2 | Animationen, die verkaufen | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |
| So 28.06 | 1 | Code-Website vs. KI-Website | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |
| So 28.06 | 2 | „1 Woche, 1 Website" (Timelapse) | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |

## Offene Logins (nach Neustart, Sessions in ~/.bwe-sessions/ — bleiben künftig erhalten)

| Plattform | Status | Was fehlt |
|---|---|---|
| **X** | ✅ eingeloggt | — (läuft automatisch, `upload-x-auto.mjs`) |
| **TikTok** | ✅ eingeloggt | Login lief am 22.06 durch (`upload-tt-auto.mjs`, `tt-profile`) — Block aufgehoben |
| **Facebook** | ⛔ dauerhaft blockiert | 2FA-Code geht an einen für den Nutzer unzugänglichen Account → kein Upload möglich. Übergehen. |
| **LinkedIn** | ⏭️ ausgelassen | auf Nutzerwunsch vorerst weggelassen |
| **YouTube** | ✅ eingeloggt | — (`upload-yt-manual.mjs`, persistente `yt-profile`-Session) |

## Pipeline-Notizen
- **Render:** Remotion in `Test/video-studio/` (`node render.mjs <CompId>` → `out/<CompId>.mp4`). Der gebündelte Remotion-Browser-Download schlägt hier fehl („No browser found") → `render.mjs` zeigt jetzt fest auf das Playwright-`chrome-headless-shell` (`browserExecutable`). Funktioniert. Braucht freien RAM (8 GB → vor Render Apps schließen).
- **Captions:** `~/.bwe-sessions/cap-*.txt` (pro Video eigene Datei, z. B. `cap-glowup-*.txt`).
- **Uploader (sequenziell, 8 GB RAM!):** `lead-automation/upload-x-auto.mjs`, `upload-yt-manual.mjs` (NICHT `upload-yt.mjs` – das nutzt die tote `/tmp`-Session), `upload-tt-auto.mjs`, `upload-li.mjs`. Profile in `~/.bwe-sessions/` (neustartfest).
- **Eigene Sounds:** ElevenLabs-Key noch offen (Onboarding) → bis dahin Videos stumm + Trending-Sound in-App.
- **KI-Video (geplant):** „Google Omni" = **Gemini Omni** (Google I/O, 19.05.2026) – text/image/video-to-video, in der Gemini-App. Braucht Google-AI-Plus/Pro/Ultra-Plan; aktuell kein offenes API → Automatisierung nur per Browser-Steuerung der Gemini-App. Veo 3.1 wäre die API-Alternative (RunComfy-Key nötig).
