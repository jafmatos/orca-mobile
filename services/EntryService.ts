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

export type CreateEntryBody = {
  category?: {
    id: string;
  };
  amount: number;
  description?: string;
  when: Date;
};

export type CreateEntryReturnType = Entry;

export type UpdateEntryBody = {
  category?: {
    id: string;
  };
  amount?: number;
  description?: string;
  when?: Date;
};

export type UpdateEntryReturnType = Entry;

export class EntryService {
  private static readonly path = "/entries";

  private static async _getEntries(options: GetEntriesArguments): Promise<PaginatedData<Entry>> {
    const query = qs.stringify(options.query);
    const { data } = await $axios.get(`${this.path}?${query}`);

    return data;
  }

  private static async _create(body: CreateEntryBody): Promise<CreateEntryReturnType> {
    const { data } = await $axios.post(`${this.path}`, body);

    return data;
  }

  private static async _update(id: Entry["id"], body: UpdateEntryBody): Promise<UpdateEntryReturnType> {
    const { data } = await $axios.put(`${this.path}/${id}`, body);

    return data;
  }

  public static readonly getEntries = EntryService._getEntries.bind(EntryService);
  public static readonly create = EntryService._create.bind(EntryService);
  public static readonly update = EntryService._update.bind(EntryService);
}
