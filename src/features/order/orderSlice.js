import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartList, getCartQty } from "../cart/cartSlice";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";


// Define initial state
const initialState = {
  orderList: [],
  orderNum: "",
  selectedOrder: {},
  error: "",
  loading: false,
  totalPageNum: 1,
};

// Async thunks
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { dispatch, rejectWithValue }) => {
    try{
      const response = await api.post("/order", payload);
      if(response.status!==200) throw new Error(response.error);
        dispatch(getCartList()); // to display Cart(0) after creating an order
        return response.data.orderNum;
    }catch(error){
      if(error.error.includes("There is lack of stock of")) {
        dispatch(showToastMessage({message:error.error, status:"error"}));
        return rejectWithValue(error.error);
      }
      dispatch(showToastMessage({message:"Something went wrong", status:"error"}));
      return rejectWithValue("Something went wrong!");
    }
  }
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (_, { rejectWithValue, dispatch }) => {
    try{
      const response = await api.get("/order");
      if(response.status!==200) throw new Error(response.error);
      return response.data.data;
    }catch(error){
      dispatch(showToastMessage({message:"Something went wrong! Please refresh the page", status:"error"}));
      return rejectWithValue("Something went wrong! Please refresh the page");
    }
  }
);

export const getOrderList = createAsyncThunk(
  "order/getOrderList",
  async (query, { rejectWithValue, dispatch }) => {
    try{
      const response = await api.get("/order/all", {params:{...query}});
      if(response.status!==200) throw new Error(response.error);
      return response.data;
    } catch(error) {
      dispatch(showToastMessage({message:"Something went wrong! Please refresh the page", status:"error"}));
      return rejectWithValue("Something went wrong! Please refresh the page");
    }
  }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, status, page }, { dispatch, rejectWithValue }) => {
    try{
      const response = await api.put(`/order/${id}`, {status});
      dispatch(getOrderList({page:page}));
      return response.data.data;
    } catch(error){
      dispatch(showToastMessage({message:"Something went wrong! Please refresh the page", status:"error"}));
      return rejectWithValue("Something went wrong! Please refresh the page");
    }
  }
);

// Order slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state,action)=>{
      state.loading=true;
    })
    .addCase(createOrder.fulfilled, (state,action)=>{
      state.loading=false;
      state.error="";
      state.orderNum=action.payload;
    })
    .addCase(createOrder.rejected, (state,action)=>{
      state.loading=false;
      state.error=action.payload;
    })
    .addCase(getOrder.pending, (state,action)=>{
      state.loading=true;
    })
    .addCase(getOrder.fulfilled, (state,action)=>{
      state.loading=false;
      state.error="";
      state.orderList=action.payload;
    })
    .addCase(getOrder.rejected, (state,action)=>{
      state.loading=false;
      state.error=action.payload;
    })
    .addCase(getOrderList.pending, (state,action)=>{
      state.loading=true;
    })
    .addCase(getOrderList.fulfilled, (state,action)=>{
      state.loading=false;
      state.error="";
      state.orderList=action.payload.data;
      state.totalPageNum=action.payload.totalPageNum;
    })
    .addCase(getOrderList.rejected, (state,action)=>{
      state.loading=false;
      state.error=action.payload;
    })
    .addCase(updateOrder.pending, (state,action)=>{
      state.loading=true;
    })
    .addCase(updateOrder.fulfilled, (state,action)=>{
      state.loading=false;
      state.error="";
      state.selectedOrder=action.payload.status;
    })
    .addCase(updateOrder.rejected, (state,action)=>{
      state.loading=false;
      state.error=action.payload;
    })
  },
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
