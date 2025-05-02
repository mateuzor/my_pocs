import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { increment, amountAdded } from "./features/counter/counter-slice";
import { useAppDispatch, userAppSelector } from "./app/hooks";
import { useFetchBreedsQuery } from "./features/dogs/dogs-api-slice";

function App() {
  const count = userAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  const [numDogs, setNumDogs] = useState(10);
  const { data = [], isFetching } = useFetchBreedsQuery(numDogs);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => dispatch(increment())}>
            Add 1
          </button>
        </p>
        <p>
          <button type="button" onClick={() => dispatch(amountAdded(5))}>
            Add 5
          </button>
        </p>
        <p>count is: {count}</p>

        <div>
          <p>Dogs to fetch:</p>
          <select
            value={numDogs}
            onChange={(e) => setNumDogs(Number(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>

        <div>Number of dogs fetched: {data.length}</div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Picture</th>
            </tr>
          </thead>
          <tbody>
            {data.map((breed) => (
              <tr>
                <td>{breed.name}</td>
                <td>
                  <img src={breed.image.url} alt={breed.name} height={250} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
