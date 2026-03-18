import { Entry, EntryTypes } from "@/models/Entry";
import { PaginatedData } from "@/models/PaginatedData";
import { $axios } from "@/utils/$axios";
import qs from "qs";

export type GetEntriesArguments = {
  query?: {
    filter?: {
      type?: EntryTypes;
      text?: string;
      category?: string;
      when?: {
        ge?: Date;
        le?: Date;
      };
    };
    order?: {
      entity?: "entry" | "category";
      column?: string;
      mode?: "ASC" | "DESC";
    };
    page?: number;
    perPage?: number;
  };
};

export class EntryService {
  private static readonly path = "/entries";

  private static async _getEntries(options: GetEntriesArguments): Promise<PaginatedData<Entry>> {
    const query = qs.stringify(options.query);
    const { data } = await $axios.get(`${this.path}?${query}`);

    return data;
  }

  public static readonly getEntries = EntryService._getEntries.bind(EntryService);
}
