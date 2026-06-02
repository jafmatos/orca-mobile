import { User } from "@/models/User";
import { $axios } from "@/utils/$axios";

export interface UpdateProfileArguments {
  name?: string;
  periodReferenceDay?: number;
  acceptsNotifications?: boolean;
}

export interface UpdateProfileReturnType {
  user: User;
}

export class ProfileService {
  private static readonly endpoint = "/users";

  private static async _update(body: UpdateProfileArguments): Promise<UpdateProfileReturnType> {
    const { data } = await $axios.put(this.endpoint, body);

    return data;
  }

  public static update = ProfileService._update.bind(ProfileService);
}
