import React, { FC, HTMLProps } from "react";
import styled from "styled-components";
import { lighten } from "polished";

const Button: FC<HTMLProps<HTMLButtonElement>> = ({
  children,
  onClick,
  disabled,
  style
}) => (
  <StyledButton style={style} disabled={disabled} onClick={onClick}>
    {children}
  </StyledButton>
);

const StyledButton = styled.button`
  background: ${({ theme }) => theme.colors.accent}
  padding: 8px 24px;
  min-height: 48px;
  font-size: 18px;
  font-weight: 500;
  font-family: inherit;
  appearance: none;
  border: none;
  border-radius: 8px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.2);
  color: inherit;
  transition: background 200ms ease;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => lighten(0.1, theme.colors.accent)}
  }

  &:active, &:focus {
    outline: 0;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1),
      0 2px 16px 4px ${({ theme }) => lighten(0.1, theme.colors.accent)};
  }

  &[disabled] {
    opacity: 0.2;
  }

`;

export default Button;
