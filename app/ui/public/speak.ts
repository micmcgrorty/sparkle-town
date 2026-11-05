/**
 * Read text aloud with the browser's built-in voice, preferring a British one.
 * Does nothing in browsers without speech synthesis.
 */
export function speak(text: string, options: { onEnd?: () => void } = {}): void {
	if (typeof speechSynthesis === "undefined") {
		options.onEnd?.();
		return;
	}

	speechSynthesis.cancel();
	let utterance = new SpeechSynthesisUtterance(text);
	let voices = speechSynthesis.getVoices();
	let voice =
		voices.find((v) => v.lang === "en-GB" && /female|libby|sonia|kate|serena/i.test(v.name)) ??
		voices.find((v) => v.lang === "en-GB") ??
		voices.find((v) => v.lang.startsWith("en"));
	if (voice) utterance.voice = voice;
	utterance.lang = "en-GB";
	utterance.rate = 0.9;
	utterance.pitch = 1.1;
	if (options.onEnd) {
		utterance.addEventListener("end", options.onEnd);
		utterance.addEventListener("error", options.onEnd);
	}
	speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
	if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
}

export function canSpeak(): boolean {
	return typeof speechSynthesis !== "undefined";
}
