// Erzeugt ein eigenes, lizenzfreies Marken-Musikbett (WAV, 30s, Stereo 44.1k).
// Clean / modern / dezent: warmer Pad + Sub-Puls + sparsame Pentatonik-Bells.
// Selbst synthetisiert -> kein Copyright/Lizenz-Flag (wichtig für Business-Accounts).
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SR = 44100, DUR = 30, CH = 2;
const N = SR * DUR;
const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);

// Progression Am – F – C – G (konsonant, melancholisch-modern)
const CHORDS = [
  {bass: 45, pad: [57, 60, 64]}, // Am
  {bass: 41, pad: [53, 57, 60]}, // F
  {bass: 48, pad: [60, 64, 67]}, // C
  {bass: 43, pad: [55, 59, 62]}, // G
];
const BAR = 2.4;                 // 100 BPM, 1 Takt = 4 Beats
const BEAT = BAR / 4;
const PENTA = [69, 72, 76, 79, 81]; // A-Moll-Pentatonik (hoch, als Bells)

const L = new Float64Array(N), R = new Float64Array(N);
const soft = (t, a, d) => Math.exp(-Math.max(0, t) * d) * (t >= 0 ? 1 : 0) * a; // exp-Decay-Env

for (let i = 0; i < N; i++) {
  const t = i / SR;
  const chord = CHORDS[Math.floor(t / BAR) % CHORDS.length];
  const barT = t % BAR;
  // Pad: weiches Trapez pro Takt, leicht detuned für Stereobreite
  const padEnv = Math.min(1, barT / 0.5) * Math.min(1, (BAR - barT) / 0.5) * 0.9;
  let l = 0, r = 0;
  for (const note of chord.pad) {
    const f = midi(note);
    l += Math.sin(2 * Math.PI * f * t) * 0.12 * padEnv;
    r += Math.sin(2 * Math.PI * (f * 1.003) * t) * 0.12 * padEnv;
  }
  // Sub-Bass (Grundton -1 Okt) + dezenter Puls auf jedem Beat
  const beatT = t % BEAT;
  const pulse = 0.55 + 0.45 * Math.exp(-beatT * 9);
  const bf = midi(chord.bass) / 2;
  const bass = Math.sin(2 * Math.PI * bf * t) * 0.16 * pulse;
  l += bass; r += bass;
  // Soft-Kick (tiefer Sinus, schneller Decay) – sehr subtil
  const kick = Math.sin(2 * Math.PI * 52 * t) * soft(beatT, 0.10, 16);
  l += kick; r += kick;
  // Bells: ein sparsamer Pentatonik-Ton pro Beat, gepannt, mit Echo
  const beatIdx = Math.floor(t / BEAT);
  const noteOnT = t - beatIdx * BEAT;
  const bellNote = PENTA[(beatIdx * 2 + Math.floor(beatIdx / 7)) % PENTA.length];
  const bell = Math.sin(2 * Math.PI * midi(bellNote) * t) * soft(noteOnT, 0.13, 7);
  const pan = (beatIdx % 2 === 0) ? 0.7 : 0.3;
  l += bell * pan; r += bell * (1 - pan);
  L[i] = l; R[i] = r;
}

// Echo (Feedback-Delay) für Tiefe – nur dezent
const dly = Math.floor(0.27 * SR), fb = 0.28;
for (let i = dly; i < N; i++) { L[i] += L[i - dly] * fb; R[i] += R[i - dly] * fb * 0.9; }

// Gesamt-Fade + Soft-Limit + Normalisierung auf ~-1.6 dBFS
let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const fade = Math.min(1, t / 1.2) * Math.min(1, (DUR - t) / 2.0);
  L[i] = Math.tanh(L[i] * 1.1) * 0.92 * fade;
  R[i] = Math.tanh(R[i] * 1.1) * 0.92 * fade;
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const norm = 0.83 / (peak || 1);

// WAV (16-bit PCM LE, interleaved)
const buf = Buffer.alloc(44 + N * CH * 2);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * CH * 2, 4); buf.write('WAVE', 8);
buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(CH, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * CH * 2, 28);
buf.writeUInt16LE(CH * 2, 32); buf.writeUInt16LE(16, 34);
buf.write('data', 36); buf.writeUInt32LE(N * CH * 2, 40);
let off = 44, rms = 0;
for (let i = 0; i < N; i++) {
  const sl = Math.max(-1, Math.min(1, L[i] * norm));
  const sr = Math.max(-1, Math.min(1, R[i] * norm));
  rms += sl * sl;
  buf.writeInt16LE((sl * 32767) | 0, off); off += 2;
  buf.writeInt16LE((sr * 32767) | 0, off); off += 2;
}
const outDir = path.join(__dirname, 'public', 'music');
fs.mkdirSync(outDir, {recursive: true});
const out = path.join(outDir, 'brand-bed.wav');
fs.writeFileSync(out, buf);
console.log(`✓ ${out}  ${(buf.length/1e6).toFixed(2)}MB  ${DUR}s  peak~${peak.toFixed(2)} RMS~${Math.sqrt(rms/N).toFixed(3)}`);
