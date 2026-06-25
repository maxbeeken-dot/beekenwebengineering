#!/usr/bin/env bash
# Repariert Remotions gebündelte ffmpeg/ffprobe-Binaries auf macOS-arm64.
# Problem: ffprobe/ffmpeg referenzieren ihre libav*-dylibs mit bloßem Namen,
# dyld findet sie nicht im Binary-Ordner -> SIGABRT -> Audio-Assets crashen.
# Fix: alle Referenzen auf @loader_path/ umschreiben + adhoc neu signieren.
# Idempotent. Nach jedem `npm install` im video-studio erneut ausführen.
set -e
DIR="$(cd "$(dirname "$0")" && pwd)/node_modules/@remotion/compositor-darwin-arm64"
[ -d "$DIR" ] || { echo "Compositor-Verzeichnis fehlt: $DIR"; exit 1; }
cd "$DIR"
LIBS="libavcodec libavdevice libavfilter libavformat libavutil libswresample libswscale"
FILES="ffprobe ffmpeg libavcodec.dylib libavdevice.dylib libavfilter.dylib libavformat.dylib libavutil.dylib libswresample.dylib libswscale.dylib"
for f in $FILES; do
  [ -f "$f" ] || continue
  case "$f" in *.dylib) install_name_tool -id "@loader_path/$f" "$f" 2>/dev/null || true ;; esac
  for l in $LIBS; do
    install_name_tool -change "$l.dylib" "@loader_path/$l.dylib" "$f" 2>/dev/null || true
  done
  codesign -f -s - "$f" 2>/dev/null || true
done
if ./ffprobe -version >/dev/null 2>&1; then
  echo "✓ Compositor-Binaries repariert (ffprobe lädt)."
else
  echo "✗ ffprobe lädt weiterhin nicht — bitte prüfen."; exit 1
fi
