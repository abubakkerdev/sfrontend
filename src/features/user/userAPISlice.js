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

export const userAPISlice = createApi({
  reducerPath: "userAPI",
  baseQuery: customBaseQuery,
  tagTypes: ["users"],
  endpoints: (builder) => ({
    addUser: builder.mutation({
      query: ({ data, token }) => ({
        url: "/backend/authentication/store",
        method: "post",
        body: data,
        token,
      }),
    }),
    loginUser: builder.mutation({
      query: ({ data, token }) => ({
        url: "/backend/authentication/login",
        method: "post",
        body: data,
        token,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ data, token }) => ({
        url: "/backend/authentication/forgot-password",
        method: "post",
        body: data,
        token,
      }),
    }),
    changePassword: builder.mutation({
      query: ({ data, token }) => ({
        url: "/backend/authentication/change-password",
        method: "post",
        body: data,
        token,
      }),
    }),
  }),
});

export const {
  useAddUserMutation,
  useLoginUserMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = userAPISlice;
