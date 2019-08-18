import React, { FC, useContext, useCallback } from "react";
import StyledGridCell from "./GridCell.styled";
import { ICell, CellType, PlayerType } from "../../state/Models";
import { ctx } from "../../App";
import getHumanPlayer from "../../lib/getHumanPlayer";

type TProps = {
  cell: ICell;
  type: CellType;
  odd: boolean;
  canBeAttacked?: boolean;
};

const GridCell: FC<TProps> = ({
  cell: {
    position: { x, y }
  },
  odd,
  type,
  canBeAttacked
}) => {
  const {
    state: {
      game: { placing },
      players
    },
    actions: { moveShip, manualPlaceShip: placeShip, selectShip, shoot },
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
    if ([CellType.Empty, CellType.Ship].includes(type))
      dispatch(shoot(PlayerType.Computer, { x, y }));
  }, [dispatch, shoot, x, y, type]);

  return (
    <StyledGridCell
      type={canBeAttacked && type === CellType.Ship ? CellType.Empty : type}
      onMouseEnter={handleHoverEnter}
      onClick={canBeAttacked ? handleAttackClick : handleClick}
      className={`cell ${odd ? "odd-cell" : ""}`}
    />
  );
};

export default GridCell;
