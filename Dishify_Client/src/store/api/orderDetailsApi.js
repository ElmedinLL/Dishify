import { baseApi } from "./baseApi"

export const orderDetailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateOrderDetail: builder.mutation({
      query: ({ orderDetailId, rating }) => ({
        url: `/OrderDetails/${orderDetailId}`,
        method: "PUT",
        body: { orderDetailId, rating },
      }),
      invalidatesTags: ["Order", "MenuItem"],
    }),
  }),
})

export const { useUpdateOrderDetailMutation } = orderDetailsApi
