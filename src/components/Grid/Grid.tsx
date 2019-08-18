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

type TProps = {
  grid: ICell[];
  canBeAttacked?: boolean;
};

const Grid: FC<TProps & HTMLAttributes<HTMLDivElement>> = ({
  grid,
  canBeAttacked,
  ...props
}) => {
  const [height, setHeight] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current)
      setHeight(gridRef.current.getBoundingClientRect().height / 1.5);
  }, []);

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
      gridHeight={height}
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
