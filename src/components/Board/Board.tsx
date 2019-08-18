import React, { FC, useContext } from "react";
import { ctx } from "../../App";
import { PlayerType } from "../../state/Models";
import Grid from "../Grid";
import Fleet from "../Fleet";
import Stats from "../Stats";
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
      <div className="board board--placing">
        <h1 className="board__title">Place your ships!</h1>
        <Grid className="board__grid" grid={getHumanPlayer(players).grid} />
        <Fleet className="board__fleet" player={PlayerType.Human} />
        <Stats className="board__stats" />
      </div>
    </BoardContainer>
  ) : (
    <BoardContainer>
      <div className="board board--battle">
        <Grid
          className="board__player-grid"
          grid={getHumanPlayer(players).grid}
        />

        <h2 className="board__title">Sink the Ships!</h2>
        <Stats className="board__stats" />

        <Grid
          className="board__opponent-grid"
          grid={getAIPlayer(players).grid}
          canBeAttacked={playerTurn === PlayerType.Human}
        />
      </div>
    </BoardContainer>
  );
};

export default Board;
