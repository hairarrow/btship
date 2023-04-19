import React, { FC, useContext, useEffect, useState } from "react";
import { ctx } from "../../../pages";
import StartScreen from "../StartScreen";
import Board from "../Board";
import GameContainer from "./Game.styled";
import { Modal } from "antd";

import { PlayerType } from "../../state/Models";
import Masthead from "../Masthead";

const Game: FC = () => {
  const {
    state: { game, players },
    actions: { startGame, gameOver, resetGame },
    dispatch,
  } = useContext(ctx);
  const defaultWaveConfig = {
    waveHeight: 5,
    waveSpeed: 2,
  };
  const [waveConfig, setWaveConfig] = useState(defaultWaveConfig);

  useEffect(() => {
    if (!game.inBattle) return;
    for (const { fleet, type } of players) {
      if (fleet.ships.every((ship) => ship.sunk)) {
        dispatch(
          gameOver(
            type === PlayerType.Human ? PlayerType.Computer : PlayerType.Human
          )
        );

        const modalConfig = {
          title: `You ${type === PlayerType.Human ? "Lose" : "Win!"}`,
          content: "Do you want to try again?",
          okText: "Try Again",
          cancelText: "Not Yet",
          onOk: () => {
            dispatch(resetGame());
            dispatch(startGame());
          },
        };

        if (type === PlayerType.Human) {
          Modal.confirm(modalConfig);
        } else Modal.success(modalConfig);
      }
    }
  }, [game, players, dispatch, gameOver, resetGame, startGame]);

  return (
    <GameContainer id="waves">
      {game.active ? <Board /> : <StartScreen />}

      <Masthead />
    </GameContainer>
  );
};

export default Game;
