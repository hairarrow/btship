import styled from "styled-components";

export default styled.section`
  @import url("https://fonts.googleapis.com/css?family=Anton&display=swap");
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.colors.text};
  font-size: 3vh;

  h1 {
    font-size: 1em;
    font-family: "Anton", sans-serif;
    opacity: 0.9;
    letter-spacing: 2px;
  }

  h2 {
    font-size: 0.5em;
    margin: 1em 0;
    opacity: 0.8;
  }

  button {
    padding: 0.6em 2em;
    font-size: 0.5em;
  }

  @media (${props => props.theme.breakpoints.medium}) {
    font-size: 5vh;
  }

  @media (${props => props.theme.breakpoints.large}) {
    font-size: 8vh;
  }
`;
