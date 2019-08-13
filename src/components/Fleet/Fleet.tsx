import React, { FC, useContext } from "react";
import { ctx } from "../../App";

const Fleet: FC<{ player: string }> = ({ player }) => {
  const {
    state: { players },
    actions: { selectShip, rotateShip, finishPlacing },
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
        // disabled={![...ships].every(({ placed }) => placed)}
        onClick={() => dispatch(finishPlacing())}
      >
        Place
      </button>
      {/* <button
        // disabled={![...ships].every(({ placed }) => placed)}
        onClick={() => dispatch(finishPlacing())}
      >
        Place Randomly
      </button> */}
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
