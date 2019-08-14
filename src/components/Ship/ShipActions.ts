import {
  IPosition,
  IShip,
  ShipDirection,
  PlayerType,
  CellType,
  ICell,
  IState,
  IPlayer
} from "../../state/Models";

type TParams = {
  ship: IShip;
  position: IPosition;
  direction: ShipDirection;
  player: PlayerType;
  gridSize: number;
  grid: ICell[];
};

export function randomPlacements(state: IState, player: PlayerType): IPlayer[] {
  const { players: playerState, game } = state;
  const {
    fleet: { ships: shipsState },
    grid: GRID
  } = [...playerState].filter(it => it.type === player)[0];
  let grid = [...GRID];
  const ships = [...shipsState].map(ship => {
    let illegalPlacement = true;
    let newShip: IShip = ship;

    while (illegalPlacement) {
      const x = Math.floor(game.gridSize * Math.random());
      const y = Math.floor(game.gridSize * Math.random());
      const direction = Math.floor(2 * Math.random());
      const obj = {
        ship,
        direction,
        grid,
        player,
        position: { x, y },
        gridSize: game.gridSize
      };

      if (isLegal(obj)) {
        newShip = placeShip(obj);
        grid = placeShipOnGrid({ ...obj, ship: newShip });
        illegalPlacement = false;
      }
    }

    return newShip;
  });

  const updatePlayer = { grid, ships };
  const players = [...playerState].map(it =>
    it.type === player ? { ...it, ...updatePlayer } : it
  );

  return players;
}

export function placeShip(obj: TParams, hover = false): IShip {
  const {
    ship,
    position: { x, y }
  } = obj;
  ship.positions = [...new Array(ship.size)].map((_, i) => {
    const position =
      obj.direction === ShipDirection.Vertical
        ? { x, y: y + i }
        : { x: x + i, y };
    return { position, type: hover ? CellType.HoverShip : CellType.Ship };
  });
  ship.placed = true;

  return ship;
}

export function placeShipOnGrid(obj: TParams): ICell[] {
  const { ship } = obj;
  let { grid } = obj;

  ship.positions.map(({ position: { x, y }, type }) => {
    grid = grid.map(it =>
      it.position.x === x && it.position.y === y
        ? {
            ...it,
            type
          }
        : it
    );

    return false;
  });

  return grid;
}

export function isLegal(obj: TParams): boolean {
  const grid = [...obj.grid].reduce<{ [k: string]: CellType }>((a, b) => {
    const xy = `${b.position.x}-${b.position.y}`;
    a[xy] = b.type;
    return a;
  }, {});

  if (withinBounds(obj)) {
    const shipCells = [...new Array(obj.ship.size)].map((_, i) => {
      const cell =
        obj.direction === ShipDirection.Vertical
          ? `${obj.position.x}-${obj.position.y + i}`
          : `${obj.position.x + i}-${obj.position.y}`;
      return grid[cell];
    });
    return shipCells.every(it =>
      [CellType.Empty, CellType.HoverShip].includes(it)
    );
  } else {
    return false;
  }
}

export function withinBounds(obj: TParams): boolean {
  if (obj.direction === ShipDirection.Vertical) {
    return obj.position.y + obj.ship.size <= obj.gridSize;
  } else {
    return obj.position.x + obj.ship.size <= obj.gridSize;
  }
}
