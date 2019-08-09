import React, { useContext, FC } from "react";
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
  console.log(grid);
  return (
    <StyledGrid gridSize={gridSize}>
      {grid.cells.map(cell => (
        <GridCell key={`${cell.position.x}${cell.position.y}`} cell={cell} />
      ))}
    </StyledGrid>
  );
};

export default Grid;
