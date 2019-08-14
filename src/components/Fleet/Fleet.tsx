import React, { FC, useContext } from "react";
import { ctx } from "../../App";
import { PlayerType } from "../../state/Models";

const Fleet: FC<{ player: string }> = ({ player }) => {
  const {
    state: { players },
    actions: { selectShip, rotateShip, finishPlacing, placeAutomatically },
    dispatch
  } = useContext(ctx);
  const {
    fleet: { ships, selectedShip }
  } = [...players].filter(({ type }) => type === player)[0];

  return (
    <div>
      {selectedShip ? (
        <div>
          <button onClick={() => dispatch(rotateShip())}>Rotate</button>
        </div>
      ) : (
        ""
      )}
      <button
        disabled={![...ships].every(({ placed }) => placed)}
        onClick={() => {
          dispatch(placeAutomatically(PlayerType.Computer));
          dispatch(finishPlacing());
        }}
      >
        Start the Battle
      </button>
      <button onClick={() => dispatch(placeAutomatically(PlayerType.Human))}>
        Place Randomly
      </button>
      <h2>Fleet</h2>
      <ul>
        {ships.map(({ name, size, placed }) => (
          <button
            key={name}
            style={{
              color:
                selectedShip && selectedShip.name === name ? "blue" : "inherit",
              opacity: placed ? 0.2 : 1
            }}
            onClick={() => dispatch(selectShip(name))}
          >
            {name} – {size}
          </button>
        ))}
      </ul>
    </div>
  );
};

export default Fleet;
