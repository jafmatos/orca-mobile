import { Text, TextProps } from "react-native-paper";

export interface AppTextProps extends TextProps<unknown> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
}

export function  AppText(props: AppTextProps) {
  const classMap = new Map<AppTextProps["as"], string>([
    ["h1", "text-3xl font-bold"],
    ["h2", "text-2xl font-bold"],
    ["h3", "text-xl font-semibold"],
    ["h4", "text-lg font-semibold"],
    ["h5", "text-base font-medium"],
    ["h6", "text-sm font-medium"],
    ["p", "text-base font-normal"],
  ]);

  return <Text className={`${props.className} ${classMap.get(props.as || "p")}`}>{props.children}</Text>;
}
