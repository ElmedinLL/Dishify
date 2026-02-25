import {baseApi} from "../api/baseApi"

export const menuItemApi = baseApi.injectEndpoints({
    endpoints : (builder) => ({
         //create all endpoints
        getMenuItem : builder.query({
            query : ()=> "/MenuItem",
            providesTags : ["MenuItem"],
            transformResponse : (response) => {
                if (response && response.result && Array.isArray(response.result)) {
                    return response.result
                }
                 if (response && Array.isArray(response.result)) {
                    return response
                }
                return [];
               
            }
        })
    })
})


export const {useGetMenuItemQuery} = menuItemApi;
