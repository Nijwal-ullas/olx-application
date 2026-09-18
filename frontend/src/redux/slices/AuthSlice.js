import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const AuthSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    login: (state, action) => {
      ((state.token = action.payload.token),
        (state.user = action.payload.user),
        (state.isAuthenticated = true));

      localStorage.setItem("token", action.payload.token);

      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state, action) => {
      ((state.token = null),
        (state.user = null),
        (state.isAuthenticated = false));

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = AuthSlice.actions;
export default AuthSlice.reducer;
