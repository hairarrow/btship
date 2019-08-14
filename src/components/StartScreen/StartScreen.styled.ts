import styled from "styled-components";

export default styled.section`
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.colors.text};

  h1 {
    font-size: 32px;
  }

  h2 {
    font-size: 18px;
    margin: 20px;
  }

  button {
    background: rgba(255, 255, 255, 0.1);
    width: 200px;
    height: 48px;
    font-size: 18px;
    font-weight: 500;
    font-family: inherit;
    appearance: none;
    color: inherit;

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
`;
