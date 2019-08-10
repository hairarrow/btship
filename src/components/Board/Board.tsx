import React, { FC, useContext, useEffect, useState } from "react";
import { ctx } from "../../App";
import { PlayerType, CellType } from "../../state/Models";
import Grid from "../Grid";
import Fleet from "../Fleet";

const Board: FC = () => {
  const {
    state: {
      game: { placing },
      players
    }
  } = useContext(ctx);

  return placing ? (
    <section>
      <h1>Place your ships!</h1>
      <Grid
        grid={
          [...players].filter(({ type }) => type === PlayerType.Human)[0].grid
        }
      />
      <Fleet player={PlayerType.Human} />
    </section>
  ) : (
    <div>Board</div>
  );
};

export default Board;
