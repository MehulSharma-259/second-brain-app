/** @format */

import type {ReactElement} from "react";

export interface ButtonProps {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick?: () => void;
}

const variantClasses = {
  primary: "bg-button-primary text-button-primary-t",
  secondary: "bg-button-secondary text-button-secondary-t",
};

const sizeClasses = {
  lg: "w-40 py-3 text-lg",
  md: "w-30 py-2 text-md",
  sm: "w-20 py-1 text-sm",
};

export function Button(props: ButtonProps) {
  return (
    <>
      <button
        onClick={props.onClick}
        className={`rounded-lg cursor-pointer flex gap-2 items-center justify-center ${
          variantClasses[props.variant]
        } ${sizeClasses[props.size]}`}
      >
        {props.startIcon}
        {props.text}
        {props.endIcon}
      </button>
    </>
  );
}
