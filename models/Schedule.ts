import { Category } from "./Category";
import { Entry, EntryTypes } from "./Entry";

export enum ScheduleFrequency {
  Weekly = "weekly",
  Monthly = "monthly",
}

export interface Schedule {
  id: string;
  type: EntryTypes;
  amount: number;
  description: string;
  when?: string;
  referenceTimestamp: string;
  frequency: ScheduleFrequency;
  dayOfWeek?: number;
  childEntry?: Entry;
  category?: Category;
  isDone: boolean;
  isOverdue: boolean;
}
