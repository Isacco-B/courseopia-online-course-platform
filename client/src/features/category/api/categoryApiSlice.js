/* eslint-disable no-unused-vars */
import { apiSlice } from "@/app/api/apiSlice";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const categoryAdapter = createEntityAdapter();
const initalState = categoryAdapter.getInitialState();

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: (type) => `/categories?type=${type}`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      providesTags: (result, error, arg) => {
        if (result) {
          return [
            { type: "Category", id: "LIST" },
            ...result.map(({id}) => ({ type: "Category", id: id })),
          ];
        } else return [{ type: "Category", id: "LIST" }];
      },
    }),
    createCategory: builder.mutation({
      query: ({ formData, type }) => ({
        url: `/categories?type=${type}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
  }),
});

export const { useGetCategoriesQuery, useCreateCategoryMutation } =
  categoryApiSlice;

export const selectCategoryResult =
  categoryApiSlice.endpoints.getCategories.select();

const selectCategoryData = createSelector(
  selectCategoryResult,
  (categoryResult) => categoryResult.data
);

export const {
  selectAll: selectAllCategories,
  selectById: selectCategoryById,
  selectIds: selectCategoryIds,
} = categoryAdapter.getSelectors(
  (state) => selectCategoryData(state) ?? initalState
);
