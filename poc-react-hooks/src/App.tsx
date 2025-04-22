import "./App.css";
import Counter from "./components/Counter";
import LayoutEffectExample from "./components/LayoutEffectExample";
import NameInput from "./components/NameInput";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <NameInput />
        <br />
        <Counter />
        <br /> */}
        <LayoutEffectExample />
      </header>
    </div>
  );
}

export default App;
