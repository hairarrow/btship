import styled from "styled-components";

const BoardContainer = styled.section`
  .board {
    display: grid;
    grid-template-areas:
      "header"
      "board"
      "fleet";
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

    &--battle {
      grid-template-areas:
        "header"
        "opponent-grid"
        "player-grid";

      @media (${({ theme: { breakpoints } }) => breakpoints.large}) {
        grid-template-areas:
          "header header"
          "opponent-grid player-grid";
        grid-column-gap: 24px;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto 1fr;
      }
    }

    &--placing {
      @media (${({ theme: { breakpoints } }) => breakpoints.large}) {
        grid-template-areas:
          "header header"
          "fleet board";
        grid-column-gap: 24px;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto 1fr;
      }

      .board {
        &__title {
          grid-column-start: 1;
          grid-column-end: span 2;
        }
      }
    }
  }
`;

export default BoardContainer;
