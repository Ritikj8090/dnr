import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AlertPopupStates = {
  showAlertPopUp: boolean;
  title: string;
  description: string | React.ReactNode; // allowed
  isSubmitting: boolean;
  onClick: () => void | Promise<void>; // allowed
};

const initialState: AlertPopupStates = {
  showAlertPopUp: false,
  title: "",
  description: "",
  isSubmitting: false,
  onClick: () => {},
};

const alertPopupSlice = createSlice({
  name: "alertPopup", // use a distinct name to avoid confusion with popupSlice
  initialState,
  reducers: {
    setAlertShowPopUp(
      state,
      action: PayloadAction<Omit<AlertPopupStates, "showAlertPopUp">>
    ) {
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.isSubmitting = action.payload.isSubmitting;
      state.onClick = action.payload.onClick;
      state.showAlertPopUp = true;
    },
    resetAlertPopUp(state) {
      state.showAlertPopUp = false;
      state.isSubmitting = false;
      state.onClick = () => {};
      state.title = "";
      state.description = "";
    },
    setIsSubmitting(state, action: PayloadAction<boolean>) {
      state.isSubmitting = action.payload;
    },
  },
});

export const { setAlertShowPopUp, resetAlertPopUp, setIsSubmitting } =
  alertPopupSlice.actions;
export default alertPopupSlice.reducer;
