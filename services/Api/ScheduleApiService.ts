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

interface CreateScheduleBodyBase {
  time: string;
  timezone: string;
  type: EntryTypes;
  amount: number;
  description?: string;
  category?: { id: string } | null;
}

export interface CreateScheduleBodyWeekly extends CreateScheduleBodyBase {
  frequency: ScheduleFrequency.Weekly;
  dayOfWeek: number;
}

export interface CreateScheduleBodyMonthly extends CreateScheduleBodyBase {
  frequency: ScheduleFrequency.Monthly;
  dayOfMonth: number;
}

export type CreateScheduleBody = CreateScheduleBodyWeekly | CreateScheduleBodyMonthly;

export interface CreateScheduleReturnType {
  schedule: Schedule;
}

interface UpdateScheduleBodyBase {
  time?: string;
  timezone?: string;
  type?: EntryTypes;
  amount?: number;
  description?: string;
  category?: { id: string } | null;
}

export interface UpdateScheduleBodyWeekly extends UpdateScheduleBodyBase {
  frequency: ScheduleFrequency.Weekly;
  dayOfWeek?: number;
}

export interface UpdateScheduleBodyMonthly extends UpdateScheduleBodyBase {
  frequency: ScheduleFrequency.Monthly;
  dayOfMonth?: number;
}

export type UpdateScheduleBody = UpdateScheduleBodyWeekly | UpdateScheduleBodyMonthly;

export interface UpdateScheduleReturnType {
  schedule: Schedule;
}

export interface RemoveScheduleReturnType {
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
