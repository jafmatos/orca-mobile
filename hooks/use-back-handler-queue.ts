import { backHandlerQueue } from "@/utils/BackHandlerQueue";
import { useEffect } from "react";
import { BackHandler } from "react-native";

export interface UseBackHandlerQueueOptions {
  isOpen: boolean;
  close: () => void;
}

export const useBackHandlerQueue = (options: UseBackHandlerQueueOptions) => {
  useEffect(() => {
    if (!options.isOpen) return;

    const queueItem = backHandlerQueue.add(() => {
      options?.close();

      return true;
    });

    const listener = BackHandler.addEventListener("hardwareBackPress", () => backHandlerQueue.callNext());

    return () => {
      backHandlerQueue.remove(queueItem);
      listener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.isOpen, options.close]);
};
