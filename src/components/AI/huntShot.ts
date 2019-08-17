import { TSegment } from "./createSegments";
import { IShip, ICell, IPosition } from "../../state/Models";
import { gridProbCoords, sortedProbableCells } from "./gridUtils";

export default function huntShot(
  grid: ICell[],
  segments: TSegment[],
  fleet: IShip[]
): IPosition {
  const cellProbs = gridProbCoords(grid);

  for (const { size: segmentSize, start, end } of segments) {
    const aFleet = [...fleet].filter(
      ({ size: shipSize }) => shipSize <= segmentSize!
    );
    const xy = start.x === end.x ? "x" : "y";
    const xyOp = start.x === end.x ? "y" : "x";

    for (let i = 0; i < segmentSize!; i++) {
      for (const ship of [...aFleet].filter(
        ({ size }) => size <= segmentSize! - i
      )) {
        for (let ii = 0; ii <= ship.size; ii++) {
          const xKey = xy === "x" ? start[xy] : start[xyOp] + ii + i;
          const yKey = xy === "x" ? start[xyOp] + ii + i : start[xy];
          const key = `${xKey}${yKey}`;

          if ([xKey, yKey].every(n => n <= 8)) cellProbs[key]++;
        }
      }
    }
  }

  const probCells = sortedProbableCells(grid, cellProbs);

  return probCells[0];
}
