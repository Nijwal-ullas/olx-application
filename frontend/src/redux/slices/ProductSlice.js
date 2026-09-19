import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/Api";

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/products", {
        params,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get products",
      );
    }
  },
);

const initialState = {
  products: [],
  pagination: {
    currentPage: 1,
    limit: 10,
    totalProducts: 0,
    totalpages: 0,
  },
  loading: false,
  error: null,
};

const ProductSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })

      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ProductSlice.reducer;
