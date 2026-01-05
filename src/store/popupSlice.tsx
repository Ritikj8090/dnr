import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type PopupStates = {
  showPopUp: boolean;
  failed: boolean;
  title: string;
  description: string;
};

const initialState: PopupStates = {
  showPopUp: false,
  failed: false,
  title: "",
  description: "",
};

const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    setShowPopUp(state, action: PayloadAction<Omit<PopupStates, "failed" | "showPopUp">>) {
      state.showPopUp = true;
      state.title = action.payload.title;
      state.description = action.payload.description;
    },
    setFailed(state, action: PayloadAction<boolean>) {
      state.failed = action.payload;
    },
    resetPopUp(state) {
      state.showPopUp = false;
      state.title = "";
      state.description = "";
    },
  },
});

export const { setShowPopUp, resetPopUp, setFailed } = popupSlice.actions;
export default popupSlice.reducer;
