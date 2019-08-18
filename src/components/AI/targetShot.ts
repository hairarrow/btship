import { ICell, CellType, IPosition, IShip } from "../../state/Models";
import {
  gridTypeCoords,
  gridProbCoords,
  sortedProbableCells
} from "./gridUtils";
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
  const neighborCells = [...grid].filter(cell =>
    [...hits].some((hit): boolean => {
      return (
        cell.type === CellType.Empty &&
        (cell.position.x === hit.position.x ||
          cell.position.y === hit.position.y) &&
        (cell.position.y === hit.position.y + 1 ||
          cell.position.y === hit.position.y - 1 ||
          cell.position.x === hit.position.x + 1 ||
          cell.position.x === hit.position.x - 1)
      );
    })
  );

  type TXYHits = { [key in TXoY]: number[] | Set<number> };

  const xyHits = [...hits].reduce<TXYHits>(
    (a, b) => {
      a.x = [...a.x, b.position.x];
      a.y = [...a.y, b.position.y];
      return a;
    },
    { x: [], y: [] }
  );

  const xyHitSets = Object.keys(xyHits).reduce<TXYHits>(
    (a, b) => {
      if (b === "x") a.x = new Set(xyHits.x);
      else a.y = new Set(xyHits.y);
      return a;
    },
    {
      x: [],
      y: []
    }
  );

  const dirs: TXoY[] = ["x", "y"];
  // TODO GET RID OF THIS GARBJ
  // This blocks out when it thinks the ship is in one direction
  // But really, it could be two ships in different directions...
  // Working on a better method with sets above.
  const nextShots = [...dirs]
    .map(XY => {
      const size = hitSegments[XY]!.size || 0;
      const { start, end } = hitSegments[XY]!;
      const xy: TXoY = XY === "x" ? "y" : "x";
      const xyOp: TXoY = xy === "x" ? "y" : "x";
      const SE = [start, end];
      if (size < 1) return false;
      return SE.map((point, idx): boolean | Partial<IPosition> => {
        const p = point[xy];
        const pOp = point[xyOp];
        const shot: Partial<{ [k in TXoY]: number }> = {
          [xy]: idx ? p + 1 : p - 1,
          [xyOp]: pOp
        };
        if (p >= 0 && p <= 8) return shot;
        else return false;
      }).filter(Boolean);
    })
    .filter(Boolean)
    .reduce((a, b) => [...a, ...b], []);

  if (hits.length >= 2) {
    const shots = [...(nextShots as IPosition[])].filter(p => {
      return cellTypes[`${p.x}${p.y}`] === CellType.Empty;
    });

    if (shots.length === 0) {
      const newShots: IPosition[] = [];
      for (const x of xyHitSets.x.values()) {
        for (const y of xyHitSets.y.values()) {
          if (x <= 7 && y <= 7) newShots.push({ x: x + 1, y: y + 1 });
          if (x >= 1 && y >= 1) newShots.push({ x: x - 1, y: y - 1 });
        }
      }

      const possibleNewShots = [...newShots].filter(
        ({ x, y }) => cellTypes[`${x}${y}`] === CellType.Empty
      );

      return possibleNewShots[
        Math.floor(Math.random() * possibleNewShots.length)
      ];
    }

    return shots.length === 1
      ? shots[0]
      : shots[Math.floor(Math.random() * shots.length)];
  } else {
    const possibleSegments = [...segments].filter(
      it =>
        ((it.start.x === it.end.x || it.start.y === it.end.y) &&
          neighborCells.some(c => c.position.x === it.start.x)) ||
        neighborCells.some(c => c.position.y === it.start.y)
    );

    for (const { size, start, end } of possibleSegments) {
      const xy = start.x === end.x ? "x" : "y";
      const xyOp = xy === "x" ? "y" : "x";
      for (let i = 0; i < size!; i++) {
        const minSize = size! - (start[xyOp] + i);

        for (const ship of [...fleet].filter(({ size }) => size <= minSize)) {
          for (let ii = 0; ii <= ship.size; ii++) {
            const xKey = xy === "x" ? start[xy] : start[xyOp] + ii + i;
            const yKey = xy === "x" ? start[xyOp] + ii + i : start[xy];
            const key = `${xKey}${yKey}`;
            if ([xKey, yKey].every(n => n <= 8)) cellProbs[key]++;
          }
        }
      }
    }

    const probCells = sortedProbableCells(neighborCells, cellProbs);

    return probCells[0];
  }
}
