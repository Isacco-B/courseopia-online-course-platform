/* eslint-disable no-unused-vars */
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@/app/api/apiSlice";

const mastersAdapter = createEntityAdapter();
const initalState = mastersAdapter.getInitialState();

export const masterApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMasters: builder.query({
      query: () => "/masters",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      providesTags: (result, error, arg) => {
        if (result) {
          return [
            { type: "Master", id: "LIST" },
            ...result.map(({ slug }) => ({ type: "Master", id: slug })),
          ];
        } else return [{ type: "Master", id: "LIST" }];
      },
    }),
    getMaster: builder.query({
      query: (slug) => `/masters/${slug}`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      providesTags: (result, error, arg) => {
        if (result?.slug) {
          return [{ type: "Master", id: result?.slug }];
        } else return [{ type: "Master", id: "LIST" }];
      },
    }),
    createMaster: builder.mutation({
      query: (initialMaster) => ({
        url: "/masters",
        method: "POST",
        body: { ...initialMaster },
      }),
      invalidatesTags: [{ type: "Master", id: "LIST" }],
    }),
    updateMaster: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/masters/${id}`,
        method: "PUT",
        body: { ...formData },
      }),
      invalidatesTags: (result, error, arg) => {
        if (result?.updatedMaster) {
          return [{ type: "Master", id: result?.updatedMaster?.slug }];
        } else return [{ type: "Master", id: "LIST" }];
      },
    }),
    deleteMaster: builder.mutation({
      query: (id) => ({
        url: `/masters/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => {
        if (result?.deletedMaster) {
          return [{ type: "Master", id: result?.deletedMaster?.slug }];
        } else return [{ type: "Master", id: "LIST" }];
      },
    }),
  }),
});

export const {
  useGetMastersQuery,
  useGetMasterQuery,
  useCreateMasterMutation,
  useUpdateMasterMutation,
  useDeleteMasterMutation,
} = masterApiSlice;

export const selectMastersResult = masterApiSlice.endpoints.getMasters.select();

const selectMastersData = createSelector(
  selectMastersResult,
  (mastersResult) => mastersResult.data
);

export const {
  selectAll: selectAllMasters,
  selectById: selectMasterById,
  selectIds: selectMasterIds,
} = mastersAdapter.getSelectors(
  (state) => selectMastersData(state) ?? initalState
);
