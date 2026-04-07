import { LucideIcon } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { Conditional } from "../Conditional";
import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { AppText } from "./AppText";

export interface AppButtonProps extends React.ComponentProps<typeof Pressable> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "tertiary" | "success" | "warning" | "danger" | "neutral";
  variant?: "outline" | "filled" | "text";
  roundness?: "full" | "default";
  icon?: LucideIcon;
  text?: string;
  loading?: boolean;
}

export function AppButton({
  size = "md",
  color = "primary",
  variant = "filled",
  roundness = "default",
  icon,
  text,
  loading,
  ...pressableProps
}: AppButtonProps) {
  const themeColors = useAppThemeColors();
  const colorSet = new Map<AppButtonProps["color"], { base: string; border: string; text: string }>([
    [
      "primary",
      { base: themeColors["--color-primary-500"], border: themeColors["--color-primary-500"], text: themeColors["--color-on-primary"] },
    ],
    [
      "secondary",
      {
        base: themeColors["--color-secondary-500"],
        border: themeColors["--color-secondary-500"],
        text: themeColors["--color-on-secondary"],
      },
    ],
    [
      "tertiary",
      { base: themeColors["--color-tertiary-500"], border: themeColors["--color-tertiary-500"], text: themeColors["--color-on-tertiary"] },
    ],
    [
      "success",
      { base: themeColors["--color-success-500"], border: themeColors["--color-success-500"], text: themeColors["--color-on-success"] },
    ],
    [
      "warning",
      { base: themeColors["--color-warning-500"], border: themeColors["--color-warning-500"], text: themeColors["--color-on-warning"] },
    ],
    [
      "danger",
      { base: themeColors["--color-danger-500"], border: themeColors["--color-danger-500"], text: themeColors["--color-on-danger"] },
    ],
    [
      "neutral",
      {
        base: variant === "filled" ? themeColors["--color-background-100"] : themeColors["--color-typography-200"],
        border: themeColors["--color-outline-700"],
        text: themeColors["--color-typography-200"],
      },
    ],
  ]).get(color)!;
  const sizeSet = new Map<AppButtonProps["size"], { height: number; borderRadius: number; font: number; icon: number; paddingX: number }>([
    [
      "xs",
      {
        height: 32,
        paddingX: 12,
        font: 12,
        icon: 14,
        borderRadius: 4,
      },
    ],
    [
      "sm",
      {
        height: 36,
        paddingX: 14,
        font: 14,
        icon: 16,
        borderRadius: 4,
      },
    ],
    [
      "md",
      {
        height: 40,
        paddingX: 16,
        font: 16,
        icon: 18,
        borderRadius: 4,
      },
    ],
    [
      "lg",
      {
        height: 44,
        paddingX: 18,
        font: 18,
        icon: 21,
        borderRadius: 4,
      },
    ],
    [
      "xl",
      {
        height: 48,
        paddingX: 20,
        font: 20,
        icon: 24,
        borderRadius: 4,
      },
    ],
  ]).get(size)!;

  return (
    <Pressable
      {...pressableProps}
      style={{
        position: "relative",
        height: sizeSet.height,
        backgroundColor: variant === "filled" ? colorSet!.base : "transparent",
        borderWidth: variant === "outline" ? 1 : 0,
        borderColor: colorSet!.border,
        borderRadius: roundness === "full" ? sizeSet.height / 2 : sizeSet.borderRadius,
        paddingLeft: sizeSet.paddingX,
        paddingRight: sizeSet.paddingX,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <Conditional
        if={!!pressableProps.disabled}
        then={() => {
          return <View style={{ backgroundColor: "black", opacity: 0.2, position: "absolute", inset: 0 }}></View>;
        }}
      />
      <Conditional
        if={!!icon && !loading}
        then={() => {
          const Icon = icon!;

          return <Icon color={variant === "filled" ? colorSet!.text : colorSet!.base} size={sizeSet.icon} />;
        }}
      />
      <Conditional
        if={!!text || !!loading}
        then={() => {
          return (
            <AppText
              style={{
                color: variant === "filled" ? colorSet!.text : colorSet!.base,
                fontWeight: 500,
                fontSize: sizeSet.font,
              }}
            >
              {loading ? "Carregando..." : text}
            </AppText>
          );
        }}
      />
    </Pressable>
  );
}
