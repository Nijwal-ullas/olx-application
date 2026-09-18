import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./slices/AuthSlice";
import ProductReducer from "./slices/ProductSlice";
import AIReducer from "./slices/AISlice";

const store = configureStore({
  reducer: {
    auth : AuthReducer,
    products : ProductReducer,
    ai : AIReducer
  },
});

export default store;
