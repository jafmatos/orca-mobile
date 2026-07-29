import { User } from "@/models/User";
import { $axios } from "@/utils/$axios";

export interface UpdateProfileArguments {
  name?: string;
  salaryDay?: number;
  acceptsNotifications?: boolean;
  financialGoal?: string | null;
}

export interface UpdateProfileReturnType {
  user: User;
}

export class ProfileService {
  private static readonly endpoint = "/users/me";

  private static async _update(body: UpdateProfileArguments): Promise<UpdateProfileReturnType> {
    const { data } = await $axios.put(this.endpoint, body);

    return data;
  }

  public static update = ProfileService._update.bind(ProfileService);
}
