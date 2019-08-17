import { ICell, CellType } from "../../state/Models";

export const gridTypeCoords = (grid: ICell[]) =>
  [...grid].reduce<{ [k: string]: CellType }>(
    (coords, { position: { x, y }, type }) => {
      coords[`${x}${y}`] = type;
      return coords;
    },
    {}
  );

export const gridProbCoords = (grid: ICell[]) =>
  [...grid].reduce<{ [k: string]: number }>(
    (coords, { position: { x, y } }) => {
      coords[`${x}${y}`] = 0;
      return coords;
    },
    {}
  );
