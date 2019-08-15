import React, { FC, useContext } from "react";
import { ctx } from "../../App";
import Container from "./StartScreen.styled";
import Button from "../Button";

const StartScreen: FC = () => {
  const {
    dispatch,
    actions: { startGame }
  } = useContext(ctx);

  return (
    <Container>
      <h1 className="title">BattleBoats</h1>
      <h2>Can you beat the computer?</h2>
      <Button onClick={() => dispatch(startGame())}>Start</Button>
    </Container>
  );
};

export default StartScreen;
