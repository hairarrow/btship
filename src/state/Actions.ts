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
import analytics from "../analytics";

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
      type,
      shots: []
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

    analytics.event({
      category: "Player",
      action: "Started Game"
    });

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

    analytics.event({
      category: "Player",
      action: "Place Automatically"
    });

    return {
      type: PlayerActions.PlaceAutomatically,
      players
    };
  }

  function shoot(targetPlayer: PlayerType, position: IPosition): TAction {
    const { players: playerState } = state;
    const {
      fleet: { ships: shipsState },
      shots: shotsState
    } = [...playerState].filter(({ type }) => type === targetPlayer)[0];
    const ships = [...shipsState].map(ship => {
      ship.positions = [...ship.positions].map(p =>
        p.position.x === position.x && p.position.y === position.y
          ? { ...p, type: CellType.Hit }
          : p
      );
      ship.sunk = ship.positions.every(pos => pos.type === CellType.Hit);
      return ship;
    });
    const shots = [...shotsState, position];
    const p = [...playerState].map(p =>
      p.type === targetPlayer
        ? { ...p, fleet: { ...p.fleet, ships }, shots }
        : { ...p }
    );

    analytics.event({
      category: "Player",
      action: "Player Shot"
    });

    const aiTurn = takeTurn(p, state.game.gridSize);
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

    analytics.event({
      category: "Player",
      action: "Rotate Ship"
    });

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

    analytics.event({
      category: "Player",
      action: "Manually Placed Ship"
    });

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
    const players = [...P].map(({ fleet, grid: G, shots, ...rest }) => {
      const { ships } = fleet;
      const fleetShips = [...ships].map(it => {
        const sunk = [...it.positions].every(p =>
          [CellType.Hit, CellType.Sunk].includes(p.type)
        );
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
              : [...shots].map(it => it.x === P.x && it.y === P.y).some(Boolean)
              ? CellType.Miss
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
        grid,
        shots
      };
    });

    return players;
  }

  function gameOver(winner: PlayerType): TAction {
    const game = {
      ...state.game,
      over: true,
      inBattle: false,
      winner
    };
    const type =
      winner === PlayerType.Human ? GameActions.Won : GameActions.Lost;
    const stats = {
      ...state.stats,
      games: {
        ...state.stats.games,
        played: state.stats.games.played++,
        won:
          winner === PlayerType.Human
            ? state.stats.games.won++
            : state.stats.games.won
      }
    };

    analytics.event({
      category: "Game Over",
      action: `${winner === PlayerType.Human ? "Human" : "AI"} Wins`
    });

    return {
      type,
      game,
      stats
    };
  }

  function resetGame(): TAction {
    return {
      type: GameActions.Reset
    };
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
    placeAutomatically,
    gameOver,
    resetGame
  };
}
