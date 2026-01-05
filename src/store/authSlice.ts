import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthUser = {
  id: string | null;
  role: string | null;
  email: string | null;
  fullName: string | null;
};

type AuthState = {
  isAuthenticated: boolean;
  user: AuthUser;
  isLoading: boolean;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: {
    id: null,
    role: null,
    email: null,
    fullName: null,
  },
  isLoading: true, // Optional initial loading state
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: AuthUser }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = {
        id: null,
        role: null,
        email: null,
        fullName: null,
      };
      state.isAuthenticated = false;
    },
    setAuth: (state, action: PayloadAction<{ user: AuthUser }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = {
        id: null,
        role: null,
        email: null,
        fullName: null,
      };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { loginSuccess, logout, setAuth, clearAuth, setLoading } =
  authSlice.actions;
export default authSlice.reducer;
