import { useAppTheme } from "@/hooks/useAppTheme";
import React, { useState } from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";

type TriggerProps = {
  open?: () => void;
};

export interface AppConfirmationDialogProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (close: () => void) => void;
  onCancel?: () => void;
  cancelButtonProps?: Partial<React.ComponentProps<typeof Button>>;
  confirmButtonProps?: Partial<React.ComponentProps<typeof Button>>;
  closeOnCancel?: boolean;
  closeOnConfirm?: boolean;
  trigger: (props: TriggerProps) => React.JSX.Element;
}

export function AppConfirmationDialog({ confirmText = "Confirmar", cancelText = "Cancelar", ...props }: AppConfirmationDialogProps) {
  const theme = useAppTheme();
  const Trigger = props.trigger;
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);

  const close = () => setIsOpen(false);

  return (
    <>
      <Trigger open={open} />
      <Portal>
        <Dialog visible={isOpen} onDismiss={close}>
          <Dialog.Title>{props.title}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{props.description}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              {...props.cancelButtonProps}
              textColor={theme.colors.onSurfaceVariant}
              onPress={() => {
                props.onCancel?.();

                props.closeOnCancel && close();
              }}
            >
              {cancelText}
            </Button>
            <Button
              {...props.confirmButtonProps}
              textColor={theme.colors.error}
              onPress={() => {
                props.onConfirm(close);

                props.closeOnConfirm && close();
              }}
            >
              {confirmText}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
