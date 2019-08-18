import React, {
  useContext,
  FC,
  HTMLAttributes,
  useState,
  useRef,
  useEffect
} from "react";
import { ctx } from "../../App";
import useComponentSize from "@rehooks/component-size";
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
  const gridRef = useRef<HTMLDivElement>(null);
  const { width, height } = useComponentSize(gridRef);
  const [gridHeight, setGridHeight] = useState(0);

  useEffect(() => {
    if (window.innerWidth < height * 2) {
      setGridHeight(height / 1.33);
    } else {
      setGridHeight(height);
    }
  }, [width, height]);

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
