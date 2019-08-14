import {
  IPosition,
  IShip,
  ShipDirection,
  PlayerType,
  CellType,
  ICell
} from "../../state/Models";

type TParams = {
  ship: IShip;
  position: IPosition;
  direction: ShipDirection;
  player: PlayerType;
  gridSize: number;
  grid: ICell[];
};

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

  [...ship.positions].map(({ position: { x, y }, type }) => {
    grid = grid.map(it =>
      it.position.x === x && it.position.y === y
        ? {
            ...it,
            type
          }
        : it
    );
  });

  return grid;
}

export function isLegal(obj: TParams): boolean {
  const legalBounds = withinBounds(obj);
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
