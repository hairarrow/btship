import React, { FC, useContext, useEffect } from "react";
import { ctx } from "../../App";
import StartScreen from "../StartScreen";
import Board from "../Board";

const Game: FC = () => {
  const {
    state: {
      game: { active }
    },
    actions: { startGame },
    dispatch
  } = useContext(ctx);

  useEffect(() => {
    if (!active) dispatch(startGame());
  }, []);

  return active ? <Board /> : <StartScreen />;
};

export default Game;
