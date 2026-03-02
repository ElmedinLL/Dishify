import { baseApi } from "./baseApi"

export const ORDER_STATUS = {
  CONFIRMED: "Confirmed",
  READY_FOR_PICKUP: "Ready for Pickup",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (userId = "") => ({
        url: "/Order",
        params: userId ? { userId } : {},
      }),
      providesTags: ["Order"],
      transformResponse: (response) => {
        if (response?.result && Array.isArray(response.result)) {
          return response.result
        }
        return []
      },
    }),
    getOrderById: builder.query({
      query: (orderId) => `/Order/${orderId}`,
      providesTags: (result, error, orderId) => [{ type: "Order", id: orderId }],
      transformResponse: (response) => response?.result || null,
    }),
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/Order",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),
    updateOrder: builder.mutation({
      query: ({ orderId, data }) => ({
        url: `/Order/${orderId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
})

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
} = orderApi
