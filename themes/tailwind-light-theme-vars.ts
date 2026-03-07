import { vars } from "nativewind";

export const lightThemeColors = {
  // Base
  "--background": "hsl(0, 0%, 90%)",
  "--background-shadow": "hsl(0, 0%, 50%)",
  "--paper": "hsl(0, 0%, 95%)",

  // Text
  "--text-primary": "hsl(218, 18%, 9%)",
  "--text-secondary": "hsla(218, 18%, 9%, 0.7)",

  // Surface
  "--surface-100": "hsl(0, 0%, 100%)",
  "--surface-200": "hsl(0, 0%, 97.5%)",
  "--surface-300": "hsl(0, 0%, 95%)",
  "--surface-400": "hsl(0, 0%, 92.5%)",
  "--surface-500": "hsl(0, 0%, 90%)",
  "--surface-600": "hsl(0, 0%, 87.5%)",

  // Primary
  "--primary": "hsl(32, 94%, 49%)",
  "--primary-dark": "hsl(32, 94%, 39%)",
  "--primary-light": "hsl(32, 94%, 59%)",
  "--on-primary": "hsl(0, 0%, 100%)",

  // Secondary
  "--secondary": "hsl(206, 100%, 41%)",
  "--secondary-dark": "hsl(206, 100%, 31%)",
  "--secondary-light": "hsl(206, 100%, 51%)",
  "--on-secondary": "hsl(0, 0%, 100%)",

  // Tertiary
  "--tertiary": "hsl(283, 79%, 57%)",
  "--tertiary-dark": "hsl(283, 79%, 47%)",
  "--tertiary-light": "hsl(283, 79%, 67%)",
  "--on-tertiary": "hsl(0, 0%, 100%)",

  // Danger/Error
  "--danger": "hsl(0, 69%, 62%)",
  "--danger-dark": "hsl(0, 69%, 52%)",
  "--danger-light": "hsl(0, 69%, 72%)",
  "--on-danger": "hsl(0, 0%, 100%)",

  // Warning
  "--warning": "hsl(36, 100%, 65%)",
  "--warning-dark": "hsl(36, 100%, 55%)",
  "--warning-light": "hsl(36, 100%, 75%)",
  "--on-warning": "hsl(0, 0%, 100%)",

  // Success
  "--success": "hsl(127, 28%, 44%)",
  "--success-dark": "hsl(127, 28%, 34%)",
  "--success-light": "hsl(127, 28%, 54%)",
  "--on-success": "hsl(0, 0%, 100%)",

  // Grey
  "--grey": "hsl(208, 12%, 63%)",
  "--grey-50": "hsl(208, 12%, 98%)",
  "--grey-100": "hsl(208, 12%, 91%)",
  "--grey-200": "hsl(208, 12%, 84%)",
  "--grey-300": "hsl(208, 12%, 77%)",
  "--grey-400": "hsl(208, 12%, 70%)",
  "--grey-500": "hsl(208, 12%, 63%)",
  "--grey-600": "hsl(208, 12%, 56%)",
  "--grey-700": "hsl(208, 12%, 49%)",
  "--grey-800": "hsl(208, 12%, 42%)",
  "--grey-900": "hsl(208, 12%, 35%)",
  "--grey-o-15": "hsla(208, 12%, 63%, 0.15)",
  "--on-grey": "hsl(0, 0%, 100%)",

  // Charts
  "--chart-blue": "#4fc3f7",
  "--chart-green": "#81c784",
  "--chart-orange": "#ffb74d",
  "--chart-red": "#e15959",
  "--chart-purple": "#ba68c8",
};

export const lightThemeVars = vars(lightThemeColors);
