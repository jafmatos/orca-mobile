import { PropsWithChildren } from "react";
import { KeyboardAvoidingComponent } from "../KeyboardAvoindingComponent";
import { ThemedComponent } from "../ThemedComponent";

export function GlobalLayout(props: PropsWithChildren) {
  return (
    <ThemedComponent>
      <KeyboardAvoidingComponent>{props.children}</KeyboardAvoidingComponent>
    </ThemedComponent>
  );
}
