import { baseApi } from "../api/baseApi"

export const menuItemApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMenuItem: builder.query({
            query: () => "/MenuItem",
            providesTags: ["MenuItem"],
            transformResponse: (response) => {
                if (response && response.result && Array.isArray(response.result)) {
                    return response.result
                }
                if (response && Array.isArray(response.result)) {
                    return response
                }
                return []
            }
        }),
        getMenuItemById: builder.query({
            query: (id) => `/MenuItem/${id}`,
            providesTags: (result, error, id) => [{ type: "MenuItem", id }],
            transformResponse: (response) => {
                if (response?.result) return response.result
                return null
            }
        }),
        createMenuItem: builder.mutation({
            query: (formData) => ({
                url: "/MenuItem",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["MenuItem"],
        }),
        updateMenuItem: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/MenuItem?id=${id}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["MenuItem"],
        }),
        deleteMenuItem: builder.mutation({
            query: (id) => ({
                url: `/MenuItem?id=${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["MenuItem"],
        }),
    })
})

export const {
    useGetMenuItemQuery,
    useGetMenuItemByIdQuery,
    useCreateMenuItemMutation,
    useUpdateMenuItemMutation,
    useDeleteMenuItemMutation,
} = menuItemApi
