import React, {
  useContext,
  FC,
  HTMLAttributes,
  useState,
  useRef,
  useEffect
} from "react";
import { ctx } from "../../App";
import StyledGrid from "./Grid.styled";
import GridCell from "../GridCell";
import { ICell } from "../../state/Models";
import useWindowSize from "../../hooks/useWindowSize";

type TProps = {
  grid: ICell[];
  canBeAttacked?: boolean;
};

const Grid: FC<TProps & HTMLAttributes<HTMLDivElement>> = ({
  grid,
  canBeAttacked,
  ...props
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const { height, isLandscape } = useWindowSize();
  const [gridHeight, setGridHeight] = useState(0);

  useEffect(() => {
    const cWidth =
      (gridRef.current && gridRef.current.getBoundingClientRect().width) || 300;
    const cHeight =
      (gridRef.current && gridRef.current.getBoundingClientRect().height) ||
      300;

    setGridHeight(cWidth >= 600 ? 600 : cWidth);

    if (cHeight < cWidth) {
      setGridHeight(cHeight);
    } else {
      setGridHeight(cWidth);
    }
  }, [isLandscape, height, gridRef]);

  const {
    state: {
      game: { gridSize }
    },
    actions: { removeSelectedShip },
    dispatch
  } = useContext(ctx);

  return (
    <StyledGrid
      ref={gridRef}
      gridSize={gridSize}
      onMouseLeave={() => dispatch(removeSelectedShip())}
      gridHeight={gridHeight}
      {...props}
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
