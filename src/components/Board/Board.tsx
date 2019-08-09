import React, { FC, useContext, useEffect } from "react";
import { ctx } from "../../App";
import Grid from "../Grid";
import { PlayerType } from "../../state/Models";

const Board: FC = () => {
  const {
    state: {
      game: { placing, players }
    }
  } = useContext(ctx);

  useEffect(() => {
    console.log(players);
  }, [placing, players]);

  return placing ? (
    <section>
      <h1>Place your ships!</h1>
      <Grid player={PlayerType.Human} />
    </section>
  ) : (
    <div>Board</div>
  );
};

export default Board;
