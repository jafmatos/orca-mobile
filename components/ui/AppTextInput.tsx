import React, { useEffect, useState } from "react";
import { TextInput as PaperTextInput } from "react-native-paper";

export type AppTextInputProps = React.ComponentProps<typeof PaperTextInput>;

export const AppTextInput = React.forwardRef<any, AppTextInputProps>(
  ({ value, onChangeText, onFocus, onBlur, ...props }, ref) => {
    const [_value, _setValue] = useState(value);
    const isFocused = React.useRef(false);

    useEffect(() => {
      if (!isFocused.current || value === "" || value === undefined) {
        _setValue(value);
      }
    }, [value]);

    return (
      <PaperTextInput
        {...props}
        ref={ref}
        value={_value}
        onChangeText={(text) => {
          _setValue(text);
          if (onChangeText) {
            onChangeText(text);
          }
        }}
        onFocus={(e) => {
          isFocused.current = true;
          if (onFocus) onFocus(e);
        }}
        onBlur={(e) => {
          isFocused.current = false;
          if (onBlur) onBlur(e);
        }}
      />
    );
  }
);
