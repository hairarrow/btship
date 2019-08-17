import styled from "styled-components";

const BoardContainer = styled.section`
  display: grid;
  width: 100%;
  position: relative;
  padding: 8vw;
  color: ${({ theme: { colors } }) => colors.text};

   {
    font-size: 10vw;
    text-align: center;
    padding: ${({ theme: { spacing } }) => spacing(3)};
  }
`;

export default BoardContainer;
