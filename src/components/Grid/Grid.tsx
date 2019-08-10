import React, { useContext, FC, useEffect, useState } from "react";
import { ctx } from "../../App";
import StyledGrid from "./Grid.styled";
import GridCell from "../GridCell";
import { ICell } from "../../state/Models";

const Grid: FC<{ grid: ICell[] }> = ({ grid }) => {
  const {
    state: {
      game: { gridSize }
    }
  } = useContext(ctx);

  return (
    <StyledGrid gridSize={gridSize} onMouseLeave={() => console.log("left")}>
      {grid.map(cell => (
        <GridCell
          key={`${cell.position.x}${cell.position.y}`}
          cell={cell}
          type={cell.type}
        />
      ))}
    </StyledGrid>
  );
};

export default Grid;
