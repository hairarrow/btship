import React, { FC, useContext, useEffect } from "react";
import { ctx } from "../../App";
import StartScreen from "../StartScreen";
import Board from "../Board";
import GameContainer from "./Game.styled";

import * as THREE from "three";
// import { default as WAVES } from "vanta/src/vanta.waves";
const WAVES = require("vanta/src/vanta.waves").default;

declare global {
  interface Window {
    THREE: any;
    WAVES: any;
  }
}

const Game: FC = () => {
  const {
    state: {
      game: { active }
    },
    actions: { startGame },
    dispatch
  } = useContext(ctx);

  useEffect(() => {
    window.THREE = THREE;
    window.WAVES = WAVES({
      el: "#waves",
      color: 0x3b515f,
      shininess: 12.0,
      waveHeight: 5.0,
      waveSpeed: 0.5,
      zoom: 0.65
    });

    if (!active) {
      dispatch(startGame());
    }

    return () => {
      window.WAVES.destroy();
    };
  }, []);

  return (
    <GameContainer id="waves">
      {active ? <Board /> : <StartScreen />}
    </GameContainer>
  );
};

export default Game;
