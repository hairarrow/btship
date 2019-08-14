import React, { FC, useContext } from "react";
import { ctx } from "../../App";
import { PlayerType } from "../../state/Models";
import Grid from "../Grid";
import Fleet from "../Fleet";
import getHumanPlayer from "../../lib/getHumanPlayer";
import getAIPlayer from "../../lib/getAIPlayer";
import BoardContainer from "./Board.styled";

const Board: FC = () => {
  const {
    state: {
      game: { placing, playerTurn },
      players
    }
  } = useContext(ctx);

  return placing ? (
    <BoardContainer>
      <h1>Place your ships!</h1>
      <Grid grid={getHumanPlayer(players).grid} />
      <Fleet player={PlayerType.Human} />
    </BoardContainer>
  ) : (
    <BoardContainer>
      <Grid grid={getHumanPlayer(players).grid} />

      <h1>Sink the Ships!</h1>
      <h3>Turn: {playerTurn}</h3>

      <Grid
        grid={getAIPlayer(players).grid}
        canBeAttacked={playerTurn === PlayerType.Human}
      />
    </BoardContainer>
  );
};

export default Board;
