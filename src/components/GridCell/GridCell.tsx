import React, { FC, useContext, useCallback, useState, useEffect } from "react";
import StyledGridCell from "./GridCell.styled";
import { ICell, PlayerType, CellType } from "../../state/Models";
import { ctx } from "../../App";

const GridCell: FC<{ cell: ICell; type: CellType }> = ({
  cell: {
    position: { x, y }
  },
  type
}) => {
  const {
    state: {
      game: { placing },
      players
    },
    actions: { moveShip, placeShip },
    dispatch
  } = useContext(ctx);
  const handleHoverEnter = useCallback(() => {
    if (!placing) return;
    const {
      fleet: { selectedShip }
    } = [...players].filter(({ type }) => type === PlayerType.Human)[0];
    if (!selectedShip) return;

    dispatch(moveShip(selectedShip.name, { x, y }));
  }, [placing, moveShip, players, x, y]);
  const handleClick = useCallback(() => {
    if (!placing) return;
    const {
      fleet: { selectedShip }
    } = [...players].filter(({ type }) => type === PlayerType.Human)[0];
    if (!selectedShip) return;

    dispatch(placeShip(selectedShip.name, { x, y }));
  }, [placing, placeShip, players, x, y]);

  // TODO useStateEffect validPlacement
  // TODO check if clicking on a placed ship, then select that ship

  return (
    <StyledGridCell
      type={type}
      onMouseEnter={handleHoverEnter}
      onClick={handleClick}
    >
      {type}
    </StyledGridCell>
  );
};

export default GridCell;
