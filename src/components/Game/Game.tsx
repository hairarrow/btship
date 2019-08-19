import React, { FC, useContext, useEffect, useState } from "react";
import { ctx } from "../../App";
import StartScreen from "../StartScreen";
import Board from "../Board";
import GameContainer from "./Game.styled";
import { Modal } from "antd";

import * as THREE from "three";
import { PlayerType } from "../../state/Models";
import Masthead from "../Masthead";

const WAVES = require("vanta/src/vanta.waves").default;

declare global {
  interface Window {
    THREE: any;
    WAVES: any;
  }
}

const Game: FC = () => {
  const {
    state: { game, players },
    actions: { startGame, gameOver, resetGame },
    dispatch
  } = useContext(ctx);
  const defaultWaveConfig = {
    waveHeight: 5,
    waveSpeed: 2
  };
  const [waveConfig, setWaveConfig] = useState(defaultWaveConfig);

  useEffect(() => {
    if (!game.inBattle) return;
    for (const { fleet, type } of players) {
      if (fleet.ships.every(ship => ship.sunk)) {
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
          }
        };

        if (type === PlayerType.Human) {
          Modal.confirm(modalConfig);
        } else Modal.success(modalConfig);
      }
    }
  }, [game, players, dispatch, gameOver, resetGame, startGame]);

  useEffect(() => {
    const wavesConfig = {
      el: "#waves",
      color: 0x3b515f,
      shininess: 12.0,
      waveSpeed: 0.5,
      zoom: 1,
      ...waveConfig
    };

    window.THREE = THREE;
    window.WAVES = WAVES(wavesConfig);

    return () => {
      // TODO ANIMATE THIS DESTRUCTION
      window.WAVES.destroy();
    };
  }, [waveConfig]);

  useEffect(() => {
    if (game.active) setWaveConfig({ waveHeight: 5, waveSpeed: 2 });
  }, [game]);

  return (
    <GameContainer id="waves">
      {game.active ? <Board /> : <StartScreen />}

      <Masthead />
    </GameContainer>
  );
};

export default Game;
