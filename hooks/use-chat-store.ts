import { ChatMessage } from "@/models/ChatMessage";
import zustand from "zustand";

type ChatStore = {
  threadId: string | undefined;
  messages: ChatMessage[];
  setThreadId: (threadId: string | undefined) => void;
  setMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  resetChat: () => void;
};

export const useChatStore = zustand.create<ChatStore>((set, get) => ({
  threadId: undefined,
  messages: [],
  setThreadId: (threadId) => set({ threadId }),
  setMessages: (messagesOrFn) => {
    const nextMessages = typeof messagesOrFn === "function" ? messagesOrFn(get().messages) : messagesOrFn;
    set({ messages: nextMessages });
  },
  resetChat: () => set({ threadId: undefined, messages: [] }),
}));
