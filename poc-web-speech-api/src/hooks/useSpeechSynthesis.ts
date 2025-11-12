import { useEffect, useMemo, useState } from "react";

export function useSpeechSynthesis(opts?: {
  voiceURI?: string;
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}) {
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    setSupported(true);

    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();

    // reload voices asynchronously (some browsers load lazily)
    window.speechSynthesis.onvoiceschanged = loadVoices;
    const t = setInterval(loadVoices, 500);
    setTimeout(() => clearInterval(t), 3000);

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const api = useMemo(
    () => ({
      speak(
        text: string,
        options?: {
          voice?: SpeechSynthesisVoice;
          lang?: string;
          rate?: number;
          pitch?: number;
          volume?: number;
        }
      ) {
        if (!supported || !text) return;

        const u = new SpeechSynthesisUtterance(text);

        if (options?.voice) u.voice = options.voice;
        if (options?.lang) u.lang = options.lang;
        if (options?.rate) u.rate = options.rate;
        if (options?.pitch) u.pitch = options.pitch;
        if (options?.volume) u.volume = options.volume;

        u.onstart = () => setSpeaking(true);
        u.onend = () => setSpeaking(false);

        window.speechSynthesis.speak(u);
      },
      cancel() {
        if (supported) window.speechSynthesis.cancel();
      },
      pause() {
        if (supported) window.speechSynthesis.pause();
      },
      resume() {
        if (supported) window.speechSynthesis.resume();
      },
    }),
    [supported]
  );

  return { supported, voices, speaking, ...api };
}
