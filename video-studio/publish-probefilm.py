"""
Veröffentlicht eine Probefilm-Seite über die GitHub Contents API.

Warum nicht `git push`: Aus der Agent-Umgebung hängt der Schreibpfad zu GitHub
(siehe CLAUDE.md → Deployment). Lesen und `gh api` funktionieren dagegen.

Aufruf: python3 publish-probefilm.py <slug> "<Label für die Commit-Message>"
"""
import base64
import json
import os
import subprocess
import sys

REPO = "maxbeeken-dot/beekenwebengineering"
GH = subprocess.run(["which", "gh"], capture_output=True, text=True).stdout.strip() or "gh"
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")


def current_sha(path):
    """Blob-SHA der Datei im Repo — nötig, sonst lehnt die API ein Update ab."""
    r = subprocess.run(
        [GH, "api", f"repos/{REPO}/contents/{path}?ref=main", "--jq", ".sha"],
        capture_output=True, text=True,
    )
    s = r.stdout.strip()
    return s if r.returncode == 0 and s and s != "null" else None


def publish(path, message):
    local = os.path.join(ROOT, path)
    payload = {
        "message": message,
        "content": base64.b64encode(open(local, "rb").read()).decode(),
        "branch": "main",
    }
    sha = current_sha(path)
    if sha:
        payload["sha"] = sha
    tmp = os.path.join("/tmp", "pf-" + path.replace("/", "_") + ".json")
    with open(tmp, "w") as fh:
        json.dump(payload, fh)
    r = subprocess.run(
        [GH, "api", "-X", "PUT", f"repos/{REPO}/contents/{path}", "--input", tmp, "--jq", ".commit.sha"],
        capture_output=True, text=True,
    )
    os.remove(tmp)
    ok = r.returncode == 0
    print(("  OK      " if ok else "  FEHLER  ") + path + "  " + (r.stdout or r.stderr).strip()[:90])
    return ok


if __name__ == "__main__":
    slug, label = sys.argv[1], sys.argv[2]
    for name in ("poster.jpg", "film.mp4", "index.html"):
        publish(f"probefilm/{slug}/{name}", f"feat: Probefilm {label} — {name}")
