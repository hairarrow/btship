import React, { FC, useContext, useEffect } from "react";
import { ctx } from "../../App";

const Game: FC = () => {
  const { dispatch } = useContext(ctx);

  return (
    <main>
      <div>Game</div>
    </main>
  );
};

export default Game;
