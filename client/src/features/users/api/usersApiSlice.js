/* eslint-disable no-unused-vars */
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@/app/api/apiSlice";

const usersAdapter = createEntityAdapter({});
const initalState = usersAdapter.getInitialState();

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: "/users",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result, error, arg) => {
        if (result) {
          return [
            { type: "User", id: "LIST" },
            ...result.map(({ slug }) => ({ type: "User", id: slug })),
          ];
        } else {
          return [{ type: "User", id: "LIST" }];
        }
      },
    }),
    getUser: builder.query({
      query: (slug) => ({
        url: `/users/${slug}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result, error, arg) => {
        if (result?.slug) {
          return [{ type: "User", id: result?.slug }];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),
    addNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/auth/sign-up",
        method: "POST",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: ({ userId, ...userFormData }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: {
          ...userFormData,
        },
      }),
      invalidatesTags: (result, error, arg) => {
        if (result?.updatedUser) {
          return [{ type: "User", id: result.updatedUser.slug }];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),
    deleteUser: builder.mutation({
      query: ({ userId }) => ({
        url: `/users${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => {
        if (result?.deletedUser) {
          return [{ type: "User", id: result.deletedUser.slug }];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),
    changeCompletedLessons: builder.mutation({
      query: ({ userId, lessonId }) => ({
        url: `/users/${userId}/lessons/${lessonId}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, arg) => {
        if (result?.updatedUser) {
          return [{ type: "User", id: result.updatedUser.slug }];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),
    setCurrentMaster: builder.mutation({
      query: ({ userId, masterId }) => ({
        url: `/users/${userId}/master/${masterId}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, arg) => {
        if (result?.updatedUser) {
          return [{ type: "User", id: result.updatedUser.slug }];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),
    changeRole: builder.mutation({
      query: ({ userId, role, user }) => ({
        url: `/users/${userId}/role`,
        method: "PUT",
        body: {
          role,
          user,
        },
      }),
      invalidatesTags: (result, error, arg) => {
        if (result?.updatedUser) {
          return [{ type: "User", id: result.updatedUser.slug }];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),
    changeStatus: builder.mutation({
      query: ({ userId, active, user }) => ({
        url: `/users/${userId}/status`,
        method: "PUT",
        body: {
          active,
          user,
        },
      }),
      invalidatesTags: (result, error, arg) => {
        if (result?.updatedUser) {
          return [{ type: "User", id: result.updatedUser.slug }];
        } else return [{ type: "User", id: "LIST" }];
      },
    })
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useChangeCompletedLessonsMutation,
  useSetCurrentMasterMutation,
  useChangeRoleMutation,
  useChangeStatusMutation,
} = userApiSlice;

export const selectUsersResult = userApiSlice.endpoints.getUsers.select();

const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data
);

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state) => selectUsersData(state) ?? initalState);
