import React, { useContext, FC, useEffect } from "react";
import { ctx } from "../../App";
import StyledGrid from "./Grid.styled";
import GridCell from "../GridCell";

const Grid: FC<{ player: string }> = ({ player }) => {
  const {
    state: {
      players,
      game: { gridSize }
    }
  } = useContext(ctx);
  const { grid } = [...players].filter(({ type }) => type === player)[0];

  return (
    <StyledGrid gridSize={gridSize}>
      {grid.cells.map(cell => (
        <GridCell key={`${cell.position.x}${cell.position.y}`} cell={cell} />
      ))}
    </StyledGrid>
  );
};

export default Grid;
