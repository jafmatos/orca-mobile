import React from "react";

export interface ConditionalProps {
  if: boolean;
  _then: React.ReactNode;
  _else?: React.ReactNode;
}

export function Conditional({ if: condition, _then, _else = null }: ConditionalProps) {
  return <>{condition ? _then : _else}</>;
}
