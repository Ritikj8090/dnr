import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type GlobalStates = {
  isLoading: boolean;
  isAddUserOpen: boolean;
};

const initialState: GlobalStates = {
  isAddUserOpen: false,
  isLoading: true,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setIsAddUserOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddUserOpen = action.payload;
    },
  },
});

export const { setLoading, setIsAddUserOpen } =
  globalSlice.actions;
export default globalSlice.reducer;
