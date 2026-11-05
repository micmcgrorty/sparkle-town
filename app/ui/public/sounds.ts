/**
 * Tiny sound effects made with the Web Audio API, so there are no audio files
 * to download. Every function is safe to call in browsers without audio.
 */

let context: AudioContext | undefined;

function audio(): AudioContext | undefined {
	if (typeof AudioContext === "undefined") return undefined;
	context ??= new AudioContext();
	if (context.state === "suspended") void context.resume();
	return context;
}

function tone(
	frequency: number,
	{ start = 0, duration = 0.15, type = "sine", volume = 0.15 }: {
		start?: number;
		duration?: number;
		type?: OscillatorType;
		volume?: number;
	} = {},
): void {
	let ctx = audio();
	if (!ctx) return;
	let at = ctx.currentTime + start;
	let osc = ctx.createOscillator();
	let gain = ctx.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(frequency, at);
	gain.gain.setValueAtTime(0.0001, at);
	gain.gain.exponentialRampToValueAtTime(volume, at + 0.01);
	gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
	osc.connect(gain).connect(ctx.destination);
	osc.start(at);
	osc.stop(at + duration + 0.05);
}

/** Short bubbly pop for taps. */
export function pop(): void {
	let ctx = audio();
	if (!ctx) return;
	let at = ctx.currentTime;
	let osc = ctx.createOscillator();
	let gain = ctx.createGain();
	osc.frequency.setValueAtTime(420, at);
	osc.frequency.exponentialRampToValueAtTime(900, at + 0.08);
	gain.gain.setValueAtTime(0.12, at);
	gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.12);
	osc.connect(gain).connect(ctx.destination);
	osc.start(at);
	osc.stop(at + 0.15);
}

/** Happy rising arpeggio for a right answer. */
export function cheer(): void {
	[523, 659, 784, 1047].forEach((f, i) => tone(f, { start: i * 0.09, duration: 0.22, type: "triangle" }));
}

/** Gentle low "try again" sound. */
export function boop(): void {
	tone(300, { duration: 0.18, type: "sine", volume: 0.12 });
	tone(240, { start: 0.12, duration: 0.22, type: "sine", volume: 0.12 });
}

/** Sparkly twinkle for magic moments. */
export function twinkle(): void {
	[1319, 1568, 2093, 1568, 2637].forEach((f, i) =>
		tone(f, { start: i * 0.06, duration: 0.18, type: "sine", volume: 0.08 }),
	);
}
