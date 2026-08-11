import React from "react";

export interface AppConditionalProps {
  if: boolean;
  _then: React.ReactNode;
  _else?: React.ReactNode;
}

export function AppConditional({ if: condition, _then, _else = null }: AppConditionalProps) {
  return <>{condition ? _then : _else}</>;
}
