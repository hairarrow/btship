import {
  ICell,
  CellType,
  ShipDirection,
  IPosition,
  IShip
} from "../../state/Models";
import { gridTypeCoords, gridProbCoords } from "./gridUtils";
import { createHitSegments, TSegment } from "./createSegments";
import { TXoY } from "../../state/Models";

export default function targetShot(
  grid: ICell[],
  segments: TSegment[],
  fleet: IShip[]
): IPosition {
  const cellProbs = gridProbCoords(grid);
  const cellTypes = gridTypeCoords(grid);
  const hits = [...grid].filter(it => it.type === CellType.Hit);
  const hitSegments = createHitSegments(hits);

  if (hits.length >= 2) {
    const dirs: TXoY[] = ["x", "y"];
    const nextShots = [...dirs]
      .map(XY => {
        const size = hitSegments[XY]!.size || 0;
        const { start, end } = hitSegments[XY]!;
        const xy: TXoY = XY === "x" ? "y" : "x";
        const xyOp: TXoY = xy === "x" ? "y" : "x";
        const SE = [start, end];
        if (size < 1) return false;
        return SE.map(
          (point, idx): boolean | Partial<IPosition> => {
            const p = point[xy];
            const pOp = point[xyOp];
            const shot: Partial<{ [k in TXoY]: number }> = {
              [xy]: idx ? p + 1 : p - 1,
              [xyOp]: pOp
            };
            if (p >= 0 && p <= 8) return shot;
            else return false;
          }
        ).filter(Boolean);
      })
      .filter(Boolean)
      .reduce((a, b) => [...a, ...b], []);

    const shots = <IPosition[]>[...nextShots].filter(p => {
      // @ts-ignore
      const { x, y } = p;
      return cellTypes[`${x}${y}`] === CellType.Empty;
    });

    return shots.length === 1
      ? shots[0]
      : shots[Math.floor(Math.random() * shots.length)];
  } else {
    const neighborCells = [...grid].filter(cell =>
      [...hits].some(
        (hit): boolean => {
          return (
            cell.type === CellType.Empty &&
            (cell.position.x === hit.position.x ||
              cell.position.y === hit.position.y) &&
            (cell.position.y === hit.position.y + 1 ||
              cell.position.y === hit.position.y - 1 ||
              cell.position.x === hit.position.x + 1 ||
              cell.position.x === hit.position.x - 1)
          );
        }
      )
    );

    const possibleSegments = [...segments].filter(
      it =>
        ((it.start.x === it.end.x || it.start.y === it.end.y) &&
          neighborCells.some(c => c.position.x === it.start.x)) ||
        neighborCells.some(c => c.position.y === it.start.y)
    );

    for (const { size, start, end } of possibleSegments) {
      const xy = start.x === end.x ? "x" : "y";
      const xyOp = xy === "x" ? "y" : "x";
      for (let i = start[xyOp]; i < size!; i++) {
        const minSize = size! - (start[xyOp] + i);

        for (const ship of [...fleet].filter(({ size }) => size <= minSize)) {
          for (let ii = 0; ii <= ship.size; ii++) {
            const xKey = xy === "x" ? start[xy] : start[xyOp] + i + ii;
            const yKey = xy === "x" ? start[xyOp] + i + ii : start[xy];
            const key = `${xKey}${yKey}`;
            if ([xKey, yKey].every(n => n <= 8)) cellProbs[key]++;
          }
        }
      }
    }

    const probCells = [...neighborCells]
      .map(cell => {
        const {
          position: { x, y }
        } = cell;
        const probability = cellProbs[`${x}${y}`];
        return { x, y, probability };
      })
      .sort((a, b) => b.probability - a.probability);

    console.log(probCells);

    return probCells[0];
  }
}
