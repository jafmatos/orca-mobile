import { apiBaseUrl } from "@/constants/api-base-url";
import axios from "axios";

export const $axios = axios.create({ baseURL: apiBaseUrl });
