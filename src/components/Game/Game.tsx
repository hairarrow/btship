import React, { FC, useContext, useEffect, useState } from "react";
import { ctx } from "../../App";
import StartScreen from "../StartScreen";
import Board from "../Board";
import GameContainer from "./Game.styled";

import * as THREE from "three";
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
    }
  } = useContext(ctx);
  const [waveConfig, setWaveConfig] = useState({
    waveHeight: 1,
    waveSpeed: 0.5
  });

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
      console.log("DESTROY");
      window.WAVES.destroy();
    };
  }, [waveConfig]);

  useEffect(() => {
    if (active) setWaveConfig({ waveHeight: 5, waveSpeed: 1 });
  }, [active]);

  return (
    <GameContainer id="waves">
      {active ? <Board /> : <StartScreen />}
    </GameContainer>
  );
};

export default Game;
