type BackHandlerStackItem = {
  id: string;
  callback: () => boolean;
};

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });
}

let instance: BackHandlerStack;

export class BackHandlerStack {
  private stack: BackHandlerStackItem[] = [];

  constructor() {
    if (!instance) {
      instance = this;
    }

    return instance;
  }

  add(callback: BackHandlerStackItem["callback"]) {
    const uuid = generateUUID();

    this.stack.push({
      id: uuid,
      callback,
    });

    return uuid;
  }

  remove(id: BackHandlerStackItem["id"]) {
    this.stack = this.stack.filter((item) => item.id !== id);
  }

  callNext() {
    const stackItem = this.stack.pop();

    return stackItem?.callback();
  }
}

export const backHandlerStack = new BackHandlerStack();
