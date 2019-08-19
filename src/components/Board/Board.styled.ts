import styled from "styled-components";

const BoardContainer = styled.section`
  .board {
    display: grid;
    grid-template-areas:
      "header"
      "board"
      "fleet"
      "stats";
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    grid-row-gap: 24px;
    min-width: 100vw;
    min-height: 100vh;
    position: relative;
    padding: 24px;
    color: ${({ theme: { colors } }) => colors.text};
    font-size: 2vh;

    &__title {
      text-align: center;
      grid-area: header;
      grid-column-start: 1;
      grid-column-end: span 2;
    }

    &__fleet {
      grid-area: fleet;
    }

    &__grid {
      grid-area: board;
    }

    &__player-grid {
      grid-area: player-grid;
    }

    &__opponent-grid {
      grid-area: opponent-grid;
    }

    &__grid,
    &__player-grid,
    &__opponent-grid {
      place-self: stretch stretch;
      justify-content: center;
    }

    &__stats {
      grid-area: stats;
    }

    &--battle {
      grid-template-areas:
        "header"
        "player-grid"
        "opponent-grid"
        "stats";
      grid-template-rows: auto 120px 1fr auto;

      @media (${({ theme: { breakpoints } }) => breakpoints.large}) {
        grid-template-areas:
          "header header"
          "player-grid opponent-grid"
          "stats";
        grid-column-gap: 24px;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto 1fr auto;

        .board {
          &__fleet {
            justify-content: end;
          }
          &__player-grid {
            grid-row-start: 2;
            grid-row-end: span 2;
            grid-column-start: 1;
            grid-column-end: span 1;
          }

          &__opponent-grid {
            grid-row-start: 2;
            grid-row-end: span 2;
            grid-column-start: 2;
            grid-column-end: span 2;
          }
        }
      }
    }

    &--placing {
      grid-template-areas:
        "header"
        "board"
        "fleet"
        "stats";

      @media (${({ theme: { breakpoints } }) => breakpoints.small}) {
        grid-template-areas:
          "header header"
          "board board"
          "fleet stats";
      }

      @media (${({ theme: { breakpoints } }) => breakpoints.large}) {
        grid-template-areas:
          "header header"
          "fleet board"
          "stats";
        grid-column-gap: 24px;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto 1fr auto;

        .board {
          &__grid {
            grid-row-start: 2;
            grid-row-end: span 2;
            grid-column-start: 2;
          }

          &__fleet {
            grid-row-start: 2;
            grid-row-end: span 2;
          }
        }
      }
    }
  }
`;

export default BoardContainer;
