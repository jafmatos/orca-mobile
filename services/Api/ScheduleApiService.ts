import { EntryTypes } from "@/models/Entry";
import { PaginatedData } from "@/models/PaginatedData";
import { Schedule, ScheduleFrequency } from "@/models/Schedule";
import { $axios } from "@/utils/$axios";

export interface ListSchedulesQuery {
  page?: number;
  perPage?: number;
}

export interface ListSchedulesReturnType extends PaginatedData<Schedule> {}

export interface FindScheduleReturnType {
  schedule: Schedule;
}

export interface CreateScheduleBody {
  type: EntryTypes;
  category?: { id: string };
  amount: number;
  description: string;
  referenceTimestamp: Date;
  frequency: ScheduleFrequency;
  dayOfWeek?: number;
}

export interface CreateScheduleReturnType {
  schedule: Schedule;
}

export interface UpdateScheduleBody {
  type?: EntryTypes;
  category?: { id: string };
  amount?: number;
  description?: string;
  referenceTimestamp?: Date;
  frequency?: ScheduleFrequency;
  dayOfWeek?: number;
}

export interface UpdateScheduleReturnType {
  schedule: Schedule;
}

export interface RemoveScheduleReturnType {
  schedule: Schedule;
}

export interface SwitchScheduleBody {
  when: Date;
  isDone?: boolean;
}

export interface SwitchScheduleReturnType {
  schedule: Schedule;
}

export class ScheduleService {
  private static readonly endpoint = "/schedules";

  private static async _list(query: ListSchedulesQuery): Promise<ListSchedulesReturnType> {
    const { data } = await $axios.get(this.endpoint, { params: query });

    return data;
  }

  private static async _find(id: string): Promise<FindScheduleReturnType> {
    const { data } = await $axios.get(`${this.endpoint}/${id}`);

    return data;
  }

  private static async _create(body: CreateScheduleBody): Promise<CreateScheduleReturnType> {
    const { data } = await $axios.post(this.endpoint, body);

    return data;
  }

  private static async _update(id: string, body: UpdateScheduleBody): Promise<UpdateScheduleReturnType> {
    const { data } = await $axios.put(`${this.endpoint}/${id}`, body);

    return data;
  }

  private static async _remove(id: string): Promise<RemoveScheduleReturnType> {
    const { data } = await $axios.delete(`${this.endpoint}/${id}`);

    return data;
  }

  public static list = ScheduleService._list.bind(ScheduleService);
  public static find = ScheduleService._find.bind(ScheduleService);
  public static create = ScheduleService._create.bind(ScheduleService);
  public static update = ScheduleService._update.bind(ScheduleService);
  public static remove = ScheduleService._remove.bind(ScheduleService);
}
