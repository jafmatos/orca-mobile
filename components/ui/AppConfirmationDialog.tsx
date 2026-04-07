import React, { useState } from "react";
import { AppDialog } from "./AppDialog";
import { AppButton } from "./AppButton";

type TriggerProps = {
  open?: () => void;
};

export interface AppConfirmationDialogProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  cancelButtonProps?: React.ComponentProps<typeof AppButton>;
  confirmButtonProps?: React.ComponentProps<typeof AppButton>;
  trigger: (props: TriggerProps) => React.JSX.Element;
}

export function AppConfirmationDialog({ confirmText = "Confirmar", cancelText = "Cancelar", ...props }: AppConfirmationDialogProps) {
  const Trigger = props.trigger;
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);

  const close = () => setIsOpen(false);

  return (
    <>
      <Trigger open={open} />
      <AppDialog isOpen={isOpen} onClose={close}>
        <AppDialog.Title>{props.title}</AppDialog.Title>
        <AppDialog.Content>{props.description}</AppDialog.Content>
        <AppDialog.Actions>
          <AppButton
            {...props.cancelButtonProps}
            text={cancelText}
            size="sm"
            color="neutral"
            variant="outline"
            onPress={() => {
              close();
              props.onCancel?.();
            }}
          />
          <AppButton {...props.confirmButtonProps} text={confirmText} size="sm" color="danger" onPress={props.onConfirm} />
        </AppDialog.Actions>
      </AppDialog>
    </>
  );
}
