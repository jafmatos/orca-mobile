import { ScheduleOccurrence } from "@/models/ScheduleOccurrence";
import { $axios } from "@/utils/$axios";

export interface CreateScheduleOccurrenceBody {
  when: Date;
}

export interface CreateScheduleOccurrenceReturnType {
  occurrence: ScheduleOccurrence;
}

export class ScheduleOccurrenceService {
  private static readonly endpoint = "/schedules/:id/occurrence";

  private static async _create(scheduleId: string, body: CreateScheduleOccurrenceBody): Promise<CreateScheduleOccurrenceReturnType> {
    const { data } = await $axios.post(this.endpoint.replace(":id", scheduleId), body);

    return data;
  }

  public static create = ScheduleOccurrenceService._create.bind(ScheduleOccurrenceService);
}
