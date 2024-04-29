/* eslint-disable no-unused-vars */
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "@/app/api/apiSlice";

const courseAdapter = createEntityAdapter();
const initalState = courseAdapter.getInitialState();

export const courseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query(
      {
        query: () => "/courses",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
        providesTags: (result, error, arg) => {
          if (result) {
            return [
              { type: "Course", id: "LIST" },
              ...result.map(({ slug }) => ({ type: "Course", id: slug })),
            ];
          } else return [{ type: "Course", id: "LIST" }];
        },
      },
    ),
    getCourse: builder.query({
      query: (slug) => `/courses/${slug}`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      providesTags: (result, error, arg) => {
        if (result?.slug) {
          return [{ type: "Course", id: result?.slug }];
        } else return [{ type: "Course", id: "LIST" }];
      },
    }),
    createCourse: builder.mutation({
      query: (formData) => ({
        url: "/courses",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: [{ type: "Course", id: "LIST" }],
    }),
    updateCourse: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/courses/${id}`,
        method: "PUT",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, arg) => {
        if (result?.updatedCourse) {
          return [{ type: "Course", id: result?.updatedCourse?.slug }];
        } else return [{ type: "Course", id: "LIST" }];
      },
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => {
        if (result?.deletedCourse) {
          return [{ type: "Course", id: result?.deletedCourse?.slug }];
        } else return [{ type: "Course", id: "LIST" }];
      },
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetCourseQuery,
} = courseApiSlice;
export const selectCoursesResult = courseApiSlice.endpoints.getCourses.select();

const selectCoursesData = createSelector(
  selectCoursesResult,
  (coursesResult) => coursesResult.data
);

export const {
  selectAll: selectAllCourses,
  selectById: selectCourseById,
  selectIds: selectCourseIds,
} = courseAdapter.getSelectors(
  (state) => selectCoursesData(state) ?? initalState
);
