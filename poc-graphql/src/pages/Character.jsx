import React from "react";
import { useParams } from "react-router";
import { useCharacter } from "../hooks/useCharacter";
import "./Character.css";

function Character() {
  const { id } = useParams();
  const { data, loading, error } = useCharacter(id);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;

  return (
    <div className="Character">
      <img
        src={data.character.image}
        alt={data.character.name}
        width={750}
        height={750}
      />
      <div className="Character-content">
        <h1>{data.character.name}</h1>
        <p>{data.character.gender}</p>
        <div className="Character-episode">
          {data.character.episode.map((episode) => (
            <div>
              <bold>
                {episode.episode} | {episode.name}
              </bold>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Character;
