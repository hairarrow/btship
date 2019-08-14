import styled from "styled-components";

const BoardContainer = styled.section`
  width: 100%;
  position: relative;
  padding: ${({ theme: { spacing } }) => spacing(4)};
  color: ${({ theme: { colors } }) => colors.text};

  h1 {
    text-align: center;
    padding: ${({ theme: { spacing } }) => spacing(3)};
  }
`;

export default BoardContainer;
