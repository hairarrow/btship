import {
  IPlayer,
  AIMode,
  CellType,
  IPosition,
  PlayerType
} from "../../state/Models";
import getHumanPlayer from "../../lib/getHumanPlayer";

type TSegment = {
  start: IPosition;
  end: IPosition;
  size?: number;
};

type TSegments = {
  [k: string]: TSegment[];
};

// TODO AI Stops shooting after it lands one shot
// TODO BREAK THIS UP
export function takeTurn(playersState: IPlayer[]): IPlayer[] {
  const humanGrid = getHumanPlayer(playersState).grid;
  const hiddenGrid = [...humanGrid].map(it => {
    if (it.type === CellType.Ship) return { ...it, type: CellType.Empty };
    return it;
  });
  const humanFleet = getHumanPlayer(playersState).fleet.ships.filter(
    it => !it.sunk
  );

  const smallestShipSize = [...humanFleet].map(it => it.size).sort()[0];

  const vSegments = [...hiddenGrid]
    .filter(({ type }) => type === CellType.Empty)
    .reduce<TSegments>((a, { position: { x, y } }) => {
      if (!a[y]) a[y] = [{ start: { x, y }, end: { x, y } }];
      else if (
        a[y][a[y].length - 1].start.y === y &&
        a[y][a[y].length - 1].end.x + 1 === x
      )
        a[y][a[y].length - 1].end.x = x;
      else a[y].push({ start: { x, y }, end: { x, y } });

      return a;
    }, {});

  const hSegments = [...hiddenGrid]
    .filter(({ type }) => type === CellType.Empty)
    .reduce<TSegments>((a, { position: { x, y } }) => {
      if (!a[x]) a[x] = [{ start: { x, y }, end: { x, y } }];
      else if (
        a[x][a[x].length - 1].start.x === x &&
        a[x][a[x].length - 1].end.y + 1 === y
      )
        a[x][a[x].length - 1].end.y = y;
      else a[x].push({ start: { x, y }, end: { x, y } });
      return a;
    }, {});

  const cH = Object.keys(hSegments).reduce<TSegment[]>((a, b) => {
    const n = [...hSegments[b]].map(it => {
      return { ...it, size: it.end.y - it.start.y };
    });
    return [...a, ...n];
  }, []);

  const cV = Object.keys(vSegments).reduce<TSegment[]>((a, b) => {
    const n = [...vSegments[b]].map(it => {
      return { ...it, size: it.end.x - it.start.x };
    });
    return [...a, ...n];
  }, []);

  const segments = [...cV, ...cH].filter(
    it => it.size && it.size >= smallestShipSize
  );

  // TODO If the location of a ship is known, then it should be taken
  // out of the probability for other locations
  // TODO for THE LOVE OF GOD, MAKE THIS DECLARATIVE
  // Or just readable in general...
  const probability = [...segments].reduce<any>((coords, b) => {
    if (b.size && b.start.x === b.end.x) {
      for (let i = 0; i < b.size; i++) {
        const aFleet = [...humanFleet].filter(
          it => b.size && it.size <= b.size - i
        );
        for (let ship = 0; ship < aFleet.length; ship++) {
          for (let shipGrid = 0; shipGrid <= aFleet[ship].size; shipGrid++) {
            const xy = `${b.start.x}-${b.start.y + i + shipGrid}`;
            if (coords[xy] === undefined) coords[xy] = 0;
            else {
              coords[xy] = coords[xy] + 1;
            }
          }
        }
      }
      // TODO Refactor; The only diff is line 104
    } else if (b.size && b.start.y === b.end.y) {
      for (let i = 0; i < b.size; i++) {
        const aFleet = [...humanFleet].filter(
          it => b.size && it.size <= b.size - i
        );
        for (let ship = 0; ship < aFleet.length; ship++) {
          for (let shipGrid = 0; shipGrid <= aFleet[ship].size; shipGrid++) {
            const xy = `${b.start.x + i + shipGrid}-${b.start.y}`;
            if (coords[xy] === undefined) coords[xy] = 0;
            else {
              coords[xy] = coords[xy] + 1;
            }
          }
        }
      }
    }

    return coords;
  }, {});

  const probabilityGrid = [...hiddenGrid].map(it => {
    return {
      ...it,
      probability:
        it.type === CellType.Empty
          ? probability[`${it.position.x}-${it.position.y}`]
          : 0
    };
  });
  const availableShots = [...probabilityGrid].filter(
    (it, i) => i % 2 && it.type === CellType.Empty
  );

  const shot = [...availableShots].sort(
    (a, b) => b.probability - a.probability
  )[0];

  const grid = [...humanGrid].map(it => {
    if (it.position.x === shot.position.x && it.position.y === shot.position.y)
      return {
        ...it,
        type: it.type === CellType.Ship ? CellType.Hit : CellType.Miss
      };
    return it;
  });

  const fleetShips = [...humanFleet].map(it => {
    const positions = [...it.positions].map(pos => {
      if (
        shot.position.x === pos.position.x &&
        shot.position.y === pos.position.y
      )
        return { ...pos, type: CellType.Hit };
      return pos;
    });

    return { ...it, positions };
  });

  console.log(grid);

  const players = [...playersState].map(it =>
    it.type === PlayerType.Human
      ? { ...it, grid, fleet: { ...it.fleet, ships: fleetShips } }
      : it
  );
  return players;
}
