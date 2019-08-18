import React, { FC, useContext, useEffect, useState } from "react";
import { ctx } from "../../App";
import StartScreen from "../StartScreen";
import Board from "../Board";
import GameContainer from "./Game.styled";
import { Modal } from "antd";

import * as THREE from "three";
import { PlayerType } from "../../state/Models";

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
  const [showGameOver, setShowGameOver] = useState(false);
  const [waveConfig, setWaveConfig] = useState({
    waveHeight: 1,
    waveSpeed: 0.5
  });

  useEffect(() => {
    const { winner, over, inBattle } = game;
    console.log("effect");
    console.log(winner, over, inBattle);
  }, [game, players]);

  useEffect(() => {
    if (!game.inBattle) return;
    for (const { fleet, type } of players) {
      if (fleet.ships.every(ship => ship.sunk)) {
        dispatch(
          gameOver(
            type === PlayerType.Human ? PlayerType.Computer : PlayerType.Human
          )
        );

        Modal.confirm({
          title: `You ${type === PlayerType.Human ? "Win!" : "Lose"}`,
          content: "Do you want to try again?",
          okText: "Try Again",
          cancelText: "Not Yet",
          onOk: () => {
            dispatch(resetGame());
            dispatch(startGame());
          }
        });
      }
    }
  }, [game, players]);

  useEffect(() => {
    if (!game.active) dispatch(startGame());
  }, []);

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
    if (game.active) setWaveConfig({ waveHeight: 5, waveSpeed: 1 });
  }, [game]);

  return (
    <GameContainer id="waves">
      {game.active ? <Board /> : <StartScreen />}
    </GameContainer>
  );
};

export default Game;
