import React, { useEffect, useReducer } from "react";

export interface ConditionalProps {
  if: boolean;
  _then: () => React.JSX.Element;
  _else?: () => React.JSX.Element;
}

export function Conditional({ _then = () => <></>, _else = () => <></>, ...props }: ConditionalProps) {
  const [, forceUpdate] = useReducer((_) => _ + 1, 0);
  const Then = _then;
  const Else = _else;

  useEffect(forceUpdate, [forceUpdate, props.if]);

  if (props.if) {
    return (
      <>
        <Then />
      </>
    );
  }

  return (
    <>
      <Else />
    </>
  );
}
