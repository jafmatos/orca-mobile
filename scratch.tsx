import React from "react";
import { TextInput, MD3DarkTheme } from "react-native-paper";

export const test = () => (
  <TextInput 
    mode="outlined"
    editable={false}
    outlineColor={MD3DarkTheme.colors.outlineVariant}
    textColor={MD3DarkTheme.colors.onSurfaceDisabled}
    style={{ backgroundColor: MD3DarkTheme.colors.surfaceDisabled }}
  />
);
