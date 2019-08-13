import React, { FC, useContext, useCallback } from "react";
import StyledGridCell from "./GridCell.styled";
import { ICell, CellType, PlayerType } from "../../state/Models";
import { ctx } from "../../App";
import getHumanPlayer from "../../lib/getHumanPlayer";

type TProps = {
  cell: ICell;
  type: CellType;
  canBeAttacked?: boolean;
};

const GridCell: FC<TProps> = ({
  cell: {
    position: { x, y }
  },
  type,
  canBeAttacked
}) => {
  const {
    state: {
      game: { placing },
      players
    },
    actions: { moveShip, placeShip, selectShip, shoot },
    dispatch
  } = useContext(ctx);
  const handleHoverEnter = useCallback(() => {
    if (!placing) return;
    const {
      fleet: { selectedShip }
    } = getHumanPlayer(players);
    if (!selectedShip) return;

    dispatch(moveShip(selectedShip.name, { x, y }));
  }, [placing, moveShip, players, x, y, dispatch]);

  const handleClick = useCallback(() => {
    if (!placing) return;
    const {
      fleet: { selectedShip, ships }
    } = getHumanPlayer(players);

    if (type === CellType.Ship) {
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
  }, [placing, placeShip, players, x, y, dispatch, selectShip, type]);

  const handleAttackClick = useCallback(() => {
    dispatch(shoot(PlayerType.Computer, { x, y }));
  }, [dispatch, shoot, x, y]);

  // TODO useStateEffect validPlacement
  // TODO check if clicking on a placed ship, then select that ship

  return canBeAttacked ? (
    <StyledGridCell
      type={type}
      onMouseEnter={handleHoverEnter}
      onClick={handleAttackClick}
    >
      {type}
    </StyledGridCell>
  ) : (
    <StyledGridCell
      type={type}
      onMouseEnter={handleHoverEnter}
      onClick={handleClick}
    >
      {type}-{x}-{y}
    </StyledGridCell>
  );
};

export default GridCell;
