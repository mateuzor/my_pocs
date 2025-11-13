import { useEffect, useMemo, useRef, useState } from "react";

type Recognition = any;
type RecognitionCtor = new () => Recognition;

function getRecognitionCtor(): RecognitionCtor | null {
  const Ctor =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  return Ctor ? (Ctor as RecognitionCtor) : null;
}

export function useSpeechRecognition(opts?: {
  lang?: string;
  interimResults?: boolean;
  continuous?: boolean;
  onResult?: (text: string, isFinal: boolean) => void;
}) {
  const {
    lang = "en-US",
    interimResults = true,
    continuous = true,
    onResult,
  } = opts || {};

  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const recRef = useRef<Recognition | null>(null);

  useEffect(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;

    const rec = new Ctor();
    rec.lang = lang;
    rec.interimResults = interimResults;
    (rec as any).continuous = continuous;
    rec.maxAlternatives = 1;

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = (e: any) => console.warn("Recognition error", e);

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) final += res[0].transcript;
        else interim += res[0].transcript;
      }
      if (interim) setTranscript(interim);
      if (final) {
        setFinalTranscript((prev) => (prev ? prev + " " : "") + final.trim());
        setTranscript("");
      }
      onResult?.(final || interim, Boolean(final));
    };

    recRef.current = rec;
    setSupported(true);
    return () => {
      recRef.current?.stop();
      recRef.current = null;
    };
  }, [lang, interimResults, continuous, onResult]);

  const api = useMemo(
    () => ({
      start() {
        recRef.current?.start?.();
      },
      stop() {
        recRef.current?.stop?.();
      },
      abort() {
        recRef.current?.abort?.();
      },
      reset() {
        setTranscript("");
        setFinalTranscript("");
      },
    }),
    []
  );

  return { supported, listening, transcript, finalTranscript, ...api };
}
