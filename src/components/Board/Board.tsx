import React, { FC, useContext, useEffect } from "react";
import { ctx } from "../../App";
import { PlayerType } from "../../state/Models";
import Grid from "../Grid";
import Fleet from "../Fleet";

const Board: FC = () => {
  const {
    state: {
      game: { placing },
      players
    }
  } = useContext(ctx);

  useEffect(() => {
    console.log(players);
  }, [placing, players]);

  return placing ? (
    <section>
      <h1>Place your ships!</h1>
      <Grid player={PlayerType.Human} />
      <Fleet player={PlayerType.Human} />
    </section>
  ) : (
    <div>Board</div>
  );
};

export default Board;
