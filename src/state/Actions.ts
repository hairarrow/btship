import { Dispatch } from "react";
import {
  TAction,
  IActions,
  PlayerActions,
  GameActions,
  ShipActions
} from "./ActionsModels";
import {
  IState,
  PlayerType,
  ICell,
  CellType,
  IGrid,
  IShip,
  ShipDirection,
  IFleet,
  IPlayer,
  IGame,
  IPosition
} from "./Models";
import DEFAULT_SHIPS from "../components/Ship/DefaultShips";

export function useActions<T extends IState>(
  state: T,
  dispatch: Dispatch<any>
): IActions {
  function createGrid(size: number): IGrid {
    const cells: ICell[] = Array.from(Array(size).keys()).reduce<ICell[]>(
      (acc, x) => {
        const row = Array.from(Array(size).keys()).map(y => ({
          position: { x, y },
          type: CellType.Empty
        }));
        return [...acc, ...row];
      },
      []
    );
    const grid = { cells };
    return grid;
  }

  function createPlayer(type: PlayerType): TAction {
    const {
      game: { gridSize: size }
    } = state;
    const grid = createGrid(size);
    const ships: IShip[] = [...DEFAULT_SHIPS].map(({ name, size }) => ({
      name,
      size,
      sunk: false,
      placed: false,
      direction: ShipDirection.Vertical,
      position: { x: 0, y: 0 },
      positions: []
    }));
    const fleet: IFleet = { ships, selectedShip: null };
    const player: IPlayer = {
      fleet,
      grid,
      type
    };

    return {
      type: PlayerActions.Create,
      player
    };
  }

  function startGame(): TAction {
    const { game: gameState } = state;
    [PlayerType.Human, PlayerType.Computer].map(it =>
      dispatch(createPlayer(it))
    );
    const game: IGame = {
      ...gameState,
      placing: true,
      active: true
    };

    return {
      type: GameActions.Start,
      game
    };
  }

  function selectShip(ship: string): TAction {
    const { players: playersState } = state;
    const { fleet: fleetState } = [...playersState].filter(
      ({ type }) => type === PlayerType.Human
    )[0];
    const { ships } = fleetState;
    const selectedShip = [...ships].filter(({ name }) => name === ship)[0];
    const fleet = { ...fleetState, selectedShip };
    const players = [...playersState].map(({ type, ...p }) =>
      type === PlayerType.Human ? { ...p, fleet, type } : { ...p, type }
    );

    return {
      type: PlayerActions.SelectShip,
      players
    };
  }

  function rotateShip(ship: string): TAction {
    const { players: playersState } = state;
    const { fleet: fleetState } = [...playersState].filter(
      ({ type }) => type === PlayerType.Human
    )[0];
    const { ships: shipsState } = fleetState;
    const ships = [...shipsState].map(({ name, direction, ...s }) =>
      name === ship
        ? {
            ...s,
            name,
            direction:
              direction === ShipDirection.Vertical
                ? ShipDirection.Horizontal
                : ShipDirection.Vertical
          }
        : { ...s, name, direction }
    );
    const fleet = { ...fleetState, ships };
    const players = [...playersState].map(({ type, ...p }) =>
      type === PlayerType.Human ? { ...p, fleet, type } : { ...p, type }
    );

    return {
      type: ShipActions.Rotate,
      players
    };
  }

  function moveShip(ship: string, position: IPosition): TAction {
    const { players: playersState } = state;
    const { fleet: fleetState } = [...playersState].filter(
      ({ type }) => type === PlayerType.Human
    )[0];
    const { ships: shipsState } = fleetState;
    const ships = [...shipsState].map(({ name, ...s }) =>
      name === ship
        ? {
            ...s,
            name,
            position,
            positions: [...Array(s.size)].map((it, idx) =>
              s.direction === ShipDirection.Vertical
                ? {
                    position: {
                      x: position.x,
                      y: position.y + idx
                    },
                    type: CellType.HoverShip
                  }
                : {
                    position: {
                      x: position.x + idx,
                      y: position.y
                    },
                    type: CellType.HoverShip
                  }
            )
          }
        : { ...s, name }
    );
    const fleet = { ...fleetState, ships };
    const players = [...playersState].map(({ type, ...p }) =>
      type === PlayerType.Human ? { ...p, fleet, type } : { ...p, type }
    );

    dispatch(updatePlayerGrid(players));

    return {
      type: ShipActions.UpdateCoords,
      players
    };
  }

  // TODO Check collisions and Boundries
  function placeShip(ship: string, position: IPosition): TAction {
    const { players: playersState } = state;
    const { fleet: fleetState } = [...playersState].filter(
      ({ type }) => type === PlayerType.Human
    )[0];
    const { ships: shipsState } = fleetState;
    const ships = [...shipsState].map(({ name, ...s }) => {
      return name === ship
        ? {
            ...s,
            name,
            position,
            positions: [...Array(s.size)].map((it, idx) =>
              s.direction === ShipDirection.Vertical
                ? {
                    position: {
                      x: s.position.x,
                      y: s.position.y + idx
                    },
                    type: CellType.PendingShip
                  }
                : {
                    position: {
                      x: s.position.x + idx,
                      y: s.position.y
                    },
                    type: CellType.PendingShip
                  }
            )
          }
        : { ...s, name };
    });
    const players = [...playersState].map(({ type, ...p }) =>
      type === PlayerType.Human ? { ...p, ships, type } : { ...p, type }
    );

    return {
      type: ShipActions.UpdateCoords,
      players
    };
  }

  // TODO Clean up empty grid positions
  function updatePlayerGrid(playersState: IPlayer[]): TAction {
    const { fleet: fleetState, grid: gridState } = [...playersState].filter(
      ({ type }) => type === PlayerType.Human
    )[0];
    const { ships: shipsState } = fleetState;
    const updateCells = [...shipsState].reduce<ICell[]>(
      (acc, { positions }) => {
        return [...acc, ...positions];
      },
      []
    );
    const cells = [...gridState.cells].map(({ position, ...c }) => {
      const uC = () =>
        [...updateCells].filter(
          ({ position: { x, y } }) => x === position.x && y === position.y
        )[0];
      const type = uC() ? uC().type : CellType.Empty;
      return { ...c, position, type };
    });
    const players = [...playersState].map(({ type, ...p }) =>
      type === PlayerType.Human
        ? { ...p, grid: { cells }, type }
        : { ...p, type }
    );

    return {
      type: PlayerActions.UpdateGridCells,
      players
    };
  }

  return {
    createPlayer,
    startGame,
    selectShip,
    rotateShip,
    moveShip,
    placeShip,
    updatePlayerGrid
  };
}
