import { ICell, CellType } from "../../state/Models";

type TCellProb = {
  [k: string]: number;
};
export const gridTypeCoords = (grid: ICell[]) =>
  [...grid].reduce<{ [k: string]: CellType }>(
    (coords, { position: { x, y }, type }) => {
      coords[`${x}${y}`] = type;
      return coords;
    },
    {}
  );

export const gridProbCoords = (grid: ICell[]) =>
  [...grid].reduce<TCellProb>((coords, { position: { x, y } }) => {
    coords[`${x}${y}`] = 0;
    return coords;
  }, {});

export const sortedProbableCells = (cells: ICell[], probs: TCellProb) =>
  [...cells]
    .map(cell => {
      const {
        position: { x, y }
      } = cell;
      const probability = probs[`${x}${y}`];
      return { x, y, probability };
    })
    .sort((a, b) => b.probability - a.probability);
