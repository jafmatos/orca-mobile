import { useAppTheme } from "@/hooks/use-app-theme";
import React, { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import { Conditional } from "../Conditional";

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
  trigger?: (props: TriggerProps) => React.JSX.Element;
}

export interface AppConfirmationDialogRef {
  open: () => void;
  close: () => void;
}

export const AppConfirmationDialog = forwardRef<AppConfirmationDialogRef, AppConfirmationDialogProps>(function AppConfirmationDialog(
  { confirmText = "Confirmar", cancelText = "Cancelar", closeOnCancel = true, ...props },
  ref,
) {
  const theme = useAppTheme();
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useImperativeHandle(ref, () => {
    return {
      open,
      close,
    };
  }, [open, close]);

  return (
    <>
      <Conditional
        if={!!props.trigger}
        then={() => {
          const Trigger = props.trigger!;

          return <Trigger open={open} />;
        }}
      />
      <Portal>
        <Dialog
          visible={isOpen}
          onDismiss={() => {
            console.log("dismiss");

            close();
          }}
        >
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

                closeOnCancel && close();
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
});
