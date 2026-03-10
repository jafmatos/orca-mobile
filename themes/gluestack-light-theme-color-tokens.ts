import { appLightThemeColors } from "./app-light-theme-colors";

export const gluestackLightThemeColorTokens = Object.entries(appLightThemeColors).reduce(
  (tokens, [key, value]) => {
    const keyToCamelCase = key.replace("--color-", "").replace(/-./g, (match) => match[1].toUpperCase());

    tokens[keyToCamelCase] = value;

    return tokens;
  },
  {} as Record<string, string>,
);
