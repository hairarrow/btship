import React, { FC, useContext } from "react";
import { ctx } from "../../App";
import { PlayerType } from "../../state/Models";
import Button from "../Button";

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
        <Button
          style={{ marginBottom: 16 }}
          onClick={() => dispatch(rotateShip())}
        >
          Rotate
        </Button>
      ) : (
        ""
      )}
      <Button
        disabled={![...ships].every(({ placed }) => placed)}
        onClick={() => {
          dispatch(placeAutomatically(PlayerType.Computer));
          dispatch(finishPlacing());
        }}
      >
        Start the Battle
      </Button>
      <Button
        style={{ marginLeft: 16 }}
        onClick={() => dispatch(placeAutomatically(PlayerType.Human))}
      >
        Place Randomly
      </Button>
      <h2 style={{ marginTop: 24 }}>Fleet</h2>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {ships.map(({ name, size, placed }) => (
          <Button
            key={name}
            disabled={placed}
            onClick={() => dispatch(selectShip(name))}
            style={{ marginTop: 16 }}
          >
            {name} – {size}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Fleet;
