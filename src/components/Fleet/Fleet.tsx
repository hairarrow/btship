import React, { FC, useContext } from "react";
import { ctx } from "../../App";

const Fleet: FC<{ player: string }> = ({ player }) => {
  const {
    state: {
      game: { players }
    }
  } = useContext(ctx);
  const {
    fleet: { ships, selectedShip }
  } = players.filter(({ type }) => type === player)[0];

  return (
    <div>
      <h2>Fleet</h2>
      <ul>
        {ships.map(({ name }) => (
          <li
            key={name}
            style={{
              color:
                selectedShip && selectedShip.name === name ? "blue" : "inherit"
            }}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Fleet;
