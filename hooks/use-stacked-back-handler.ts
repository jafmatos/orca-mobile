import { backHandlerStack } from "@/utils/BackHandlerStack";
import { PropsWithChildren, useEffect } from "react";
import { BackHandler } from "react-native";

export interface UseStackedBackHandlerOptions extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
}

export function useStackedBackHandler(options: UseStackedBackHandlerOptions) {
  useEffect(() => {
    if (!options.isOpen) return;

    const handler = backHandlerStack.add(() => {
      options.onClose();

      return true;
    });

    const listener = BackHandler.addEventListener("hardwareBackPress", () => backHandlerStack.callNext());

    return () => {
      backHandlerStack.remove(handler);
      listener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.isOpen, options.onClose]);
}
