import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/Api";

export const aiSearch = createAsyncThunk(
  "ai/search",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.post("/ai/search", {
        query,
      });

      return response.data.filters;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "AI search failed",
      );
    }
  },
);

const initialState = {
  filters: null,
  loading: false,
  error: null,
};

const AISlice = createSlice({
  name: "ai",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(aiSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(aiSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.filters = action.payload;
      })

      .addCase(aiSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default AISlice.reducer;
