import { IPlayer } from "../../state/Models";

export function checkWinner(players: IPlayer[]) {
  console.log(players);
  const winner = [...players]
    .map(
      ({ fleet, type }) =>
        fleet.ships.every(ship => ship.sunk) && {
          type,
          winner: fleet.ships.every(ship => ship.sunk)
        }
    )
    .filter(Boolean);
  console.log(winner);
}
