import { Entry, EntryTypes } from "@/models/Entry";
import { CursorPaginatedData, PaginatedData } from "@/models/PaginatedData";
import { $axios } from "@/utils/$axios";
import { AxiosResponse } from "axios";
import qs from "qs";

export type ListEntriesArguments = {
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
    cursor?: string;
    perPage?: number;
  };
};

export type ExportEntriesArguments = {
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
  };
};

export type CreateEntryBody =
  | {
      type: EntryTypes;
      category?: {
        id: string;
      };
      amount: number;
      description?: string;
      when: Date;
    }
  | FormData;

export type CreateEntryReturnType = {
  entry: Entry;
};

export type CreateSmartEntryBody =
  | {
      text: string;
      now: Date;
    }
  | FormData;

export type CreateSmartEntryReturnType = {
  entries: Entry[];
};

export type CreateBulkEntryBody = {
  entries: CreateEntryBody[];
};

export type CreateBulkEntryReturnType = {
  entries: Entry[];
};

export type UpdateEntryBody = {
  type: EntryTypes;
  category?: {
    id: string;
  };
  amount?: number;
  description?: string;
  when?: Date;
};

export type UpdateEntryReturnType = {
  entry: Entry;
};

export type DeleteEntryReturnType = {
  entry: Entry;
};

export class EntryService {
  private static readonly path = "/entries";

  private static async _list(options: ListEntriesArguments): Promise<CursorPaginatedData<Entry>> {
    const query = qs.stringify(options.query);
    const { data } = await $axios.get(`${this.path}?${query}`);

    return data;
  }

  private static async _exportEntries(
    options: ExportEntriesArguments,
  ): Promise<AxiosResponse<string, any, { "Content-Disposition": string }>> {
    const query = qs.stringify(options.query);
    const response = await $axios.get(`${this.path}/export/csv?${query}`);

    return response as unknown as AxiosResponse<string, any, { "Content-Disposition": string }>;
  }

  private static async _create(body: CreateEntryBody): Promise<CreateEntryReturnType> {
    const { data } = await $axios.post(`${this.path}`, body);

    return data;
  }

  private static async _createSmart(body: CreateSmartEntryBody): Promise<CreateSmartEntryReturnType> {
    const { data } = await $axios.post(`${this.path}/smart`, body, {
      headers: body instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });

    return data;
  }

  private static async _createBulk(body: CreateBulkEntryBody): Promise<CreateBulkEntryReturnType> {
    const { data } = await $axios.post(`${this.path}/bulk`, body);

    return data;
  }

  private static async _update(id: Entry["id"], body: UpdateEntryBody): Promise<UpdateEntryReturnType> {
    const { data } = await $axios.put(`${this.path}/${id}`, body);

    return data;
  }

  private static async _delete(id: Entry["id"]): Promise<DeleteEntryReturnType> {
    const { data } = await $axios.delete(`${this.path}/${id}`);

    return data;
  }

  public static readonly list = EntryService._list.bind(EntryService);
  public static readonly create = EntryService._create.bind(EntryService);
  public static readonly update = EntryService._update.bind(EntryService);
  public static readonly delete = EntryService._delete.bind(EntryService);
  public static readonly exportEntries = EntryService._exportEntries.bind(EntryService);
  public static readonly createSmart = EntryService._createSmart.bind(EntryService);
  public static readonly createBulk = EntryService._createBulk.bind(EntryService);
}
