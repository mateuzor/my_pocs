import SpeechToText from "./components/SpeechToText";
import TextToSpeech from "./components/TextToSpeech";

export default function App() {
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <SpeechToText />
        </div>
        <div className="col">
          <TextToSpeech />
        </div>
      </div>
    </div>
  );
}
