import { AppButton } from "./AppButton";

export function AppFab(props: React.ComponentProps<typeof AppButton>) {
  return <AppButton {...props} roundness="full" />;
}
