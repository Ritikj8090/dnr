import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import globalReducer from "./globalSlice";
import popupReducer from "./popupSlice";
import alertReducer from "./alertPopupSlice";
import pdfPreviewSlice from "./PdfPreview";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    global: globalReducer,
    popup: popupReducer,
    alert: alertReducer,
    pdfPreview: pdfPreviewSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
