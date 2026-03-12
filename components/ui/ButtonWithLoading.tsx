import { Button, Spinner } from "@gluestack-ui/themed";
import { ComponentProps } from "react";
import { View } from "react-native";

type ButtonProps = ComponentProps<typeof Button>;

export function ButtonWithLoading({ isLoading, spinnerColor, ...props }: ButtonProps & { isLoading?: boolean; spinnerColor?: string }) {
  return (
    <View className="relative">
      <Spinner
        sx={{
          props: {
						display: isLoading ? "flex" : "none",
            position: "absolute",
            color: spinnerColor || "$onPrimary",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          },
        }}
        size={"small"}
      />
      <Button {...props}>{isLoading ? <></> : props.children}</Button>
    </View>
  );
}
