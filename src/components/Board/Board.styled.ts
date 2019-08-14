import styled from "styled-components";

const BoardContainer = styled.section`
  width: 100%;
  position: relative;
  padding: 8vw;
  color: ${({ theme: { colors } }) => colors.text};

  h1 {
    font-size: 10vw;
    text-align: center;
    padding: ${({ theme: { spacing } }) => spacing(3)};
  }
`;

export default BoardContainer;
