import { createSlice } from "@reduxjs/toolkit";

const getCookie = (cookieName) => {
  let cookieValue = document.cookie
    .split(";")
    .map(
      (el) =>
        decodeURIComponent(el.trim()).split("=")[0] == cookieName &&
        JSON.parse(
          decodeURIComponent(el.trim())
            .split("=")[1]
            .split("s:")[1]
            .split("}")[0] + "}"
        )
    );
  return cookieValue.find((el) => el && el);
};

const initialState = {
  userLoginInfo: {
    infoUser: getCookie("userAllInfo")
      ? getCookie("userAllInfo")
      : { error: false },
    forgotToken: getCookie("forgotToken")
      ? getCookie("forgotToken")
      : { forgotToken: "101010" },
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userLoginInfo.infoUser = action.payload;
    },
    setForgotToken(state, action) {
      state.userLoginInfo.forgotToken = action.payload;
    },
  },
});
 
export const { setUserData, setForgotToken } = userSlice.actions;

export default userSlice.reducer;
