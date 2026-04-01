import { PropsWithChildren } from "react";
import { ThemedComponent } from "../ThemedComponent";
import { AppToast } from "../AppToast";

export function TabbedLayout(props: PropsWithChildren) {
  return (
    <>
      <ThemedComponent.Background />

      {props.children}

      <AppToast topOffset={8} />
    </>
  );
}
