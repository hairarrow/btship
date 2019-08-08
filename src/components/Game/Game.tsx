import React, { FC, useContext, useEffect } from "react";
import { ctx } from "../../App";
import DEFAULT_SHIPS from "../Ship/DefaultShips";

const Game: FC = () => {
  const {
    state: {
      game: { active, ships, gridSize }
    },
    actions: { updateGameStatus, createShips },
    dispatch
  } = useContext(ctx);

  const onClickStart = () => dispatch(updateGameStatus(true));

  useEffect(() => {
    if (active && !ships.length) {
      const ships = [...DEFAULT_SHIPS].map(({ name, size }) => ({
        name,
        size
      }));
      dispatch(createShips(ships));
    }
  }, [active, dispatch, createShips, ships]);

  useEffect(() => {
    console.log(ships);
  }, [ships]);

  return (
    <main>
      {active ? (
        <table style={{ borderCollapse: "collapse" }}>
          <tbody>
            {Array.from(Array(gridSize).keys()).map(it => (
              <tr key={it}>
                {Array.from(Array(gridSize).keys()).map(iit => (
                  <td
                    key={`${it}-${iit}`}
                    onMouseEnter={() => console.log(`entering ${it}-${iit}`)}
                    onMouseLeave={() => console.log(`leaving ${it}-${iit}`)}
                    style={{
                      width: 50,
                      height: 50,
                      border: "1px solid",
                      textAlign: "center"
                    }}
                  >
                    {it}-{iit}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <button onClick={onClickStart}>Start Game</button>
      )}
    </main>
  );
};

export default Game;
