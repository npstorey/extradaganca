import React from "react";
import styled from "styled-components";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent";
  size?: "small" | "medium" | "large";
  className?: string;
}

const StyledButton = styled.button<{
  $variant?: "primary" | "secondary" | "accent";
  $size?: "small" | "medium" | "large";
}>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: ${(props) =>
    props.$size === "small"
      ? "0.5rem 1rem"
      : props.$size === "large"
      ? "1rem 2rem"
      : "0.75rem 1.5rem"};
  font-size: ${(props) =>
    props.$size === "small"
      ? "0.875rem"
      : props.$size === "large"
      ? "1.25rem"
      : "1rem"};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  background-color: ${(props) =>
    props.$variant === "secondary"
      ? props.theme.secondaryColor
      : props.$variant === "accent"
      ? props.theme.accentColor
      : props.theme.primaryColor};
  color: #ffffff;
  border: 2px solid transparent;
  border-radius: ${(props) => props.theme.borderRadius || "4px"};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  font-family: ${(props) => props.theme.fontFamily || "'Press Start 2P', cursive"};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  className,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      className={className}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button; 