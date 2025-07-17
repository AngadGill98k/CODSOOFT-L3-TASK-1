import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  image: '',
  name:'',
  price:'',
  cart:[],
};

export const actpSlice = createSlice({
  name: 'dostname',
  initialState,
  reducers: {
    updateimage: (state, action) => {
      state.image = action.payload;
    },
    updatename: (state, action) => {
        state.name = action.payload;
      },
      updateprice: (state, action) => {
        state.price = action.payload;
      },
      updatecart: (state, action) => {
        state.cart = [...state.cart, action.payload];
      },
  },
}); 

// Export the action creator
export const { updatename,updateimage,updateprice,updatecart } = actpSlice.actions;

// Export the reducer correctly
export const actpReducer = actpSlice.reducer;
