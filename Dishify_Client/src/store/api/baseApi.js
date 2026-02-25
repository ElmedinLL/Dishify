import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../utility/constants";

const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL+"/api",
});

const baseQueryWithAuth = async  (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  return result;
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithAuth,
    tagTypes:[],
    endpoints: () => ({}),
});