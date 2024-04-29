/* eslint-disable no-unused-vars */
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@/app/api/apiSlice";

const projectsAdapter = createEntityAdapter();
const initalState = projectsAdapter.getInitialState();

export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => ({
        url: "/projects",
        method: "GET",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result, error, arg) => {
        if (result) {
          return [
            { type: "Project", id: "LIST" },
            ...result.map(({ _id }) => ({ type: "Project", id: _id })),
          ];
        } else return [{ type: "Project", id: "LIST" }];
      },
    }),
    createProject: builder.mutation({
      query: ({ userId, formData }) => ({
        url: `/projects/${userId}`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),
    updateProject: builder.mutation({
      query: ({ formData, projectId }) => ({
        url: `/projects/${projectId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => {
        if (result?.updatedProject) {
          return [{ type: "Project", id: result?.updatedProject?._id }];
        } else return [{ type: "Project", id: "LIST" }];
      },
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
} = projectApiSlice;

export const selectProjectsResult =
  projectApiSlice.endpoints.getProjects.select();

const projectsDataSelector = createSelector(
  selectProjectsResult,
  (projectsResult) => projectsResult.data
);

export const {
  selectAll: selectAllProjects,
  selectById: selectProjectById,
  selectIds: selectProjectIds,
} = projectsAdapter.getSelectors(
  (state) => projectsDataSelector(state) ?? initalState
);
