import React, { FC, useContext } from "react";
import { ctx } from "../../App";
import Container from "./StartScreen.styled";

const StartScreen: FC = () => {
  const {
    dispatch,
    actions: { startGame }
  } = useContext(ctx);

  return (
    <Container>
      <h1 className="title">BattleBoats</h1>
      <h2>Can you beat the computer?</h2>
      <button onClick={() => dispatch(startGame())}>Start</button>
    </Container>
  );
};

export default StartScreen;
