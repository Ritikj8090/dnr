import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type PdfPreviewStates = {
  isPdfDialogOpen: boolean;
  pdfUrl: string;
};

const initialState: PdfPreviewStates = {
  isPdfDialogOpen: false,
  pdfUrl: "",
};

const pdfPreviewSlice = createSlice({
  name: "pdfPreview",
  initialState,
  reducers: {
    setPdfDialogOpen: (state, action: PayloadAction<string>) => {
      state.isPdfDialogOpen = true;
      state.pdfUrl = action.payload;
    },
    setPdfDialogClose: () => initialState,
  },
});

export const { setPdfDialogOpen, setPdfDialogClose } =
  pdfPreviewSlice.actions;
export default pdfPreviewSlice.reducer;
