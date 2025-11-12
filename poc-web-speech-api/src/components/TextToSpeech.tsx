import { useEffect, useMemo, useState } from "react";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";

export default function TextToSpeech() {
  const { supported, voices, speaking, speak, pause, resume, cancel } =
    useSpeechSynthesis();
  const [text, setText] = useState(
    "Hello! This is a Web Speech API proof of concept."
  );
  const [selVoice, setSelVoice] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("tts.voiceURI");
    if (saved) setSelVoice(saved);
  }, []);
  useEffect(() => {
    if (selVoice) localStorage.setItem("tts.voiceURI", selVoice);
  }, [selVoice]);

  const voice = useMemo(
    () => voices.find((v) => v.voiceURI === selVoice),
    [voices, selVoice]
  );

  return (
    <div className="card">
      <h2>Text to Speech</h2>
      {!supported && (
        <p className="small">Your browser does not support SpeechSynthesis.</p>
      )}

      <div className="row">
        <div className="col">
          <div className="field">
            <label>Voice</label>
            <select
              value={selVoice}
              onChange={(e) => setSelVoice(e.target.value)}
            >
              <option value="">(System default)</option>
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} — {v.lang}
                  {v.default ? " (default)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="field">
        <label>Text</label>
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="actions">
        <button
          onClick={() => speak(text, { voice })}
          disabled={!supported || !text.trim()}
        >
          Speak
        </button>
        <button onClick={pause} disabled={!supported || !speaking}>
          Pause
        </button>
        <button onClick={resume} disabled={!supported}>
          Resume
        </button>
        <button onClick={cancel} disabled={!supported}>
          Cancel
        </button>
      </div>
    </div>
  );
}
