import React, {
  FC,
  useContext,
  HTMLAttributes,
  useState,
  useCallback
} from "react";
import { ctx } from "../../App";
import { PlayerType } from "../../state/Models";
import Button from "../Button";
import useWindowSize from "../../hooks/useWindowSize";
import { Drawer } from "antd";

const Fleet: FC<{ player: string } & HTMLAttributes<HTMLDivElement>> = ({
  player,
  ...props
}) => {
  const {
    state: { players },
    actions: { selectShip, rotateShip, finishPlacing, placeAutomatically },
    dispatch
  } = useContext(ctx);
  const {
    fleet: { ships, selectedShip }
  } = [...players].filter(({ type }) => type === player)[0];
  const { isLarge } = useWindowSize();
  const [fleetVisible, setFleetVisible] = useState(false);

  const showFleet = useCallback(() => {
    setFleetVisible(true);
  }, []);

  const hideFleet = useCallback(() => {
    setFleetVisible(false);
  }, []);

  const onSelectShip = useCallback(
    (name: string) => {
      dispatch(selectShip(name));
      hideFleet();
    },
    [hideFleet, dispatch, selectShip]
  );

  function renderFleet() {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {ships.map(({ name, size, placed }) => (
          <Button
            key={name}
            disabled={placed}
            onClick={() => onSelectShip(name)}
            style={{ marginTop: 16 }}
          >
            {name} – {size}
          </Button>
        ))}
      </div>
    );
  }

  function renderStartButton() {
    return (
      <Button
        style={{ marginRight: 16 }}
        disabled={![...ships].every(({ placed }) => placed)}
        onClick={() => {
          dispatch(placeAutomatically(PlayerType.Computer));
          dispatch(finishPlacing());
        }}
      >
        Start the Battle
      </Button>
    );
  }

  return (
    <div {...props}>
      {selectedShip ? (
        <div>
          <Button
            style={{ marginBottom: 16 }}
            onClick={() => dispatch(rotateShip())}
          >
            Rotate
          </Button>
        </div>
      ) : (
        ""
      )}
      {[...ships].every(({ placed }) => placed) &&
        isLarge &&
        renderStartButton()}
      {!isLarge && renderStartButton()}
      <Button onClick={() => dispatch(placeAutomatically(PlayerType.Human))}>
        Place Randomly
      </Button>
      <h2 style={{ marginTop: 24 }}>Fleet</h2>
      {isLarge ? (
        <Drawer
          title="Select a Ship"
          placement="bottom"
          onClose={hideFleet}
          visible={fleetVisible}
          height={500}
          closable
        >
          {renderFleet()}
        </Drawer>
      ) : (
        renderFleet()
      )}
      {isLarge && <Button onClick={showFleet}>Select a Ship</Button>}
    </div>
  );
};

export default Fleet;
