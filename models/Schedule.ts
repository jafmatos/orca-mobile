import { Category } from "./Category";
import { Entry, EntryTypes } from "./Entry";
import { ScheduleOccurrence } from "./ScheduleOccurrence";

export enum ScheduleFrequency {
  Weekly = "weekly",
  Monthly = "monthly",
}

export enum ScheduleCycleStatus {
  Done = "done",
  Pending = "pending",
  Overdue = "overdue",
}

export interface ScheduleCycle {
  expectedDate: string;
  status: ScheduleCycleStatus;
  occurrence?: ScheduleOccurrence;
}

export interface Schedule {
  id: string;
  type: EntryTypes;
  amount: number;
  description?: string;
  frequency: ScheduleFrequency;
  time: string;
  timezone: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  category?: Category;
  occurrences?: ScheduleOccurrence[];
  cycles?: ScheduleCycle[];
}
