import React, { useContext, HTMLAttributes, FC } from "react";
import { ctx } from "../../App";
import Button from "../Button";

const Stats: FC<HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
  const {
    state: { stats, game },
    actions: { resetGame, startGame },
    dispatch
  } = useContext(ctx);

  return (
    <div {...props}>
      <div>
        <h2>Games Won</h2>
        <p style={{ fontWeight: 500 }}>
          {stats.games.won} of {stats.games.played}
        </p>
      </div>

      {game.over && (
        <Button
          style={{ marginTop: 20 }}
          onClick={() => {
            dispatch(resetGame());
            dispatch(startGame());
          }}
        >
          Reset
        </Button>
      )}
    </div>
  );
};

export default Stats;
