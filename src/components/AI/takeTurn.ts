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
import huntShot from "./huntShot";

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

  const shot =
    aiMode === AIMode.HUNT
      ? huntShot(hiddenGrid, segments, humanFleet)
      : // TODO This is a crappy fix... computer errors out when trying to get target shots
        targetShot(hiddenGrid, segments, humanFleet) ||
        [...hiddenGrid]
          .map(
            ({ type, position: { x, y } }) =>
              type === CellType.Empty && { x, y }
          )
          .filter(Boolean)[0];

  const grid = [...humanGrid].map(it => {
    if (it.position.x === shot.x && it.position.y === shot.y)
      return {
        ...it,
        type: it.type === CellType.Ship ? CellType.Hit : CellType.Miss
      };
    return it;
  });
  const fleetShips = [...humanFleet].map(it => {
    const positions = [...it.positions].map(pos => {
      if (shot.x === pos.position.x && shot.y === pos.position.y)
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
