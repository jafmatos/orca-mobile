import { Entry } from "./Entry";

export interface ScheduleOccurrence {
  id: string;
  scheduleId: string;
  entryId: string;
  entry: Entry;
}
