import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try{
      const response = await api.post("/auth/login", {email,password});
      sessionStorage.setItem("token", response.data.token);
      return response.data;
    }catch(error){
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { dispatch, rejectWithValue }) => {
    try{
      const response = await api.post("/auth/google",{token});
      sessionStorage.setItem("token", response.data.token);
      return response.data.user;
    } catch(error) {
      dispatch(showToastMessage({message:"Sorry, login failed", status:"error"}));
      return rejectWithValue(error.error);
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout", 
  async({navigate},{dispatch, rejectWithValue}) => {
    try{
      await sessionStorage.removeItem("token");
    } catch(error){
      dispatch(showToastMessage({message:"Sorry, logout failed", status:"error"}));
      return rejectWithValue(error.error);
    }
});

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try{
      const response = await api.post("/user",{email,name,password});
      dispatch(showToastMessage({message:"Successfully signed up!", status:"success"}));
      navigate("/login");
      return response.data.data;
    } catch(error){
      dispatch(showToastMessage({message:"Something went wrong while sign up", status:"error"}));
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {
    try{
      const response = await api.get("/user/me");
      return response.data;
    } catch(error){
      return rejectWithValue(error.error);
    } 
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending,(state)=>{
      state.loading=true;
    })
    .addCase(registerUser.fulfilled,(state)=>{
      state.loading=false;
      state.registrationError=null;
    })
    .addCase(registerUser.rejected,(state, action)=>{
      state.loading=false;
      state.registrationError=action.payload;
    })
    .addCase(loginWithEmail.pending,(state)=> {
      state.loading=true;
    })
    .addCase(loginWithEmail.fulfilled,(state,action)=>{
      state.loading=false;
      state.user=action.payload.user;
      state.loginError=null;
    })
    .addCase(loginWithEmail.rejected,(state,action)=>{
      state.loading=false;
      state.loginError=action.payload;
    })
    .addCase(loginWithToken.fulfilled,(state,action)=>{
      state.user = action.payload.user;
    }) 
    .addCase(logout.pending, (state,action)=> {
      state.loading=true;
    })
    .addCase(logout.fulfilled, (state,action)=> {
      state.loading=false;
      state.error="";
      state.user=null;
    })
    .addCase(logout.rejected, (state,action)=> {
      state.loading=false;
      state.error=action.payload;
    })
    .addCase(loginWithGoogle.pending, (state,action)=> {
      state.loading=true;
    })
    .addCase(loginWithGoogle.fulfilled, (state,action)=> {
      state.loading=false;
      state.user=action.payload;
      state.loginError=null;
    })
    .addCase(loginWithGoogle.rejected, (state,action)=> {
      state.loading=false;
      state.loginError=action.payload;
    })
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
