import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import LazyComponent from "./components/LazyComponent";

function App() {
  const [allPokemons, setAllPokemons] = useState([]);
  useEffect(() => {
    async function getPokemons() {
      const { data } = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=799&offset=100"
      );
      if (data.results) {
        const pokemons = data.results.map((pokemon, index) => ({
          name: pokemon.name,
          id: index + 101,
        }));
        setAllPokemons(pokemons);
      }
    }
    getPokemons();
  }, []);
  return (
    <div className="App">
      {allPokemons.map(({ name, id }, index) => {
        return (
          <div key={name}>
            <h2>{name}</h2>
            <LazyComponent
              data-src={`https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/${id}.png`}
              alt={name}
            />
          </div>
        );
      })}
    </div>
  );
}

export default App;
