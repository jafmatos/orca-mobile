export enum ChatMessageRoles {
  Assistant = "assistant",
  User = "user",
}

export type ChatMessage = {
  id?: string;
  role: ChatMessageRoles;
  content: string;
  createdAt?: string;
};
