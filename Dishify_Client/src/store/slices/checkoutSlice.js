import { createSlice } from "@reduxjs/toolkit"

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    pickupDetails: {
      pickUpName: "",
      pickUpPhoneNumber: "",
      pickUpEmail: "",
    },
  },
  reducers: {
    setPickupDetails: (state, action) => {
      state.pickupDetails = { ...state.pickupDetails, ...action.payload }
    },
    clearPickupDetails: (state) => {
      state.pickupDetails = {
        pickUpName: "",
        pickUpPhoneNumber: "",
        pickUpEmail: "",
      }
    },
  },
})

export const { setPickupDetails, clearPickupDetails } = checkoutSlice.actions

export const selectPickupDetails = (state) => state.checkout.pickupDetails

export default checkoutSlice.reducer
