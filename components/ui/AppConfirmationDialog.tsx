import { useState } from "react";
import { AppDialog } from "./AppDialog";
import { Button, ButtonText } from "@gluestack-ui/themed";

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
          <Button
            size="sm"
            bgColor="$background600"
            borderColor="$outline500"
            variant="outline"
            onPress={() => {
              close();
              props.onCancel?.();
            }}
          >
            <ButtonText color="$typography200">{cancelText}</ButtonText>
          </Button>
          <Button size="sm" bgColor="$danger500" onPress={props.onConfirm}>
            <ButtonText color="$onDanger">{confirmText}</ButtonText>
          </Button>
        </AppDialog.Actions>
      </AppDialog>
    </>
  );
}
