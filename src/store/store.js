import { configureStore } from "@reduxjs/toolkit";
import { userAPISlice } from "../features/user/userAPISlice";
import userReducer from "../features/user/userSlice";
import { customerAPISlice } from "../features/customer/customerAPISlice";

export default configureStore({
  reducer: {
    userInfo: userReducer,
    [userAPISlice.reducerPath]: userAPISlice.reducer,
    [customerAPISlice.reducerPath]: customerAPISlice.reducer,
  },
  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares()
      .concat(userAPISlice.middleware)
      .concat(customerAPISlice.middleware),
});
