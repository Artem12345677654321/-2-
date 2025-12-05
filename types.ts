export interface MousePosition {
  x: number;
  y: number;
}

export interface WebGlBackgroundProps {
  mousePosition: MousePosition;
}

export interface AnimatedHeadingProps {
  text: string;
  className?: string;
  delay?: number;
}
