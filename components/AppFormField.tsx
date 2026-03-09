import { InterfaceFormControlProps } from "@gluestack-ui/core/lib/esm/form-control/creator/types";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
} from "@gluestack-ui/themed";
import { PropsWithChildren } from "react";
import { TextInputProps } from "react-native";

function AppFormFieldLabel({ label, ...props }: { label: string; className?: string }) {
  return (
    <FormControlLabel>
      <FormControlLabelText {...props}>{label}</FormControlLabelText>
    </FormControlLabel>
  );
}

function AppFormFieldError(props: { error?: string }) {
  return (
    <FormControlError>
      <FormControlErrorText>{props.error}</FormControlErrorText>
    </FormControlError>
  );
}

function AppFormFieldTextInput({
  disabled,
  required,
  isInvalid,
  fullWidth,
  ...props
}: TextInputProps & { disabled?: boolean; required?: boolean; isInvalid?: boolean; fullWidth?: boolean }) {
  return (
    <Input isDisabled={disabled} isInvalid={isInvalid} isRequired={required} isFullWidth={fullWidth}>
      <InputField {...props} />
    </Input>
  );
}

export function AppFormField({ children, ...props }: InterfaceFormControlProps & PropsWithChildren) {
  return <FormControl {...props}>{children}</FormControl>;
}

AppFormField.Label = AppFormFieldLabel;
AppFormField.Error = AppFormFieldError;
AppFormField.TextInput = AppFormFieldTextInput;
