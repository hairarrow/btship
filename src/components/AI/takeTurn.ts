import {
  IPlayer,
  AIMode,
  CellType,
  IPosition,
  PlayerType
} from "../../state/Models";
import getHumanPlayer from "../../lib/getHumanPlayer";
import createSegments from "./createSegments";
import targetShot from "./targetShot";

type TSegment = {
  start: IPosition;
  end: IPosition;
  size?: number;
};

// TODO BREAK THIS UP
export function takeTurn(playersState: IPlayer[], gridSize: number): IPlayer[] {
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
  const segments = createSegments(hiddenGrid, smallestShipSize);

  if (aiMode === AIMode.TARGET) {
    const target = targetShot(hiddenGrid, segments, humanFleet);
    const grid = [...humanGrid].map(it => {
      if (it.position.x === target.x && it.position.y === target.y)
        return {
          ...it,
          type: it.type === CellType.Ship ? CellType.Hit : CellType.Miss
        };
      return it;
    });
    const fleetShips = [...humanFleet].map(it => {
      const positions = [...it.positions].map(pos => {
        if (target.x === pos.position.x && target.y === pos.position.y)
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
    const probability = [...segments].reduce<any>((coords, b) => {
      if (!b.size) return coords;
      for (let i = 0; i < b.size; i++) {
        const aFleet = [...humanFleet].filter(
          it => b.size && it.size <= b.size - i
        );
        for (let ship = 0; ship < aFleet.length; ship++) {
          for (let shipGrid = 0; shipGrid <= aFleet[ship].size; shipGrid++) {
            const xy =
              b.start.x === b.end.x
                ? `${b.start.x}-${b.start.y + i + shipGrid}`
                : `${b.start.x + i + shipGrid}-${b.start.y}`;
            if (coords[xy] === undefined) coords[xy] = 0;
            else {
              coords[xy] = coords[xy] + 1;
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
        : {
            ...it,
            grid: playersState.filter(
              ({ type }) => type === PlayerType.Computer
            )[0].grid
          }
    );
    return players;
  }
}
