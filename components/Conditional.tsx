import React, { useEffect, useReducer } from "react";

export interface ConditionalProps {
  if: boolean;
  then: () => React.JSX.Element;
}

export function Conditional(props: ConditionalProps) {
  const [, forceUpdate] = useReducer((_) => _ + 1, 0);
  const Then = props.then;

  useEffect(forceUpdate, [forceUpdate, props.if, props.then]);

  if (!props.if) return <></>;

  return (
    <>
      <Then />
    </>
  );
}
