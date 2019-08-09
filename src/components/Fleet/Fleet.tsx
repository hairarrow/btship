import React, { FC, useContext } from "react";
import { ctx } from "../../App";

const Fleet: FC<{ player: string }> = ({ player }) => {
  const {
    state: { players },
    actions: { selectShip },
    dispatch
  } = useContext(ctx);
  const {
    fleet: { ships, selectedShip }
  } = [...players].filter(({ type }) => type === player)[0];

  return (
    <div>
      <h2>Fleet</h2>
      <ul>
        {ships.map(({ name, size }) => (
          <li
            key={name}
            style={{
              color:
                selectedShip && selectedShip.name === name ? "blue" : "inherit"
            }}
            onClick={() => dispatch(selectShip(name))}
          >
            {name} – {size}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Fleet;
