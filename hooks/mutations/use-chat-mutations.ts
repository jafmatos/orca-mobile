import { ChatApiService, SendMessageBody } from "@/services/Api/ChatApiService";
import { useMutation } from "@tanstack/react-query";

export function useSendChatMessage() {
  return useMutation({
    mutationFn: (body: SendMessageBody) => ChatApiService.sendMessage(body),
  });
}
