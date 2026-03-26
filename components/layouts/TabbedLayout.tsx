import { PropsWithChildren } from "react";
import { ThemedComponent } from "../ThemedComponent";

export function TabbedLayout(props: PropsWithChildren) {
  return (
    <>
      <ThemedComponent.Background />
      {props.children}
    </>
  );
}
