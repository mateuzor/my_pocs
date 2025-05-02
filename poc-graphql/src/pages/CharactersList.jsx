import React from "react";
import { useCharacters } from "../hooks/useCharacters";
import "./CharacterList.css";
import { Link } from "react-router-dom";

const CharactersList = () => {
  const { data, loading, error } = useCharacters();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;

  return (
    <div className="CharacterList">
      {data.characters.results.map((character) => (
        <Link
          key={character.id}
          to={`/${character.id}`}
          className="CharacterName"
        >
          <h4 key={character.id}>{character.name}</h4>
          <img src={character.image} alt={character.name} />
        </Link>
      ))}
    </div>
  );
};

export default CharactersList;
