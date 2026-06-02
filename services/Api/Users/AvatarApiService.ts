import { User } from "@/models/User";
import { $axios } from "@/utils/$axios";

export class AvatarService {
  private static readonly endpoint = "/users/avatar";

  private static async _update(formData: FormData): Promise<User> {
    const { data } = await $axios.put(this.endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data.user;
  }

  private static async _remove(): Promise<User> {
    const { data } = await $axios.delete(this.endpoint);

    return data.user;
  }

  public static update = AvatarService._update.bind(AvatarService);
  public static remove = AvatarService._remove.bind(AvatarService);
}
