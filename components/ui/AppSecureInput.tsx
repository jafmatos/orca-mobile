import { useState } from "react";
import { TextInput as PaperTextInput } from "react-native-paper";
import { AppTextInput } from "./AppTextInput";

export type AppSecureInputProps = React.ComponentProps<typeof AppTextInput>;

export function AppSecureInput(props: AppSecureInputProps) {
  const [isContentVisible, setIsContentVisible] = useState(false);

  return (
    <AppTextInput
      secureTextEntry={!isContentVisible}
      right={<PaperTextInput.Icon icon={isContentVisible ? "eye" : "eye-off"} onPress={() => setIsContentVisible(!isContentVisible)} />}
      {...props}
    />
  );
}
