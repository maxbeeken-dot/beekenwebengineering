# BWE Content-Plan — 2 Videos/Tag

**Woche:** Mo 2026-06-22 → So 2026-06-28
**Plattformen:** YouTube Shorts · X · TikTok · Facebook · LinkedIn
**Status-Legende:** ✅ hochgeladen · ⏳ offen (Login/CAPTCHA nötig) · 🔲 geplant · ⏸️ blockiert

## Upload-Status pro Video × Plattform

| Tag | Slot | Video | YouTube | X | TikTok | Facebook | LinkedIn |
|---|---|---|---|---|---|---|---|
| **Mo 22.06** | 1 | **Baukasten vs. Handarbeit** (Performance-Showdown) | ✅ | ✅ | ⏸️ | ⏸️ | ⏸️ |
| Mo 22.06 | 2 | **Website Glow-Up** (Before/After, viraler Hook) | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |
| Di 23.06 | 1 | Web Red Flags (3 Zeichen für eine schlechte Website) | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |
| Di 23.06 | 2 | „3,9s = 53% weg" (Ladezeit-Schock) | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |
| Mi 24.06 | 1 | Website-Rettung (Redesign Vorher/Nachher) | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |
| Mi 24.06 | 2 | Eigentum statt Mietmodell (dir gehört die Seite) | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |
| Do 25.06 | 1 | Mobile-Fail (Seite kaputt auf dem Handy) | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |
| Do 25.06 | 2 | Lighthouse 100 erklärt | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |
| Fr 26.06 | 1 | Trend/Meme-Jacking (aktueller Sound) | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |
| Fr 26.06 | 2 | DSGVO-Falle: Google Fonts | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |
| Sa 27.06 | 1 | Was kostet eine Website wirklich? | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |
| Sa 27.06 | 2 | Animationen, die verkaufen | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |
| So 28.06 | 1 | Code-Website vs. KI-Website | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |
| So 28.06 | 2 | „1 Woche, 1 Website" (Timelapse) | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |

## Offene Logins (nach Neustart, Sessions in ~/.bwe-sessions/ — bleiben künftig erhalten)

| Plattform | Status | Was fehlt |
|---|---|---|
| **X** | ✅ eingeloggt | — (läuft automatisch) |
| **TikTok** | ⏸️ blockiert | Chromium-Login-Spinner (Anti-Bot) — nur per Handy/Safari einloggbar |
| **Facebook** | ⏸️ blockiert | App-2FA ohne Fallback — braucht FB-App auf Zweitgerät (Nutzer hat keins) |
| **LinkedIn** | ⏭️ ausgelassen | auf Nutzerwunsch vorerst weggelassen |
| **YouTube** | ✅ eingeloggt | — (autonomer Login Konto+PW funktioniert, Session dauerhaft) |

## Pipeline-Notizen
- **Render:** Remotion in `Test/video-studio/` (`node render.mjs <CompId>`). Braucht freien RAM (8 GB-Gerät → vor Render Apps schließen).
- **Captions:** `~/.bwe-sessions/cap-*.txt`
- **Uploader:** `lead-automation/upload-{x,tt-auto,fb,li}.mjs`, `upload-yt.mjs` — Profile jetzt in `~/.bwe-sessions/` (neustartfest).
- **Eigene Sounds:** ElevenLabs-Key noch offen (Onboarding) → bis dahin Videos stumm + Trending-Sound in-App.
