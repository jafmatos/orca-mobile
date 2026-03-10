import { UserAvatar } from "./UserAvatar";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: UserAvatar;
}
