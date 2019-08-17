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
      <h1 className="board__title">Place your ships!</h1>
      <Grid className="board__grid" grid={getHumanPlayer(players).grid} />
      <Fleet player={PlayerType.Human} />
    </BoardContainer>
  ) : (
    <BoardContainer>
      <Grid className="board__human-grid" grid={getHumanPlayer(players).grid} />

      <h2>Sink the Ships!</h2>

      <Grid
        className="board__ai-grid"
        grid={getAIPlayer(players).grid}
        canBeAttacked={playerTurn === PlayerType.Human}
      />
    </BoardContainer>
  );
};

export default Board;
