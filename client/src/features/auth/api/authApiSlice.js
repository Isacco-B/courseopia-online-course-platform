import { apiSlice } from "@/app/api/apiSlice";
import { logout, setCredentials } from "../authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/sign-in",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    register: builder.mutation({
      query: (initialUserData) => ({
        url: "/auth/sign-up",
        method: "POST",
        body: {
          ...initialUserData,
        },
      }),
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: "/auth/sign-out",
        method: "POST",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(logout());
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken } = data;
          dispatch(setCredentials({ accessToken }));
        } catch (err) {
          console.log(err);
        }
      },
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { ...data },
      }),
    }),
    confirmPasswordReset: builder.mutation({
      query: (data) => ({
        url: "/auth/confirm-password-reset",
        method: "POST",
        body: { ...data },
      }),
    }),
    changePassword: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/auth/change-password/${userId}`,
        method: "POST",
        body: { ...data },
      }),
    }),
    getAccountVerification: builder.query({
      query: (userId) => ({
        url: `/auth/verify-account/${userId}`,
        method: "GET",
      }),
    }),
    confirmAccountVerification: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/auth/verify-account/${userId}`,
        method: "POST",
        body: { ...data },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "User", id: arg.userId },
      ],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useSendLogoutMutation,
  useRefreshMutation,
  useResetPasswordMutation,
  useConfirmPasswordResetMutation,
  useChangePasswordMutation,
  useGetAccountVerificationQuery,
  useConfirmAccountVerificationMutation,
} = authApiSlice;
