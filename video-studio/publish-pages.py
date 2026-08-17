"""Veröffentlicht nur die index.html der Probefilm-Seiten (z.B. nach Textänderungen)."""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "publish-probefilm.py")).read()
exec(src.split('if __name__')[0])  # bringt publish() + current_sha() mit

for slug in sys.argv[1:]:
    publish(f"probefilm/{slug}/index.html", f"chore: Pakete 125/300 + Ueberleitung — {slug}")
