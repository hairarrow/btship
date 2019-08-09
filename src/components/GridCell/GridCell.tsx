import React, { FC, useContext, useCallback, useState, useEffect } from "react";
import StyledGridCell from "./GridCell.styled";
import { ICell, PlayerType } from "../../state/Models";
import { ctx } from "../../App";

const GridCell: FC<{ cell: ICell }> = ({
  cell: {
    position: { x, y },
    type
  }
}) => {
  const {
    state: {
      game: { placing },
      players
    },
    actions: { moveShip },
    dispatch
  } = useContext(ctx);
  const handleHoverEnter = useCallback(async () => {
    if (!placing) return;
    const {
      fleet: { selectedShip }
    } = [...players].filter(({ type }) => type === PlayerType.Human)[0];
    if (!selectedShip) return;

    moveShip(dispatch)(selectedShip.name, { x, y });
  }, [placing, moveShip, players, x, y]);

  return (
    <StyledGridCell type={type} onMouseEnter={handleHoverEnter}>
      {x}
      {y}
    </StyledGridCell>
  );
};

export default GridCell;
