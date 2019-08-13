import {
  IPlayer,
  AIMode,
  CellType,
  IPosition,
  PlayerType
} from "../../state/Models";
import getHumanPlayer from "../../lib/getHumanPlayer";
import createSegments from "./createSegments";

type TSegment = {
  start: IPosition;
  end: IPosition;
  size?: number;
};

type TSegments = {
  [k: string]: TSegment[];
};

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
  const aiMode: AIMode.HUNT | AIMode.TARGET = [...humanFleet].some(ship =>
    ship.positions.some(pos => pos.type === CellType.Hit)
  )
    ? AIMode.TARGET
    : AIMode.HUNT;

  console.log(aiMode === AIMode.HUNT);

  if (aiMode === AIMode.TARGET) {
    const hits = [...hiddenGrid].filter(it => it.type === CellType.Hit);
    const neighborCells = [...hiddenGrid].filter(cell =>
      [...hits].some(hit => {
        if (cell.position.x <= 9 && cell.position.y <= 9) {
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
      })
    );
    const shot = [...neighborCells][0];
    const grid = [...humanGrid].map(it => {
      if (
        it.position.x === shot.position.x &&
        it.position.y === shot.position.y
      )
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

    const players = [...playersState].map(it =>
      it.type === PlayerType.Human
        ? { ...it, grid, fleet: { ...it.fleet, ships: fleetShips } }
        : it
    );
    return players;
  } else {
    const segments = createSegments(hiddenGrid, smallestShipSize);
    console.log(segments);

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
      if (
        it.position.x === shot.position.x &&
        it.position.y === shot.position.y
      )
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

    const players = [...playersState].map(it =>
      it.type === PlayerType.Human
        ? { ...it, grid, fleet: { ...it.fleet, ships: fleetShips } }
        : it
    );
    return players;
  }
}
