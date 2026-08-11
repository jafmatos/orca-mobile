import { ChatMessage } from "@/models/ChatMessage";
import { ChatThread } from "@/models/ChatThread";
import { $axios } from "@/utils/$axios";

export type SendMessageBody = {
  content: string;
  threadId?: string;
};

export type SendMessageReturnType = {
  message: ChatMessage;
  thread: ChatThread;
};

export class ChatApiService {
  static async sendMessage(body: SendMessageBody): Promise<SendMessageReturnType> {
    const { data } = await $axios.post<SendMessageReturnType>(`/chat/messages`, body, {
      timeout: 120000,
    });

    return data;
  }
}
