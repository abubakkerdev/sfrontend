import { createApi } from "@reduxjs/toolkit/query/react";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const customBaseQuery = async ({ url, method, body, token }) => {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Basic ${btoa(`user:${token}`)}`);
  }

  try {
    const response = await fetch(`${baseUrl}${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    if (!response.ok) {
      return {
        error: { status: response.status, data: await response.json() },
      };
    }

    return { data: await response.json() };
  } catch (error) {
    return { error: { status: "FETCH_ERROR", data: error.message } };
  }
};

export const customerAPISlice = createApi({
  reducerPath: "customerAPI",
  baseQuery: customBaseQuery,
  tagTypes: ["Customers"],
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: (token) => ({
        url: "/backend/customer/all",
        method: "get",
        token,
      }),
      providesTags: ["Customers"],
    }),
    getCustomer: builder.query({
      query: ({ token, id }) => ({
        url: `/backend/customer/edit/${id}`,
        method: "get",
        token,
      }),
    }),
    addCustomer: builder.mutation({
      query: ({ data, token }) => ({
        url: "/backend/customer/store",
        method: "post",
        body: data,
        token,
      }),
    }),
    updateCustomer: builder.mutation({
      query: ({ data, token }) => ({
        url: "/backend/customer/update",
        method: "post",
        body: data,
        token,
      }),
    }),
    deleteCustomer: builder.mutation({
      query: ({ data, token }) => ({
        url: "/backend/customer/destroy",
        method: "post",
        body: data,
        token,
      }),
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useAddCustomerMutation,
  useGetCustomerQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerAPISlice;
