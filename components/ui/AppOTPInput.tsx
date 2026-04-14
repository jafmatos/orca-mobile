import { TextInput } from "react-native-paper";

export type AppOTPInputProps = React.ComponentProps<typeof TextInput>;

export function AppOTPInput(props: AppOTPInputProps) {
  return <TextInput keyboardType="number-pad" textContentType="oneTimeCode" {...props} />;
}
