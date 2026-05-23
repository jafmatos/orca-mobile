import { CallbackQueue, CallbackQueueItem } from "./CallbackQueue";

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });
}

export type BackHandlerQueueCallback = () => boolean;

export class BackHandlerQueue implements CallbackQueue<BackHandlerQueueCallback> {
  private stack: CallbackQueueItem<BackHandlerQueueCallback>[] = [];

  add(callback: BackHandlerQueueCallback): string {
    const id = generateUUID();

    this.stack.push({
      id,
      callback,
    });

    return id;
  }

  callNext(): boolean {
    const stackItem = this.stack.pop();

    return !!stackItem?.callback();
  }

  remove(id: CallbackQueueItem<BackHandlerQueueCallback>["id"]): void {
    this.stack = this.stack.filter((stackItem) => stackItem.id !== id);
  }
}

export const backHandlerQueue = new BackHandlerQueue();
