import React, { useState } from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

export default function SpeechToText() {
  const [lang, setLang] = useState("en-US");
  const {
    supported,
    listening,
    transcript,
    finalTranscript,
    start,
    stop,
    reset,
  } = useSpeechRecognition({ lang });

  return (
    <div className="card">
      <h2>Speech to Text</h2>
      {!supported && (
        <p className="small">
          Your browser does not support the SpeechRecognition API. Try Chrome or
          Edge.
        </p>
      )}

      <div className="row" style={{ alignItems: "center" }}>
        <div className="col" style={{ maxWidth: 280 }}>
          <label>Language</label>
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="pt-BR">Português (Brasil)</option>
            <option value="es-ES">Español (España)</option>
            <option value="fr-FR">Français</option>
            <option value="de-DE">Deutsch</option>
            <option value="it-IT">Italiano</option>
            <option value="ja-JP">日本語</option>
          </select>
        </div>

        <div className="col">
          <div className="pill">{listening ? "Listening..." : "Idle"}</div>
          <div className="small">
            Press <b>Start</b> and grant the microphone permission.
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <label>Interim Transcript</label>
          <div className="log" style={{ minHeight: 60 }}>
            {transcript || <span className="small">Say something…</span>}
          </div>
        </div>

        <div className="col">
          <label>Final Transcript</label>
          <div className="log" style={{ minHeight: 60 }}>
            {finalTranscript || (
              <span className="small">Final chunks appear here.</span>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        <button onClick={start} disabled={!supported || listening}>
          Start
        </button>
        <button onClick={stop} disabled={!supported || !listening}>
          Stop
        </button>
        <button onClick={reset} disabled={!supported}>
          Reset
        </button>
      </div>
    </div>
  );
}
