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
) {
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

    return shots;
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

    const segmentProbs = [...possibleSegments].map(({ size, start, end }) => {
      const xy = start.x === end.x ? "x" : "y";
      const xyOp = xy === "x" ? "y" : "x";
      const coords = [...Array(size)].map((_, idx) => {
        const ss = [...fleet]
          .filter(({ size }) => size >= size! - idx)
          .map(it => {
            [...Array(it.size)].map((_, ii) => {
              const key = `${xy === "x" ? start[xy] : start[xyOp] + ii}${
                xy === "y" ? start[xy] : start[xyOp] + ii
              }`;

              console.log(key);
              console.log(cellProbs[key]);
              console.log(cellProbs);

              // cellProbs[key] = cellProbs
            });
          });
      });
    });
  }
}
