export interface CallbackQueueItem<Function> {
  id: string;
  callback: Function;
}

export interface CallbackQueue<Function extends () => void> {
  add(callback: Function): CallbackQueueItem<Function>["id"];
  callNext(): ReturnType<Function>;
  remove(identifier: CallbackQueueItem<Function>["id"]): void;
}
