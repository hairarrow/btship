import React, { useContext, FC } from "react";
import { ctx } from "../../App";
import StyledGrid from "./Grid.styled";
import GridCell from "../GridCell";
import { ICell } from "../../state/Models";

type TProps = {
  grid: ICell[];
  canBeAttacked?: boolean;
};
const Grid: FC<TProps> = ({ grid, canBeAttacked }) => {
  const {
    state: {
      game: { gridSize }
    },
    actions: { removeSelectedShip },
    dispatch
  } = useContext(ctx);

  return (
    <StyledGrid
      gridSize={gridSize}
      onMouseLeave={() => dispatch(removeSelectedShip())}
    >
      {grid.map((cell, i) => (
        <GridCell
          key={`${cell.position.x}${cell.position.y}`}
          cell={cell}
          type={cell.type}
          canBeAttacked={canBeAttacked}
          odd={i % 2 === 0}
        />
      ))}
    </StyledGrid>
  );
};

export default Grid;
