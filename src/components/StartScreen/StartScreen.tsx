import React, { FC, useContext } from "react";
import { ctx } from "../../App";

const StartScreen: FC = () => {
  const {
    dispatch,
    actions: { startGame }
  } = useContext(ctx);

  return (
    <section>
      <h1>BattleBoats</h1>
      <h2>Can you beat the computer?</h2>
      <button onClick={() => dispatch(startGame())}>Start</button>
    </section>
  );
};

export default StartScreen;
