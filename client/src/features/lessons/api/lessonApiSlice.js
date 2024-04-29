/* eslint-disable no-unused-vars */
import { apiSlice } from "@/app/api/apiSlice";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const lessonsAdapter = createEntityAdapter();
const initalState = lessonsAdapter.getInitialState();

export const lessonApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLessons: builder.query({
      query: () => "/lessons",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      providesTags: (result, error, arg) => {
        if (result) {
          return [
            { type: "Lesson", id: "LIST" },
            ...result.map(({ slug }) => ({ type: "Lesson", id: slug })),
          ];
        } else return [{ type: "Lesson", id: "LIST" }];
      },
    }),
    getLesson: builder.query({
      query: (slug) => `/lessons/${slug}`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      providesTags: (result, error, arg) => {
        if (result?.slug) {
          return [{ type: "Lesson", id: result?.slug }];
        } else return [{ type: "Lesson", id: "LIST" }];
      },
    }),
    createLesson: builder.mutation({
      query: (initialLesson) => ({
        url: "/lessons",
        method: "POST",
        body: { ...initialLesson },
      }),
      invalidatesTags: [{ type: "Lesson", id: "LIST" }],
    }),
    updateLesson: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/lessons/${id}`,
        method: "PUT",
        body: { ...formData },
      }),
      invalidatesTags: (result, error, arg) => {
        if (result?.updatedLesson) {
          return [{ type: "Lesson", id: result?.updatedLesson?.slug }];
        } else return [{ type: "Lesson", id: "LIST" }];
      },
    }),
    deleteLesson: builder.mutation({
      query: ( id ) => ({
        url: `/lessons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => {
        if (result?.deletedLesson) {
          return [{ type: "Lesson", id: result?.deletedLesson?.slug }];
        } else return [{ type: "Lesson", id: "LIST" }];
      },
    }),
  }),
});

export const {
  useGetLessonsQuery,
  useGetLessonQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = lessonApiSlice;

const selectLessonsResult = lessonApiSlice.endpoints.getLessons.select();

const selectLessonsData = createSelector(
  selectLessonsResult,
  (lessonsResult) => lessonsResult.data
);

export const {
  selectAll: selectAllLessons,
  selectById: selectLessonById,
  selectIds: selectLessonIds,
} = lessonsAdapter.getSelectors(
  (state) => selectLessonsData(state) ?? initalState
);
