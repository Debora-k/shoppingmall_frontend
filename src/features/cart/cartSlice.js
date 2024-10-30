import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

const initialState = {
  loading: false,
  error: "",
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

// Async thunk actions
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, size }, { rejectWithValue, dispatch }) => {
    try{
      const response = await api.post("/cart", {productId:id,size,qty:1});
      if(response.status!==200) throw new Error(response.error);
      dispatch(showToastMessage({message:"Added to your cart",status:"success"}));
      return response.data.cartItemQty;
    }catch(error){
      dispatch(showToastMessage({message:"Failed to add it to your cart",status:"error"}));
      return rejectWithValue(error.error);
    }
  }
);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue, dispatch }) => {
    try{
      const response = await api.get("/cart");
      if(response.status!==200) throw new Error(response.error);
      return response.data.data;
    } catch(error){
      dispatch(showToastMessage({message:"Failed to check your cart",status:"error"}));
      return rejectWithValue(error.error);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch }) => {
    try{
      const response = await api.delete(`/cart/${id}`);
      if(response.status!==200) throw new Error(response.error);
      dispatch(showToastMessage({message:"상품삭제완료", status:"success"}));
      dispatch(getCartList());
      return response.data.data;
    }catch(error){
      return rejectWithValue(error.error);
    }
  }
);

export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, value, size }, { rejectWithValue, dispatch }) => {
    try{
      const response = await api.put(`/cart/${id}`,{qty:value, size});
      if(response.status!==200) throw new Error("Something went wrong. Try again");
      dispatch(getCartList());
      return response.data.data;
    } catch(error){
      console.log(error);
      if(error?.error === "Sorry, there is not enough stock.") dispatch(showToastMessage({message:"Sorry, there is not enough stock.", status:"error"}));;
      return rejectWithValue(error.error);
    }
  }
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {}
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
    },
    // You can still add reducers here for non-async actions if necessary
  },
  extraReducers: (builder) => {
    builder.addCase(addToCart.pending,(state,action)=> {
      state.loading=true;
    })
    .addCase(addToCart.fulfilled,(state,action)=> {
      state.loading=false;
      state.error="";
      state.cartItemCount=action.payload;
    })
    .addCase(addToCart.rejected,(state,action)=> {
      state.loading=false;
      state.error=action.payload;
    })
    .addCase(getCartList.pending,(state,action)=>{
      state.loading=true;
    })
    .addCase(getCartList.fulfilled,(state,action)=>{
      state.loading=false;
      state.error="";
      state.cartList=action.payload;
      state.cartItemCount=action.payload.length;
      state.totalPrice=action.payload.reduce(
        (total,item)=>total+item.productId.price*item.qty, 
        0);
    })
    .addCase(getCartList.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload;
    })
    .addCase(deleteCartItem.pending,(state,action)=>{
      state.loading=true;
    })
    .addCase(deleteCartItem.fulfilled,(state,action)=>{
      state.loading=false;
      // state.cartList=action.payload;
      // state.cartItemCount=action.payload;
      // state.totalPrice=action.payload.reduce(
      //   (total,item)=>total+item.productId.price*item.qty, 
      //   0);
      state.error="";
    })
    .addCase(deleteCartItem.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload;
    })
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
