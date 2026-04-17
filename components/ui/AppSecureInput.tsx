import { useState } from "react";
import { TextInput } from "react-native-paper";

export type AppSecureInputProps = React.ComponentProps<typeof TextInput>;

export function AppSecureInput(props: AppSecureInputProps) {
  const [isContentVisible, setIsContentVisible] = useState(false);

  return (
    <TextInput
      secureTextEntry={!isContentVisible}
      right={<TextInput.Icon icon={isContentVisible ? "eye" : "eye-off"} onPress={() => setIsContentVisible(!isContentVisible)} />}
      {...props}
    />
  );
}
