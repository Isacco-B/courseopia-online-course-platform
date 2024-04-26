/* eslint-disable no-unused-vars */
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@/app/api/apiSlice";

const profilesAdapter = createEntityAdapter();
const initalState = profilesAdapter.getInitialState();

export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfiles: builder.query({
      query: (options) => ({
        url: "/profiles",
        params: {
          ...options,
        },
        method: "GET",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedProfiles = responseData.map((profile) => {
          profile.id = profile._id;
          return profile;
        });
        return profilesAdapter.setAll(initalState, loadedProfiles);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Profile", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Profile", id })),
          ];
        } else return [{ type: "Profile", id: "LIST" }];
      },
    }),
    getProfile: builder.query({
      query: (userId) => ({
        url: `/profiles/${userId}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result, error, arg) => {
        if (result?.id) {
          return [{ type: "Profile", id: result.id }];
        } else return [{ type: "Profile", id: "LIST" }];
      },
    }),
    updateProfile: builder.mutation({
      query: ({ userId, userSlug, ...profileFormData }) => ({
        url: `/profiles/${userId}`,
        method: "PUT",
        body: {
          ...profileFormData,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Profile", id: arg.id },
        { type: "User", id: arg.userSlug },
      ],
    }),
    updateProfileImage: builder.mutation({
      query: ({ userId, userSlug, formData }) => ({
        url: `/profiles/${userId}/image`,
        method: "PUT",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Profile", id: arg.id },
        { type: "User", id: arg.userSlug },
      ],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetProfilesQuery,
  useUpdateProfileMutation,
  useUpdateProfileImageMutation
} = profileApiSlice;

export const selectProfilesResult =
  profileApiSlice.endpoints.getProfiles.select();

const selectProfilesData = createSelector(
  selectProfilesResult,
  (profileResult) => profileResult.data
);

export const {
  selectAll: selectAllProfiles,
  selectById: selectProfileById,
  selectIds: selectProfileIds,
} = profilesAdapter.getSelectors(
  (state) => selectProfilesData(state) ?? initalState
);
