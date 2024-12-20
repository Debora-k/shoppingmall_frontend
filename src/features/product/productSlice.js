import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// 비동기 액션 생성
export const getProductList = createAsyncThunk(
  "products/getProductList",
  async (query, { rejectWithValue }) => {
    try{
      const response = await api.get("/product", {params:{...query}});
      return response.data;
    }catch(error){
      return rejectWithValue(error.error);
    }
  }
);


export const getProductDetail = createAsyncThunk(
  "products/getProductDetail",
  async (id, { rejectWithValue }) => {
    try{
      const response = await api.get(`/product/${id}`);
      return response.data.data;
    }catch(error){
      return rejectWithValue(error.error);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { dispatch, rejectWithValue }) => {
    try{
      const response = await api.post("/product",formData);   
      dispatch(showToastMessage({message:"상품생성완료", status:"success"}));
      dispatch(getProductList({page:1}));
      return response.data.data;
    }catch(error){
      console.log(error);
      if(error?.error?.message === "Product validation failed: image: Path `image` is required.") {
        dispatch(showToastMessage({message:"Add an image!", status:"error"}));
        return rejectWithValue("Add an image!");
      }
      if(error?.error?.errorResponse?.code === 11000) {
        dispatch(showToastMessage({message:"The SKU already exists", status:"error"}));
        return rejectWithValue("The SKU already exists, Please input another sku");
      }
      if(error?.error === "Price cannot be zero or negative") {
        dispatch(showToastMessage({message:"Price cannot be zero or negative!", status:"error"}));
        return rejectWithValue("Price cannot be zero or negative!");
      }
      if(error?.error === "Name shouldn't be empty!") {
        dispatch(showToastMessage({message:"Add a correct name", status:"error"}));
        return rejectWithValue("Add a correct name");
      }
      if(error?.error === "Description shouldn't be empty!") {
        dispatch(showToastMessage({message:"Add description", status:"error"}));
        return rejectWithValue("Add description");
      }
      if(error?.error === "Stock cannot be negative") {
        dispatch(showToastMessage({message:"Stock cannot be negative", status:"error"}));
        return rejectWithValue("Stock cannot be negative");
      }
      return rejectWithValue("Something went wrong!");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { dispatch, rejectWithValue }) => {
    try{
      const response = await api.delete(`/product/${id}`);
      dispatch(showToastMessage({message:"상품삭제완료", status:"success"}));
      dispatch(getProductList({page:1}));
      return response.data.data;
    } catch(error){
      return rejectWithValue(error.error);
    }

  }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, page, ...formData }, { dispatch, rejectWithValue }) => {
    try{
      const response = await api.put(`/product/${id}`, formData);
      dispatch(showToastMessage({message:"상품수정완료", status:"success"}));
      dispatch(getProductList({page:page}));
      return response.data.data;
    } catch(error){
      if(error.error === "Price cannot be zero or negative") {
        dispatch(showToastMessage({message:"Price cannot be zero or negative!", status:"error"}));
        return rejectWithValue("Price cannot be zero or negative!");
      }
      if(error?.error?.errorResponse?.code === 11000) {
        dispatch(showToastMessage({message:"The SKU already exists", status:"error"}));
        return rejectWithValue("The SKU already exists, Please input another sku");
      }
      if(error?.error?.message === "Product validation failed: image: Path `image` is required.") {
        dispatch(showToastMessage({message:"Add an image!", status:"error"}));
        return rejectWithValue("Add an image!");
      }
      if(error?.error === "Name shouldn't be empty!") {
        dispatch(showToastMessage({message:"Add a correct name", status:"error"}));
        return rejectWithValue("Add a correct name");
      }
      if(error?.error === "Description shouldn't be empty!") {
        dispatch(showToastMessage({message:"Add description", status:"error"}));
        return rejectWithValue("Add description");
      }
      if(error?.error === "Stock cannot be negative") {
        dispatch(showToastMessage({message:"Stock cannot be negative", status:"error"}));
        return rejectWithValue("Stock cannot be negative");
      }
      return rejectWithValue("Something went wrong! Please try again.");
    }
  }
);

// 슬라이스 생성
const productSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    selectedProduct: null,
    loading: false,
    error: "",
    totalPageNum: 1,
    success: false,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createProduct.pending,(state,action)=>{
      state.loading=true;
    })
    .addCase(createProduct.fulfilled,(state,action)=>{
      state.loading=false;
      state.error="";
      state.success=true;
    })
    .addCase(createProduct.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload;
      state.success=false;
    })
    .addCase(getProductList.pending,(state,action)=>{
      state.loading=true;
    })
    .addCase(getProductList.fulfilled,(state,action)=>{
      state.loading=false;
      state.productList=action.payload.data;
      state.error="";
      state.totalPageNum=action.payload.totalPageNum;
    })
    .addCase(getProductList.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload;
    })
    .addCase(editProduct.pending,(state,action)=> {
      state.loading=true;
    })
    .addCase(editProduct.fulfilled,(state,action)=> {
      state.loading=false;
      state.error="";
      state.success=true;
    })
    .addCase(editProduct.rejected,(state,action)=> {
      state.loading=false;
      state.error=action.payload;
      state.sucess=false;
    })
    .addCase(deleteProduct.pending,(state,action)=>{
      state.loading=true;
    })
    .addCase(deleteProduct.fulfilled,(state,action)=>{
      state.loading=false;
      state.error="";
      state.success=true;
    })
    .addCase(deleteProduct.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload;
      state.success=false;
    })
    .addCase(getProductDetail.pending,(state,action)=> {
      state.loading=true;
    })
    .addCase(getProductDetail.fulfilled,(state,action)=> {
      state.loading=false;
      state.error="";
      state.success=true;
      state.selectedProduct=action.payload;
    })
    .addCase(getProductDetail.rejected,(state,action)=> {
      state.loading=false;
      state.error=action.payload;
      state.success=false;
    })
  },
});

export const { setSelectedProduct, setFilteredList, clearError } =
  productSlice.actions;
export default productSlice.reducer;
