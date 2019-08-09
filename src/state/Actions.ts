import { Dispatch } from "react";
import { TAction, IActions, PlayerActions, GameActions } from "./ActionsModels";
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
  IGame
} from "./Models";
import DEFAULT_SHIPS from "../components/Ship/DefaultShips";

export function useActions<T extends IState>(
  state: T,
  // TODO Fix this dispatch actions. Can't pass one of these actions through to dispatch
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

  return {
    createPlayer,
    startGame,
    selectShip
  };
}
