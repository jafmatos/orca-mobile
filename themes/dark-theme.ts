import { vars } from "nativewind";

export const darkThemeColors = {
  // Base
  "--background": "hsl(218, 17%, 9%)",
  "--background-shadow": "hsl(218, 17%, 59%)",
  "--paper": "hsl(218, 17%, 12%)",

  // Text
  "--text-primary": "hsl(0, 0%, 100%)",
  "--text-secondary": "hsla(0, 0%, 100%, 0.75)",

  // Surface
  "--surface-100": "hsl(218, 14%, 20%)",
  "--surface-200": "hsl(222, 14%, 17.5%)",
  "--surface-300": "hsl(222, 14%, 15%)",
  "--surface-400": "hsl(222, 14%, 12.5%)",
  "--surface-500": "hsl(222, 14%, 10%)",
  "--surface-600": "hsl(222, 14%, 7.5%)",

  // Primary
  "--primary": "hsl(32, 94%, 49%)",
  "--primary-dark": "hsl(32, 94%, 39%)",
  "--primary-light": "hsl(32, 94%, 59%)",
  "--on-primary": "hsl(0, 0%, 100%)",

  // Secondary
  "--secondary": "hsl(201, 81%, 33%)",
  "--secondary-dark": "hsl(201, 81%, 23%)",
  "--secondary-light": "hsl(201, 81%, 43%)",
  "--on-secondary": "hsl(0, 0%, 100%)",

  // Tertiary
  "--tertiary": "hsl(283, 79%, 47%)",
  "--tertiary-dark": "hsl(283, 79%, 37%)",
  "--tertiary-light": "hsl(283, 79%, 57%)",
  "--on-tertiary": "hsl(0, 0%, 100%)",

  // Danger
  "--danger": "hsl(2, 63%, 57%)",
  "--danger-dark": "hsl(2, 63%, 47%)",
  "--danger-light": "hsl(2, 63%, 67%)",
  "--on-danger": "hsl(0, 0%, 100%)",

  // Warning
  "--warning": "hsl(34, 86%, 57%)",
  "--warning-dark": "hsl(34, 86%, 47%)",
  "--warning-light": "hsl(34, 86%, 67%)",
  "--on-warning": "hsl(0, 0%, 0%)", // Black text on warning in dark mode

  // Success
  "--success": "hsl(119, 23%, 51%)",
  "--success-dark": "hsl(119, 23%, 41%)",
  "--success-light": "hsl(119, 23%, 61%)",
  "--on-success": "hsl(0, 0%, 100%)",

  // Grey
  "--grey": "hsl(208, 12%, 38%)",
  "--grey-50": "hsl(208, 12%, 70%)",
  "--grey-100": "hsl(208, 12%, 63%)",
  "--grey-200": "hsl(208, 12%, 56%)",
  "--grey-300": "hsl(208, 12%, 49%)",
  "--grey-400": "hsl(208, 12%, 43%)",
  "--grey-500": "hsl(208, 12%, 48%)",
  "--grey-600": "hsl(208, 12%, 33%)",
  "--grey-700": "hsl(208, 12%, 28%)",
  "--grey-800": "hsl(208, 12%, 23%)",
  "--grey-900": "hsl(208, 12%, 18%)",
  "--grey-o-15": "hsla(208, 12%, 63%, 0.15)",
  "--on-grey": "hsl(0, 0%, 100%)",

  // Charts
  "--chart-blue": "#4498d2",
  "--chart-green": "#679f66",
  "--chart-orange": "#ef9d32",
  "--chart-red": "#d7534e",
  "--chart-purple": "#a45fb3",
};

export const darkTheme = vars(darkThemeColors);
