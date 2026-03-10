import { appDarkThemeColors } from "./app-dark-theme-colors";

export const gluestackDarkThemeColorTokens = Object.entries(appDarkThemeColors).reduce(
  (tokens, [key, value]) => {
    const keyToCamelCase = key.replace("--color-", "").replace(/-./g, (match) => match[1].toUpperCase());

    tokens[keyToCamelCase] = value;

    return tokens;
  },
  {} as Record<string, string>,
);
