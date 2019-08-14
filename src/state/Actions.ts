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
  IShip,
  ShipDirection,
  IFleet,
  IPlayer,
  IGame,
  IPosition
} from "./Models";
import DEFAULT_SHIPS from "../components/Ship/DefaultShips";
import getHumanPlayer from "../lib/getHumanPlayer";
import { takeTurn } from "../components/AI";
import {
  isLegal,
  placeShip,
  randomPlacements
} from "../components/Ship/ShipActions";

export function useActions<T extends IState>(
  state: T,
  dispatch: Dispatch<any>
): IActions {
  function createGrid(size: number): ICell[] {
    const grid: ICell[] = Array.from(Array(size).keys()).reduce<ICell[]>(
      (acc, x) => {
        const row = Array.from(Array(size).keys()).map(y => ({
          position: { x, y },
          type: CellType.Empty
        }));
        return [...acc, ...row];
      },
      []
    );

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

  function finishPlacing(): TAction {
    return {
      type: GameActions.EndPlacing
    };
  }

  function placeAutomatically(player: PlayerType): TAction {
    const players = withGridUpdate(randomPlacements(state, player));

    return {
      type: PlayerActions.PlaceAutomatically,
      players
    };
  }

  function endTurn(): TAction {
    const {
      game: { playerTurn: P }
    } = state;
    const playerTurn =
      P === PlayerType.Human ? PlayerType.Computer : PlayerType.Human;
    const game = { ...state.game, playerTurn };

    return {
      type: GameActions.EndTurn,
      game
    };
  }

  // TODO Check if valid shot
  function shoot(targetPlayer: PlayerType, position: IPosition): TAction {
    const { players: playerState } = state;
    const { grid: G } = [...playerState].filter(
      ({ type }) => type === targetPlayer
    )[0];
    const grid = [...G].map(({ ...rest }) => {
      if (position.x === rest.position.x && position.y === rest.position.y) {
        console.log(rest.type);
        return {
          ...rest,
          type: rest.type === CellType.Ship ? CellType.Hit : CellType.Miss
        };
      } else return { ...rest };
    });
    const p = [...playerState].map(p =>
      p.type === targetPlayer ? { ...p, grid } : { ...p }
    );

    console.log(targetPlayer === PlayerType.Computer);
    // TODO Shooting the computer doesn't work!
    const aiTurn = takeTurn(p);
    const players = withGridUpdate(aiTurn);

    return {
      type: PlayerActions.Shoot,
      players
    };
  }

  function selectShip(ship: string): TAction {
    const { players: playersState } = state;
    const { fleet: fleetState } = [...playersState].filter(
      ({ type }) => type === PlayerType.Human
    )[0];
    const { ships: shipsState } = fleetState;
    const selectedShip = [...shipsState].filter(({ name }) => name === ship)[0];
    const ships = [...shipsState].map(({ name, ...rest }) => ({
      ...rest,
      name,
      placed: name === ship ? false : rest.placed,
      positions: name === ship ? [] : rest.positions
    }));
    const fleet = { ...fleetState, selectedShip, ships };
    const players = withGridUpdate(
      [...playersState].map(({ type, ...p }) =>
        type === PlayerType.Human ? { ...p, fleet, type } : { ...p, type }
      )
    );

    return {
      type: PlayerActions.SelectShip,
      players
    };
  }

  function rotateShip(): TAction {
    const { players: playersState } = state;
    const {
      fleet: { selectedShip, ships: shipsState }
    } = [...playersState].filter(({ type }) => type === PlayerType.Human)[0];
    const ships = [...shipsState].map(({ name, direction, ...s }) =>
      selectedShip && name === selectedShip.name
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
    const fleet = { selectedShip, ships };
    const players = withGridUpdate(
      [...playersState].map(({ type, ...p }) =>
        type === PlayerType.Human ? { ...p, fleet, type } : { ...p, type }
      )
    );

    return {
      type: ShipActions.Rotate,
      players
    };
  }

  function moveShip(shipName: string, position: IPosition): TAction {
    const {
      players: playersState,
      game: { gridSize }
    } = state;
    const { fleet: fleetState, grid } = [...playersState].filter(
      ({ type }) => type === PlayerType.Human
    )[0];
    const { ships: shipsState } = fleetState;
    let ship = [...shipsState].filter(it => it.name === shipName)[0];
    const obj = {
      ship,
      grid,
      position,
      gridSize,
      player: PlayerType.Human,
      direction: ship.direction
    };

    if (isLegal(obj)) {
      ship = placeShip(obj, true);
    }

    const ships = [...shipsState].map(it => (it.name === shipName ? ship : it));
    const players = withGridUpdate(
      [...playersState].map(it =>
        it.type === PlayerType.Human
          ? { ...it, fleet: { ...it.fleet, ships } }
          : it
      )
    );

    return {
      type: ShipActions.UpdateCoords,
      players
    };
  }

  function manualPlaceShip(shipName: string, position: IPosition): TAction {
    const {
      players: playersState,
      game: { gridSize }
    } = state;
    const { fleet: fleetState, grid } = getHumanPlayer(playersState);
    const { ships: shipsState } = fleetState;
    let ship = [...shipsState].filter(it => it.name === shipName)[0];
    const obj = {
      ship,
      grid,
      position,
      gridSize,
      player: PlayerType.Human,
      direction: ship.direction
    };
    const legalPlacement = isLegal(obj);

    ship = legalPlacement
      ? placeShip(obj)
      : { ...ship, placed: false, positions: [] };

    const ships = [...shipsState].map(it => (it.name === shipName ? ship : it));
    const players = withGridUpdate(
      [...playersState].map(it =>
        it.type === PlayerType.Human
          ? {
              ...it,
              fleet: {
                selectedShip: legalPlacement ? null : it.fleet.selectedShip,
                ships
              }
            }
          : it
      )
    );

    return {
      type: ShipActions.UpdateCoords,
      players
    };
  }

  function removeSelectedShip(): TAction {
    const { players: playersState } = state;
    const {
      fleet: { selectedShip, ships: shipsState }
    } = [...playersState].filter(({ type }) => type === PlayerType.Human)[0];
    const ships = [...shipsState].map(({ name, ...s }) =>
      selectedShip && name === selectedShip.name
        ? {
            ...s,
            name,
            positions: []
          }
        : { ...s, name }
    );
    const fleet = { selectedShip, ships };
    const players = withGridUpdate(
      [...playersState].map(({ type, ...p }) =>
        type === PlayerType.Human ? { ...p, fleet, type } : { ...p, type }
      )
    );

    return {
      type: ShipActions.UpdateCoords,
      players
    };
  }

  function withGridUpdate(P: IPlayer[]): IPlayer[] {
    const players = [...P].map(({ fleet, grid: G, ...rest }) => {
      const { ships } = fleet;
      const fleetShips = [...ships].map(it => {
        const sunk = [...it.positions].every(p => p.type === CellType.Hit);
        return {
          ...it,
          sunk,
          positions: [...it.positions].map(p => ({
            ...p,
            type: sunk ? CellType.Sunk : p.type
          }))
        };
      });
      const shipCoords = [...fleetShips].reduce<ICell[]>(
        (acc, { positions }) => [...acc, ...positions],
        []
      );
      const grid = [...G].reduce<ICell[]>((acc, { position: P, ...rest }) => {
        return [
          ...acc,
          {
            ...rest,
            position: {
              x: P.x,
              y: P.y
            },
            type: [...shipCoords]
              .map(({ position: { x, y } }) => `${x}-${y}`)
              .includes(`${P.x}-${P.y}`)
              ? [...shipCoords].filter(
                  ({ position: { x, y } }) => `${x}-${y}` === `${P.x}-${P.y}`
                )[0].type
              : rest.type === CellType.Miss ||
                rest.type === CellType.Hit ||
                rest.type === CellType.Sunk
              ? rest.type
              : CellType.Empty
          }
        ];
      }, []);
      return {
        ...rest,
        fleet: {
          ...fleet,
          ships: fleetShips
        },
        grid
      };
    });

    return players;
  }

  return {
    createPlayer,
    startGame,
    selectShip,
    rotateShip,
    moveShip,
    manualPlaceShip,
    removeSelectedShip,
    finishPlacing,
    shoot,
    endTurn,
    placeAutomatically
  };
}
