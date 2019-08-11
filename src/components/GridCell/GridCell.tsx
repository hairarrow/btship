import React, { FC, useContext, useCallback, useState, useEffect } from "react";
import StyledGridCell from "./GridCell.styled";
import { ICell, PlayerType, CellType } from "../../state/Models";
import { ctx } from "../../App";
import getHumanPlayer from "../../lib/getHumanPlayer";

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
    actions: { moveShip, placeShip, removeSelectedShip, selectShip },
    dispatch
  } = useContext(ctx);
  const handleHoverEnter = useCallback(() => {
    if (!placing) return;
    const {
      fleet: { selectedShip }
    } = getHumanPlayer(players);
    if (!selectedShip) return;

    dispatch(moveShip(selectedShip.name, { x, y }));
  }, [placing, moveShip, players, x, y]);
  const handleClick = useCallback(() => {
    if (!placing) return;
    console.log(x, y);
    const {
      fleet: { selectedShip, ships }
    } = getHumanPlayer(players);

    if (type === CellType.PendingShip) {
      // TODO, this fails if you try to place on the same tile you picked up a ship from
      const { name } = [...ships]
        .map(({ name, positions }) => ({ name, positions }))
        .filter(({ positions }) =>
          positions
            .map(({ position: p }) => `${p.x}-${p.y}`)
            .includes(`${x}-${y}`)
        )[0];
      dispatch(selectShip(name));
    }

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
